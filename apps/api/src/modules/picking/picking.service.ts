import { pickingRepository } from './picking.repository';
import { auditService } from '../audit/audit.service';
import { AppError } from '../../core/AppError';
import { PickListStatus } from '@prisma/client';

export class PickingService {
  async getPickLists(status?: string) {
    return pickingRepository.findPickLists(status as PickListStatus);
  }

  async getPickListById(id: string) {
    const list = await pickingRepository.findPickListById(id);
    if (!list) {
      throw AppError.notFound(`Pick list with ID ${id} not found`);
    }
    return list;
  }

  async createPickList(orderIds: string[], assignedToId?: string, userId?: string, userEmail?: string) {
    const pickList = await pickingRepository.createPickListForOrders(orderIds, assignedToId);

    await auditService.log({
      userId,
      userEmail,
      action: 'PICK_LIST_GENERATED',
      entityType: 'PickList',
      entityId: pickList!.id,
      details: {
        pickListNumber: pickList!.pickListNumber,
        orderCount: orderIds.length,
        taskCount: pickList!.tasks.length,
      },
    });

    return pickList;
  }

  async confirmPickTask(
    taskId: string,
    data: {
      scannedBarcode: string;
      scannedLocationBarcode: string;
      pickedQty: number;
      shortPickedQty?: number;
    },
    userId: string,
    userEmail: string
  ) {
    const result = await pickingRepository.confirmPickTask({
      taskId,
      scannedBarcode: data.scannedBarcode,
      scannedLocationBarcode: data.scannedLocationBarcode,
      pickedQty: data.pickedQty,
      shortPickedQty: data.shortPickedQty,
      userId,
    });

    await auditService.log({
      userId,
      userEmail,
      action: 'PICK_TASK_CONFIRMED',
      entityType: 'PickTask',
      entityId: taskId,
      details: {
        pickedQty: data.pickedQty,
        shortPickedQty: data.shortPickedQty,
        status: result.task.status,
      },
    });

    return result;
  }
}

export const pickingService = new PickingService();
