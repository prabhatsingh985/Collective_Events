import { prisma } from '../../config/db';
import { AlertType, AlertSeverity, POStatus } from '@prisma/client';
import { calculateGstBreakup } from '@toy-wms/shared';
import { AppError } from '../../core/AppError';

export class AlertsRepository {
  async findAlerts(filter?: { isRead?: boolean; type?: AlertType }) {
    const where: any = {};
    if (filter?.isRead !== undefined) {
      where.isRead = filter.isRead;
    }
    if (filter?.type) {
      where.type = filter.type;
    }

    return prisma.alert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async findLowStockProducts(warehouseId?: string) {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: { select: { id: true, name: true } },
        stockLevels: {
          where: warehouseId ? { warehouseId } : undefined,
          include: {
            warehouse: { select: { id: true, name: true, code: true } },
            location: { select: { id: true, barcode: true, code: true } },
          },
        },
        supplierPrices: {
          include: {
            supplier: { select: { id: true, name: true, code: true, leadTimeDays: true, gstin: true } },
          },
        },
      },
    });

    const lowStockList = [];

    for (const prod of products) {
      let totalOnHand = 0;
      let totalReserved = 0;

      for (const st of prod.stockLevels) {
        totalOnHand += st.onHand;
        totalReserved += st.reserved;
      }

      const totalAvailable = totalOnHand - totalReserved;
      if (totalAvailable <= prod.reorderLevel) {
        const preferredPrice =
          prod.supplierPrices.find((sp) => sp.isPrimary) || prod.supplierPrices[0];

        lowStockList.push({
          productId: prod.id,
          sku: prod.sku,
          name: prod.name,
          category: prod.category.name,
          reorderLevel: prod.reorderLevel,
          reorderQty: prod.reorderQty,
          totalOnHand,
          totalReserved,
          totalAvailable,
          deficit: Math.max(0, prod.reorderLevel - totalAvailable),
          suggestedSupplier: preferredPrice?.supplier || null,
          unitCost: preferredPrice?.unitPrice ? Number(preferredPrice.unitPrice) : Number(prod.costPrice),
        });
      }
    }

    return lowStockList;
  }

  async createAlert(data: {
    type: AlertType;
    severity?: AlertSeverity;
    title: string;
    message: string;
    entityType?: string;
    entityId?: string;
    metadata?: any;
  }) {
    return prisma.alert.create({
      data: {
        type: data.type,
        severity: data.severity || 'INFO',
        title: data.title,
        message: data.message,
        entityType: data.entityType,
        entityId: data.entityId,
        metadata: data.metadata,
      },
    });
  }

  async markAsRead(id: string) {
    return prisma.alert.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead() {
    return prisma.alert.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
  }

  async createPoFromLowStockItem(warehouseId: string, productId: string, userId: string, quantityOverride?: number) {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });
    if (!warehouse) {
      throw AppError.notFound(`Warehouse with ID ${warehouseId} not found`);
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        supplierPrices: {
          include: { supplier: true },
        },
      },
    });
    if (!product) {
      throw AppError.notFound(`Product with ID ${productId} not found`);
    }

    const preferredPrice =
      product.supplierPrices.find((sp) => sp.isPrimary) || product.supplierPrices[0];

    if (!preferredPrice) {
      throw AppError.badRequest(
        `No supplier configured for SKU ${product.sku}. Please assign a supplier first.`
      );
    }

    const supplier = preferredPrice.supplier;
    const unitPrice = Number(preferredPrice.unitPrice || product.costPrice);
    const orderQty = quantityOverride || product.reorderQty || Math.max(product.reorderLevel * 2, 20);

    const subtotal = unitPrice * orderQty;
    const supplierStateCode = supplier.gstin ? supplier.gstin.substring(0, 2) : '29';
    const warehouseStateCode = warehouse.gstin ? warehouse.gstin.substring(0, 2) : '29';
    const isInterState = supplierStateCode !== warehouseStateCode;
    const taxCalc = calculateGstBreakup(subtotal, 18.0, isInterState);

    const poNumber = `PO-AUTO-${Date.now().toString().slice(-6)}`;
    const expectedDelivery = new Date();
    expectedDelivery.setDate(expectedDelivery.getDate() + (supplier.leadTimeDays || 7));

    const po = await prisma.purchaseOrder.create({
      data: {
        poNumber,
        warehouseId,
        supplierId: supplier.id,
        createdById: userId,
        status: POStatus.DRAFT,
        subtotal,
        taxAmount: taxCalc.totalTax,
        totalAmount: taxCalc.totalWithTax,
        expectedDeliveryDate: expectedDelivery,
        notes: `Automatically generated from low stock alert. SKU: ${product.sku}`,
        items: {
          create: [
            {
              productId: product.id,
              expectedQty: orderQty,
              unitPrice,
              gstPercent: 18.0,
              taxAmount: taxCalc.totalTax,
              totalPrice: taxCalc.totalWithTax,
            },
          ],
        },
      },
      include: {
        supplier: true,
        warehouse: true,
        items: { include: { product: true } },
      },
    });

    return po;
  }
}

export const alertsRepository = new AlertsRepository();
