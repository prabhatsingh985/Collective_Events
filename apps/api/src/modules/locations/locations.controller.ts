import { Request, Response } from 'express';
import { locationsService } from './locations.service';
import { ApiResponse } from '../../core/ApiResponse';

export class LocationsController {
  async getLocations(req: Request, res: Response) {
    const result = await locationsService.getLocations(req.query as any);
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
      'Locations retrieved successfully'
    );
  }

  async getLocationById(req: Request, res: Response) {
    const loc = await locationsService.getLocationById(req.params.id);
    return ApiResponse.success(res, loc, 'Location details retrieved');
  }

  async getLocationByBarcode(req: Request, res: Response) {
    const loc = await locationsService.getLocationByBarcode(req.params.barcode);
    return ApiResponse.success(res, loc, 'Location found by barcode');
  }

  async createLocation(req: Request, res: Response) {
    const loc = await locationsService.createLocation(
      req.body,
      req.user!.id,
      req.user!.email
    );
    return ApiResponse.created(res, loc, 'Location created successfully');
  }

  async updateLocation(req: Request, res: Response) {
    const loc = await locationsService.updateLocation(
      req.params.id,
      req.body,
      req.user!.id,
      req.user!.email
    );
    return ApiResponse.success(res, loc, 'Location updated successfully');
  }
}

export const locationsController = new LocationsController();
