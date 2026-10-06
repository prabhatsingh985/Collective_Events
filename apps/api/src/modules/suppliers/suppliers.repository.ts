import { prisma } from '../../config/db';

export class SuppliersRepository {
  async findMany() {
    return prisma.supplier.findMany({
      include: {
        prices: {
          include: {
            product: {
              select: {
                id: true,
                sku: true,
                name: true,
                costPrice: true,
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.supplier.findUnique({
      where: { id },
      include: {
        prices: {
          include: {
            product: true,
          },
        },
        purchaseOrders: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async create(data: any) {
    return prisma.supplier.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return prisma.supplier.update({
      where: { id },
      data,
    });
  }

  async setProductPrice(data: {
    supplierId: string;
    productId: string;
    unitPrice: number;
    moq: number;
    leadTimeDays: number;
    supplierSku?: string;
  }) {
    return prisma.supplierProductPrice.upsert({
      where: {
        supplierId_productId: {
          supplierId: data.supplierId,
          productId: data.productId,
        },
      },
      update: {
        unitPrice: data.unitPrice,
        moq: data.moq,
        leadTimeDays: data.leadTimeDays,
        supplierSku: data.supplierSku,
      },
      create: {
        supplierId: data.supplierId,
        productId: data.productId,
        unitPrice: data.unitPrice,
        moq: data.moq,
        leadTimeDays: data.leadTimeDays,
        supplierSku: data.supplierSku,
        isPrimary: true,
      },
    });
  }
}

export const suppliersRepository = new SuppliersRepository();
