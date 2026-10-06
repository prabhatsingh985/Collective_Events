import { Router } from 'express';
import { returnsController } from './returns.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createReturnSchema, inspectReturnItemSchema } from '@toy-wms/shared';
import { asyncHandler } from '../../core/asyncHandler';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  requireRole(['ADMIN', 'WAREHOUSE_MANAGER', 'QC', 'WAREHOUSE_ASSOCIATE']),
  asyncHandler((req, res) => returnsController.getReturns(req, res))
);

router.get(
  '/:id',
  requireRole(['ADMIN', 'WAREHOUSE_MANAGER', 'QC', 'WAREHOUSE_ASSOCIATE']),
  asyncHandler((req, res) => returnsController.getReturnById(req, res))
);

router.post(
  '/',
  requireRole(['ADMIN', 'WAREHOUSE_MANAGER', 'QC', 'WAREHOUSE_ASSOCIATE']),
  validate(createReturnSchema),
  asyncHandler((req, res) => returnsController.createReturn(req, res))
);

router.post(
  '/inspect',
  requireRole(['ADMIN', 'WAREHOUSE_MANAGER', 'QC']),
  validate(inspectReturnItemSchema),
  asyncHandler((req, res) => returnsController.inspectItem(req, res))
);

export default router;
