import { prisma } from '../../config/db';
import { Prisma } from '@prisma/client';
import { CreateProductInput, UpdateProductInput, ProductQueryInput } from '@toy-wms/shared';

export class ProductsRepository {
  async findMany(query: ProductQueryInput) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { sku: { contains: query.search, mode: 'insensitive' } },
        { barcode: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.brandId) where.brandId = query.brandId;
    if (query.isActive !== undefined) where.isActive = query.isActive;

    const [total, items] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          brand: true,
          stockLevels: {
            include: {
              location: true,
            },
          },
        },
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

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        stockLevels: {
          include: {
            location: true,
          },
        },
        supplierPrices: {
          include: {
            supplier: true,
          },
        },
      },
    });
  }

  async findByBarcodeOrSku(identifier: string) {
    return prisma.product.findFirst({
      where: {
        OR: [{ barcode: identifier }, { sku: identifier }],
      },
      include: {
        category: true,
        brand: true,
        stockLevels: {
          include: {
            location: true,
          },
        },
      },
    });
  }

  async create(data: CreateProductInput) {
    return prisma.product.create({
      data: {
        ...data,
      },
      include: {
        category: true,
        brand: true,
      },
    });
  }

  async update(id: string, data: UpdateProductInput) {
    return prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        brand: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }

  async findCategories() {
    return prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  async findBrands() {
    return prisma.brand.findMany({ orderBy: { name: 'asc' } });
  }
}

export const productsRepository = new ProductsRepository();
