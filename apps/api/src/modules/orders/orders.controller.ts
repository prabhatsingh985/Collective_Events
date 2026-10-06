import { Request, Response } from 'express';
import { ordersService } from './orders.service';
import { ApiResponse } from '../../core/ApiResponse';

export class OrdersController {
  async getOrders(req: Request, res: Response) {
    const result = await ordersService.getOrders(req.query as any);
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
      'Orders retrieved successfully'
    );
  }

  async getOrderById(req: Request, res: Response) {
    const order = await ordersService.getOrderById(req.params.id);
    return ApiResponse.success(res, order, 'Order details retrieved');
  }

  async createOrder(req: Request, res: Response) {
    const warehouseId = req.user?.warehouseId || (req.body.warehouseId as string);
    const order = await ordersService.createOrder(
      req.body,
      warehouseId,
      req.user?.id,
      req.user?.email
    );
    return ApiResponse.created(res, order, 'Order created and stock allocated');
  }
}

export const ordersController = new OrdersController();
