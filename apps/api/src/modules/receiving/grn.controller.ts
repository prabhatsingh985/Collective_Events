import { Request, Response } from 'express';
import { grnService } from './grn.service';
import { ApiResponse } from '../../core/ApiResponse';

export class GRNController {
  async getGRNs(req: Request, res: Response) {
    const grns = await grnService.getGRNs();
    return ApiResponse.success(res, grns, 'Goods Receipt Notes retrieved');
  }

  async getGRNById(req: Request, res: Response) {
    const grn = await grnService.getGRNById(req.params.id);
    return ApiResponse.success(res, grn, 'GRN details retrieved');
  }

  async createGRN(req: Request, res: Response) {
    const result = await grnService.createGRN(
      req.body,
      req.user!.id,
      req.user!.email
    );
    return ApiResponse.created(res, result, 'Goods received, QC recorded, and putaway tasks generated');
  }
}

export const grnController = new GRNController();
