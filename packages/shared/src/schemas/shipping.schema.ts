import { z } from 'zod';

export const createPackageSchema = z.object({
  orderId: z.string().uuid(),
  packagingMaterialId: z.string().uuid().optional(),
  boxCode: z.string().optional(),
  actualWeightGrams: z.number().positive(),
  lengthCm: z.number().positive(),
  widthCm: z.number().positive(),
  heightCm: z.number().positive(),
  itemIds: z.array(z.string().uuid()).min(1),
});

export const createShipmentSchema = z.object({
  orderId: z.string().uuid(),
  packageId: z.string().uuid(),
  provider: z.enum(['MOCK', 'SHIPROCKET', 'DELHIVERY', 'BLUEDART']).default('MOCK'),
  courierName: z.string().min(2),
});

export const courierWebhookSchema = z.object({
  awbNumber: z.string().min(1),
  status: z.string().min(1),
  location: z.string().optional(),
  description: z.string(),
  eventTimestamp: z.string().datetime().optional(),
  rawPayload: z.any().optional(),
});

export type CreatePackageInput = z.infer<typeof createPackageSchema>;
export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;
export type CourierWebhookInput = z.infer<typeof courierWebhookSchema>;
