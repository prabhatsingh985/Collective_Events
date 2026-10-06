import { prisma } from '../../config/db';
import { MovementType, ReferenceDocType, ReturnDisposition, ReturnStatus } from '@prisma/client';
import { CreateReturnInput, InspectReturnItemInput } from '@toy-wms/shared';
import { AppError } from '../../core/AppError';

export class ReturnsRepository {
  async findMany(status?: ReturnStatus) {
    return prisma.return.findMany({
      where: status ? { status } : undefined,
      include: {
        order: { select: { id: true, orderNumber: true, customerName: true, paymentMode: true } },
        receivedBy: { select: { id: true, name: true } },
        inspectedBy: { select: { id: true, name: true } },
        items: {
          include: {
            product: { select: { id: true, sku: true, name: true, barcode: true } },
            restockLocation: { select: { id: true, code: true, type: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.return.findUnique({
      where: { id },
      include: {
        order: { include: { items: true } },
        receivedBy: true,
        inspectedBy: true,
        items: {
          include: {
            product: true,
            restockLocation: true,
          },
        },
      },
    });
  }

  async createReturn(data: CreateReturnInput, receivedById: string) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: data.orderId },
        include: { items: true },
      });

      if (!order) throw AppError.notFound('Order not found');

      const count = await tx.return.count();
      const returnNumber = `RMA-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

      const createdReturn = await tx.return.create({
        data: {
          returnNumber,
          orderId: data.orderId,
          shipmentId: data.shipmentId || null,
          type: data.type as any,
          status: ReturnStatus.RECEIVED,
          trackingNumber: data.trackingNumber || null,
          receivedAt: new Date(),
          receivedById,
          items: {
            create: data.items.map((i) => ({
              orderItemId: i.orderItemId,
              productId: i.productId,
              quantity: i.quantity,
              reason: i.reason as any,
            })),
          },
        },
        include: { items: true },
      });

      return createdReturn;
    });
  }

  /**
   * QC Inspection of Return Item with Stock Disposition (Restock / Damaged / Scrap)
   */
  async inspectReturnItem(data: InspectReturnItemInput, inspectedById: string) {
    return prisma.$transaction(async (tx) => {
      const returnItem = await tx.returnItem.findUnique({
        where: { id: data.returnItemId },
        include: {
          return: { include: { order: true } },
          product: true,
        },
      });

      if (!returnItem) throw AppError.notFound('Return item not found');

      let targetLocationId = data.restockLocationId;

      // 1. Stock disposition movement
      if (data.disposition === ReturnDisposition.RESTOCK) {
        if (!targetLocationId) {
          // Find standard forward picking or storage location
          const loc = await tx.location.findFirst({
            where: {
              warehouseId: returnItem.return.order.warehouseId,
              type: 'PICKING',
            },
          });
          targetLocationId = loc?.id;
        }

        if (!targetLocationId) throw AppError.badRequest('No destination restock location provided');

        // Increment onHand in target location
        const stock = await tx.stockLevel.upsert({
          where: {
            locationId_productId: {
              locationId: targetLocationId,
              productId: returnItem.productId,
            },
          },
          update: { onHand: { increment: returnItem.quantity } },
          create: {
            warehouseId: returnItem.return.order.warehouseId,
            locationId: targetLocationId,
            productId: returnItem.productId,
            onHand: returnItem.quantity,
            reserved: 0,
          },
        });

        // Write immutable ledger entry
        await tx.inventoryLedger.create({
          data: {
            productId: returnItem.productId,
            toLocationId: targetLocationId,
            movementType: MovementType.RESTOCK,
            quantity: returnItem.quantity,
            beforeOnHand: stock.onHand - returnItem.quantity,
            afterOnHand: stock.onHand,
            beforeReserved: 0,
            afterReserved: 0,
            referenceType: ReferenceDocType.RETURN,
            referenceId: returnItem.return.returnNumber,
            reason: `Restocked good return from order ${returnItem.return.order.orderNumber}`,
            performedById: inspectedById,
          },
        });
      } else if (data.disposition === ReturnDisposition.DAMAGED) {
        const damagedLoc = await tx.location.findFirst({
          where: {
            warehouseId: returnItem.return.order.warehouseId,
            type: 'DAMAGED',
          },
        });

        if (damagedLoc) {
          targetLocationId = damagedLoc.id;
          const stock = await tx.stockLevel.upsert({
            where: {
              locationId_productId: {
                locationId: damagedLoc.id,
                productId: returnItem.productId,
              },
            },
            update: {
              onHand: { increment: returnItem.quantity },
              damaged: { increment: returnItem.quantity },
            },
            create: {
              warehouseId: returnItem.return.order.warehouseId,
              locationId: damagedLoc.id,
              productId: returnItem.productId,
              onHand: returnItem.quantity,
              damaged: returnItem.quantity,
            },
          });

          await tx.inventoryLedger.create({
            data: {
              productId: returnItem.productId,
              toLocationId: damagedLoc.id,
              movementType: MovementType.DAMAGE_TRANSFER,
              quantity: returnItem.quantity,
              beforeOnHand: stock.onHand - returnItem.quantity,
              afterOnHand: stock.onHand,
              beforeReserved: 0,
              afterReserved: 0,
              referenceType: ReferenceDocType.RETURN,
              referenceId: returnItem.return.returnNumber,
              reason: `Damaged return transferred to DMG location: ${data.qcNotes || 'Defective unit'}`,
              performedById: inspectedById,
            },
          });
        }
      } else if (data.disposition === ReturnDisposition.SCRAP) {
        await tx.inventoryLedger.create({
          data: {
            productId: returnItem.productId,
            movementType: MovementType.SCRAP,
            quantity: returnItem.quantity,
            beforeOnHand: 0,
            afterOnHand: 0,
            beforeReserved: 0,
            afterReserved: 0,
            referenceType: ReferenceDocType.RETURN,
            referenceId: returnItem.return.returnNumber,
            reason: `Return scrapped: ${data.qcNotes || 'Beyond repair'}`,
            performedById: inspectedById,
          },
        });
      }

      // 2. Update ReturnItem
      const updatedItem = await tx.returnItem.update({
        where: { id: data.returnItemId },
        data: {
          condition: data.condition as any,
          missingComponents: data.missingComponents,
          damagedPackaging: data.damagedPackaging,
          qcNotes: data.qcNotes,
          disposition: data.disposition as any,
          restockLocationId: targetLocationId || null,
          refundStatus: data.refundStatus as any,
        },
      });

      // 3. Update Return status
      await tx.return.update({
        where: { id: returnItem.returnId },
        data: {
          status: ReturnStatus.INSPECTED,
          inspectedById,
          inspectedAt: new Date(),
        },
      });

      return updatedItem;
    });
  }
}

export const returnsRepository = new ReturnsRepository();
