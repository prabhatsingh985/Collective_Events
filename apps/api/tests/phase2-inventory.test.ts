import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/config/db';

const app = createApp();

describe('Phase 2: Products, Locations, Suppliers, Barcodes, Inventory & Ledger Tests', () => {
  let adminToken: string;
  let workerToken: string;
  let sampleProduct: any;
  let sourceLocation: any;
  let targetLocation: any;

  beforeAll(async () => {
    // Login as Admin
    const adminRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@toywms.in',
      password: 'Password@123',
    });
    adminToken = adminRes.body.data.tokens.accessToken;

    // Login as Worker
    const workerRes = await request(app).post('/api/v1/auth/login').send({
      email: 'worker@toywms.in',
      password: 'Password@123',
    });
    workerToken = workerRes.body.data.tokens.accessToken;

    // Fetch sample product
    sampleProduct = await prisma.product.findFirst({
      where: { sku: 'TOY-RC-001' },
      include: { category: true, brand: true },
    });

    // Fetch two locations
    sourceLocation = await prisma.location.findFirst({ where: { code: 'B-01-A-01' } });
    targetLocation = await prisma.location.findFirst({ where: { code: 'A-01-A-01' } });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('1. Barcode Generation Endpoints', () => {
    it('should generate Code128 barcode in SVG format', async () => {
      const res = await request(app)
        .get('/api/v1/barcodes/svg?text=TOY-RC-001')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('image/svg+xml');
      const content = res.text || res.body.toString();
      expect(content).toContain('<svg');
    });

    it('should generate Code128 barcode in PNG format', async () => {
      const res = await request(app)
        .get('/api/v1/barcodes/png?text=LOC-A01A01')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('image/png');
    });

    it('should render printable product shelf label HTML', async () => {
      const res = await request(app)
        .get(
          `/api/v1/barcodes/product-label?sku=${sampleProduct.sku}&barcode=${sampleProduct.barcode}&name=${encodeURIComponent(sampleProduct.name)}&sellingPrice=2499&bisCertNumber=${sampleProduct.bisCertNumber}&ageGroup=${encodeURIComponent(sampleProduct.ageGroup)}`
        )
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.text).toContain(sampleProduct.sku);
      expect(res.text).toContain(sampleProduct.bisCertNumber);
    });
  });

  describe('2. Products Catalog & Indian Compliance', () => {
    it('should list products with aggregated stock buckets', async () => {
      const res = await request(app)
        .get('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      const first = res.body.data[0];
      expect(first.stockSummary).toBeDefined();
      expect(first.stockSummary.available).toBeGreaterThanOrEqual(0);
      expect(first.bisCertNumber).toBeDefined();
      expect(first.hsnCode).toBeDefined();
    });

    it('should fetch product by barcode', async () => {
      const res = await request(app)
        .get(`/api/v1/products/barcode/${sampleProduct.barcode}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.sku).toBe(sampleProduct.sku);
    });

    it('should create new compliant Toy SKU and record Audit Log', async () => {
      const testSku = `TOY-TEST-${Date.now()}`;
      const testBarcode = `890${Date.now()}`.slice(0, 13);
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          sku: testSku,
          barcode: testBarcode,
          name: 'Electronic Robotic Dog Toy',
          categoryId: sampleProduct.categoryId,
          brandId: sampleProduct.brandId,
          costPrice: 990,
          sellingPrice: 1999,
          gstPercent: 18,
          hsnCode: '95030090',
          weightGrams: 500,
          lengthCm: 20,
          widthCm: 15,
          heightCm: 15,
          reorderLevel: 10,
          reorderQty: 30,
          bisCertNumber: 'CM/L-9988776',
          ageGroup: '3-6 Years',
          chokingHazardWarning: false,
          batteryRequired: true,
          batteryIncluded: false,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.sku).toBe(testSku);
    });
  });

  describe('3. Locations & Optimal S-Curve Route Sequence', () => {
    it('should list locations sorted by pickSequence for optimal routing', async () => {
      const res = await request(app)
        .get('/api/v1/locations')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(40);
      expect(res.body.data[0].pickSequence).toBeLessThanOrEqual(res.body.data[1].pickSequence);
      expect(res.body.data[0].utilizationPercent).toBeDefined();
    });

    it('should fetch location by barcode', async () => {
      const res = await request(app)
        .get(`/api/v1/locations/barcode/${sourceLocation.barcode}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.code).toBe(sourceLocation.code);
    });
  });

  describe('4. Suppliers & Procurement Catalog', () => {
    it('should list Indian suppliers with price configurations', async () => {
      const res = await request(app)
        .get('/api/v1/suppliers')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(3);
      expect(res.body.data[0].gstin).toBeDefined();
    });
  });

  describe('5. Inventory Stock, Transactional Transfers, & Immutable Ledger', () => {
    it('should retrieve stock levels with computed available field', async () => {
      const res = await request(app)
        .get('/api/v1/inventory/stock')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].available).toBe(
        res.body.data[0].onHand - res.body.data[0].reserved
      );
    });

    it('should execute transactional stock transfer between locations and write ledger', async () => {
      const transferQty = 5;

      // Ensure source location has enough on-hand stock for the test
      const initSource = await prisma.stockLevel.upsert({
        where: {
          locationId_productId: {
            locationId: sourceLocation.id,
            productId: sampleProduct.id,
          },
        },
        update: {
          onHand: { increment: 20 },
        },
        create: {
          warehouseId: sourceLocation.warehouseId,
          locationId: sourceLocation.id,
          productId: sampleProduct.id,
          onHand: 20,
          reserved: 0,
        },
      });
      const initialSourceOnHand = initSource.onHand;

      const res = await request(app)
        .post('/api/v1/inventory/transfer')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          productId: sampleProduct.id,
          fromLocationId: sourceLocation.id,
          toLocationId: targetLocation.id,
          quantity: transferQty,
          reason: 'Replenishing bulk storage to forward picking bin',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.sourceStock.onHand).toBe(initialSourceOnHand - transferQty);
      expect(res.body.data.ledger).toBeDefined();
      expect(res.body.data.ledger.movementType).toBe('PUTAWAY');
      expect(res.body.data.ledger.quantity).toBe(transferQty);
    });

    it('should reject transfer when quantity exceeds available stock', async () => {
      const res = await request(app)
        .post('/api/v1/inventory/transfer')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          productId: sampleProduct.id,
          fromLocationId: sourceLocation.id,
          toLocationId: targetLocation.id,
          quantity: 99999, // Impossible amount
          reason: 'Exorbitant move',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should create and approve StockAdjustment with immutable ledger update', async () => {
      // 1. Worker creates adjustment request
      const createRes = await request(app)
        .post('/api/v1/inventory/adjustments')
        .set('Authorization', `Bearer ${workerToken}`)
        .send({
          productId: sampleProduct.id,
          locationId: targetLocation.id,
          quantity: 2,
          reason: 'FOUND',
          notes: 'Found 2 unopened units on top shelf during cycle count',
        });

      expect(createRes.status).toBe(201);
      expect(createRes.body.data.status).toBe('PENDING');
      const adjustmentId = createRes.body.data.id;

      // 2. Admin approves adjustment
      const approveRes = await request(app)
        .patch(`/api/v1/inventory/adjustments/${adjustmentId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          approved: true,
          notes: 'Count verified and approved by DC Manager',
        });

      expect(approveRes.status).toBe(200);
      expect(approveRes.body.data.adjustment.status).toBe('APPROVED');
      expect(approveRes.body.data.ledger).toBeDefined();
      expect(approveRes.body.data.ledger.movementType).toBe('ADJUSTMENT_ADD');
    });

    it('should query immutable InventoryLedger records with before/after snapshots', async () => {
      const res = await request(app)
        .get(`/api/v1/inventory/ledger?productId=${sampleProduct.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      const ledgerEntry = res.body.data[0];
      expect(ledgerEntry.beforeOnHand).toBeDefined();
      expect(ledgerEntry.afterOnHand).toBeDefined();
      expect(ledgerEntry.performedBy).toBeDefined();
    });
  });
});
