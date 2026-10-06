import { prisma } from '../../config/db';
import { OrderStatus, PackageStatus } from '@prisma/client';
import { calculateWeights } from '@toy-wms/shared';
import { CreatePackageInput } from '@toy-wms/shared';
import { env } from '../../config/env';
import { AppError } from '../../core/AppError';

export class PackingRepository {
  async findPackages(orderId?: string) {
    return prisma.package.findMany({
      where: orderId ? { orderId } : undefined,
      include: {
        order: { select: { id: true, orderNumber: true, customerName: true, status: true } },
        packagingMaterial: true,
        packedBy: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            product: { select: { id: true, sku: true, name: true, barcode: true } },
          },
        },
        shipment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPackageById(id: string) {
    return prisma.package.findUnique({
      where: { id },
      include: {
        order: { include: { items: true } },
        packagingMaterial: true,
        items: { include: { product: true } },
        shipment: true,
      },
    });
  }

  async createPackage(data: CreatePackageInput, packedById: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Fetch order
      const order = await tx.order.findUnique({
        where: { id: data.orderId },
        include: { items: true },
      });

      if (!order) throw AppError.notFound('Order not found');
      if (order.status !== OrderStatus.PICKED && order.status !== OrderStatus.PACKING) {
        throw AppError.badRequest(`Order must be in PICKED status to pack. Current: ${order.status}`);
      }

      // 2. Fetch packaging material if provided
      let boxCode: string | undefined = data.boxCode;
      if (data.packagingMaterialId) {
        const material = await tx.packagingMaterial.findUnique({
          where: { id: data.packagingMaterialId },
        });
        if (material) {
          boxCode = material.code;
          // Decrement packaging material stock
          await tx.packagingMaterial.update({
            where: { id: material.id },
            data: { stockQuantity: { decrement: 1 } },
          });
        }
      }

      // 3. Calculate volumetric & chargeable weights
      const { volumetricWeightGrams, chargeableWeightGrams } = calculateWeights(
        data.lengthCm,
        data.widthCm,
        data.heightCm,
        data.actualWeightGrams,
        env.COURIER_VOLUMETRIC_DIVISOR
      );

      const count = await tx.package.count();
      const packageNumber = `PKG-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

      // 4. Create package
      const createdPackage = await tx.package.create({
        data: {
          packageNumber,
          orderId: order.id,
          packagingMaterialId: data.packagingMaterialId || null,
          boxCode: boxCode || null,
          actualWeightGrams: data.actualWeightGrams,
          lengthCm: data.lengthCm,
          widthCm: data.widthCm,
          heightCm: data.heightCm,
          volumetricWeightGrams,
          chargeableWeightGrams,
          status: PackageStatus.PACKED,
          packedById,
          items: {
            create: order.items.map((item) => ({
              orderItemId: item.id,
              productId: item.productId,
              quantity: item.pickedQty || item.quantity,
            })),
          },
        },
        include: { items: true, packagingMaterial: true },
      });

      // 5. Update order items packedQty & order status
      await tx.orderItem.updateMany({
        where: { orderId: order.id },
        data: { packedQty: { increment: 1 } }, // marks packed
      });

      await tx.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.PACKED },
      });

      return createdPackage;
    });
  }
}

export const packingRepository = new PackingRepository();
