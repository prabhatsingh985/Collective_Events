import { Response } from 'express';
import { ApiResponse as SharedApiResponse, PaginationMeta } from '@toy-wms/shared';

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = 200,
    meta?: PaginationMeta
  ) {
    const payload: SharedApiResponse<T> = {
      success: true,
      data,
      message,
      meta,
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(payload);
  }

  static created<T>(res: Response, data: T, message?: string) {
    return ApiResponse.success(res, data, message, 201);
  }

  static paginated<T>(
    res: Response,
    data: T,
    meta: PaginationMeta,
    message?: string
  ) {
    return ApiResponse.success(res, data, message, 200, meta);
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    code: string = 'ERROR',
    details?: any
  ) {
    const payload: SharedApiResponse<null> = {
      success: false,
      data: null,
      error: {
        code,
        message,
        details,
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(payload);
  }
}
