import { ordersRepository } from './orders.repository';
import { auditService } from '../audit/audit.service';
import { AppError } from '../../core/AppError';
import { CreateOrderInput, OrderQueryInput } from '@toy-wms/shared';
import { OrderStatus } from '@prisma/client';

export class OrdersService {
  async getOrders(query: OrderQueryInput) {
    return ordersRepository.findMany(query);
  }

  async getOrderById(id: string) {
    const order = await ordersRepository.findById(id);
    if (!order) {
      throw AppError.notFound(`Order with ID ${id} not found`);
    }
    return order;
  }

  async createOrder(data: CreateOrderInput, warehouseId: string, userId?: string, userEmail?: string) {
    const { order, alreadyExisted } = await ordersRepository.createAndReserveOrder(
      data,
      warehouseId,
      userId
    );

    if (!alreadyExisted) {
      await auditService.log({
        userId,
        userEmail,
        action: 'ORDER_CREATED_AND_RESERVED',
        entityType: 'Order',
        entityId: order.id,
        details: {
          orderNumber: order.orderNumber,
          customer: order.customerName,
          totalAmount: order.totalAmount,
          itemCount: order.items.length,
        },
      });
    }

    return order;
  }

  async updateOrderStatus(id: string, status: OrderStatus, userId?: string, userEmail?: string) {
    const order = await ordersRepository.updateStatus(id, status);

    await auditService.log({
      userId,
      userEmail,
      action: `ORDER_STATUS_${status}`,
      entityType: 'Order',
      entityId: id,
      details: { orderNumber: order.orderNumber, status },
    });

    return order;
  }
}

export const ordersService = new OrdersService();
