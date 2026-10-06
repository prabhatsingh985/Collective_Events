import { packingRepository } from './packing.repository';
import { auditService } from '../audit/audit.service';
import { AppError } from '../../core/AppError';
import { CreatePackageInput } from '@toy-wms/shared';

export class PackingService {
  async getPackages(orderId?: string) {
    return packingRepository.findPackages(orderId);
  }

  async getPackageById(id: string) {
    const pkg = await packingRepository.findPackageById(id);
    if (!pkg) {
      throw AppError.notFound(`Package with ID ${id} not found`);
    }
    return pkg;
  }

  async createPackage(data: CreatePackageInput, userId: string, userEmail: string) {
    const pkg = await packingRepository.createPackage(data, userId);

    await auditService.log({
      userId,
      userEmail,
      action: 'PACKAGE_PACKED_AND_WEIGHED',
      entityType: 'Package',
      entityId: pkg.id,
      details: {
        packageNumber: pkg.packageNumber,
        actualWeight: pkg.actualWeightGrams,
        volumetricWeight: pkg.volumetricWeightGrams,
        chargeableWeight: pkg.chargeableWeightGrams,
      },
    });

    return pkg;
  }
}

export const packingService = new PackingService();
