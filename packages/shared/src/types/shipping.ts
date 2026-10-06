export type ShippingProviderType = 'MOCK' | 'SHIPROCKET' | 'DELHIVERY' | 'BLUEDART';

export type ShipmentStatusEnum =
  | 'MANIFESTED'
  | 'PICKUP_SCHEDULED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'RTO_INITIATED'
  | 'RTO_DELIVERED'
  | 'CANCELLED'
  | 'FAILED';

export interface TrackingEventDto {
  status: string;
  location?: string | null;
  description: string;
  eventTimestamp: string;
}

export interface ShipmentDto {
  id: string;
  shipmentNumber: string;
  orderId: string;
  packageId: string;
  provider: ShippingProviderType;
  courierName: string;
  awbNumber: string;
  shippingLabelUrl?: string | null;
  invoiceUrl?: string | null;
  status: ShipmentStatusEnum;
  pickupScheduledAt?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  codAmount: number;
  shippingCharges: number;
  trackingEvents: TrackingEventDto[];
  createdAt: string;
}
