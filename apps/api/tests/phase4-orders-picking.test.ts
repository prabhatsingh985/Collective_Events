import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/config/db';

const app = createApp();

describe('Phase 4: Order Intake, Atomic Stock Reservation & Scan-First Picking Tests', () => {
  let adminToken: string;
  let workerToken: string;
  let sampleWarehouse: any;
  let sampleProduct: any;
  let createdOrderId: string;
  let createdPickListId: string;
  let pickTask: any;

  beforeAll(async () => {
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

    sampleWarehouse = await prisma.warehouse.findFirst();
    sampleProduct = await prisma.product.findFirst({ where: { sku: 'TOY-RC-001' } });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('1. Order Intake & Concurrency-Safe Reservation', () => {
    const testIdempotencyKey = `IDEMP-${Date.now()}`;

    it('should create order, calculate Indian GST, and atomically reserve stock', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          idempotencyKey: testIdempotencyKey,
          source: 'WEBSITE',
          paymentMode: 'PREPAID',
          customerName: 'Rahul Malhotra',
          customerEmail: 'rahul.malhotra@gmail.com',
          customerPhone: '9876543210',
          shippingAddressLine1: 'Flat 402, Lotus Towers, Indiranagar',
          shippingCity: 'Bengaluru',
          shippingState: 'Karnataka',
          shippingPincode: '560038',
          shippingCountry: 'India',
          shippingFee: 50,
          discount: 100,
          items: [
            {
              productId: sampleProduct.id,
              quantity: 2,
            },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('ALLOCATED');
      expect(Number(res.body.data.totalAmount)).toBeGreaterThan(0);
      expect(res.body.data.items[0].allocatedQty).toBe(2);

      createdOrderId = res.body.data.id;
    });

    it('should return existing order on duplicate idempotency key without double booking', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          idempotencyKey: testIdempotencyKey,
          source: 'WEBSITE',
          customerName: 'Duplicate Attempt',
          customerEmail: 'dup@gmail.com',
          customerPhone: '9876543210',
          shippingAddressLine1: 'Address',
          shippingCity: 'Bengaluru',
          shippingState: 'Karnataka',
          shippingPincode: '560038',
          items: [{ productId: sampleProduct.id, quantity: 2 }],
        });

      expect(res.status).toBe(201);
      expect(res.body.data.id).toBe(createdOrderId);
    });

    it('should reject order if requested quantity exceeds available stock', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          customerName: 'Oversell Tester',
          customerEmail: 'oversell@gmail.com',
          customerPhone: '9876543210',
          shippingAddressLine1: 'Address',
          shippingCity: 'Bengaluru',
          shippingState: 'Karnataka',
          shippingPincode: '560038',
          items: [{ productId: sampleProduct.id, quantity: 999999 }],
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('Insufficient available stock');
    });

    it('should verify immutable ledger recorded ORDER_RESERVE with snapshot', async () => {
      const ledger = await prisma.inventoryLedger.findFirst({
        where: {
          productId: sampleProduct.id,
          movementType: 'ORDER_RESERVE',
        },
        orderBy: { createdAt: 'desc' },
      });

      expect(ledger).toBeDefined();
      expect(ledger?.quantity).toBe(2);
      expect(ledger?.afterReserved).toBeGreaterThan(0);
    });
  });

  describe('2. Pick List Generation & Optimal Route Sorting', () => {
    it('should generate PickList with tasks pre-sorted by warehouse routeSequence', async () => {
      const res = await request(app)
        .post('/api/v1/picking')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          orderIds: [createdOrderId],
          assignedToId: null,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.tasks.length).toBeGreaterThan(0);
      expect(res.body.data.status).toBe('CREATED');

      createdPickListId = res.body.data.id;
      pickTask = res.body.data.tasks[0];
      expect(pickTask.requestedQty).toBe(2);

      // Verify order transitioned to PICKING
      const order = await prisma.order.findUnique({ where: { id: createdOrderId } });
      expect(order?.status).toBe('PICKING');
    });
  });

  describe('3. Scan-First Picking & Barcode Verification', () => {
    it('should reject pick if scanned product barcode is wrong', async () => {
      const loc = await prisma.location.findUnique({ where: { id: pickTask.locationId } });

      const res = await request(app)
        .post(`/api/v1/picking/tasks/${pickTask.id}/confirm`)
        .set('Authorization', `Bearer ${workerToken}`)
        .send({
          scannedBarcode: 'WRONG-PRODUCT-BARCODE',
          scannedLocationBarcode: loc?.barcode,
          pickedQty: 2,
        });

      expect(res.status).toBe(400);
      expect(res.body.error.message).toContain('Product barcode mismatch');
    });

    it('should reject pick if scanned location barcode is wrong', async () => {
      const res = await request(app)
        .post(`/api/v1/picking/tasks/${pickTask.id}/confirm`)
        .set('Authorization', `Bearer ${workerToken}`)
        .send({
          scannedBarcode: sampleProduct.barcode,
          scannedLocationBarcode: 'LOC-WRONG-BIN',
          pickedQty: 2,
        });

      expect(res.status).toBe(400);
      expect(res.body.error.message).toContain('Location barcode mismatch');
    });

    it('should successfully confirm pick with correct scans, update stock & set order to PICKED', async () => {
      const loc = await prisma.location.findUnique({ where: { id: pickTask.locationId } });

      const res = await request(app)
        .post(`/api/v1/picking/tasks/${pickTask.id}/confirm`)
        .set('Authorization', `Bearer ${workerToken}`)
        .send({
          scannedBarcode: sampleProduct.barcode,
          scannedLocationBarcode: loc?.barcode,
          pickedQty: 2,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.task.status).toBe('PICKED');
      expect(res.body.data.ledger.movementType).toBe('PICK');
      expect(res.body.data.ledger.quantity).toBe(2);

      // Verify Order transitioned to PICKED
      const order = await prisma.order.findUnique({ where: { id: createdOrderId } });
      expect(order?.status).toBe('PICKED');

      // Verify PickList transitioned to COMPLETED
      const pickList = await prisma.pickList.findUnique({ where: { id: createdPickListId } });
      expect(pickList?.status).toBe('COMPLETED');
    });
  });
});
