import { Router, Request, Response } from 'express';
import { prisma } from '../../config/db';
import { ApiResponse } from '../../core/ApiResponse';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  let dbStatus = 'ok';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = 'disconnected';
  }

  const payload = {
    status: dbStatus === 'ok' ? 'healthy' : 'degraded',
    version: '1.0.0',
    service: 'Toy WMS API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbStatus,
    memoryUsage: process.memoryUsage(),
  };

  return ApiResponse.success(res, payload, 'System health report');
});

export default router;
