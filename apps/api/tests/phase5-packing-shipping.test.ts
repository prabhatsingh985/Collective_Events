import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/config/db';

const app = createApp();

describe('Phase 5: Packing, Volumetric Weighing, Shipping Adapter & Webhook Tracking Tests', () => {
  let adminToken: string;
  let workerToken: string;
  let sampleWarehouse: any;
  let sampleProduct: any;
  let sampleBox: any;
  let orderId: string;
  let packageId: string;
  let awbNumber: string;

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
    sampleBox = await prisma.packagingMaterial.findFirst({ where: { code: 'BOX-M' } });

    // 1. Create Order
    const orderRes = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        source: 'WEBSITE',
        paymentMode: 'PREPAID',
        customerName: 'Aayush Sharma',
        customerEmail: 'aayush@gmail.com',
        customerPhone: '9876543210',
        shippingAddressLine1: 'Villa 12, Palm Meadows, Whitefield',
        shippingCity: 'Bengaluru',
        shippingState: 'Karnataka',
        shippingPincode: '560066',
        items: [{ productId: sampleProduct.id, quantity: 1 }],
      });
    orderId = orderRes.body.data.id;

    // 2. Pick Order
    const pickListRes = await request(app)
      .post('/api/v1/picking')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ orderIds: [orderId] });

    const task = pickListRes.body.data.tasks[0];
    const loc = await prisma.location.findUnique({ where: { id: task.locationId } });

    await request(app)
      .post(`/api/v1/picking/tasks/${task.id}/confirm`)
      .set('Authorization', `Bearer ${workerToken}`)
      .send({
        scannedBarcode: sampleProduct.barcode,
        scannedLocationBarcode: loc?.barcode,
        pickedQty: 1,
      });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('1. Packing & Volumetric Weight Computation', () => {
    it('should pack order, compute volumetric vs chargeable weight, and deduct box inventory', async () => {
      const initialBoxStock = sampleBox.stockQuantity;

      // BOX-M dimensions: 35 x 25 x 20 cm
      // Actual weight: 1200g
      // Volumetric weight: (35 * 25 * 20 / 5000) * 1000 = 3500g
      // Chargeable weight: max(1200, 3500) = 3500g
      const res = await request(app)
        .post('/api/v1/packing')
        .set('Authorization', `Bearer ${workerToken}`)
        .send({
          orderId,
          packagingMaterialId: sampleBox.id,
          boxCode: sampleBox.code,
          actualWeightGrams: 1200,
          lengthCm: 35,
          widthCm: 25,
          heightCm: 20,
          itemIds: [sampleProduct.id],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('PACKED');
      expect(Number(res.body.data.actualWeightGrams)).toBe(1200);
      expect(Number(res.body.data.volumetricWeightGrams)).toBe(3500);
      expect(Number(res.body.data.chargeableWeightGrams)).toBe(3500);

      packageId = res.body.data.id;

      // Verify order status transitioned to PACKED
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      expect(order?.status).toBe('PACKED');

      // Verify packaging material stock decremented by 1
      const updatedBox = await prisma.packagingMaterial.findUnique({ where: { id: sampleBox.id } });
      expect(updatedBox?.stockQuantity).toBe(initialBoxStock - 1);
    });
  });

  describe('2. Shipping Adapter & Label Generation', () => {
    it('should generate AWB and shipping label via ShippingProvider', async () => {
      const res = await request(app)
        .post('/api/v1/shipping')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          orderId,
          packageId,
          provider: 'MOCK',
          courierName: 'Delhivery Surface Premium',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('MANIFESTED');
      expect(res.body.data.awbNumber).toBeDefined();
      expect(res.body.data.shippingLabelUrl).toBeDefined();
      expect(Number(res.body.data.shippingCharges)).toBeGreaterThan(0);

      awbNumber = res.body.data.awbNumber;

      // Verify order transitioned to SHIPPED
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      expect(order?.status).toBe('SHIPPED');
    });

    it('should retrieve shipment tracking history', async () => {
      const res = await request(app)
        .get(`/api/v1/shipping/${awbNumber}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.awbNumber).toBe(awbNumber);
      expect(res.body.data.trackingEvents.length).toBeGreaterThan(0);
    });
  });

  describe('3. Courier Tracking Webhooks', () => {
    it('should process webhook event and update status to IN_TRANSIT', async () => {
      const res = await request(app)
        .post('/api/v1/shipping/webhook')
        .send({
          awbNumber,
          status: 'IN_TRANSIT',
          location: 'Hub - Hosur Road',
          description: 'Package scanned at sorting center',
          eventTimestamp: new Date().toISOString(),
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.shipment.status).toBe('IN_TRANSIT');
    });

    it('should process final delivery webhook, marking shipment & order as DELIVERED', async () => {
      const res = await request(app)
        .post('/api/v1/shipping/webhook')
        .send({
          awbNumber,
          status: 'DELIVERED',
          location: 'Whitefield Delivery Center',
          description: 'Delivered to customer with OTP verification',
          eventTimestamp: new Date().toISOString(),
        });

      expect(res.status).toBe(200);
      expect(res.body.data.shipment.status).toBe('DELIVERED');
      expect(res.body.data.shipment.deliveredAt).toBeDefined();

      const order = await prisma.order.findUnique({ where: { id: orderId } });
      expect(order?.status).toBe('DELIVERED');
    });
  });
});
