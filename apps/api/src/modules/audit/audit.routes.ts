import { Router } from 'express';
import { auditController } from './audit.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { asyncHandler } from '../../core/asyncHandler';
import { USER_ROLES } from '@toy-wms/shared';

const router = Router();

router.get(
  '/',
  authenticate,
  requireRole([USER_ROLES.ADMIN, USER_ROLES.WAREHOUSE_MANAGER]),
  asyncHandler(auditController.getLogs.bind(auditController))
);

export default router;
