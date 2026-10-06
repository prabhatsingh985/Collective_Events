import { z } from 'zod';

export const stockTransferSchema = z.object({
  productId: z.string().uuid(),
  fromLocationId: z.string().uuid(),
  toLocationId: z.string().uuid(),
  quantity: z.number().int().positive(),
  reason: z.string().min(3),
});

export const stockQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  warehouseId: z.string().uuid().optional(),
  productId: z.string().uuid().optional(),
  locationId: z.string().uuid().optional(),
  search: z.string().optional(),
  lowStockOnly: z.coerce.boolean().optional(),
});

export const ledgerQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  productId: z.string().uuid().optional(),
  referenceId: z.string().optional(),
  movementType: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type StockTransferInput = z.infer<typeof stockTransferSchema>;
export type StockQueryInput = z.infer<typeof stockQuerySchema>;
export type LedgerQueryInput = z.infer<typeof ledgerQuerySchema>;
