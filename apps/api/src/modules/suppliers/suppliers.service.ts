import { suppliersRepository } from './suppliers.repository';
import { auditService } from '../audit/audit.service';
import { AppError } from '../../core/AppError';

export class SuppliersService {
  async getSuppliers() {
    return suppliersRepository.findMany();
  }

  async getSupplierById(id: string) {
    const supplier = await suppliersRepository.findById(id);
    if (!supplier) {
      throw AppError.notFound(`Supplier with ID ${id} not found`);
    }
    return supplier;
  }

  async createSupplier(data: any, userId: string, userEmail: string) {
    const supplier = await suppliersRepository.create(data);

    await auditService.log({
      userId,
      userEmail,
      action: 'SUPPLIER_CREATED',
      entityType: 'Supplier',
      entityId: supplier.id,
      details: { code: supplier.code, name: supplier.name },
    });

    return supplier;
  }

  async updateSupplier(id: string, data: any, userId: string, userEmail: string) {
    await this.getSupplierById(id);
    const updated = await suppliersRepository.update(id, data);

    await auditService.log({
      userId,
      userEmail,
      action: 'SUPPLIER_UPDATED',
      entityType: 'Supplier',
      entityId: updated.id,
      details: data,
    });

    return updated;
  }

  async setProductPrice(data: any, userId: string, userEmail: string) {
    const price = await suppliersRepository.setProductPrice(data);

    await auditService.log({
      userId,
      userEmail,
      action: 'SUPPLIER_PRICE_CONFIGURED',
      entityType: 'SupplierProductPrice',
      entityId: price.id,
      details: data,
    });

    return price;
  }
}

export const suppliersService = new SuppliersService();
