import { prisma } from '../../config/db';
import { MovementType, OrderStatus, Prisma, ReferenceDocType, ReservationStatus } from '@prisma/client';
import { CreateOrderInput, OrderQueryInput } from '@toy-wms/shared';
import { calculateGstBreakup } from '@toy-wms/shared';
import { AppError } from '../../core/AppError';

export class OrdersRepository {
  async findMany(query: OrderQueryInput) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};
    if (query.status) where.status = query.status as any;
    if (query.paymentMode) where.paymentMode = query.paymentMode as any;
    if (query.search) {
      where.OR = [
        { orderNumber: { contains: query.search, mode: 'insensitive' } },
        { customerName: { contains: query.search, mode: 'insensitive' } },
        { customerPhone: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  sku: true,
                  name: true,
                  barcode: true,
                },
              },
            },
          },
          reservations: true,
          packages: true,
          shipments: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        warehouse: true,
        items: {
          include: {
            product: true,
            reservations: {
              include: { location: true },
            },
          },
        },
        reservations: {
          include: { location: true, product: true },
        },
        packages: {
          include: { shipment: true },
        },
        shipments: {
          include: { trackingEvents: true },
        },
        returns: {
          include: { items: true },
        },
      },
    });
  }

  async findByIdempotencyKey(key: string) {
    return prisma.order.findUnique({
      where: { idempotencyKey: key },
      include: { items: true },
    });
  }

  /**
   * Concurrency-safe Order Intake & Stock Reservation in an atomic Prisma Transaction
   */
  async createAndReserveOrder(data: CreateOrderInput, warehouseId: string, userId?: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Check idempotency
      if (data.idempotencyKey) {
        const existing = await tx.order.findUnique({
          where: { idempotencyKey: data.idempotencyKey },
          include: { items: true, reservations: true },
        });
        if (existing) {
          return { order: existing, alreadyExisted: true };
        }
      }

      const warehouse = await tx.warehouse.findUnique({ where: { id: warehouseId } });
      if (!warehouse) throw AppError.notFound('Warehouse not found');

      // 2. Fetch all products and verify stock availability across forward picking / storage bins
      const isInterState = warehouse.state.toLowerCase() !== data.shippingState.toLowerCase();
      let subtotal = 0;
      let totalCgst = 0;
      let totalSgst = 0;
      let totalIgst = 0;
      let totalTax = 0;

      const orderItemsToCreate = [];
      const stockAllocations = [];

      for (const itemInput of data.items) {
        const product = await tx.product.findUnique({
          where: { id: itemInput.productId },
        });

        if (!product || !product.isActive) {
          throw AppError.badRequest(`Product ${itemInput.productId} not found or inactive`);
        }

        const unitPrice = itemInput.unitPrice ?? Number(product.sellingPrice);
        const gstPercent = Number(product.gstPercent);
        const linePrice = unitPrice * itemInput.quantity;

        const gst = calculateGstBreakup(linePrice, gstPercent, isInterState);
        subtotal += gst.taxableAmount;
        totalCgst += gst.cgst;
        totalSgst += gst.sgst;
        totalIgst += gst.igst;
        totalTax += gst.totalTax;

        // Atomic check for available stock in this warehouse
        // We select locations with available stock, prioritizing PICKING then STORAGE
        const stockLevels = await tx.stockLevel.findMany({
          where: {
            warehouseId,
            productId: product.id,
          },
          include: { location: true },
          orderBy: [
            { location: { type: 'asc' } }, // PICKING before STORAGE
            { location: { pickSequence: 'asc' } },
          ],
        });

        let remainingToReserve = itemInput.quantity;
        const matchedLocations: Array<{ locationId: string; quantity: number }> = [];

        for (const stock of stockLevels) {
          const availableInBin = stock.onHand - stock.reserved;
          if (availableInBin > 0) {
            const takeQty = Math.min(remainingToReserve, availableInBin);
            matchedLocations.push({ locationId: stock.locationId, quantity: takeQty });
            remainingToReserve -= takeQty;
            if (remainingToReserve <= 0) break;
          }
        }

        if (remainingToReserve > 0) {
          throw AppError.badRequest(
            `Insufficient available stock for "${product.name}" (${product.sku}). Requested: ${itemInput.quantity}, Short by: ${remainingToReserve}`
          );
        }

        orderItemsToCreate.push({
          productId: product.id,
          sku: product.sku,
          name: product.name,
          quantity: itemInput.quantity,
          unitPrice,
          taxPercent: gstPercent,
          taxAmount: gst.totalTax,
          totalPrice: gst.totalWithTax,
          allocatedQty: itemInput.quantity,
        });

        stockAllocations.push({
          productId: product.id,
          allocations: matchedLocations,
        });
      }

      // 3. Create Order
      const count = await tx.order.count();
      const orderNumber = `ORD-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
      const totalAmount =
        subtotal + totalTax + data.shippingFee - data.discount;

      const order = await tx.order.create({
        data: {
          orderNumber,
          idempotencyKey: data.idempotencyKey,
          warehouseId,
          source: data.source as any,
          status: OrderStatus.ALLOCATED,
          paymentMode: data.paymentMode as any,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          shippingAddressLine1: data.shippingAddressLine1,
          shippingAddressLine2: data.shippingAddressLine2,
          shippingCity: data.shippingCity,
          shippingState: data.shippingState,
          shippingPincode: data.shippingPincode,
          shippingCountry: data.shippingCountry,
          billingAddressLine1: data.billingAddressLine1 || data.shippingAddressLine1,
          billingAddressLine2: data.billingAddressLine2,
          billingCity: data.billingCity || data.shippingCity,
          billingState: data.billingState || data.shippingState,
          billingPincode: data.billingPincode || data.shippingPincode,
          billingCountry: data.billingCountry || 'India',
          subtotal: Math.round(subtotal * 100) / 100,
          cgst: Math.round(totalCgst * 100) / 100,
          sgst: Math.round(totalSgst * 100) / 100,
          igst: Math.round(totalIgst * 100) / 100,
          taxAmount: Math.round(totalTax * 100) / 100,
          shippingFee: data.shippingFee,
          discount: data.discount,
          totalAmount: Math.round(totalAmount * 100) / 100,
          codAmount: data.paymentMode === 'COD' ? Math.round(totalAmount * 100) / 100 : 0,
          notes: data.notes,
          items: {
            create: orderItemsToCreate,
          },
        },
        include: { items: true },
      });

      // 4. Reserve stock atomically & write immutable inventory ledger entries
      for (const alloc of stockAllocations) {
        const orderItem = order.items.find((i) => i.productId === alloc.productId)!;

        for (const locAlloc of alloc.allocations) {
          // Increment reserved count in stockLevel
          const stock = await tx.stockLevel.findUnique({
            where: {
              locationId_productId: {
                locationId: locAlloc.locationId,
                productId: alloc.productId,
              },
            },
          });

          const beforeReserved = stock!.reserved;
          const afterReserved = beforeReserved + locAlloc.quantity;

          await tx.stockLevel.update({
            where: { id: stock!.id },
            data: { reserved: { increment: locAlloc.quantity } },
          });

          // Create Reservation row
          await tx.reservation.create({
            data: {
              orderId: order.id,
              orderItemId: orderItem.id,
              productId: alloc.productId,
              locationId: locAlloc.locationId,
              quantity: locAlloc.quantity,
              status: ReservationStatus.ACTIVE,
            },
          });

          // Create Immutable Ledger entry
          await tx.inventoryLedger.create({
            data: {
              productId: alloc.productId,
              fromLocationId: locAlloc.locationId,
              movementType: MovementType.ORDER_RESERVE,
              quantity: locAlloc.quantity,
              beforeOnHand: stock!.onHand,
              afterOnHand: stock!.onHand,
              beforeReserved,
              afterReserved,
              referenceType: ReferenceDocType.ORDER,
              referenceId: order.orderNumber,
              reason: `Stock allocated for Order ${order.orderNumber}`,
              performedById: userId || (await tx.user.findFirst())!.id,
            },
          });
        }
      }

      return { order, alreadyExisted: false };
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
  }
}

export const ordersRepository = new OrdersRepository();
