import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../core/asyncHandler';
import { loginSchema, refreshTokenSchema } from '@toy-wms/shared';

const router = Router();

router.post(
  '/login',
  validate(loginSchema),
  asyncHandler(authController.login.bind(authController))
);

router.post(
  '/refresh',
  validate(refreshTokenSchema),
  asyncHandler(authController.refreshToken.bind(authController))
);

router.post(
  '/logout',
  asyncHandler(authController.logout.bind(authController))
);

router.get(
  '/me',
  authenticate,
  asyncHandler(authController.getMe.bind(authController))
);

export default router;
