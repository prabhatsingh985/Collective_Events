import { prisma } from '../../config/db';
import { MovementType, PutawayStatus, ReferenceDocType } from '@prisma/client';
import { AppError } from '../../core/AppError';

export class PutawayRepository {
  async findMany(status?: PutawayStatus) {
    return prisma.putawayTask.findMany({
      where: status ? { status } : undefined,
      include: {
        product: { select: { id: true, sku: true, name: true, barcode: true } },
        fromLocation: { select: { id: true, code: true, barcode: true, type: true } },
        toLocation: { select: { id: true, code: true, barcode: true, type: true } },
        assignedTo: { select: { id: true, name: true } },
        completedBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.putawayTask.findUnique({
      where: { id },
      include: {
        product: true,
        fromLocation: true,
        toLocation: true,
        assignedTo: true,
        completedBy: true,
        grn: true,
      },
    });
  }

  async confirmPutaway(params: {
    taskId: string;
    scannedProductBarcode: string;
    scannedLocationBarcode: string;
    confirmedQty: number;
    userId: string;
  }) {
    return prisma.$transaction(async (tx) => {
      // 1. Fetch task
      const task = await tx.putawayTask.findUnique({
        where: { id: params.taskId },
        include: { product: true, fromLocation: true, toLocation: true },
      });

      if (!task) {
        throw AppError.notFound('Putaway task not found');
      }

      if (task.status === PutawayStatus.COMPLETED) {
        throw AppError.badRequest('Putaway task is already completed');
      }

      // 2. Barcode verification check
      const cleanProdScan = params.scannedProductBarcode.trim();
      if (cleanProdScan !== task.product.barcode && cleanProdScan !== task.product.sku) {
        throw AppError.badRequest(
          `Product barcode mismatch! Scanned: "${cleanProdScan}". Expected: "${task.product.barcode}" (${task.product.sku})`
        );
      }

      const cleanLocScan = params.scannedLocationBarcode.trim();
      if (cleanLocScan !== task.toLocation.barcode && cleanLocScan !== task.toLocation.code) {
        throw AppError.badRequest(
          `Target location barcode mismatch! Scanned: "${cleanLocScan}". Expected: "${task.toLocation.barcode}" (${task.toLocation.code})`
        );
      }

      if (params.confirmedQty <= 0 || params.confirmedQty > task.quantity) {
        throw AppError.badRequest(
          `Invalid confirmed quantity: ${params.confirmedQty}. Must be between 1 and ${task.quantity}`
        );
      }

      // 3. Move stock from fromLocation (RECEIVING) to toLocation (STORAGE)
      const fromStock = await tx.stockLevel.findUnique({
        where: {
          locationId_productId: {
            locationId: task.fromLocationId,
            productId: task.productId,
          },
        },
      });

      if (!fromStock || fromStock.onHand < params.confirmedQty) {
        throw AppError.badRequest('Insufficient on-hand stock at receiving location');
      }

      const updatedFromStock = await tx.stockLevel.update({
        where: { id: fromStock.id },
        data: { onHand: { decrement: params.confirmedQty } },
      });

      const updatedToStock = await tx.stockLevel.upsert({
        where: {
          locationId_productId: {
            locationId: task.toLocationId,
            productId: task.productId,
          },
        },
        update: { onHand: { increment: params.confirmedQty } },
        create: {
          warehouseId: task.fromLocation.warehouseId,
          locationId: task.toLocationId,
          productId: task.productId,
          onHand: params.confirmedQty,
          reserved: 0,
        },
      });

      // 4. Create immutable ledger record
      const ledger = await tx.inventoryLedger.create({
        data: {
          productId: task.productId,
          fromLocationId: task.fromLocationId,
          toLocationId: task.toLocationId,
          movementType: MovementType.PUTAWAY,
          quantity: params.confirmedQty,
          beforeOnHand: fromStock.onHand,
          afterOnHand: updatedFromStock.onHand,
          beforeReserved: 0,
          afterReserved: 0,
          referenceType: ReferenceDocType.PUTAWAY_TASK,
          referenceId: task.taskNumber,
          reason: `Putaway completed to ${task.toLocation.code}`,
          performedById: params.userId,
        },
      });

      // 5. Update task status
      const updatedTask = await tx.putawayTask.update({
        where: { id: task.id },
        data: {
          status: PutawayStatus.COMPLETED,
          completedById: params.userId,
          completedAt: new Date(),
          scannedProductBarcode: cleanProdScan,
          scannedLocationBarcode: cleanLocScan,
        },
        include: {
          product: true,
          fromLocation: true,
          toLocation: true,
        },
      });

      return { task: updatedTask, ledger, destinationStock: updatedToStock };
    });
  }
}

export const putawayRepository = new PutawayRepository();
