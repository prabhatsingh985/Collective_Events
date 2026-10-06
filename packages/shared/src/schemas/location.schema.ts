import { z } from 'zod';

export const locationTypeEnum = z.enum([
  'STORAGE',
  'RECEIVING',
  'PICKING',
  'PACKING',
  'STAGING',
  'RETURNS',
  'DAMAGED',
  'QC',
]);

export const createLocationSchema = z.object({
  warehouseId: z.string().uuid(),
  code: z
    .string()
    .regex(
      /^[A-Z0-9]+-[0-9]+-[A-Z0-9]+-[0-9]+$/,
      'Code must match hierarchical format AISLE-RACK-SHELF-BIN (e.g. A-01-B-05)'
    ),
  aisle: z.string().min(1),
  rack: z.string().min(1),
  shelf: z.string().min(1),
  bin: z.string().min(1),
  type: locationTypeEnum.default('STORAGE'),
  capacity: z.number().int().positive().default(100),
  pickSequence: z.number().int().nonnegative().default(0),
});

export const updateLocationSchema = createLocationSchema.partial();

export const locationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(200).default(50),
  warehouseId: z.string().uuid().optional(),
  type: locationTypeEnum.optional(),
  aisle: z.string().optional(),
  search: z.string().optional(),
});

export type CreateLocationInput = z.infer<typeof createLocationSchema>;
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;
export type LocationQueryInput = z.infer<typeof locationQuerySchema>;
