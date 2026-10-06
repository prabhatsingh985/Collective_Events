import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { prisma } from '../config/db';
import { AppError } from '../core/AppError';
import { UserRole } from '@toy-wms/shared';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  warehouseId?: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(AppError.unauthorized('No authorization token provided'));
    }

    const token = authHeader.split(' ')[1];
    let decoded: any;

    try {
      decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        return next(AppError.unauthorized('Access token expired', 'TOKEN_EXPIRED'));
      }
      return next(AppError.unauthorized('Invalid access token', 'INVALID_TOKEN'));
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        warehouseId: true,
      },
    });

    if (!user) {
      return next(AppError.unauthorized('User not found'));
    }

    if (!user.isActive) {
      return next(AppError.forbidden('User account is deactivated', 'ACCOUNT_DEACTIVATED'));
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      warehouseId: user.warehouseId,
    };

    next();
  } catch (error) {
    next(error);
  }
};
