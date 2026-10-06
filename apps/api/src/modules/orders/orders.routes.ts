import { Router } from 'express';
import { ordersController } from './orders.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { asyncHandler } from '../../core/asyncHandler';
import { createOrderSchema, orderQuerySchema } from '@toy-wms/shared';

const router = Router();

// Order intake endpoint (supports website API calls with Bearer token)
router.post(
  '/',
  authenticate,
  validate(createOrderSchema),
  asyncHandler(ordersController.createOrder.bind(ordersController))
);

router.get(
  '/',
  authenticate,
  validate(orderQuerySchema, 'query'),
  asyncHandler(ordersController.getOrders.bind(ordersController))
);

router.get(
  '/:id',
  authenticate,
  asyncHandler(ordersController.getOrderById.bind(ordersController))
);

export default router;
