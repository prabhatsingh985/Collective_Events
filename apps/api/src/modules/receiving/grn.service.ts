import { grnRepository } from './grn.repository';
import { auditService } from '../audit/audit.service';
import { AppError } from '../../core/AppError';
import { CreateGRNInput } from '@toy-wms/shared';

export class GRNService {
  async getGRNs() {
    return grnRepository.findMany();
  }

  async getGRNById(id: string) {
    const grn = await grnRepository.findById(id);
    if (!grn) {
      throw AppError.notFound(`GRN with ID ${id} not found`);
    }
    return grn;
  }

  async createGRN(data: CreateGRNInput, userId: string, userEmail: string) {
    const result = await grnRepository.createWithQCAndPutawayTasks(data, userId);

    await auditService.log({
      userId,
      userEmail,
      action: 'GRN_CREATED',
      entityType: 'GRN',
      entityId: result.grn.id,
      details: {
        grnNumber: result.grn.grnNumber,
        invoiceNumber: result.grn.supplierInvoiceNumber,
        putawayTasksGenerated: result.putawayTasks.length,
      },
    });

    return result;
  }
}

export const grnService = new GRNService();
