import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/config/db';

const app = createApp();

describe('Phase 1: Auth, RBAC, and Audit Logging Integration Tests', () => {
  let adminToken: string;
  let managerToken: string;
  let workerToken: string;
  let qcToken: string;
  let refreshToken: string;

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('1. Health Check Endpoint', () => {
    it('should return healthy status and database status ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('healthy');
      expect(res.body.data.database).toBe('ok');
    });
  });

  describe('2. Authentication Flow (Login)', () => {
    it('should login ADMIN successfully and return tokens + user profile', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@toywms.in',
          password: 'Password@123',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.role).toBe('ADMIN');
      expect(res.body.data.tokens.accessToken).toBeDefined();
      expect(res.body.data.tokens.refreshToken).toBeDefined();

      adminToken = res.body.data.tokens.accessToken;
      refreshToken = res.body.data.tokens.refreshToken;
    });

    it('should login WAREHOUSE_MANAGER successfully', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'manager@toywms.in',
          password: 'Password@123',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.user.role).toBe('WAREHOUSE_MANAGER');
      managerToken = res.body.data.tokens.accessToken;
    });

    it('should login WAREHOUSE_ASSOCIATE successfully', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'worker@toywms.in',
          password: 'Password@123',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.user.role).toBe('WAREHOUSE_ASSOCIATE');
      workerToken = res.body.data.tokens.accessToken;
    });

    it('should login QC successfully', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'qc@toywms.in',
          password: 'Password@123',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.user.role).toBe('QC');
      qcToken = res.body.data.tokens.accessToken;
    });

    it('should reject login with wrong password (401)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@toywms.in',
          password: 'WrongPassword999',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('should reject login with non-existent email (401)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'doesnotexist@toywms.in',
          password: 'Password@123',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('3. Token Refresh & User Profile', () => {
    it('should refresh tokens with valid refresh token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.tokens.accessToken).toBeDefined();
      expect(res.body.data.tokens.refreshToken).toBeDefined();

      // Old refresh token was rotated, updating to new refresh token
      refreshToken = res.body.data.tokens.refreshToken;
    });

    it('should fetch authenticated user profile with GET /api/v1/auth/me', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('admin@toywms.in');
      expect(res.body.data.role).toBe('ADMIN');
    });

    it('should reject /api/v1/auth/me without token (401)', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
    });
  });

  describe('4. RBAC & Audit Log Permissions', () => {
    it('ADMIN should be permitted to access audit logs (200)', async () => {
      const res = await request(app)
        .get('/api/v1/audit-logs')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toBeDefined();
    });

    it('WAREHOUSE_MANAGER should be permitted to access audit logs (200)', async () => {
      const res = await request(app)
        .get('/api/v1/audit-logs')
        .set('Authorization', `Bearer ${managerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('WAREHOUSE_ASSOCIATE should be forbidden from accessing audit logs (403)', async () => {
      const res = await request(app)
        .get('/api/v1/audit-logs')
        .set('Authorization', `Bearer ${workerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INSUFFICIENT_PERMISSIONS');
    });

    it('QC should be forbidden from accessing audit logs (403)', async () => {
      const res = await request(app)
        .get('/api/v1/audit-logs')
        .set('Authorization', `Bearer ${qcToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INSUFFICIENT_PERMISSIONS');
    });
  });

  describe('5. Audit Log Entry Verification', () => {
    it('should find recorded audit logs for login events in the database', async () => {
      const res = await request(app)
        .get('/api/v1/audit-logs?action=USER_LOGIN')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      const loginLog = res.body.data.find((l: any) => l.action === 'USER_LOGIN');
      expect(loginLog).toBeDefined();
      expect(loginLog.entityType).toBe('User');
    });
  });
});
