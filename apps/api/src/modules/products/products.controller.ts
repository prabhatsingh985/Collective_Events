import { Request, Response } from 'express';
import { productsService } from './products.service';
import { ApiResponse } from '../../core/ApiResponse';

export class ProductsController {
  async getProducts(req: Request, res: Response) {
    const result = await productsService.getProducts(req.query as any);
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
      'Products retrieved successfully'
    );
  }

  async getProductById(req: Request, res: Response) {
    const product = await productsService.getProductById(req.params.id);
    return ApiResponse.success(res, product, 'Product details retrieved');
  }

  async getProductByBarcode(req: Request, res: Response) {
    const product = await productsService.getProductByBarcode(req.params.barcode);
    return ApiResponse.success(res, product, 'Product found by barcode');
  }

  async createProduct(req: Request, res: Response) {
    const product = await productsService.createProduct(
      req.body,
      req.user!.id,
      req.user!.email
    );
    return ApiResponse.created(res, product, 'Product created successfully');
  }

  async updateProduct(req: Request, res: Response) {
    const product = await productsService.updateProduct(
      req.params.id,
      req.body,
      req.user!.id,
      req.user!.email
    );
    return ApiResponse.success(res, product, 'Product updated successfully');
  }

  async getCategories(req: Request, res: Response) {
    const categories = await productsService.getCategories();
    return ApiResponse.success(res, categories, 'Categories retrieved');
  }

  async getBrands(req: Request, res: Response) {
    const brands = await productsService.getBrands();
    return ApiResponse.success(res, brands, 'Brands retrieved');
  }
}

export const productsController = new ProductsController();
