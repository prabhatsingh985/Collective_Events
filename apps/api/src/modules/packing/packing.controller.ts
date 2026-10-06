import { Request, Response } from 'express';
import { packingService } from './packing.service';
import { ApiResponse } from '../../core/ApiResponse';

export class PackingController {
  async getPackages(req: Request, res: Response) {
    const packages = await packingService.getPackages(req.query.orderId as string);
    return ApiResponse.success(res, packages, 'Packages retrieved');
  }

  async getPackageById(req: Request, res: Response) {
    const pkg = await packingService.getPackageById(req.params.id);
    return ApiResponse.success(res, pkg, 'Package details retrieved');
  }

  async createPackage(req: Request, res: Response) {
    const pkg = await packingService.createPackage(
      req.body,
      req.user!.id,
      req.user!.email
    );
    return ApiResponse.created(res, pkg, 'Package weighed, boxed, and marked PACKED');
  }
}

export const packingController = new PackingController();
