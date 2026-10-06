export type OrderStatusEnum =
  | 'PENDING'
  | 'CONFIRMED'
  | 'ALLOCATED'
  | 'PICKING'
  | 'PICKED'
  | 'PACKING'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED'
  | 'RTO';

export type PaymentModeEnum = 'PREPAID' | 'COD';

export interface OrderItemDto {
  id: string;
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  taxPercent: number;
  taxAmount: number;
  totalPrice: number;
  allocatedQty: number;
  pickedQty: number;
  packedQty: number;
}

export interface OrderDto {
  id: string;
  orderNumber: string;
  source: string;
  status: OrderStatusEnum;
  paymentMode: PaymentModeEnum;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  taxAmount: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  codAmount: number;
  notes?: string | null;
  items: OrderItemDto[];
  createdAt: string;
  updatedAt: string;
}
