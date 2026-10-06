export interface StockBuckets {
  onHand: number;
  reserved: number;
  available: number; // onHand - reserved
  damaged: number;
  returned: number;
  inTransit: number;
  incoming: number;
  lostMissing: number;
}

export interface StockLevelDto extends StockBuckets {
  id: string;
  warehouseId: string;
  locationId: string;
  locationCode: string;
  productId: string;
  productSku: string;
  productName: string;
}

export type MovementTypeEnum =
  | 'PO_RECEIVE'
  | 'PUTAWAY'
  | 'ORDER_RESERVE'
  | 'ORDER_UNRESERVE'
  | 'PICK'
  | 'PACK'
  | 'SHIP'
  | 'CUSTOMER_RETURN'
  | 'RTO_RECEIVE'
  | 'RESTOCK'
  | 'DAMAGE_TRANSFER'
  | 'SCRAP'
  | 'ADJUSTMENT_ADD'
  | 'ADJUSTMENT_DEDUCT'
  | 'CYCLE_COUNT';

export type ReferenceDocTypeEnum =
  | 'PURCHASE_ORDER'
  | 'GRN'
  | 'PUTAWAY_TASK'
  | 'ORDER'
  | 'PICK_LIST'
  | 'PACKAGE'
  | 'SHIPMENT'
  | 'RETURN'
  | 'STOCK_ADJUSTMENT'
  | 'CYCLE_COUNT';

export interface InventoryLedgerDto {
  id: string;
  productId: string;
  productSku: string;
  productName: string;
  fromLocationId?: string | null;
  fromLocationCode?: string | null;
  toLocationId?: string | null;
  toLocationCode?: string | null;
  movementType: MovementTypeEnum;
  quantity: number;
  beforeOnHand: number;
  afterOnHand: number;
  beforeReserved: number;
  afterReserved: number;
  referenceType: ReferenceDocTypeEnum;
  referenceId: string;
  reason?: string | null;
  performedById: string;
  performedByName: string;
  createdAt: string;
}
