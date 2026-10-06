import { Request, Response } from 'express';
import { packagingService } from './packaging.service';
import { ApiResponse } from '../../core/ApiResponse';

export class PackagingController {
  async getAll(_req: Request, res: Response) {
    const materials = await packagingService.getAll();
    return ApiResponse.success(res, materials, 'Packaging materials retrieved');
  }

  async getById(req: Request, res: Response) {
    const material = await packagingService.getById(req.params.id);
    return ApiResponse.success(res, material, 'Packaging material retrieved');
  }

  async updateStock(req: Request, res: Response) {
    const delta = Number(req.body.delta);
    const material = await packagingService.updateStock(req.params.id, delta);
    return ApiResponse.success(res, material, 'Packaging stock updated');
  }

  async create(req: Request, res: Response) {
    const material = await packagingService.create(req.body);
    return ApiResponse.created(res, material, 'Packaging material created');
  }
}

export const packagingController = new PackagingController();
