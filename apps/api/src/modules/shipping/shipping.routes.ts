import { Router } from 'express';
import { shippingController } from './shipping.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import { asyncHandler } from '../../core/asyncHandler';
import {
  createShipmentSchema,
  courierWebhookSchema,
  USER_ROLES,
} from '@toy-wms/shared';

const router = Router();

// Courier webhook does not require JWT auth (simulates external courier webhook)
router.post(
  '/webhook',
  validate(courierWebhookSchema),
  asyncHandler(shippingController.courierWebhook.bind(shippingController))
);

// Protected routes
router.use(authenticate);

router.get('/', asyncHandler(shippingController.getShipments.bind(shippingController)));
router.get('/:awb', asyncHandler(shippingController.getShipmentByAwb.bind(shippingController)));

router.post(
  '/',
  requireRole([
    USER_ROLES.ADMIN,
    USER_ROLES.WAREHOUSE_MANAGER,
    USER_ROLES.WAREHOUSE_ASSOCIATE,
  ]),
  validate(createShipmentSchema),
  asyncHandler(shippingController.createShipment.bind(shippingController))
);

export default router;
