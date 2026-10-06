import { Request, Response, NextFunction } from 'express';
import { AppError } from '../core/AppError';
import { UserRole } from '@toy-wms/shared';

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        AppError.forbidden(
          `Access denied. Allowed roles: ${allowedRoles.join(', ')}. Current role: ${req.user.role}`,
          'INSUFFICIENT_PERMISSIONS'
        )
      );
    }

    next();
  };
};
