import { Router } from 'express';
import { inventoryController } from './inventory.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import { asyncHandler } from '../../core/asyncHandler';
import {
  stockQuerySchema,
  stockTransferSchema,
  createAdjustmentSchema,
  approveAdjustmentSchema,
  ledgerQuerySchema,
  USER_ROLES,
} from '@toy-wms/shared';

const router = Router();

router.use(authenticate);

// Stock queries
router.get(
  '/stock',
  validate(stockQuerySchema, 'query'),
  asyncHandler(inventoryController.getStock.bind(inventoryController))
);

// Stock transfer between locations
router.post(
  '/transfer',
  requireRole([USER_ROLES.ADMIN, USER_ROLES.WAREHOUSE_MANAGER, USER_ROLES.WAREHOUSE_ASSOCIATE]),
  validate(stockTransferSchema),
  asyncHandler(inventoryController.transferStock.bind(inventoryController))
);

// Stock Adjustments
router.get(
  '/adjustments',
  asyncHandler(inventoryController.getAdjustments.bind(inventoryController))
);

router.post(
  '/adjustments',
  requireRole([
    USER_ROLES.ADMIN,
    USER_ROLES.WAREHOUSE_MANAGER,
    USER_ROLES.WAREHOUSE_ASSOCIATE,
    USER_ROLES.QC,
  ]),
  validate(createAdjustmentSchema),
  asyncHandler(inventoryController.createAdjustment.bind(inventoryController))
);

router.patch(
  '/adjustments/:id/approve',
  requireRole([USER_ROLES.ADMIN, USER_ROLES.WAREHOUSE_MANAGER]),
  validate(approveAdjustmentSchema),
  asyncHandler(inventoryController.approveAdjustment.bind(inventoryController))
);

// Immutable Ledger
router.get(
  '/ledger',
  validate(ledgerQuerySchema, 'query'),
  asyncHandler(inventoryController.getLedgers.bind(inventoryController))
);

export default router;
