import { inventoryRepository } from './inventory.repository';
import { auditService } from '../audit/audit.service';
import { StockQueryInput, LedgerQueryInput, StockTransferInput, CreateAdjustmentInput, ApproveAdjustmentInput } from '@toy-wms/shared';
import { AdjustmentReason, AdjustmentStatus } from '@prisma/client';

export class InventoryService {
  private formatStockLevel(item: any) {
    const available = Math.max(0, item.onHand - item.reserved);
    return {
      ...item,
      available,
    };
  }

  async getStock(query: StockQueryInput) {
    const result = await inventoryRepository.findStock(query);
    let items = result.items.map(this.formatStockLevel);

    if (query.lowStockOnly) {
      items = items.filter((item) => item.available <= (item.product.reorderLevel || 10));
    }

    return {
      ...result,
      items,
    };
  }

  async getStockByLocationAndProduct(productId: string, locationId: string) {
    const stock = await inventoryRepository.findStockLevel(productId, locationId);
    if (!stock) return null;
    return this.formatStockLevel(stock);
  }

  async transferStock(data: StockTransferInput, userId: string, userEmail: string) {
    const result = await inventoryRepository.transferStock({
      productId: data.productId,
      fromLocationId: data.fromLocationId,
      toLocationId: data.toLocationId,
      quantity: data.quantity,
      reason: data.reason,
      performedById: userId,
    });

    await auditService.log({
      userId,
      userEmail,
      action: 'STOCK_TRANSFER',
      entityType: 'StockLevel',
      entityId: result.ledger.id,
      details: {
        productId: data.productId,
        quantity: data.quantity,
        fromLocationId: data.fromLocationId,
        toLocationId: data.toLocationId,
        reason: data.reason,
      },
    });

    return {
      sourceStock: this.formatStockLevel(result.sourceStock),
      targetStock: this.formatStockLevel(result.targetStock),
      ledger: result.ledger,
    };
  }

  async createAdjustment(data: CreateAdjustmentInput, userId: string, userEmail: string) {
    const adjustment = await inventoryRepository.createAdjustment({
      productId: data.productId,
      locationId: data.locationId,
      quantity: data.quantity,
      reason: data.reason as AdjustmentReason,
      notes: data.notes,
      requestedById: userId,
    });

    await auditService.log({
      userId,
      userEmail,
      action: 'STOCK_ADJUSTMENT_REQUESTED',
      entityType: 'StockAdjustment',
      entityId: adjustment.id,
      details: {
        adjustmentNumber: adjustment.adjustmentNumber,
        productId: data.productId,
        quantity: data.quantity,
        reason: data.reason,
      },
    });

    return adjustment;
  }

  async approveAdjustment(
    id: string,
    data: ApproveAdjustmentInput,
    userId: string,
    userEmail: string
  ) {
    const result = await inventoryRepository.approveAdjustment({
      adjustmentId: id,
      approved: data.approved,
      approvedById: userId,
      notes: data.notes,
    });

    await auditService.log({
      userId,
      userEmail,
      action: data.approved ? 'STOCK_ADJUSTMENT_APPROVED' : 'STOCK_ADJUSTMENT_REJECTED',
      entityType: 'StockAdjustment',
      entityId: id,
      details: { approved: data.approved, notes: data.notes },
    });

    return result;
  }

  async getAdjustments(status?: string) {
    return inventoryRepository.findAdjustments(status as AdjustmentStatus);
  }

  async getLedgers(query: LedgerQueryInput) {
    return inventoryRepository.findLedgers(query);
  }
}

export const inventoryService = new InventoryService();
