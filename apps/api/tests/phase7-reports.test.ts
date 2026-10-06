import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/config/db';

const app = createApp();

describe('Phase 7: Packaging Materials, Valuation, SLA & Contribution Margin Reports', () => {
  let adminToken: string;
  let managerToken: string;
  let sampleBox: any;

  beforeAll(async () => {
    const adminRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@toywms.in',
      password: 'Password@123',
    });
    adminToken = adminRes.body.data.tokens.accessToken;

    const mgrRes = await request(app).post('/api/v1/auth/login').send({
      email: 'manager@toywms.in',
      password: 'Password@123',
    });
    managerToken = mgrRes.body.data.tokens.accessToken;

    sampleBox = await prisma.packagingMaterial.findFirst({ where: { code: 'BOX-M' } });
  });

  describe('1. Packaging Materials Inventory', () => {
    it('should list all packaging materials with box dimensions and unit costs', async () => {
      const res = await request(app)
        .get('/api/v1/packaging')
        .set('Authorization', `Bearer ${managerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(3);

      const boxM = res.body.data.find((b: any) => b.code === 'BOX-M');
      expect(boxM).toBeDefined();
      expect(Number(boxM.lengthCm)).toBe(35);
      expect(Number(boxM.unitCost)).toBe(32);
    });

    it('should update packaging material stock level', async () => {
      const initialStock = sampleBox.stockQuantity;
      const res = await request(app)
        .patch(`/api/v1/packaging/${sampleBox.id}/stock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ delta: 50 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.stockQuantity).toBe(initialStock + 50);
    });
  });

  describe('2. Warehouse Inventory Valuation Report', () => {
    it('should calculate active SKUs, on-hand units, cost valuation and retail valuation', async () => {
      const res = await request(app)
        .get('/api/v1/reports/inventory-valuation')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalActiveSkus).toBeGreaterThan(0);
      expect(res.body.data.totalUnitsOnHand).toBeGreaterThan(0);
      expect(res.body.data.totalCostValuation).toBeGreaterThan(0);
      expect(res.body.data.totalRetailValuation).toBeGreaterThan(res.body.data.totalCostValuation);
      expect(res.body.data.potentialGrossMargin).toBeGreaterThan(0);
      expect(Array.isArray(res.body.data.categoryBreakdown)).toBe(true);
      expect(res.body.data.categoryBreakdown.length).toBeGreaterThan(0);
    });
  });

  describe('3. Order Fulfillment & SLA Adherence Metrics', () => {
    it('should report order volume by status, source, and SLA adherence rate', async () => {
      const res = await request(app)
        .get('/api/v1/reports/order-fulfillment')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalOrders');
      expect(res.body.data).toHaveProperty('statusCounts');
      expect(res.body.data).toHaveProperty('sourceCounts');
      expect(res.body.data).toHaveProperty('slaOnTimeRate');
    });
  });

  describe('4. Returns & RTO Analytics', () => {
    it('should report customer return rate %, RTO rate %, reasons and refunds', async () => {
      const res = await request(app)
        .get('/api/v1/reports/returns-rto')
        .set('Authorization', `Bearer ${managerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalReturns');
      expect(res.body.data).toHaveProperty('returnRatePct');
      expect(res.body.data).toHaveProperty('rtoRatePct');
      expect(res.body.data).toHaveProperty('reasonBreakdown');
      expect(res.body.data).toHaveProperty('dispositionBreakdown');
    });
  });

  describe('5. Contribution Margin & Unit Economics Calculator', () => {
    it('should compute contribution margin across all operational cost drivers for a SKU', async () => {
      const res = await request(app)
        .post('/api/v1/reports/contribution-margin?sku=TOY-RC-001')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          packagingCost: 32, // Medium Box
          shippingCost: 80, // Delhivery 500g
          gatewayPercent: 2.0, // Razorpay
          rtoRatePercent: 4.0, // 4% RTO
          overheadCost: 25, // Rent + Utilities
          laborCost: 15, // Warehouse floor labor
          marketingCac: 150, // Ad spend per unit
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data).toHaveLength(1);

      const marginData = res.body.data[0];
      expect(marginData.sku).toBe('TOY-RC-001');
      expect(marginData.costBreakdown).toBeDefined();
      expect(marginData.costBreakdown.packagingCost).toBe(32);
      expect(marginData.costBreakdown.shippingCost).toBe(80);
      expect(marginData.costBreakdown.totalOperationalCost).toBeGreaterThan(0);
      expect(typeof marginData.contributionMargin).toBe('number');
      expect(typeof marginData.contributionMarginPct).toBe('number');

      // Verify formula: Selling Price - total operational cost = contribution margin
      const expectedMargin = Math.round((marginData.sellingPrice - marginData.costBreakdown.totalOperationalCost) * 100) / 100;
      expect(marginData.contributionMargin).toBe(expectedMargin);
    });
  });
});
