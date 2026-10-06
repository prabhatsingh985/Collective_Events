import { prisma } from '../../config/db';
import { Prisma } from '@prisma/client';
import { CreateLocationInput, UpdateLocationInput, LocationQueryInput } from '@toy-wms/shared';

export class LocationsRepository {
  async findMany(query: LocationQueryInput) {
    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    const where: Prisma.LocationWhereInput = {};

    if (query.warehouseId) where.warehouseId = query.warehouseId;
    if (query.type) where.type = query.type as any;
    if (query.aisle) where.aisle = query.aisle;
    if (query.search) {
      where.OR = [
        { code: { contains: query.search, mode: 'insensitive' } },
        { barcode: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.location.count({ where }),
      prisma.location.findMany({
        where,
        skip,
        take: limit,
        include: {
          stockLevels: {
            include: {
              product: {
                select: {
                  id: true,
                  sku: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: [{ pickSequence: 'asc' }, { code: 'asc' }],
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

  async findById(id: string) {
    return prisma.location.findUnique({
      where: { id },
      include: {
        stockLevels: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findByBarcodeOrCode(identifier: string) {
    return prisma.location.findFirst({
      where: {
        OR: [{ barcode: identifier }, { code: identifier }],
      },
      include: {
        stockLevels: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async create(data: CreateLocationInput) {
    const barcode = `LOC-${data.code.replace(/-/g, '')}`;
    return prisma.location.create({
      data: {
        ...data,
        type: data.type as any,
        barcode,
      },
    });
  }

  async update(id: string, data: UpdateLocationInput) {
    return prisma.location.update({
      where: { id },
      data: {
        ...data,
        type: data.type ? (data.type as any) : undefined,
      },
    });
  }
}

export const locationsRepository = new LocationsRepository();
