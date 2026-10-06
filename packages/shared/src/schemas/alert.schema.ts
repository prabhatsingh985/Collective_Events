import { z } from 'zod';

export const createAlertSchema = z.object({
  type: z.enum(['LOW_STOCK', 'SHIPMENT_DELAY', 'QC_REJECTION', 'ORDER_SLA_BREACH', 'SYSTEM']),
  severity: z.enum(['INFO', 'WARNING', 'CRITICAL']).default('INFO'),
  title: z.string().min(1),
  message: z.string().min(1),
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const createPoFromLowStockSchema = z.object({
  warehouseId: z.string().uuid(),
  productId: z.string().uuid().optional(),
  supplierId: z.string().uuid().optional(),
  quantity: z.number().int().positive().optional(),
});

export type CreateAlertInput = z.infer<typeof createAlertSchema>;
export type CreatePoFromLowStockInput = z.infer<typeof createPoFromLowStockSchema>;
