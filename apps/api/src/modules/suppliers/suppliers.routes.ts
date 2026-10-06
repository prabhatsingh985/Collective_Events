import { Router } from 'express';
import { suppliersController } from './suppliers.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { asyncHandler } from '../../core/asyncHandler';
import { USER_ROLES } from '@toy-wms/shared';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(suppliersController.getSuppliers.bind(suppliersController)));
router.get('/:id', asyncHandler(suppliersController.getSupplierById.bind(suppliersController)));

router.post(
  '/',
  requireRole([USER_ROLES.ADMIN, USER_ROLES.WAREHOUSE_MANAGER]),
  asyncHandler(suppliersController.createSupplier.bind(suppliersController))
);

router.patch(
  '/:id',
  requireRole([USER_ROLES.ADMIN, USER_ROLES.WAREHOUSE_MANAGER]),
  asyncHandler(suppliersController.updateSupplier.bind(suppliersController))
);

router.post(
  '/:id/prices',
  requireRole([USER_ROLES.ADMIN, USER_ROLES.WAREHOUSE_MANAGER]),
  asyncHandler(suppliersController.setProductPrice.bind(suppliersController))
);

export default router;
