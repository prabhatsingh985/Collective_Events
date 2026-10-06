import { z } from 'zod';

export const createAdjustmentSchema = z.object({
  productId: z.string().uuid(),
  locationId: z.string().uuid(),
  quantity: z.number().int().refine((val) => val !== 0, 'Quantity cannot be zero'),
  reason: z.enum(['DAMAGE', 'LOSS', 'FOUND', 'COUNT_CORRECTION', 'OTHER']),
  notes: z.string().min(3),
});

export const approveAdjustmentSchema = z.object({
  approved: z.boolean(),
  notes: z.string().optional(),
});

export type CreateAdjustmentInput = z.infer<typeof createAdjustmentSchema>;
export type ApproveAdjustmentInput = z.infer<typeof approveAdjustmentSchema>;
