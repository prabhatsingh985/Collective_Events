import { Router } from 'express';
import { grnController } from './grn.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import { asyncHandler } from '../../core/asyncHandler';
import { createGRNSchema, USER_ROLES } from '@toy-wms/shared';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(grnController.getGRNs.bind(grnController)));
router.get('/:id', asyncHandler(grnController.getGRNById.bind(grnController)));

router.post(
  '/',
  requireRole([
    USER_ROLES.ADMIN,
    USER_ROLES.WAREHOUSE_MANAGER,
    USER_ROLES.WAREHOUSE_ASSOCIATE,
    USER_ROLES.QC,
  ]),
  validate(createGRNSchema),
  asyncHandler(grnController.createGRN.bind(grnController))
);

export default router;
