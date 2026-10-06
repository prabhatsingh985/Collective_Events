export type UserRole = 'ADMIN' | 'WAREHOUSE_MANAGER' | 'WAREHOUSE_ASSOCIATE' | 'QC';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  warehouseId?: string;
}

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  category: string;
  brand: string;
  hsnCode: string;
  gstRate: number;
  bisRegistrationNumber: string;
  isBisCompliant: boolean;
  ageGrading: string;
  materialType: string;
  safetyStandard: string;
  costPrice: number;
  sellingPrice: number;
  weightGrams: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  onHand: number;
  reserved: number;
  available: number;
  inTransit?: number;
  damaged?: number;
  minThreshold: number;
}

export interface Location {
  id: string;
  code: string;
  zone: string;
  aisle: string;
  rack: string;
  shelf: string;
  bin: string;
  type: 'STORAGE' | 'RECEIVING' | 'PICKING' | 'PACKING' | 'STAGING' | 'RETURNS' | 'DAMAGED' | 'QC';
  pickSequence: number;
  maxWeightCapacityKg: number;
  currentOccupancy: number;
  itemsCount: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  supplierGstin: string;
  status: 'DRAFT' | 'SENT' | 'PARTIAL' | 'RECEIVED' | 'CANCELLED';
  orderDate: string;
  expectedDate: string;
  totalAmount: number;
  items: {
    sku: string;
    productName: string;
    orderedQty: number;
    receivedQty: number;
    unitPrice: number;
    gstRate: number;
  }[];
}

export interface Order {
  id: string;
  orderNumber: string;
  channel: 'B2C_SHOPIFY' | 'B2C_AMAZON' | 'B2B_RETAIL' | 'QUICK_COMMERCE';
  customerName: string;
  city: string;
  state: string;
  pincode: string;
  status: 'PENDING' | 'RESERVED' | 'PICKING' | 'PICKED' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RTO';
  itemsCount: number;
  totalAmount: number;
  createdAt: string;
  courier?: string;
  awbNumber?: string;
  slaHoursRemaining: number;
}

export interface PickTask {
  id: string;
  pickListId: string;
  orderId: string;
  orderNumber: string;
  sku: string;
  productName: string;
  locationCode: string;
  quantity: number;
  status: 'PENDING' | 'PICKED';
  routeSequence: number;
}

export interface PackageMaterial {
  id: string;
  code: string;
  name: string;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  maxWeightKg: number;
  unitCost: number;
  onHand: number;
}

export interface StockAlert {
  id: string;
  type: 'LOW_STOCK' | 'BIS_COMPLIANCE' | 'QC_REJECT' | 'EXCESS_RTO';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  description: string;
  sku?: string;
  timestamp: string;
}

export interface AuditRecord {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userName: string;
  userRole: string;
  timestamp: string;
  details: string;
}
