import { Router } from 'express';
import { productsController } from './products.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import { asyncHandler } from '../../core/asyncHandler';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  USER_ROLES,
} from '@toy-wms/shared';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  validate(productQuerySchema, 'query'),
  asyncHandler(productsController.getProducts.bind(productsController))
);

router.get('/categories', asyncHandler(productsController.getCategories.bind(productsController)));
router.get('/brands', asyncHandler(productsController.getBrands.bind(productsController)));

router.get(
  '/barcode/:barcode',
  asyncHandler(productsController.getProductByBarcode.bind(productsController))
);

router.get(
  '/:id',
  asyncHandler(productsController.getProductById.bind(productsController))
);

router.post(
  '/',
  requireRole([USER_ROLES.ADMIN, USER_ROLES.WAREHOUSE_MANAGER]),
  validate(createProductSchema),
  asyncHandler(productsController.createProduct.bind(productsController))
);

router.patch(
  '/:id',
  requireRole([USER_ROLES.ADMIN, USER_ROLES.WAREHOUSE_MANAGER]),
  validate(updateProductSchema),
  asyncHandler(productsController.updateProduct.bind(productsController))
);

export default router;
