import { z } from 'zod';
import { TOY_AGE_GROUPS } from '../constants/bis.constants';

export const createProductSchema = z.object({
  sku: z.string().min(3).max(50),
  barcode: z.string().min(5).max(50),
  name: z.string().min(2).max(200),
  description: z.string().optional(),
  categoryId: z.string().uuid(),
  brandId: z.string().uuid(),
  costPrice: z.number().positive(),
  sellingPrice: z.number().positive(),
  gstPercent: z.number().min(0).max(28).default(18),
  hsnCode: z.string().default('950300'),
  weightGrams: z.number().positive(),
  lengthCm: z.number().positive(),
  widthCm: z.number().positive(),
  heightCm: z.number().positive(),
  reorderLevel: z.number().int().nonnegative().default(10),
  reorderQty: z.number().int().positive().default(50),
  images: z.array(z.string().url()).optional().default([]),

  // Indian BIS Toy Safety compliance
  bisCertNumber: z.string().min(3, 'BIS Certificate CM/L number is required for toys in India'),
  ageGroup: z.enum(TOY_AGE_GROUPS),
  safetyDocUrl: z.string().url().optional(),
  chokingHazardWarning: z.boolean().default(false),
  batteryRequired: z.boolean().default(false),
  batteryIncluded: z.boolean().default(false),
  materialType: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  brandId: z.string().uuid().optional(),
  isActive: z.coerce.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
