import { purchaseOrderRepository } from './po.repository';
import { auditService } from '../audit/audit.service';
import { AppError } from '../../core/AppError';
import { CreatePOInput } from '@toy-wms/shared';
import { POStatus } from '@prisma/client';

export class PurchaseOrderService {
  async getPOs(filter?: { status?: string; supplierId?: string }) {
    return purchaseOrderRepository.findMany({
      status: filter?.status as POStatus,
      supplierId: filter?.supplierId,
    });
  }

  async getPOById(id: string) {
    const po = await purchaseOrderRepository.findById(id);
    if (!po) {
      throw AppError.notFound(`Purchase Order with ID ${id} not found`);
    }
    return po;
  }

  async createPO(data: CreatePOInput, userId: string, userEmail: string) {
    const po = await purchaseOrderRepository.create(data, userId);

    await auditService.log({
      userId,
      userEmail,
      action: 'PO_CREATED',
      entityType: 'PurchaseOrder',
      entityId: po.id,
      details: { poNumber: po.poNumber, supplier: po.supplier.name, totalAmount: po.totalAmount },
    });

    return po;
  }

  async sendPO(id: string, userId: string, userEmail: string) {
    const po = await this.getPOById(id);
    if (po.status !== POStatus.DRAFT) {
      throw AppError.badRequest(`Cannot send PO in status ${po.status}. Must be DRAFT.`);
    }

    const updated = await purchaseOrderRepository.updateStatus(id, POStatus.SENT);

    await auditService.log({
      userId,
      userEmail,
      action: 'PO_SENT_TO_SUPPLIER',
      entityType: 'PurchaseOrder',
      entityId: id,
      details: { poNumber: po.poNumber },
    });

    return updated;
  }

  async cancelPO(id: string, reason: string, userId: string, userEmail: string) {
    const po = await this.getPOById(id);
    if (po.status === POStatus.RECEIVED) {
      throw AppError.badRequest('Cannot cancel an already received PO.');
    }

    const updated = await purchaseOrderRepository.updateStatus(id, POStatus.CANCELLED, {
      notes: po.notes ? `${po.notes} | Cancelled: ${reason}` : `Cancelled: ${reason}`,
    });

    await auditService.log({
      userId,
      userEmail,
      action: 'PO_CANCELLED',
      entityType: 'PurchaseOrder',
      entityId: id,
      details: { reason },
    });

    return updated;
  }
}

export const purchaseOrderService = new PurchaseOrderService();
