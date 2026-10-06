import { Request, Response } from 'express';
import { suppliersService } from './suppliers.service';
import { ApiResponse } from '../../core/ApiResponse';

export class SuppliersController {
  async getSuppliers(req: Request, res: Response) {
    const suppliers = await suppliersService.getSuppliers();
    return ApiResponse.success(res, suppliers, 'Suppliers retrieved');
  }

  async getSupplierById(req: Request, res: Response) {
    const supplier = await suppliersService.getSupplierById(req.params.id);
    return ApiResponse.success(res, supplier, 'Supplier details retrieved');
  }

  async createSupplier(req: Request, res: Response) {
    const supplier = await suppliersService.createSupplier(
      req.body,
      req.user!.id,
      req.user!.email
    );
    return ApiResponse.created(res, supplier, 'Supplier created successfully');
  }

  async updateSupplier(req: Request, res: Response) {
    const supplier = await suppliersService.updateSupplier(
      req.params.id,
      req.body,
      req.user!.id,
      req.user!.email
    );
    return ApiResponse.success(res, supplier, 'Supplier updated successfully');
  }

  async setProductPrice(req: Request, res: Response) {
    const price = await suppliersService.setProductPrice(
      {
        ...req.body,
        supplierId: req.params.id,
      },
      req.user!.id,
      req.user!.email
    );
    return ApiResponse.success(res, price, 'Supplier product price configured');
  }
}

export const suppliersController = new SuppliersController();
