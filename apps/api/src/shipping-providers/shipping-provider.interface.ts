export interface ShipmentCreationRequest {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: {
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  boxCode?: string | null;
  actualWeightGrams: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  chargeableWeightGrams: number;
  isCod: boolean;
  codAmount: number;
  items: Array<{
    name: string;
    sku: string;
    quantity: number;
    unitPrice: number;
  }>;
}

export interface ShipmentCreationResponse {
  awbNumber: string;
  shippingLabelUrl: string;
  invoiceUrl: string;
  shippingCharges: number;
  courierName: string;
}

export interface TrackingEvent {
  status: string;
  location?: string | null;
  description: string;
  eventTimestamp: string;
  rawPayload?: any;
}

export interface ShippingProvider {
  createShipment(details: ShipmentCreationRequest): Promise<ShipmentCreationResponse>;
  cancelShipment(awbNumber: string, reason: string): Promise<{ cancelled: boolean }>;
  schedulePickup(awbNumber: string, date: Date): Promise<{ scheduled: boolean; pickupTime: string }>;
  getTracking(awbNumber: string): Promise<TrackingEvent[]>;
  handleWebhook(payload: any, signature?: string): Promise<TrackingEvent>;
}
