import { Router } from 'express';
import { reportsController } from './reports.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { asyncHandler } from '../../core/asyncHandler';

const router = Router();

router.use(authenticate);

router.get(
  '/inventory-valuation',
  requireRole(['ADMIN', 'WAREHOUSE_MANAGER']),
  asyncHandler((req, res) => reportsController.getInventoryValuation(req, res))
);

router.get(
  '/order-fulfillment',
  requireRole(['ADMIN', 'WAREHOUSE_MANAGER']),
  asyncHandler((req, res) => reportsController.getOrderFulfillmentSla(req, res))
);

router.get(
  '/returns-rto',
  requireRole(['ADMIN', 'WAREHOUSE_MANAGER', 'QC']),
  asyncHandler((req, res) => reportsController.getReturnsAndRto(req, res))
);

router.post(
  '/contribution-margin',
  requireRole(['ADMIN', 'WAREHOUSE_MANAGER']),
  asyncHandler((req, res) => reportsController.getContributionMargin(req, res))
);

router.get(
  '/contribution-margin',
  requireRole(['ADMIN', 'WAREHOUSE_MANAGER']),
  asyncHandler((req, res) => reportsController.getContributionMargin(req, res))
);

export default router;
