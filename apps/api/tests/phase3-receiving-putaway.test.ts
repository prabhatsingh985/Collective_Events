import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/config/db';

const app = createApp();

describe('Phase 3: Purchase Orders, GRN / Receiving, QC & Putaway Workflow Tests', () => {
  let adminToken: string;
  let workerToken: string;
  let qcToken: string;
  let sampleSupplier: any;
  let sampleWarehouse: any;
  let sampleProduct: any;
  let createdPoId: string;
  let createdGrnId: string;
  let createdPutawayTask: any;

  beforeAll(async () => {
    // Logins
    const adminRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@toywms.in',
      password: 'Password@123',
    });
    adminToken = adminRes.body.data.tokens.accessToken;

    const workerRes = await request(app).post('/api/v1/auth/login').send({
      email: 'worker@toywms.in',
      password: 'Password@123',
    });
    workerToken = workerRes.body.data.tokens.accessToken;

    const qcRes = await request(app).post('/api/v1/auth/login').send({
      email: 'qc@toywms.in',
      password: 'Password@123',
    });
    qcToken = qcRes.body.data.tokens.accessToken;

    // Fetch fixtures
    sampleSupplier = await prisma.supplier.findFirst();
    sampleWarehouse = await prisma.warehouse.findFirst();
    sampleProduct = await prisma.product.findFirst({ where: { sku: 'TOY-RC-001' } });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('1. Purchase Order Creation & Supplier Dispatch', () => {
    it('should create a new Purchase Order in DRAFT status with tax calculations', async () => {
      const res = await request(app)
        .post('/api/v1/purchase-orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          warehouseId: sampleWarehouse.id,
          supplierId: sampleSupplier.id,
          expectedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Special Q3 Festive Stock Order',
          items: [
            {
              productId: sampleProduct.id,
              expectedQty: 50,
              unitPrice: 1200,
              gstPercent: 18,
            },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('DRAFT');
      expect(Number(res.body.data.subtotal)).toBe(60000);
      expect(Number(res.body.data.taxAmount)).toBe(10800);
      expect(Number(res.body.data.totalAmount)).toBe(70800);

      createdPoId = res.body.data.id;
    });

    it('should transition PO from DRAFT to SENT', async () => {
      const res = await request(app)
        .patch(`/api/v1/purchase-orders/${createdPoId}/send`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('SENT');
      expect(res.body.data.sentAt).toBeDefined();
    });
  });

  describe('2. Goods Receipt Note (GRN) & QC Inspection', () => {
    it('should receive PO items, record QC (accepted/rejected), update stock & generate putaway tasks', async () => {
      const res = await request(app)
        .post('/api/v1/receiving')
        .set('Authorization', `Bearer ${qcToken}`)
        .send({
          purchaseOrderId: createdPoId,
          supplierInvoiceNumber: `INV-FP-${Date.now()}`,
          supplierInvoiceDate: new Date().toISOString(),
          supplierInvoiceAmount: 70800,
          notes: 'Received via Delhivery Express Cargo',
          items: [
            {
              productId: sampleProduct.id,
              receivedQty: 50,
              acceptedQty: 48,
              rejectedQty: 2,
              qcStatus: 'PARTIAL',
              qcNotes: '2 cartons had water damage on outer packaging',
              rejectionReason: 'Damaged in transit',
              batchNumber: 'B-2026-Q3-01',
            },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.grn.grnNumber).toBeDefined();
      expect(res.body.data.putawayTasks.length).toBe(1);

      createdGrnId = res.body.data.grn.id;
      createdPutawayTask = res.body.data.putawayTasks[0];
      expect(createdPutawayTask.quantity).toBe(48);
      expect(createdPutawayTask.status).toBe('PENDING');

      // Verify PO status transitioned to RECEIVED
      const po = await prisma.purchaseOrder.findUnique({ where: { id: createdPoId } });
      expect(po?.status).toBe('RECEIVED');
    });

    it('should verify immutable ledger entries created for PO receive and damage transfer', async () => {
      const ledgers = await prisma.inventoryLedger.findMany({
        where: { productId: sampleProduct.id },
        orderBy: { createdAt: 'desc' },
        take: 2,
      });

      expect(ledgers.length).toBeGreaterThanOrEqual(1);
      const poReceiveLedger = ledgers.find((l) => l.movementType === 'PO_RECEIVE');
      expect(poReceiveLedger).toBeDefined();
      expect(poReceiveLedger?.quantity).toBe(48);
    });
  });

  describe('3. Putaway Task Execution & Barcode Verification', () => {
    it('should list pending putaway tasks', async () => {
      const res = await request(app)
        .get('/api/v1/putaway?status=PENDING')
        .set('Authorization', `Bearer ${workerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      const found = res.body.data.find((t: any) => t.id === createdPutawayTask.id);
      expect(found).toBeDefined();
    });

    it('should reject putaway if scanned product barcode does not match', async () => {
      const targetLoc = await prisma.location.findUnique({
        where: { id: createdPutawayTask.toLocationId },
      });

      const res = await request(app)
        .post(`/api/v1/putaway/${createdPutawayTask.id}/confirm`)
        .set('Authorization', `Bearer ${workerToken}`)
        .send({
          scannedProductBarcode: 'WRONG-BARCODE-000',
          scannedLocationBarcode: targetLoc?.barcode,
          confirmedQty: 48,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('barcode mismatch');
    });

    it('should reject putaway if scanned location barcode does not match', async () => {
      const res = await request(app)
        .post(`/api/v1/putaway/${createdPutawayTask.id}/confirm`)
        .set('Authorization', `Bearer ${workerToken}`)
        .send({
          scannedProductBarcode: sampleProduct.barcode,
          scannedLocationBarcode: 'LOC-WRONG-BIN',
          confirmedQty: 48,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('barcode mismatch');
    });

    it('should confirm putaway with correct scans, moving stock to storage and writing ledger', async () => {
      const targetLoc = await prisma.location.findUnique({
        where: { id: createdPutawayTask.toLocationId },
      });

      const res = await request(app)
        .post(`/api/v1/putaway/${createdPutawayTask.id}/confirm`)
        .set('Authorization', `Bearer ${workerToken}`)
        .send({
          scannedProductBarcode: sampleProduct.barcode,
          scannedLocationBarcode: targetLoc?.barcode,
          confirmedQty: 48,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.task.status).toBe('COMPLETED');
      expect(res.body.data.ledger).toBeDefined();
      expect(res.body.data.ledger.movementType).toBe('PUTAWAY');
      expect(res.body.data.destinationStock.onHand).toBeGreaterThanOrEqual(48);
    });
  });
});
