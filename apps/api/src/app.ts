import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { logger } from './config/logger';
import { errorHandler } from './middleware/error.middleware';
import { AppError } from './core/AppError';

// Routes
import healthRoutes from './modules/health/health.routes';
import authRoutes from './modules/auth/auth.routes';
import auditRoutes from './modules/audit/audit.routes';
import barcodeRoutes from './modules/barcodes/barcode.routes';
import productRoutes from './modules/products/products.routes';
import locationRoutes from './modules/locations/locations.routes';
import supplierRoutes from './modules/suppliers/suppliers.routes';
import inventoryRoutes from './modules/inventory/inventory.routes';
import poRoutes from './modules/purchase-orders/po.routes';
import receivingRoutes from './modules/receiving/grn.routes';
import putawayRoutes from './modules/putaway/putaway.routes';
import orderRoutes from './modules/orders/orders.routes';
import pickingRoutes from './modules/picking/picking.routes';
import packingRoutes from './modules/packing/packing.routes';
import shippingRoutes from './modules/shipping/shipping.routes';
import returnsRoutes from './modules/returns/returns.routes';
import alertRoutes from './modules/alerts/alerts.routes';
import packagingRoutes from './modules/packaging/packaging.routes';
import reportsRoutes from './modules/reports/reports.routes';

export function createApp(): Express {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: [env.FRONTEND_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-idempotency-key'],
    })
  );

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      data: null,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests from this IP, please try again later.',
      },
      timestamp: new Date().toISOString(),
    },
  });
  app.use(limiter);

  // Structured HTTP request logging with Pino
  app.use(
    pinoHttp({
      logger,
      autoLogging: {
        ignore: (req) => req.url === '/health' || req.url === '/api/v1/health',
      },
    })
  );

  // Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Root health check
  app.use('/health', healthRoutes);

  // API v1 Router
  const apiV1Router = express.Router();
  apiV1Router.use('/health', healthRoutes);
  apiV1Router.use('/auth', authRoutes);
  apiV1Router.use('/audit-logs', auditRoutes);
  apiV1Router.use('/barcodes', barcodeRoutes);
  apiV1Router.use('/products', productRoutes);
  apiV1Router.use('/locations', locationRoutes);
  apiV1Router.use('/suppliers', supplierRoutes);
  apiV1Router.use('/inventory', inventoryRoutes);
  apiV1Router.use('/purchase-orders', poRoutes);
  apiV1Router.use('/receiving', receivingRoutes);
  apiV1Router.use('/putaway', putawayRoutes);
  apiV1Router.use('/orders', orderRoutes);
  apiV1Router.use('/picking', pickingRoutes);
  apiV1Router.use('/packing', packingRoutes);
  apiV1Router.use('/shipping', shippingRoutes);
  apiV1Router.use('/returns', returnsRoutes);
  apiV1Router.use('/alerts', alertRoutes);
  apiV1Router.use('/packaging', packagingRoutes);
  apiV1Router.use('/reports', reportsRoutes);

  app.use('/api/v1', apiV1Router);

  // 404 Route Catch-all
  app.use((req: Request, _res: Response, next: NextFunction) => {
    next(AppError.notFound(`Cannot find ${req.method} ${req.originalUrl} on this server`));
  });

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
}
