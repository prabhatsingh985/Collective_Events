import { alertsRepository } from './alerts.repository';
import { auditService } from '../audit/audit.service';
import { AlertType, AlertSeverity } from '@prisma/client';

export class AlertsService {
  async getAlerts(filter?: { isRead?: boolean; type?: AlertType }) {
    return alertsRepository.findAlerts(filter);
  }

  async getLowStock(warehouseId?: string) {
    return alertsRepository.findLowStockProducts(warehouseId);
  }

  async scanAndSyncLowStockAlerts(warehouseId?: string) {
    const lowStockItems = await alertsRepository.findLowStockProducts(warehouseId);
    let createdCount = 0;

    for (const item of lowStockItems) {
      // Check if an unread alert for this product already exists
      const existing = await alertsRepository.findAlerts({
        isRead: false,
        type: AlertType.LOW_STOCK,
      });

      const alreadyAlerted = existing.some((a: any) => a.entityId === item.productId);
      if (!alreadyAlerted) {
        await alertsRepository.createAlert({
          type: AlertType.LOW_STOCK,
          severity: item.totalAvailable <= 0 ? AlertSeverity.CRITICAL : AlertSeverity.WARNING,
          title: `Low Stock: ${item.name} (${item.sku})`,
          message: `Available stock (${item.totalAvailable}) is at or below reorder level (${item.reorderLevel}). Deficit: ${item.deficit}.`,
          entityType: 'Product',
          entityId: item.productId,
          metadata: item,
        });
        createdCount++;
      }
    }

    return {
      scannedCount: lowStockItems.length,
      newAlertsCreated: createdCount,
      items: lowStockItems,
    };
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
    return alertsRepository.createAlert(data);
  }

  async markAsRead(id: string) {
    return alertsRepository.markAsRead(id);
  }

  async markAllAsRead() {
    return alertsRepository.markAllAsRead();
  }

  async createPoFromLowStock(
    warehouseId: string,
    productId: string,
    userId: string,
    userEmail: string,
    quantity?: number
  ) {
    const po = await alertsRepository.createPoFromLowStockItem(
      warehouseId,
      productId,
      userId,
      quantity
    );

    await auditService.log({
      userId,
      userEmail,
      action: 'PO_CREATED_FROM_ALERT',
      entityType: 'PurchaseOrder',
      entityId: po.id,
      details: {
        poNumber: po.poNumber,
        warehouseId,
        productId,
        totalAmount: Number(po.totalAmount),
      },
    });

    await alertsRepository.createAlert({
      type: AlertType.SYSTEM,
      severity: AlertSeverity.INFO,
      title: `Draft PO Created: ${po.poNumber}`,
      message: `Automatic draft purchase order created for low-stock replenishment. Total: ₹${po.totalAmount}`,
      entityType: 'PurchaseOrder',
      entityId: po.id,
    });

    return po;
  }
}

export const alertsService = new AlertsService();
