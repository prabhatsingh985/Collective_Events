import { prisma } from '../../config/db';
import { OrderStatus, ShipmentStatus } from '@prisma/client';
import { AppError } from '../../core/AppError';

export class ShippingRepository {
  async findShipments(orderId?: string) {
    return prisma.shipment.findMany({
      where: orderId ? { orderId } : undefined,
      include: {
        order: { select: { id: true, orderNumber: true, customerName: true, status: true } },
        package: true,
        trackingEvents: { orderBy: { eventTimestamp: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByAwb(awbNumber: string) {
    return prisma.shipment.findUnique({
      where: { awbNumber },
      include: {
        order: true,
        package: true,
        trackingEvents: { orderBy: { eventTimestamp: 'desc' } },
      },
    });
  }

  async createShipment(data: {
    orderId: string;
    packageId: string;
    provider: any;
    courierName: string;
    awbNumber: string;
    shippingLabelUrl: string;
    invoiceUrl: string;
    shippingCharges: number;
    codAmount: number;
  }) {
    return prisma.$transaction(async (tx) => {
      const count = await tx.shipment.count();
      const shipmentNumber = `SHP-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

      const shipment = await tx.shipment.create({
        data: {
          shipmentNumber,
          orderId: data.orderId,
          packageId: data.packageId,
          provider: data.provider,
          courierName: data.courierName,
          awbNumber: data.awbNumber,
          shippingLabelUrl: data.shippingLabelUrl,
          invoiceUrl: data.invoiceUrl,
          shippingCharges: data.shippingCharges,
          codAmount: data.codAmount,
          status: ShipmentStatus.MANIFESTED,
        },
      });

      // Initial tracking event
      await tx.shipmentTrackingEvent.create({
        data: {
          shipmentId: shipment.id,
          status: 'MANIFESTED',
          location: 'Origin DC',
          description: 'Shipment registered and AWB generated',
          eventTimestamp: new Date(),
        },
      });

      // Update Order status to SHIPPED
      await tx.order.update({
        where: { id: data.orderId },
        data: { status: OrderStatus.SHIPPED },
      });

      return shipment;
    });
  }

  async updateTracking(awbNumber: string, eventData: {
    status: string;
    location?: string | null;
    description: string;
    eventTimestamp?: Date;
    rawPayload?: any;
  }) {
    return prisma.$transaction(async (tx) => {
      const shipment = await tx.shipment.findUnique({
        where: { awbNumber },
        include: { order: true },
      });

      if (!shipment) {
        throw AppError.notFound(`Shipment with AWB ${awbNumber} not found`);
      }

      // Add tracking event
      const event = await tx.shipmentTrackingEvent.create({
        data: {
          shipmentId: shipment.id,
          status: eventData.status,
          location: eventData.location || null,
          description: eventData.description,
          eventTimestamp: eventData.eventTimestamp || new Date(),
          rawPayload: eventData.rawPayload || null,
        },
      });

      // Map courier status to normalized ShipmentStatus & OrderStatus
      let newShipmentStatus: ShipmentStatus = shipment.status;
      let newOrderStatus: OrderStatus = shipment.order.status;

      const upperStatus = eventData.status.toUpperCase();
      if (upperStatus.includes('PICKED_UP') || upperStatus.includes('IN_TRANSIT')) {
        newShipmentStatus = ShipmentStatus.IN_TRANSIT;
        newOrderStatus = OrderStatus.SHIPPED;
      } else if (upperStatus.includes('OUT_FOR_DELIVERY')) {
        newShipmentStatus = ShipmentStatus.OUT_FOR_DELIVERY;
      } else if (upperStatus.includes('DELIVERED')) {
        newShipmentStatus = ShipmentStatus.DELIVERED;
        newOrderStatus = OrderStatus.DELIVERED;
      } else if (upperStatus.includes('RTO')) {
        newShipmentStatus = ShipmentStatus.RTO_INITIATED;
        newOrderStatus = OrderStatus.RTO;
      }

      const updatedShipment = await tx.shipment.update({
        where: { id: shipment.id },
        data: {
          status: newShipmentStatus,
          shippedAt: newShipmentStatus === ShipmentStatus.IN_TRANSIT && !shipment.shippedAt ? new Date() : undefined,
          deliveredAt: newShipmentStatus === ShipmentStatus.DELIVERED ? new Date() : undefined,
        },
      });

      await tx.order.update({
        where: { id: shipment.orderId },
        data: { status: newOrderStatus },
      });

      return { shipment: updatedShipment, event };
    });
  }
}

export const shippingRepository = new ShippingRepository();
