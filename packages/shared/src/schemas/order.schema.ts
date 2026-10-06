import { z } from 'zod';

export const orderItemInputSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive().optional(),
});

export const createOrderSchema = z.object({
  idempotencyKey: z.string().optional(),
  source: z.enum(['WEBSITE', 'MANUAL', 'AMAZON', 'FLIPKART']).default('WEBSITE'),
  paymentMode: z.enum(['PREPAID', 'COD']).default('PREPAID'),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10),
  shippingAddressLine1: z.string().min(3),
  shippingAddressLine2: z.string().optional(),
  shippingCity: z.string().min(2),
  shippingState: z.string().min(2),
  shippingPincode: z.string().min(6).max(6),
  shippingCountry: z.string().default('India'),
  billingAddressLine1: z.string().optional(),
  billingAddressLine2: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingPincode: z.string().optional(),
  billingCountry: z.string().default('India'),
  shippingFee: z.number().nonnegative().default(0),
  discount: z.number().nonnegative().default(0),
  codAmount: z.number().nonnegative().default(0),
  notes: z.string().optional(),
  items: z.array(orderItemInputSchema).min(1, 'Order must contain at least one item'),
});

export const orderQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.string().optional(),
  search: z.string().optional(),
  paymentMode: z.enum(['PREPAID', 'COD']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
