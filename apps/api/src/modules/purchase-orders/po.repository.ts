import { prisma } from '../../config/db';
import { POStatus, Prisma } from '@prisma/client';
import { CreatePOInput } from '@toy-wms/shared';

export class PurchaseOrderRepository {
  async findMany(filter?: { status?: POStatus; supplierId?: string }) {
    const where: Prisma.PurchaseOrderWhereInput = {};
    if (filter?.status) where.status = filter.status;
    if (filter?.supplierId) where.supplierId = filter.supplierId;

    return prisma.purchaseOrder.findMany({
      where,
      include: {
        supplier: true,
        createdBy: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            product: {
              select: {
                id: true,
                sku: true,
                name: true,
                barcode: true,
                costPrice: true,
              },
            },
          },
        },
        grns: {
          select: {
            id: true,
            grnNumber: true,
            status: true,
            receivedAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
        createdBy: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            product: true,
          },
        },
        grns: {
          include: {
            receivedBy: { select: { id: true, name: true, email: true } },
            items: {
              include: {
                product: true,
                putawayTasks: true,
              },
            },
          },
        },
      },
    });
  }

  async create(data: CreatePOInput, createdById: string) {
    const count = await prisma.purchaseOrder.count();
    const poNumber = `PO-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    let subtotal = 0;
    let totalTax = 0;

    const itemsData = data.items.map((item) => {
      const lineTax = (item.unitPrice * item.expectedQty * item.gstPercent) / 100;
      const lineTotal = item.unitPrice * item.expectedQty + lineTax;
      subtotal += item.unitPrice * item.expectedQty;
      totalTax += lineTax;

      return {
        productId: item.productId,
        expectedQty: item.expectedQty,
        receivedQty: 0,
        unitPrice: item.unitPrice,
        gstPercent: item.gstPercent,
        taxAmount: Math.round(lineTax * 100) / 100,
        totalPrice: Math.round(lineTotal * 100) / 100,
      };
    });

    return prisma.purchaseOrder.create({
      data: {
        poNumber,
        warehouseId: data.warehouseId,
        supplierId: data.supplierId,
        expectedDeliveryDate: data.expectedDeliveryDate ? new Date(data.expectedDeliveryDate) : null,
        subtotal: Math.round(subtotal * 100) / 100,
        taxAmount: Math.round(totalTax * 100) / 100,
        totalAmount: Math.round((subtotal + totalTax) * 100) / 100,
        notes: data.notes,
        createdById,
        status: POStatus.DRAFT,
        items: {
          create: itemsData,
        },
      },
      include: {
        supplier: true,
        items: {
          include: { product: true },
        },
      },
    });
  }

  async updateStatus(id: string, status: POStatus, extraData?: any) {
    return prisma.purchaseOrder.update({
      where: { id },
      data: {
        status,
        sentAt: status === POStatus.SENT ? new Date() : undefined,
        closedAt: status === POStatus.RECEIVED || status === POStatus.CANCELLED ? new Date() : undefined,
        ...extraData,
      },
      include: { supplier: true, items: true },
    });
  }
}

export const purchaseOrderRepository = new PurchaseOrderRepository();
