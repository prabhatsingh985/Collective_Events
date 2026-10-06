import { returnsRepository } from './returns.repository';
import { auditService } from '../audit/audit.service';
import { AppError } from '../../core/AppError';
import { CreateReturnInput, InspectReturnItemInput } from '@toy-wms/shared';
import { ReturnStatus } from '@prisma/client';

export class ReturnsService {
  async getReturns(status?: string) {
    return returnsRepository.findMany(status as ReturnStatus);
  }

  async getReturnById(id: string) {
    const ret = await returnsRepository.findById(id);
    if (!ret) {
      throw AppError.notFound(`Return with ID ${id} not found`);
    }
    return ret;
  }

  async createReturn(data: CreateReturnInput, userId: string, userEmail: string) {
    const ret = await returnsRepository.createReturn(data, userId);

    await auditService.log({
      userId,
      userEmail,
      action: 'RETURN_RECEIVED',
      entityType: 'Return',
      entityId: ret.id,
      details: {
        returnNumber: ret.returnNumber,
        type: ret.type,
        itemCount: ret.items.length,
      },
    });

    return ret;
  }

  async inspectItem(data: InspectReturnItemInput, userId: string, userEmail: string) {
    const item = await returnsRepository.inspectReturnItem(data, userId);

    await auditService.log({
      userId,
      userEmail,
      action: 'RETURN_ITEM_INSPECTED',
      entityType: 'ReturnItem',
      entityId: item.id,
      details: {
        disposition: item.disposition,
        condition: item.condition,
        refundStatus: item.refundStatus,
      },
    });

    return item;
  }
}

export const returnsService = new ReturnsService();
