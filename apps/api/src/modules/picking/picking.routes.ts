import { Router } from 'express';
import { pickingController } from './picking.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { asyncHandler } from '../../core/asyncHandler';
import { USER_ROLES } from '@toy-wms/shared';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(pickingController.getPickLists.bind(pickingController)));
router.get('/:id', asyncHandler(pickingController.getPickListById.bind(pickingController)));

router.post(
  '/',
  requireRole([USER_ROLES.ADMIN, USER_ROLES.WAREHOUSE_MANAGER]),
  asyncHandler(pickingController.createPickList.bind(pickingController))
);

router.post(
  '/tasks/:taskId/confirm',
  requireRole([
    USER_ROLES.ADMIN,
    USER_ROLES.WAREHOUSE_MANAGER,
    USER_ROLES.WAREHOUSE_ASSOCIATE,
  ]),
  asyncHandler(pickingController.confirmPickTask.bind(pickingController))
);

export default router;
