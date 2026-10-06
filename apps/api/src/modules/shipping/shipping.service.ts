import { shippingRepository } from './shipping.repository';
import { mockShippingProvider } from '../../shipping-providers/mock-shipping.provider';
import { auditService } from '../audit/audit.service';
import { prisma } from '../../config/db';
import { AppError } from '../../core/AppError';
import { CreateShipmentInput, CourierWebhookInput } from '@toy-wms/shared';

export class ShippingService {
  async getShipments(orderId?: string) {
    return shippingRepository.findShipments(orderId);
  }

  async getShipmentByAwb(awbNumber: string) {
    const shipment = await shippingRepository.findByAwb(awbNumber);
    if (!shipment) {
      throw AppError.notFound(`Shipment with AWB ${awbNumber} not found`);
    }
    return shipment;
  }

  async createShipment(data: CreateShipmentInput, userId: string, userEmail: string) {
    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
      include: { items: { include: { product: true } } },
    });

    if (!order) throw AppError.notFound('Order not found');

    const pkg = await prisma.package.findUnique({
      where: { id: data.packageId },
    });

    if (!pkg) throw AppError.notFound('Package not found');

    // Call shipping adapter (Mock, Delhivery, etc.)
    const provider = mockShippingProvider;
    const providerResponse = await provider.createShipment({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      shippingAddress: {
        line1: order.shippingAddressLine1,
        line2: order.shippingAddressLine2,
        city: order.shippingCity,
        state: order.shippingState,
        pincode: order.shippingPincode,
        country: order.shippingCountry,
      },
      actualWeightGrams: Number(pkg.actualWeightGrams),
      lengthCm: Number(pkg.lengthCm),
      widthCm: Number(pkg.widthCm),
      heightCm: Number(pkg.heightCm),
      chargeableWeightGrams: Number(pkg.chargeableWeightGrams),
      isCod: order.paymentMode === 'COD',
      codAmount: Number(order.codAmount),
      items: order.items.map((i) => ({
        name: i.name,
        sku: i.sku,
        quantity: i.quantity,
        unitPrice: Number(i.unitPrice),
      })),
    });

    const shipment = await shippingRepository.createShipment({
      orderId: order.id,
      packageId: pkg.id,
      provider: data.provider,
      courierName: providerResponse.courierName,
      awbNumber: providerResponse.awbNumber,
      shippingLabelUrl: providerResponse.shippingLabelUrl,
      invoiceUrl: providerResponse.invoiceUrl,
      shippingCharges: providerResponse.shippingCharges,
      codAmount: Number(order.codAmount),
    });

    await auditService.log({
      userId,
      userEmail,
      action: 'SHIPMENT_MANIFESTED',
      entityType: 'Shipment',
      entityId: shipment.id,
      details: {
        awbNumber: shipment.awbNumber,
        courier: shipment.courierName,
        shippingCharges: shipment.shippingCharges,
      },
    });

    return shipment;
  }

  async handleCourierWebhook(data: CourierWebhookInput) {
    const result = await shippingRepository.updateTracking(data.awbNumber, {
      status: data.status,
      location: data.location,
      description: data.description,
      eventTimestamp: data.eventTimestamp ? new Date(data.eventTimestamp) : new Date(),
      rawPayload: data.rawPayload,
    });

    return result;
  }
}

export const shippingService = new ShippingService();
