import { prisma } from '../../config/db';
import { Prisma, MovementType, ReferenceDocType, AdjustmentReason, AdjustmentStatus } from '@prisma/client';
import { StockQueryInput, LedgerQueryInput } from '@toy-wms/shared';
import { AppError } from '../../core/AppError';

export class InventoryRepository {
  async findStock(query: StockQueryInput) {
    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    const where: Prisma.StockLevelWhereInput = {};

    if (query.warehouseId) where.warehouseId = query.warehouseId;
    if (query.productId) where.productId = query.productId;
    if (query.locationId) where.locationId = query.locationId;
    if (query.search) {
      where.OR = [
        { product: { name: { contains: query.search, mode: 'insensitive' } } },
        { product: { sku: { contains: query.search, mode: 'insensitive' } } },
        { location: { code: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.stockLevel.count({ where }),
      prisma.stockLevel.findMany({
        where,
        skip,
        take: limit,
        include: {
          product: {
            select: {
              id: true,
              sku: true,
              name: true,
              barcode: true,
              sellingPrice: true,
              costPrice: true,
              reorderLevel: true,
              reorderQty: true,
            },
          },
          location: {
            select: {
              id: true,
              code: true,
              type: true,
              barcode: true,
            },
          },
        },
        orderBy: [{ location: { code: 'asc' } }],
      }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findStockLevel(productId: string, locationId: string) {
    return prisma.stockLevel.findUnique({
      where: {
        locationId_productId: {
          locationId,
          productId,
        },
      },
      include: {
        product: true,
        location: true,
      },
    });
  }

  /**
   * Transactional Stock Transfer between locations
   */
  async transferStock(params: {
    productId: string;
    fromLocationId: string;
    toLocationId: string;
    quantity: number;
    reason: string;
    performedById: string;
  }) {
    return prisma.$transaction(async (tx) => {
      // 1. Fetch source stock level
      const sourceStock = await tx.stockLevel.findUnique({
        where: {
          locationId_productId: {
            locationId: params.fromLocationId,
            productId: params.productId,
          },
        },
      });

      if (!sourceStock) {
        throw AppError.badRequest('Source location has no stock record for this product');
      }

      const availableAtSource = sourceStock.onHand - sourceStock.reserved;
      if (availableAtSource < params.quantity) {
        throw AppError.badRequest(
          `Insufficient available stock at source location. Available: ${availableAtSource}, Requested: ${params.quantity}`
        );
      }

      // 2. Decrement source location stock
      const updatedSource = await tx.stockLevel.update({
        where: { id: sourceStock.id },
        data: {
          onHand: { decrement: params.quantity },
        },
      });

      // 3. Increment or create target location stock
      const targetStock = await tx.stockLevel.upsert({
        where: {
          locationId_productId: {
            locationId: params.toLocationId,
            productId: params.productId,
          },
        },
        update: {
          onHand: { increment: params.quantity },
        },
        create: {
          warehouseId: sourceStock.warehouseId,
          locationId: params.toLocationId,
          productId: params.productId,
          onHand: params.quantity,
          reserved: 0,
        },
      });

      // 4. Record immutable inventory ledger entry
      const ledger = await tx.inventoryLedger.create({
        data: {
          productId: params.productId,
          fromLocationId: params.fromLocationId,
          toLocationId: params.toLocationId,
          movementType: MovementType.PUTAWAY,
          quantity: params.quantity,
          beforeOnHand: sourceStock.onHand,
          afterOnHand: updatedSource.onHand,
          beforeReserved: sourceStock.reserved,
          afterReserved: updatedSource.reserved,
          referenceType: ReferenceDocType.PUTAWAY_TASK,
          referenceId: `TRF-${Date.now()}`,
          reason: params.reason,
          performedById: params.performedById,
        },
      });

      return { sourceStock: updatedSource, targetStock, ledger };
    });
  }

  /**
   * Create Stock Adjustment Request
   */
  async createAdjustment(params: {
    productId: string;
    locationId: string;
    quantity: number;
    reason: AdjustmentReason;
    notes: string;
    requestedById: string;
  }) {
    const count = await prisma.stockAdjustment.count();
    const adjustmentNumber = `ADJ-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    return prisma.stockAdjustment.create({
      data: {
        adjustmentNumber,
        productId: params.productId,
        locationId: params.locationId,
        quantity: params.quantity,
        reason: params.reason,
        notes: params.notes,
        requestedById: params.requestedById,
        status: AdjustmentStatus.PENDING,
      },
      include: {
        product: true,
        location: true,
        requestedBy: { select: { id: true, name: true, email: true } },
      },
    });
  }

  /**
   * Approve Stock Adjustment with transactional Ledger update
   */
  async approveAdjustment(params: {
    adjustmentId: string;
    approved: boolean;
    approvedById: string;
    notes?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const adjustment = await tx.stockAdjustment.findUnique({
        where: { id: params.adjustmentId },
        include: { product: true, location: true },
      });

      if (!adjustment) {
        throw AppError.notFound('Adjustment request not found');
      }

      if (adjustment.status !== AdjustmentStatus.PENDING) {
        throw AppError.badRequest(`Adjustment is already ${adjustment.status}`);
      }

      if (!params.approved) {
        return tx.stockAdjustment.update({
          where: { id: params.adjustmentId },
          data: {
            status: AdjustmentStatus.REJECTED,
            approvedById: params.approvedById,
            approvedAt: new Date(),
            notes: params.notes ? `${adjustment.notes} | Rejected: ${params.notes}` : adjustment.notes,
          },
        });
      }

      // Fetch or create stock level at location
      const stockLevel = await tx.stockLevel.findUnique({
        where: {
          locationId_productId: {
            locationId: adjustment.locationId,
            productId: adjustment.productId,
          },
        },
      });

      const beforeOnHand = stockLevel ? stockLevel.onHand : 0;
      const beforeReserved = stockLevel ? stockLevel.reserved : 0;
      const newOnHand = beforeOnHand + adjustment.quantity;

      if (newOnHand < 0) {
        throw AppError.badRequest(
          `Adjustment of ${adjustment.quantity} would cause negative stock. Current onHand: ${beforeOnHand}`
        );
      }

      let updatedStock;
      if (stockLevel) {
        updatedStock = await tx.stockLevel.update({
          where: { id: stockLevel.id },
          data: { onHand: newOnHand },
        });
      } else {
        const location = await tx.location.findUnique({ where: { id: adjustment.locationId } });
        updatedStock = await tx.stockLevel.create({
          data: {
            warehouseId: location!.warehouseId,
            locationId: adjustment.locationId,
            productId: adjustment.productId,
            onHand: newOnHand,
            reserved: 0,
          },
        });
      }

      // Create immutable ledger entry
      const ledger = await tx.inventoryLedger.create({
        data: {
          productId: adjustment.productId,
          fromLocationId: adjustment.quantity < 0 ? adjustment.locationId : null,
          toLocationId: adjustment.quantity > 0 ? adjustment.locationId : null,
          movementType:
            adjustment.quantity > 0 ? MovementType.ADJUSTMENT_ADD : MovementType.ADJUSTMENT_DEDUCT,
          quantity: Math.abs(adjustment.quantity),
          beforeOnHand,
          afterOnHand: newOnHand,
          beforeReserved,
          afterReserved: beforeReserved,
          referenceType: ReferenceDocType.STOCK_ADJUSTMENT,
          referenceId: adjustment.adjustmentNumber,
          reason: `[${adjustment.reason}] ${adjustment.notes}`,
          performedById: params.approvedById,
        },
      });

      // Update adjustment record
      const updatedAdjustment = await tx.stockAdjustment.update({
        where: { id: adjustment.id },
        data: {
          status: AdjustmentStatus.APPROVED,
          approvedById: params.approvedById,
          approvedAt: new Date(),
          ledgerId: ledger.id,
        },
      });

      return { adjustment: updatedAdjustment, stock: updatedStock, ledger };
    });
  }

  async findAdjustments(status?: AdjustmentStatus) {
    return prisma.stockAdjustment.findMany({
      where: status ? { status } : undefined,
      include: {
        product: { select: { id: true, sku: true, name: true, barcode: true } },
        location: { select: { id: true, code: true, type: true } },
        requestedBy: { select: { id: true, name: true, email: true } },
        approvedBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findLedgers(query: LedgerQueryInput) {
    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    const where: Prisma.InventoryLedgerWhereInput = {};

    if (query.productId) where.productId = query.productId;
    if (query.referenceId) where.referenceId = { contains: query.referenceId, mode: 'insensitive' };
    if (query.movementType) where.movementType = query.movementType as any;
    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) where.createdAt.lte = new Date(query.endDate);
    }

    const [total, items] = await Promise.all([
      prisma.inventoryLedger.count({ where }),
      prisma.inventoryLedger.findMany({
        where,
        skip,
        take: limit,
        include: {
          product: { select: { id: true, sku: true, name: true } },
          fromLocation: { select: { id: true, code: true, type: true } },
          toLocation: { select: { id: true, code: true, type: true } },
          performedBy: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export const inventoryRepository = new InventoryRepository();
