import { Request, Response } from 'express';
import { purchaseOrderService } from './po.service';
import { ApiResponse } from '../../core/ApiResponse';

export class PurchaseOrderController {
  async getPOs(req: Request, res: Response) {
    const pos = await purchaseOrderService.getPOs({
      status: req.query.status as string,
      supplierId: req.query.supplierId as string,
    });
    return ApiResponse.success(res, pos, 'Purchase orders retrieved');
  }

  async getPOById(req: Request, res: Response) {
    const po = await purchaseOrderService.getPOById(req.params.id);
    return ApiResponse.success(res, po, 'Purchase order details retrieved');
  }

  async createPO(req: Request, res: Response) {
    const po = await purchaseOrderService.createPO(
      req.body,
      req.user!.id,
      req.user!.email
    );
    return ApiResponse.created(res, po, 'Purchase order created successfully');
  }

  async sendPO(req: Request, res: Response) {
    const po = await purchaseOrderService.sendPO(
      req.params.id,
      req.user!.id,
      req.user!.email
    );
    return ApiResponse.success(res, po, 'Purchase order sent to supplier');
  }

  async cancelPO(req: Request, res: Response) {
    const po = await purchaseOrderService.cancelPO(
      req.params.id,
      req.body.reason || 'Operational cancellation',
      req.user!.id,
      req.user!.email
    );
    return ApiResponse.success(res, po, 'Purchase order cancelled');
  }
}

export const purchaseOrderController = new PurchaseOrderController();
