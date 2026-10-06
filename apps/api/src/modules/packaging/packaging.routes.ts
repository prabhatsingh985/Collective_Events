import { Router } from 'express';
import { packagingController } from './packaging.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { asyncHandler } from '../../core/asyncHandler';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  requireRole(['ADMIN', 'WAREHOUSE_MANAGER', 'WAREHOUSE_ASSOCIATE', 'QC']),
  asyncHandler((req, res) => packagingController.getAll(req, res))
);

router.get(
  '/:id',
  requireRole(['ADMIN', 'WAREHOUSE_MANAGER', 'WAREHOUSE_ASSOCIATE', 'QC']),
  asyncHandler((req, res) => packagingController.getById(req, res))
);

router.patch(
  '/:id/stock',
  requireRole(['ADMIN', 'WAREHOUSE_MANAGER']),
  asyncHandler((req, res) => packagingController.updateStock(req, res))
);

router.post(
  '/',
  requireRole(['ADMIN', 'WAREHOUSE_MANAGER']),
  asyncHandler((req, res) => packagingController.create(req, res))
);

export default router;
