import { prisma } from '../../config/db';
import { PackagingMaterialType } from '@prisma/client';

export class PackagingRepository {
  async findAll() {
    return prisma.packagingMaterial.findMany({
      orderBy: { code: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.packagingMaterial.findUnique({
      where: { id },
    });
  }

  async updateStock(id: string, quantityDelta: number) {
    return prisma.packagingMaterial.update({
      where: { id },
      data: {
        stockQuantity: {
          increment: quantityDelta,
        },
      },
    });
  }

  async create(data: {
    code: string;
    name: string;
    type: PackagingMaterialType;
    lengthCm: number;
    widthCm: number;
    heightCm: number;
    maxWeightCapacityGrams: number;
    unitCost: number;
    stockQuantity?: number;
    reorderLevel?: number;
    reorderQty?: number;
  }) {
    return prisma.packagingMaterial.create({
      data: {
        code: data.code,
        name: data.name,
        type: data.type,
        lengthCm: data.lengthCm,
        widthCm: data.widthCm,
        heightCm: data.heightCm,
        maxWeightCapacityGrams: data.maxWeightCapacityGrams,
        unitCost: data.unitCost,
        stockQuantity: data.stockQuantity || 100,
        reorderLevel: data.reorderLevel || 20,
        reorderQty: data.reorderQty || 100,
      },
    });
  }
}

export const packagingRepository = new PackagingRepository();
