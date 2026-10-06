import { Request, Response } from 'express';
import { auditService } from './audit.service';
import { ApiResponse } from '../../core/ApiResponse';

export class AuditController {
  async getLogs(req: Request, res: Response) {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const userId = req.query.userId as string;
    const entityType = req.query.entityType as string;
    const entityId = req.query.entityId as string;
    const action = req.query.action as string;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const result = await auditService.getLogs({
      page,
      limit,
      userId,
      entityType,
      entityId,
      action,
      startDate,
      endDate,
    });

    return ApiResponse.paginated(
      res,
      result.items,
      {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        hasNext: result.page < result.totalPages,
        hasPrev: result.page > 1,
      },
      'Audit logs retrieved successfully'
    );
  }
}

export const auditController = new AuditController();
