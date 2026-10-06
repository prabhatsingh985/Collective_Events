import { Request, Response } from 'express';
import { inventoryService } from './inventory.service';
import { ApiResponse } from '../../core/ApiResponse';

export class InventoryController {
  async getStock(req: Request, res: Response) {
    const result = await inventoryService.getStock(req.query as any);
    return ApiResponse.paginated(
      res,
      result.items,
      {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        hasNext: result.page < result.totalPages,
        hasPrev: result.page > 1,
      },
      'Inventory stock retrieved successfully'
    );
  }

  async transferStock(req: Request, res: Response) {
    const result = await inventoryService.transferStock(
      req.body,
      req.user!.id,
      req.user!.email
    );
    return ApiResponse.success(res, result, 'Stock transferred successfully');
  }

  async createAdjustment(req: Request, res: Response) {
    const adjustment = await inventoryService.createAdjustment(
      req.body,
      req.user!.id,
      req.user!.email
    );
    return ApiResponse.created(res, adjustment, 'Stock adjustment request created');
  }

  async approveAdjustment(req: Request, res: Response) {
    const result = await inventoryService.approveAdjustment(
      req.params.id,
      req.body,
      req.user!.id,
      req.user!.email
    );
    return ApiResponse.success(res, result, 'Stock adjustment processed successfully');
  }

  async getAdjustments(req: Request, res: Response) {
    const status = req.query.status as string;
    const adjustments = await inventoryService.getAdjustments(status);
    return ApiResponse.success(res, adjustments, 'Stock adjustments retrieved');
  }

  async getLedgers(req: Request, res: Response) {
    const result = await inventoryService.getLedgers(req.query as any);
    return ApiResponse.paginated(
      res,
      result.items,
      {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        hasNext: result.page < result.totalPages,
        hasPrev: result.page > 1,
      },
      'Inventory ledger movements retrieved successfully'
    );
  }
}

export const inventoryController = new InventoryController();
