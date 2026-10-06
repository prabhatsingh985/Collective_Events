import { auditRepository, CreateAuditLogParams, FindAuditLogsFilter } from './audit.repository';
import { logger } from '../../config/logger';

export class AuditService {
  async log(params: CreateAuditLogParams) {
    try {
      return await auditRepository.create(params);
    } catch (error) {
      // Audit log failures should not crash user operations, but must be logged to pino
      logger.error(error, 'Failed to write audit log');
      return null;
    }
  }

  async getLogs(filter: FindAuditLogsFilter) {
    return auditRepository.findMany(filter);
  }
}

export const auditService = new AuditService();
