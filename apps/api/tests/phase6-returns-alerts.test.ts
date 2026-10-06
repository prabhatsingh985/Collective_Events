import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/config/db';

const app = createApp();

describe('Phase 6: Returns, QC Inspection & Low Stock Alerts Tests', () => {
  let adminToken: string;
  let qcToken: string;
  let sampleWarehouse: any;
  let sampleProduct: any;
  let orderId: string;
  let orderItemId: string;
  let returnId: string;
  let returnItemId: string;

  beforeAll(async () => {
    // 1. Authenticate ADMIN
    const adminRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@toywms.in',
      password: 'Password@123',
    });
    adminToken = adminRes.body.data.tokens.accessToken;

    // 2. Authenticate QC
    const qcRes = await request(app).post('/api/v1/auth/login').send({
      email: 'qc@toywms.in',
      password: 'Password@123',
    });
    qcToken = qcRes.body.data.tokens.accessToken;

    sampleWarehouse = await prisma.warehouse.findFirst();
    sampleProduct = await prisma.product.findFirst({ where: { sku: 'TOY-RC-001' } });

    // 3. Create an order to be returned
    const orderRes = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        source: 'WEBSITE',
        paymentMode: 'PREPAID',
        customerName: 'Rohit Verma',
        customerEmail: 'rohit@gmail.com',
        customerPhone: '9876500000',
        shippingAddressLine1: 'Indiranagar 100ft road',
        shippingCity: 'Bengaluru',
        shippingState: 'Karnataka',
        shippingPincode: '560038',
        items: [{ productId: sampleProduct.id, quantity: 2 }],
      });
    orderId = orderRes.body.data.id;
    orderItemId = orderRes.body.data.items[0].id;
  });

  describe('1. Returns Management & Intake', () => {
    it('should successfully record return intake (RMA)', async () => {
      const res = await request(app)
        .post('/api/v1/returns')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          orderId,
          type: 'CUSTOMER_RETURN',
          trackingNumber: 'RET-DELHIVERY-998877',
          items: [
            {
              orderItemId,
              productId: sampleProduct.id,
              quantity: 1,
              reason: 'DEFECTIVE',
            },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.returnNumber).toMatch(/^RMA-/);
      expect(res.body.data.status).toBe('RECEIVED');
      expect(res.body.data.items).toHaveLength(1);

      returnId = res.body.data.id;
      returnItemId = res.body.data.items[0].id;
    });

    it('should list returns and filter by status', async () => {
      const res = await request(app)
        .get('/api/v1/returns?status=RECEIVED')
        .set('Authorization', `Bearer ${qcToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.some((r: any) => r.id === returnId)).toBe(true);
    });

    it('should retrieve single return details with relations', async () => {
      const res = await request(app)
        .get(`/api/v1/returns/${returnId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(returnId);
      expect(res.body.data.items[0].id).toBe(returnItemId);
    });
  });

  describe('2. QC Return Inspection & Stock Disposition', () => {
    it('should inspect item with RESTOCK disposition and update inventory ledger', async () => {
      // Find picking location in warehouse
      const pickingLoc = await prisma.location.findFirst({
        where: { warehouseId: sampleWarehouse.id, type: 'PICKING' },
      });

      const res = await request(app)
        .post('/api/v1/returns/inspect')
        .set('Authorization', `Bearer ${qcToken}`)
        .send({
          returnItemId,
          condition: 'OPENED_LIKE_NEW',
          missingComponents: false,
          damagedPackaging: false,
          qcNotes: 'Toy tested and functional. Repacked in protective poly.',
          disposition: 'RESTOCK',
          restockLocationId: pickingLoc?.id,
          refundStatus: 'APPROVED',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.disposition).toBe('RESTOCK');
      expect(res.body.data.refundStatus).toBe('APPROVED');

      // Verify that inventory ledger recorded RESTOCK
      const ledgerEntry = await prisma.inventoryLedger.findFirst({
        where: {
          productId: sampleProduct.id,
          movementType: 'RESTOCK',
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(ledgerEntry).not.toBeNull();
      expect(ledgerEntry?.quantity).toBe(1);
    });
  });

  describe('3. Inventory Alerts & Low Stock Automated POs', () => {
    it('should detect low stock items and calculate deficits', async () => {
      const res = await request(app)
        .get('/api/v1/alerts/low-stock')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should scan for low stock items and create alerts', async () => {
      const res = await request(app)
        .post('/api/v1/alerts/scan-low-stock')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ warehouseId: sampleWarehouse.id });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('scannedCount');
      expect(res.body.data).toHaveProperty('newAlertsCreated');
    });

    it('should fetch alerts list and mark an alert as read', async () => {
      // Create a test alert
      const alert = await prisma.alert.create({
        data: {
          type: 'LOW_STOCK',
          severity: 'WARNING',
          title: 'Test Alert: Stock low for drone',
          message: 'Available stock is below reorder level.',
        },
      });

      const getRes = await request(app)
        .get('/api/v1/alerts?isRead=false')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(getRes.status).toBe(200);
      expect(getRes.body.success).toBe(true);
      expect(getRes.body.data.some((a: any) => a.id === alert.id)).toBe(true);

      const patchRes = await request(app)
        .patch(`/api/v1/alerts/${alert.id}/read`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(patchRes.status).toBe(200);
      expect(patchRes.body.data.isRead).toBe(true);
    });

    it('should automatically generate draft PO from low stock trigger', async () => {
      const res = await request(app)
        .post('/api/v1/alerts/create-po')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          warehouseId: sampleWarehouse.id,
          productId: sampleProduct.id,
          quantity: 25,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.poNumber).toMatch(/^PO-AUTO-/);
      expect(res.body.data.status).toBe('DRAFT');
      expect(res.body.data.items).toHaveLength(1);
      expect(res.body.data.items[0].expectedQty).toBe(25);
      expect(Number(res.body.data.totalAmount)).toBeGreaterThan(0);
    });
  });
});
