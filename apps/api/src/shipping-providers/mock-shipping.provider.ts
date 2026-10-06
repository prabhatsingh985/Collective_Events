import {
  ShippingProvider,
  ShipmentCreationRequest,
  ShipmentCreationResponse,
  TrackingEvent,
} from './shipping-provider.interface';

export class MockShippingProvider implements ShippingProvider {
  async createShipment(details: ShipmentCreationRequest): Promise<ShipmentCreationResponse> {
    const randomSuffix = Math.floor(10000000 + Math.random() * 90000000);
    const awbNumber = `MOCK-AWB-${randomSuffix}`;

    // Base shipping charge calculation (₹60 base for 500g + ₹40 per extra 500g)
    const weightIn500g = Math.ceil(details.chargeableWeightGrams / 500);
    const shippingCharges = 60 + Math.max(0, weightIn500g - 1) * 40;

    return {
      awbNumber,
      shippingLabelUrl: `/api/v1/barcodes/png?text=${encodeURIComponent(awbNumber)}`,
      invoiceUrl: `/api/v1/orders/invoices/${details.orderNumber}`,
      shippingCharges,
      courierName: 'Delhivery Surface Premium (Mock)',
    };
  }

  async cancelShipment(awbNumber: string, _reason: string): Promise<{ cancelled: boolean }> {
    return { cancelled: true };
  }

  async schedulePickup(
    awbNumber: string,
    date: Date
  ): Promise<{ scheduled: boolean; pickupTime: string }> {
    return {
      scheduled: true,
      pickupTime: date.toISOString(),
    };
  }

  async getTracking(awbNumber: string): Promise<TrackingEvent[]> {
    const now = new Date();
    return [
      {
        status: 'MANIFESTED',
        location: 'Bengaluru DC',
        description: 'Shipment label created and manifested in WMS',
        eventTimestamp: new Date(now.getTime() - 4 * 3600 * 1000).toISOString(),
      },
      {
        status: 'PICKED_UP',
        location: 'Bengaluru Hub',
        description: 'Courier executive collected shipment package',
        eventTimestamp: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(),
      },
      {
        status: 'IN_TRANSIT',
        location: 'Nelamangala Sort Facility',
        description: 'Shipment in transit to destination hub',
        eventTimestamp: now.toISOString(),
      },
    ];
  }

  async handleWebhook(payload: any, _signature?: string): Promise<TrackingEvent> {
    return {
      status: payload.status || 'IN_TRANSIT',
      location: payload.location || 'Local Hub',
      description: payload.description || 'Tracking update received',
      eventTimestamp: payload.eventTimestamp || new Date().toISOString(),
      rawPayload: payload,
    };
  }
}

export const mockShippingProvider = new MockShippingProvider();
