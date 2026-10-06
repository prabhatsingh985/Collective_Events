import { prisma } from '../../config/db';

export class ReportsRepository {
  async getInventoryValuation(warehouseId?: string) {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        stockLevels: {
          where: warehouseId ? { warehouseId } : undefined,
        },
      },
    });

    let totalUnitsOnHand = 0;
    let totalUnitsReserved = 0;
    let totalUnitsDamaged = 0;
    let totalUnitsReturned = 0;
    let totalCostValuation = 0;
    let totalRetailValuation = 0;

    const categoryMap = new Map<
      string,
      { skuCount: number; units: number; costValuation: number }
    >();

    for (const p of products) {
      let pOnHand = 0;
      let pReserved = 0;
      let pDamaged = 0;
      let pReturned = 0;

      for (const st of p.stockLevels) {
        pOnHand += st.onHand;
        pReserved += st.reserved;
        pDamaged += st.damaged;
        pReturned += st.returned;
      }

      totalUnitsOnHand += pOnHand;
      totalUnitsReserved += pReserved;
      totalUnitsDamaged += pDamaged;
      totalUnitsReturned += pReturned;

      const costVal = pOnHand * Number(p.costPrice);
      const retailVal = pOnHand * Number(p.sellingPrice);

      totalCostValuation += costVal;
      totalRetailValuation += retailVal;

      const catName = p.category.name;
      const existing = categoryMap.get(catName) || { skuCount: 0, units: 0, costValuation: 0 };
      categoryMap.set(catName, {
        skuCount: existing.skuCount + 1,
        units: existing.units + pOnHand,
        costValuation: existing.costValuation + costVal,
      });
    }

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, stats]) => ({
      category,
      skuCount: stats.skuCount,
      units: stats.units,
      costValuation: Math.round(stats.costValuation * 100) / 100,
    }));

    return {
      totalActiveSkus: products.length,
      totalUnitsOnHand,
      totalUnitsReserved,
      totalUnitsAvailable: totalUnitsOnHand - totalUnitsReserved,
      totalUnitsDamaged,
      totalUnitsReturned,
      totalCostValuation: Math.round(totalCostValuation * 100) / 100,
      totalRetailValuation: Math.round(totalRetailValuation * 100) / 100,
      potentialGrossMargin: Math.round((totalRetailValuation - totalCostValuation) * 100) / 100,
      categoryBreakdown,
    };
  }

  async getOrderFulfillmentSla() {
    const orders = await prisma.order.findMany({
      include: {
        shipments: true,
      },
    });

    const statusCounts: Record<string, number> = {};
    const sourceCounts: Record<string, number> = {};

    let totalFulfillmentHours = 0;
    let shippedOrdersCount = 0;
    let ordersUnder24hSla = 0;

    for (const order of orders) {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
      sourceCounts[order.source] = (sourceCounts[order.source] || 0) + 1;

      const primaryShipment = order.shipments[0];
      if (primaryShipment) {
        const creationTime = new Date(order.createdAt).getTime();
        const shippedTime = new Date(primaryShipment.createdAt).getTime();
        const diffHours = (shippedTime - creationTime) / (1000 * 60 * 60);

        totalFulfillmentHours += diffHours;
        shippedOrdersCount++;

        if (diffHours <= 24) {
          ordersUnder24hSla++;
        }
      }
    }

    const avgFulfillmentHours =
      shippedOrdersCount > 0
        ? Math.round((totalFulfillmentHours / shippedOrdersCount) * 10) / 10
        : 0;

    const slaOnTimeRate =
      shippedOrdersCount > 0
        ? Math.round((ordersUnder24hSla / shippedOrdersCount) * 1000) / 10
        : 100;

    return {
      totalOrders: orders.length,
      shippedOrdersCount,
      statusCounts,
      sourceCounts,
      avgFulfillmentHours,
      slaOnTimeRate,
      ordersUnder24hSla,
    };
  }

  async getReturnsAndRto() {
    const totalOrdersCount = await prisma.order.count();
    const returns = await prisma.return.findMany({
      include: {
        items: true,
      },
    });

    let customerReturnsCount = 0;
    let rtoReturnsCount = 0;
    let totalRefundAmount = 0;

    const reasonCounts: Record<string, number> = {};
    const dispositionCounts: Record<string, number> = {};

    for (const r of returns) {
      if (r.type === 'CUSTOMER_RETURN') customerReturnsCount++;
      if (r.type === 'RTO') rtoReturnsCount++;
      if (r.totalRefundAmount) totalRefundAmount += Number(r.totalRefundAmount);

      for (const item of r.items) {
        reasonCounts[item.reason] = (reasonCounts[item.reason] || 0) + item.quantity;
        dispositionCounts[item.disposition] =
          (dispositionCounts[item.disposition] || 0) + item.quantity;
      }
    }

    const returnRatePct =
      totalOrdersCount > 0
        ? Math.round((customerReturnsCount / totalOrdersCount) * 1000) / 10
        : 0;

    const rtoRatePct =
      totalOrdersCount > 0 ? Math.round((rtoReturnsCount / totalOrdersCount) * 1000) / 10 : 0;

    return {
      totalReturns: returns.length,
      customerReturnsCount,
      rtoReturnsCount,
      returnRatePct,
      rtoRatePct,
      totalRefundAmount: Math.round(totalRefundAmount * 100) / 100,
      reasonBreakdown: reasonCounts,
      dispositionBreakdown: dispositionCounts,
    };
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
    const products = await prisma.product.findMany({
      where: sku ? { sku } : { isActive: true },
      take: sku ? 1 : 15,
      include: {
        category: true,
      },
    });

    const results = products.map((p) => {
      const sellingPrice = Number(p.sellingPrice);
      const productCost = Number(p.costPrice);

      const packagingCost = overrides?.packagingCost ?? 32;
      const shippingCost = overrides?.shippingCost ?? 75;
      const gatewayFee = Math.round((((overrides?.gatewayPercent ?? 2.0) / 100) * sellingPrice) * 100) / 100;
      const rtoCostImpact =
        Math.round((((overrides?.rtoRatePercent ?? 5.0) / 100) * (shippingCost * 1.5)) * 100) / 100;
      const overheadCost = overrides?.overheadCost ?? 20;
      const laborCost = overrides?.laborCost ?? 15;
      const marketingCac = overrides?.marketingCac ?? 120;

      const totalOperationalCost =
        Math.round(
          (productCost +
            packagingCost +
            shippingCost +
            gatewayFee +
            rtoCostImpact +
            overheadCost +
            laborCost +
            marketingCac) *
            100
        ) / 100;

      const contributionMargin = Math.round((sellingPrice - totalOperationalCost) * 100) / 100;
      const contributionMarginPct =
        sellingPrice > 0 ? Math.round((contributionMargin / sellingPrice) * 1000) / 10 : 0;

      return {
        productId: p.id,
        sku: p.sku,
        name: p.name,
        category: p.category.name,
        sellingPrice,
        costBreakdown: {
          productCost,
          packagingCost,
          shippingCost,
          gatewayFee,
          rtoCostImpact,
          overheadCost,
          laborCost,
          marketingCac,
          totalOperationalCost,
        },
        contributionMargin,
        contributionMarginPct,
      };
    });

    return results;
  }
}

export const reportsRepository = new ReportsRepository();
