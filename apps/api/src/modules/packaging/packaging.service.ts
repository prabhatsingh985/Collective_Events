import { packagingRepository } from './packaging.repository';
import { AppError } from '../../core/AppError';
import { PackagingMaterialType } from '@prisma/client';

export class PackagingService {
  async getAll() {
    return packagingRepository.findAll();
  }

  async getById(id: string) {
    const material = await packagingRepository.findById(id);
    if (!material) {
      throw AppError.notFound(`Packaging material with ID ${id} not found`);
    }
    return material;
  }

  async updateStock(id: string, delta: number) {
    return packagingRepository.updateStock(id, delta);
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
    return packagingRepository.create(data);
  }
}

export const packagingService = new PackagingService();
