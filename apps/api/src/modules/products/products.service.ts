import { productsRepository } from './products.repository';
import { auditService } from '../audit/audit.service';
import { AppError } from '../../core/AppError';
import { CreateProductInput, UpdateProductInput, ProductQueryInput } from '@toy-wms/shared';

export class ProductsService {
  private formatProductWithStock(product: any) {
    let totalOnHand = 0;
    let totalReserved = 0;
    let totalDamaged = 0;
    let totalReturned = 0;
    let totalInTransit = 0;
    let totalIncoming = 0;
    let totalLostMissing = 0;

    if (product.stockLevels) {
      for (const sl of product.stockLevels) {
        totalOnHand += sl.onHand;
        totalReserved += sl.reserved;
        totalDamaged += sl.damaged;
        totalReturned += sl.returned;
        totalInTransit += sl.inTransit;
        totalIncoming += sl.incoming;
        totalLostMissing += sl.lostMissing;
      }
    }

    const available = totalOnHand - totalReserved;

    return {
      ...product,
      stockSummary: {
        onHand: totalOnHand,
        reserved: totalReserved,
        available: Math.max(0, available),
        damaged: totalDamaged,
        returned: totalReturned,
        inTransit: totalInTransit,
        incoming: totalIncoming,
        lostMissing: totalLostMissing,
      },
    };
  }

  async getProducts(query: ProductQueryInput) {
    const result = await productsRepository.findMany(query);
    const items = result.items.map(this.formatProductWithStock);

    return {
      ...result,
      items,
    };
  }

  async getProductById(id: string) {
    const product = await productsRepository.findById(id);
    if (!product) {
      throw AppError.notFound(`Product with ID ${id} not found`);
    }
    return this.formatProductWithStock(product);
  }

  async getProductByBarcode(barcode: string) {
    const product = await productsRepository.findByBarcodeOrSku(barcode);
    if (!product) {
      throw AppError.notFound(`Product with barcode/SKU "${barcode}" not found`);
    }
    return this.formatProductWithStock(product);
  }

  async createProduct(data: CreateProductInput, userId: string, userEmail: string) {
    const product = await productsRepository.create(data);

    await auditService.log({
      userId,
      userEmail,
      action: 'PRODUCT_CREATED',
      entityType: 'Product',
      entityId: product.id,
      details: { sku: product.sku, name: product.name, bisCertNumber: product.bisCertNumber },
    });

    return this.formatProductWithStock(product);
  }

  async updateProduct(id: string, data: UpdateProductInput, userId: string, userEmail: string) {
    await this.getProductById(id); // Ensure exists
    const updated = await productsRepository.update(id, data);

    await auditService.log({
      userId,
      userEmail,
      action: 'PRODUCT_UPDATED',
      entityType: 'Product',
      entityId: updated.id,
      details: data,
    });

    return this.formatProductWithStock(updated);
  }

  async getCategories() {
    return productsRepository.findCategories();
  }

  async getBrands() {
    return productsRepository.findBrands();
  }
}

export const productsService = new ProductsService();
