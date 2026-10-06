import { Router } from 'express';
import { purchaseOrderController } from './po.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import { asyncHandler } from '../../core/asyncHandler';
import { createPOSchema, USER_ROLES } from '@toy-wms/shared';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(purchaseOrderController.getPOs.bind(purchaseOrderController)));
router.get('/:id', asyncHandler(purchaseOrderController.getPOById.bind(purchaseOrderController)));

router.post(
  '/',
  requireRole([USER_ROLES.ADMIN, USER_ROLES.WAREHOUSE_MANAGER]),
  validate(createPOSchema),
  asyncHandler(purchaseOrderController.createPO.bind(purchaseOrderController))
);

router.patch(
  '/:id/send',
  requireRole([USER_ROLES.ADMIN, USER_ROLES.WAREHOUSE_MANAGER]),
  asyncHandler(purchaseOrderController.sendPO.bind(purchaseOrderController))
);

router.patch(
  '/:id/cancel',
  requireRole([USER_ROLES.ADMIN, USER_ROLES.WAREHOUSE_MANAGER]),
  asyncHandler(purchaseOrderController.cancelPO.bind(purchaseOrderController))
);

export default router;
