import { Request, Response } from 'express';
import { returnsService } from './returns.service';
import { ApiResponse } from '../../core/ApiResponse';

export class ReturnsController {
  async getReturns(req: Request, res: Response) {
    const returns = await returnsService.getReturns(req.query.status as string);
    return ApiResponse.success(res, returns, 'Returns retrieved');
  }

  async getReturnById(req: Request, res: Response) {
    const ret = await returnsService.getReturnById(req.params.id);
    return ApiResponse.success(res, ret, 'Return details retrieved');
  }

  async createReturn(req: Request, res: Response) {
    const ret = await returnsService.createReturn(
      req.body,
      req.user!.id,
      req.user!.email
    );
    return ApiResponse.created(res, ret, 'Return intake recorded');
  }

  async inspectItem(req: Request, res: Response) {
    const item = await returnsService.inspectItem(
      req.body,
      req.user!.id,
      req.user!.email
    );
    return ApiResponse.success(res, item, 'Return item inspected and stock disposition applied');
  }
}

export const returnsController = new ReturnsController();
