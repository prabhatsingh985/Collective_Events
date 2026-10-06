import { Request, Response, NextFunction } from 'express';
import { AppError } from '../core/AppError';
import { ApiResponse } from '../core/ApiResponse';
import { logger } from '../config/logger';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Operational AppError
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(err, `[${err.code}] ${err.message}`);
    } else {
      logger.warn(`[${err.code}] ${err.message} - Path: ${req.originalUrl}`);
    }
    return ApiResponse.error(res, err.message, err.statusCode, err.code, err.details);
  }

  // Prisma Unique Constraint Error (P2002)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[])?.join(', ') || 'field';
      const message = `A record with this ${target} already exists.`;
      logger.warn(`[PRISMA_P2002] ${message} - Path: ${req.originalUrl}`);
      return ApiResponse.error(res, message, 409, 'DUPLICATE_RECORD', { target });
    }

    if (err.code === 'P2025') {
      const message = 'The requested record was not found.';
      logger.warn(`[PRISMA_P2025] ${message} - Path: ${req.originalUrl}`);
      return ApiResponse.error(res, message, 404, 'RECORD_NOT_FOUND');
    }
  }

  // SyntaxError from invalid JSON body
  if (err instanceof SyntaxError && 'body' in err) {
    return ApiResponse.error(res, 'Malformed JSON in request body', 400, 'INVALID_JSON');
  }

  // Unexpected runtime error
  logger.error(err, `Unhandled Exception at ${req.method} ${req.originalUrl}`);
  return ApiResponse.error(
    res,
    process.env.NODE_ENV === 'production'
      ? 'An unexpected internal error occurred'
      : err.message || 'Internal Server Error',
    500,
    'INTERNAL_SERVER_ERROR'
  );
};
