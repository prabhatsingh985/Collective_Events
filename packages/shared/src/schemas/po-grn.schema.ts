import { z } from 'zod';

export const createPOSchema = z.object({
  supplierId: z.string().uuid(),
  warehouseId: z.string().uuid(),
  expectedDeliveryDate: z.string().datetime().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        expectedQty: z.number().int().positive(),
        unitPrice: z.number().positive(),
        gstPercent: z.number().min(0).max(28).default(18),
      })
    )
    .min(1, 'PO must contain at least one item'),
});

export const createGRNSchema = z.object({
  purchaseOrderId: z.string().uuid(),
  supplierInvoiceNumber: z.string().min(1),
  supplierInvoiceDate: z.string().datetime(),
  supplierInvoiceAmount: z.number().positive().optional(),
  invoiceAttachmentUrl: z.string().url().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        receivedQty: z.number().int().nonnegative(),
        acceptedQty: z.number().int().nonnegative(),
        rejectedQty: z.number().int().nonnegative(),
        qcStatus: z.enum(['PENDING', 'PASSED', 'FAILED', 'PARTIAL']).default('PASSED'),
        qcNotes: z.string().optional(),
        rejectionReason: z.string().optional(),
        batchNumber: z.string().optional(),
      })
    )
    .min(1),
});

export const confirmPutawaySchema = z.object({
  scannedProductBarcode: z.string().min(1),
  scannedLocationBarcode: z.string().min(1),
  confirmedQty: z.number().int().positive(),
});

export type CreatePOInput = z.infer<typeof createPOSchema>;
export type CreateGRNInput = z.infer<typeof createGRNSchema>;
export type ConfirmPutawayInput = z.infer<typeof confirmPutawaySchema>;
