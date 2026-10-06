export const USER_ROLES = {
  ADMIN: 'ADMIN',
  WAREHOUSE_MANAGER: 'WAREHOUSE_MANAGER',
  WAREHOUSE_ASSOCIATE: 'WAREHOUSE_ASSOCIATE',
  QC: 'QC',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN: ['*'],
  WAREHOUSE_MANAGER: [
    'inventory:*',
    'suppliers:*',
    'purchase_orders:*',
    'grn:*',
    'putaway:*',
    'orders:*',
    'picking:*',
    'packing:*',
    'shipping:*',
    'returns:*',
    'adjustments:*',
    'reports:*',
    'users:read',
    'locations:*',
    'products:*',
  ],
  WAREHOUSE_ASSOCIATE: [
    'receiving:read',
    'receiving:execute',
    'putaway:read',
    'putaway:execute',
    'picking:read',
    'picking:execute',
    'packing:read',
    'packing:execute',
    'shipping:read',
    'shipping:execute',
    'locations:read',
    'products:read',
    'inventory:read',
  ],
  QC: [
    'receiving:qc',
    'returns:qc',
    'products:read',
    'inventory:read',
    'damaged:manage',
  ],
};
