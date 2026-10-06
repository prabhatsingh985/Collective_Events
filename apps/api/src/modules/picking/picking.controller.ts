import { Request, Response } from 'express';
import { pickingService } from './picking.service';
import { ApiResponse } from '../../core/ApiResponse';

export class PickingController {
  async getPickLists(req: Request, res: Response) {
    const lists = await pickingService.getPickLists(req.query.status as string);
    return ApiResponse.success(res, lists, 'Pick lists retrieved');
  }

  async getPickListById(req: Request, res: Response) {
    const list = await pickingService.getPickListById(req.params.id);
    return ApiResponse.success(res, list, 'Pick list details retrieved');
  }

  async createPickList(req: Request, res: Response) {
    const { orderIds, assignedToId } = req.body;
    const list = await pickingService.createPickList(
      orderIds,
      assignedToId,
      req.user!.id,
      req.user!.email
    );
    return ApiResponse.created(res, list, 'Pick list created and tasks routed');
  }

  async confirmPickTask(req: Request, res: Response) {
    const result = await pickingService.confirmPickTask(
      req.params.taskId,
      req.body,
      req.user!.id,
      req.user!.email
    );
    return ApiResponse.success(res, result, 'Pick task confirmed');
  }
}

export const pickingController = new PickingController();
