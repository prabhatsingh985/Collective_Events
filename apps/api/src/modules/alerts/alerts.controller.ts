import { Request, Response } from 'express';
import { alertsService } from './alerts.service';
import { ApiResponse } from '../../core/ApiResponse';
import { AlertType } from '@prisma/client';

export class AlertsController {
  async getAlerts(req: Request, res: Response) {
    const isRead = req.query.isRead !== undefined ? req.query.isRead === 'true' : undefined;
    const type = req.query.type as AlertType | undefined;
    const alerts = await alertsService.getAlerts({ isRead, type });
    return ApiResponse.success(res, alerts, 'Alerts retrieved successfully');
  }

  async getLowStock(req: Request, res: Response) {
    const warehouseId = req.query.warehouseId as string | undefined;
    const items = await alertsService.getLowStock(warehouseId);
    return ApiResponse.success(res, items, 'Low stock items retrieved');
  }

  async scanLowStock(req: Request, res: Response) {
    const warehouseId = req.body.warehouseId as string | undefined;
    const result = await alertsService.scanAndSyncLowStockAlerts(warehouseId);
    return ApiResponse.success(res, result, 'Low stock scan completed');
  }

  async markAsRead(req: Request, res: Response) {
    const alert = await alertsService.markAsRead(req.params.id);
    return ApiResponse.success(res, alert, 'Alert marked as read');
  }

  async markAllAsRead(_req: Request, res: Response) {
    const result = await alertsService.markAllAsRead();
    return ApiResponse.success(res, result, 'All alerts marked as read');
  }

  async createPoFromLowStock(req: Request, res: Response) {
    const { warehouseId, productId, quantity } = req.body;
    const po = await alertsService.createPoFromLowStock(
      warehouseId,
      productId,
      req.user!.id,
      req.user!.email,
      quantity
    );
    return ApiResponse.created(res, po, 'Draft Purchase Order created from low stock alert');
  }
}

export const alertsController = new AlertsController();
