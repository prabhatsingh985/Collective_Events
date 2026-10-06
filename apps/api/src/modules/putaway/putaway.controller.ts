import { Request, Response } from 'express';
import { putawayService } from './putaway.service';
import { ApiResponse } from '../../core/ApiResponse';

export class PutawayController {
  async getTasks(req: Request, res: Response) {
    const tasks = await putawayService.getTasks(req.query.status as string);
    return ApiResponse.success(res, tasks, 'Putaway tasks retrieved');
  }

  async getTaskById(req: Request, res: Response) {
    const task = await putawayService.getTaskById(req.params.id);
    return ApiResponse.success(res, task, 'Putaway task details retrieved');
  }

  async confirmPutaway(req: Request, res: Response) {
    const result = await putawayService.confirmPutaway(
      req.params.id,
      req.body,
      req.user!.id,
      req.user!.email
    );
    return ApiResponse.success(res, result, 'Putaway task confirmed and stock moved');
  }
}

export const putawayController = new PutawayController();
