import { reportsRepository } from './reports.repository';

export class ReportsService {
  async getInventoryValuation(warehouseId?: string) {
    return reportsRepository.getInventoryValuation(warehouseId);
  }

  async getOrderFulfillmentSla() {
    return reportsRepository.getOrderFulfillmentSla();
  }

  async getReturnsAndRto() {
    return reportsRepository.getReturnsAndRto();
  }

  async getContributionMargin(
    sku?: string,
    overrides?: {
      packagingCost?: number;
      shippingCost?: number;
      gatewayPercent?: number;
      rtoRatePercent?: number;
      overheadCost?: number;
      laborCost?: number;
      marketingCac?: number;
    }
  ) {
    return reportsRepository.getContributionMargin(sku, overrides);
  }
}

export const reportsService = new ReportsService();
