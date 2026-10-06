import { Router } from 'express';
import { packingController } from './packing.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import { asyncHandler } from '../../core/asyncHandler';
import { createPackageSchema, USER_ROLES } from '@toy-wms/shared';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(packingController.getPackages.bind(packingController)));
router.get('/:id', asyncHandler(packingController.getPackageById.bind(packingController)));

router.post(
  '/',
  requireRole([
    USER_ROLES.ADMIN,
    USER_ROLES.WAREHOUSE_MANAGER,
    USER_ROLES.WAREHOUSE_ASSOCIATE,
  ]),
  validate(createPackageSchema),
  asyncHandler(packingController.createPackage.bind(packingController))
);

export default router;
