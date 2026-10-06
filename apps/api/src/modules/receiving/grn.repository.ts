import { prisma } from '../../config/db';
import { GRNStatus, LocationType, MovementType, POStatus, ReferenceDocType } from '@prisma/client';
import { CreateGRNInput } from '@toy-wms/shared';
import { AppError } from '../../core/AppError';

export class GRNRepository {
  async findMany() {
    return prisma.gRN.findMany({
      include: {
        purchaseOrder: {
          select: {
            id: true,
            poNumber: true,
            supplier: { select: { id: true, name: true, code: true } },
          },
        },
        receivedBy: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            product: { select: { id: true, sku: true, name: true, barcode: true } },
            putawayTasks: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.gRN.findUnique({
      where: { id },
      include: {
        purchaseOrder: {
          include: { supplier: true, items: { include: { product: true } } },
        },
        receivedBy: { select: { id: true, name: true, email: true } },
        warehouse: true,
        items: {
          include: {
            product: true,
            putawayTasks: {
              include: {
                fromLocation: true,
                toLocation: true,
                assignedTo: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });
  }

  async createWithQCAndPutawayTasks(data: CreateGRNInput, receivedById: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Validate PO
      const po = await tx.purchaseOrder.findUnique({
        where: { id: data.purchaseOrderId },
        include: { items: true, warehouse: true },
      });

      if (!po) {
        throw AppError.notFound('Purchase order not found');
      }

      if (po.status !== POStatus.SENT && po.status !== POStatus.PARTIAL) {
        throw AppError.badRequest(`Cannot receive goods for PO in status ${po.status}`);
      }

      // 2. Find Receiving location & Damage location
      const receivingLocation = await tx.location.findFirst({
        where: { warehouseId: po.warehouseId, type: LocationType.RECEIVING },
      });

      if (!receivingLocation) {
        throw AppError.internal('Warehouse does not have a designated RECEIVING location');
      }

      const damagedLocation = await tx.location.findFirst({
        where: { warehouseId: po.warehouseId, type: LocationType.DAMAGED },
      });

      // Storage locations for putaway recommendations
      const storageLocations = await tx.location.findMany({
        where: { warehouseId: po.warehouseId, type: LocationType.PICKING },
      });

      // 3. Create GRN
      const count = await tx.gRN.count();
      const grnNumber = `GRN-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

      const grn = await tx.gRN.create({
        data: {
          grnNumber,
          purchaseOrderId: po.id,
          warehouseId: po.warehouseId,
          supplierInvoiceNumber: data.supplierInvoiceNumber,
          supplierInvoiceDate: new Date(data.supplierInvoiceDate),
          supplierInvoiceAmount: data.supplierInvoiceAmount,
          invoiceAttachmentUrl: data.invoiceAttachmentUrl,
          status: GRNStatus.COMPLETED,
          receivedById,
          notes: data.notes,
        },
      });

      let putawayCount = await tx.putawayTask.count();
      const createdPutawayTasks = [];

      // 4. Process each GRN Item
      for (const item of data.items) {
        const poItem = po.items.find((p) => p.productId === item.productId);
        const expectedQty = poItem ? poItem.expectedQty : item.receivedQty;

        const grnItem = await tx.gRNItem.create({
          data: {
            grnId: grn.id,
            productId: item.productId,
            expectedQty,
            receivedQty: item.receivedQty,
            acceptedQty: item.acceptedQty,
            rejectedQty: item.rejectedQty,
            qcStatus: item.qcStatus as any,
            qcNotes: item.qcNotes,
            rejectionReason: item.rejectionReason,
            batchNumber: item.batchNumber,
          },
        });

        // Update PO item receivedQty
        if (poItem) {
          await tx.purchaseOrderItem.update({
            where: { id: poItem.id },
            data: { receivedQty: { increment: item.receivedQty } },
          });
        }

        // Add accepted quantity to RECEIVING location
        if (item.acceptedQty > 0) {
          const receivingStock = await tx.stockLevel.upsert({
            where: {
              locationId_productId: {
                locationId: receivingLocation.id,
                productId: item.productId,
              },
            },
            update: { onHand: { increment: item.acceptedQty } },
            create: {
              warehouseId: po.warehouseId,
              locationId: receivingLocation.id,
              productId: item.productId,
              onHand: item.acceptedQty,
              reserved: 0,
            },
          });

          // Write immutable ledger entry
          await tx.inventoryLedger.create({
            data: {
              productId: item.productId,
              toLocationId: receivingLocation.id,
              movementType: MovementType.PO_RECEIVE,
              quantity: item.acceptedQty,
              beforeOnHand: receivingStock.onHand - item.acceptedQty,
              afterOnHand: receivingStock.onHand,
              beforeReserved: 0,
              afterReserved: 0,
              referenceType: ReferenceDocType.GRN,
              referenceId: grn.grnNumber,
              reason: `PO goods receipt: ${po.poNumber}`,
              performedById: receivedById,
            },
          });

          // Generate Putaway Task for accepted goods
          putawayCount++;
          const taskNumber = `PUT-${new Date().getFullYear()}-${String(putawayCount).padStart(4, '0')}`;
          const recommendedLocation = storageLocations[putawayCount % storageLocations.length] || receivingLocation;

          const putawayTask = await tx.putawayTask.create({
            data: {
              taskNumber,
              grnId: grn.id,
              grnItemId: grnItem.id,
              productId: item.productId,
              fromLocationId: receivingLocation.id,
              toLocationId: recommendedLocation.id,
              quantity: item.acceptedQty,
              status: 'PENDING',
            },
          });

          createdPutawayTasks.push(putawayTask);
        }

        // Add rejected quantity to DAMAGED location if applicable
        if (item.rejectedQty > 0 && damagedLocation) {
          const damagedStock = await tx.stockLevel.upsert({
            where: {
              locationId_productId: {
                locationId: damagedLocation.id,
                productId: item.productId,
              },
            },
            update: {
              onHand: { increment: item.rejectedQty },
              damaged: { increment: item.rejectedQty },
            },
            create: {
              warehouseId: po.warehouseId,
              locationId: damagedLocation.id,
              productId: item.productId,
              onHand: item.rejectedQty,
              damaged: item.rejectedQty,
            },
          });

          await tx.inventoryLedger.create({
            data: {
              productId: item.productId,
              toLocationId: damagedLocation.id,
              movementType: MovementType.DAMAGE_TRANSFER,
              quantity: item.rejectedQty,
              beforeOnHand: damagedStock.onHand - item.rejectedQty,
              afterOnHand: damagedStock.onHand,
              beforeReserved: 0,
              afterReserved: 0,
              referenceType: ReferenceDocType.GRN,
              referenceId: grn.grnNumber,
              reason: `QC Rejected: ${item.rejectionReason || 'Damaged in transit'}`,
              performedById: receivedById,
            },
          });
        }
      }

      // 5. Update PO status
      const updatedPOItems = await tx.purchaseOrderItem.findMany({ where: { purchaseOrderId: po.id } });
      const allFullyReceived = updatedPOItems.every((item) => item.receivedQty >= item.expectedQty);

      await tx.purchaseOrder.update({
        where: { id: po.id },
        data: {
          status: allFullyReceived ? POStatus.RECEIVED : POStatus.PARTIAL,
          closedAt: allFullyReceived ? new Date() : undefined,
        },
      });

      return { grn, putawayTasks: createdPutawayTasks };
    });
  }
}

export const grnRepository = new GRNRepository();
