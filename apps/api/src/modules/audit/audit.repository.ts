import { prisma } from '../../config/db';
import { Prisma } from '@prisma/client';

export interface CreateAuditLogParams {
  userId?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: any;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface FindAuditLogsFilter {
  userId?: string;
  entityType?: string;
  entityId?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export class AuditRepository {
  async create(data: CreateAuditLogParams) {
    return prisma.auditLog.create({
      data: {
        userId: data.userId || null,
        userEmail: data.userEmail || null,
        userRole: data.userRole || null,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId || null,
        details: data.details ? (data.details as Prisma.InputJsonValue) : Prisma.JsonNull,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
      },
    });
  }

  async findMany(filter: FindAuditLogsFilter) {
    const page = filter.page || 1;
    const limit = filter.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.AuditLogWhereInput = {};

    if (filter.userId) where.userId = filter.userId;
    if (filter.entityType) where.entityType = filter.entityType;
    if (filter.entityId) where.entityId = filter.entityId;
    if (filter.action) where.action = { contains: filter.action, mode: 'insensitive' };
    if (filter.startDate || filter.endDate) {
      where.createdAt = {};
      if (filter.startDate) where.createdAt.gte = filter.startDate;
      if (filter.endDate) where.createdAt.lte = filter.endDate;
    }

    const [total, items] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export const auditRepository = new AuditRepository();
