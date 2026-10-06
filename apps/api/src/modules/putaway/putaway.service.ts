import { putawayRepository } from './putaway.repository';
import { auditService } from '../audit/audit.service';
import { AppError } from '../../core/AppError';
import { ConfirmPutawayInput } from '@toy-wms/shared';
import { PutawayStatus } from '@prisma/client';

export class PutawayService {
  async getTasks(status?: string) {
    return putawayRepository.findMany(status as PutawayStatus);
  }

  async getTaskById(id: string) {
    const task = await putawayRepository.findById(id);
    if (!task) {
      throw AppError.notFound(`Putaway task with ID ${id} not found`);
    }
    return task;
  }

  async confirmPutaway(
    taskId: string,
    data: ConfirmPutawayInput,
    userId: string,
    userEmail: string
  ) {
    const result = await putawayRepository.confirmPutaway({
      taskId,
      scannedProductBarcode: data.scannedProductBarcode,
      scannedLocationBarcode: data.scannedLocationBarcode,
      confirmedQty: data.confirmedQty,
      userId,
    });

    await auditService.log({
      userId,
      userEmail,
      action: 'PUTAWAY_CONFIRMED',
      entityType: 'PutawayTask',
      entityId: taskId,
      details: {
        taskNumber: result.task.taskNumber,
        product: result.task.product.sku,
        destination: result.task.toLocation.code,
        quantity: data.confirmedQty,
      },
    });

    return result;
  }
}

export const putawayService = new PutawayService();
