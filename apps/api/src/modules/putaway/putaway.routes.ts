import { Router } from 'express';
import { putawayController } from './putaway.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import { asyncHandler } from '../../core/asyncHandler';
import { confirmPutawaySchema, USER_ROLES } from '@toy-wms/shared';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(putawayController.getTasks.bind(putawayController)));
router.get('/:id', asyncHandler(putawayController.getTaskById.bind(putawayController)));

router.post(
  '/:id/confirm',
  requireRole([
    USER_ROLES.ADMIN,
    USER_ROLES.WAREHOUSE_MANAGER,
    USER_ROLES.WAREHOUSE_ASSOCIATE,
  ]),
  validate(confirmPutawaySchema),
  asyncHandler(putawayController.confirmPutaway.bind(putawayController))
);

export default router;
