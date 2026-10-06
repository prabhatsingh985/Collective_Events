import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from '../core/AppError';

export const validate = (schema: AnyZodObject, source: 'body' | 'query' | 'params' = 'body') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        return next(AppError.badRequest('Validation failed', 'VALIDATION_ERROR', issues));
      }
      next(error);
    }
  };
};
