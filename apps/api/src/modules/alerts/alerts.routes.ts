import { Router } from 'express';
import { alertsController } from './alerts.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createPoFromLowStockSchema } from '@toy-wms/shared';
import { asyncHandler } from '../../core/asyncHandler';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  requireRole(['ADMIN', 'WAREHOUSE_MANAGER', 'QC', 'WAREHOUSE_ASSOCIATE']),
  asyncHandler((req, res) => alertsController.getAlerts(req, res))
);

router.get(
  '/low-stock',
  requireRole(['ADMIN', 'WAREHOUSE_MANAGER', 'QC']),
  asyncHandler((req, res) => alertsController.getLowStock(req, res))
);

router.post(
  '/scan-low-stock',
  requireRole(['ADMIN', 'WAREHOUSE_MANAGER']),
  asyncHandler((req, res) => alertsController.scanLowStock(req, res))
);

router.patch(
  '/:id/read',
  requireRole(['ADMIN', 'WAREHOUSE_MANAGER', 'QC', 'WAREHOUSE_ASSOCIATE']),
  asyncHandler((req, res) => alertsController.markAsRead(req, res))
);

router.post(
  '/mark-all-read',
  requireRole(['ADMIN', 'WAREHOUSE_MANAGER']),
  asyncHandler((req, res) => alertsController.markAllAsRead(req, res))
);

router.post(
  '/create-po',
  requireRole(['ADMIN', 'WAREHOUSE_MANAGER']),
  validate(createPoFromLowStockSchema),
  asyncHandler((req, res) => alertsController.createPoFromLowStock(req, res))
);

export default router;
