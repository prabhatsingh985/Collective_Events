import { prisma } from '../../config/db';
import { MovementType, OrderStatus, PickListStatus, PickTaskStatus, ReferenceDocType, ReservationStatus } from '@prisma/client';
import { AppError } from '../../core/AppError';

export class PickingRepository {
  async findPickLists(status?: PickListStatus) {
    return prisma.pickList.findMany({
      where: status ? { status } : undefined,
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        tasks: {
          include: {
            product: { select: { id: true, sku: true, name: true, barcode: true } },
            location: { select: { id: true, code: true, barcode: true, pickSequence: true } },
            order: { select: { id: true, orderNumber: true, customerName: true } },
          },
          orderBy: { routeSequence: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPickListById(id: string) {
    return prisma.pickList.findUnique({
      where: { id },
      include: {
        assignedTo: true,
        tasks: {
          include: {
            product: true,
            location: true,
            order: true,
            orderItem: true,
          },
          orderBy: { routeSequence: 'asc' },
        },
      },
    });
  }

  /**
   * Generates a Pick List with route optimization for specified order IDs
   */
  async createPickListForOrders(orderIds: string[], assignedToId?: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Fetch active reservations for these orders
      const reservations = await tx.reservation.findMany({
        where: {
          orderId: { in: orderIds },
          status: ReservationStatus.ACTIVE,
        },
        include: {
          location: true,
          product: true,
          order: true,
        },
        orderBy: { location: { pickSequence: 'asc' } },
      });

      if (reservations.length === 0) {
        throw AppError.badRequest('No active reservations found for the selected orders');
      }

      const count = await tx.pickList.count();
      const pickListNumber = `PL-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

      const pickList = await tx.pickList.create({
        data: {
          pickListNumber,
          status: assignedToId ? PickListStatus.ASSIGNED : PickListStatus.CREATED,
          assignedToId: assignedToId || null,
        },
      });

      // 2. Create PickTasks sorted along optimal S-curve routeSequence
      let seq = 1;
      for (const res of reservations) {
        await tx.pickTask.create({
          data: {
            pickListId: pickList.id,
            orderId: res.orderId,
            orderItemId: res.orderItemId,
            productId: res.productId,
            locationId: res.locationId,
            requestedQty: res.quantity,
            routeSequence: res.location.pickSequence || seq * 10,
            status: PickTaskStatus.PENDING,
          },
        });
        seq++;
      }

      // 3. Update orders status to PICKING
      await tx.order.updateMany({
        where: { id: { in: orderIds } },
        data: { status: OrderStatus.PICKING },
      });

      return tx.pickList.findUnique({
        where: { id: pickList.id },
        include: {
          tasks: {
            include: { product: true, location: true, order: true },
            orderBy: { routeSequence: 'asc' },
          },
        },
      });
    });
  }

  /**
   * Confirms a Pick Task with Barcode Scanning and Ledger Write
   */
  async confirmPickTask(params: {
    taskId: string;
    scannedBarcode: string;
    scannedLocationBarcode: string;
    pickedQty: number;
    shortPickedQty?: number;
    userId: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const task = await tx.pickTask.findUnique({
        where: { id: params.taskId },
        include: {
          product: true,
          location: true,
          order: true,
          orderItem: true,
        },
      });

      if (!task) throw AppError.notFound('Pick task not found');
      if (task.status === PickTaskStatus.PICKED) {
        throw AppError.badRequest('Pick task is already completed');
      }

      // Barcode validation
      const cleanProd = params.scannedBarcode.trim();
      if (cleanProd !== task.product.barcode && cleanProd !== task.product.sku) {
        throw AppError.badRequest(
          `Product barcode mismatch! Scanned: "${cleanProd}". Expected: "${task.product.barcode}" (${task.product.sku})`
        );
      }

      const cleanLoc = params.scannedLocationBarcode.trim();
      if (cleanLoc !== task.location.barcode && cleanLoc !== task.location.code) {
        throw AppError.badRequest(
          `Location barcode mismatch! Scanned: "${cleanLoc}". Expected: "${task.location.barcode}" (${task.location.code})`
        );
      }

      const actualPicked = params.pickedQty;
      const shortPicked = params.shortPickedQty || 0;

      if (actualPicked + shortPicked !== task.requestedQty) {
        throw AppError.badRequest(
          `Picked quantity (${actualPicked}) + short picked (${shortPicked}) must equal requested quantity (${task.requestedQty})`
        );
      }

      // Decrement onHand and reserved from StockLevel
      const stock = await tx.stockLevel.findUnique({
        where: {
          locationId_productId: {
            locationId: task.locationId,
            productId: task.productId,
          },
        },
      });

      const beforeOnHand = stock!.onHand;
      const beforeReserved = stock!.reserved;
      const afterOnHand = beforeOnHand - actualPicked;
      const afterReserved = beforeReserved - task.requestedQty;

      await tx.stockLevel.update({
        where: { id: stock!.id },
        data: {
          onHand: { decrement: actualPicked },
          reserved: { decrement: task.requestedQty },
        },
      });

      // Update OrderItem pickedQty
      await tx.orderItem.update({
        where: { id: task.orderItemId },
        data: { pickedQty: { increment: actualPicked } },
      });

      // Update Reservation
      await tx.reservation.updateMany({
        where: {
          orderItemId: task.orderItemId,
          locationId: task.locationId,
          productId: task.productId,
          status: ReservationStatus.ACTIVE,
        },
        data: { status: ReservationStatus.FULFILLED },
      });

      // Immutable Ledger write
      const ledger = await tx.inventoryLedger.create({
        data: {
          productId: task.productId,
          fromLocationId: task.locationId,
          movementType: MovementType.PICK,
          quantity: actualPicked,
          beforeOnHand,
          afterOnHand,
          beforeReserved,
          afterReserved,
          referenceType: ReferenceDocType.PICK_LIST,
          referenceId: task.pickListId,
          reason: `Order Pick for ${task.order.orderNumber}`,
          performedById: params.userId,
        },
      });

      // Update Task
      const updatedTask = await tx.pickTask.update({
        where: { id: task.id },
        data: {
          pickedQty: actualPicked,
          shortPickedQty: shortPicked,
          status: shortPicked > 0 ? PickTaskStatus.SHORT_PICKED : PickTaskStatus.PICKED,
          scannedBarcode: cleanProd,
          scannedLocationBarcode: cleanLoc,
          pickedById: params.userId,
          pickedAt: new Date(),
        },
      });

      // Check if all tasks in pick list are finished
      const allTasks = await tx.pickTask.findMany({ where: { pickListId: task.pickListId } });
      const allDone = allTasks.every((t) => t.status === PickTaskStatus.PICKED || t.status === PickTaskStatus.SHORT_PICKED);

      if (allDone) {
        await tx.pickList.update({
          where: { id: task.pickListId },
          data: { status: PickListStatus.COMPLETED, completedAt: new Date() },
        });

        // Update Order to PICKED
        await tx.order.update({
          where: { id: task.orderId },
          data: { status: OrderStatus.PICKED },
        });
      }

      return { task: updatedTask, ledger };
    });
  }
}

export const pickingRepository = new PickingRepository();
