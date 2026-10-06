import { Request, Response } from 'express';
import { reportsService } from './reports.service';
import { ApiResponse } from '../../core/ApiResponse';

export class ReportsController {
  async getInventoryValuation(req: Request, res: Response) {
    const warehouseId = req.query.warehouseId as string | undefined;
    const report = await reportsService.getInventoryValuation(warehouseId);
    return ApiResponse.success(res, report, 'Inventory valuation report generated');
  }

  async getOrderFulfillmentSla(_req: Request, res: Response) {
    const report = await reportsService.getOrderFulfillmentSla();
    return ApiResponse.success(res, report, 'Order fulfillment SLA metrics retrieved');
  }

  async getReturnsAndRto(_req: Request, res: Response) {
    const report = await reportsService.getReturnsAndRto();
    return ApiResponse.success(res, report, 'Returns & RTO metrics retrieved');
  }

  async getContributionMargin(req: Request, res: Response) {
    const sku = req.query.sku as string | undefined;
    const overrides = req.body && Object.keys(req.body).length > 0 ? req.body : undefined;
    const report = await reportsService.getContributionMargin(sku, overrides);
    return ApiResponse.success(res, report, 'Contribution margin unit economics report generated');
  }
}

export const reportsController = new ReportsController();
