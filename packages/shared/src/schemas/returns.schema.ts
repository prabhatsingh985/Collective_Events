import { z } from 'zod';

export const createReturnSchema = z.object({
  orderId: z.string().uuid(),
  shipmentId: z.string().uuid().optional(),
  type: z.enum(['CUSTOMER_RETURN', 'RTO']).default('CUSTOMER_RETURN'),
  trackingNumber: z.string().optional(),
  items: z
    .array(
      z.object({
        orderItemId: z.string().uuid(),
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
        reason: z.enum([
          'DEFECTIVE',
          'WRONG_ITEM',
          'NOT_AS_DESCRIBED',
          'DAMAGED_IN_TRANSIT',
          'BUYER_MIND_CHANGED',
          'UNDELIVERED_RTO',
          'OTHER',
        ]),
      })
    )
    .min(1),
});

export const inspectReturnItemSchema = z.object({
  returnItemId: z.string().uuid(),
  condition: z.enum(['UNOPENED', 'OPENED_LIKE_NEW', 'DAMAGED', 'MISSING_PARTS']),
  missingComponents: z.boolean().default(false),
  damagedPackaging: z.boolean().default(false),
  qcNotes: z.string().optional(),
  disposition: z.enum(['RESTOCK', 'DAMAGED', 'SCRAP']),
  restockLocationId: z.string().uuid().optional(),
  refundStatus: z.enum(['NONE', 'PENDING', 'APPROVED', 'REJECTED', 'PROCESSED']).default('PENDING'),
});

export type CreateReturnInput = z.infer<typeof createReturnSchema>;
export type InspectReturnItemInput = z.infer<typeof inspectReturnItemSchema>;
