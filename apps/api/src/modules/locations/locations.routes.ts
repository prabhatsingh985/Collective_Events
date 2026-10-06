import { Router } from 'express';
import { locationsController } from './locations.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import { asyncHandler } from '../../core/asyncHandler';
import {
  createLocationSchema,
  updateLocationSchema,
  locationQuerySchema,
  USER_ROLES,
} from '@toy-wms/shared';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  validate(locationQuerySchema, 'query'),
  asyncHandler(locationsController.getLocations.bind(locationsController))
);

router.get(
  '/barcode/:barcode',
  asyncHandler(locationsController.getLocationByBarcode.bind(locationsController))
);

router.get(
  '/:id',
  asyncHandler(locationsController.getLocationById.bind(locationsController))
);

router.post(
  '/',
  requireRole([USER_ROLES.ADMIN, USER_ROLES.WAREHOUSE_MANAGER]),
  validate(createLocationSchema),
  asyncHandler(locationsController.createLocation.bind(locationsController))
);

router.patch(
  '/:id',
  requireRole([USER_ROLES.ADMIN, USER_ROLES.WAREHOUSE_MANAGER]),
  validate(updateLocationSchema),
  asyncHandler(locationsController.updateLocation.bind(locationsController))
);

export default router;
