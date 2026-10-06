import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './config/db';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Toy WMS API Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  logger.info(`👉 Health check available at: http://localhost:${env.PORT}/health`);
  logger.info(`👉 API v1 base endpoint at: http://localhost:${env.PORT}/api/v1`);
});

// Graceful shutdown handling
const shutdown = async (signal: string) => {
  logger.info(`${signal} signal received: closing HTTP server and database connections`);
  server.close(async () => {
    logger.info('HTTP server closed');
    await prisma.$disconnect();
    logger.info('Database connection closed');
    process.exit(0);
  });

  // Force close after 10 seconds if graceful shutdown hangs
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
