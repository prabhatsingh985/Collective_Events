'use client';

import React, { useState } from 'react';
import { useWms } from '../../context/WmsContext';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  Calculator,
  IndianRupee,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

export default function ReportsPage() {
  const { products, orders } = useWms();

  // Unit Economics Calculator state
  const [sellingPrice, setSellingPrice] = useState(1899);
  const [costPrice, setCostPrice] = useState(850);
  const [packagingCost, setPackagingCost] = useState(28);
  const [courierCost, setCourierCost] = useState(120);
  const [gstRate, setGstRate] = useState(18);

  const gstAmount = Math.round(sellingPrice - sellingPrice / (1 + gstRate / 100));
  const netRevenue = sellingPrice - gstAmount;
  const totalCost = costPrice + packagingCost + courierCost;
  const contributionMargin = netRevenue - totalCost;
  const marginPercentage = Math.round((contributionMargin / sellingPrice) * 100);

  const totalCostValuation = products.reduce((sum, p) => sum + p.onHand * p.costPrice, 0);
  const totalRetailValuation = products.reduce((sum, p) => sum + p.onHand * p.sellingPrice, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            BIS Compliance, Valuation & Unit Economics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Financial warehouse health metrics, Indian GST tax analytics, and contribution margin calculator.
          </p>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cost Valuation</span>
          <p className="text-2xl font-black text-slate-900 mt-2">
            ₹{(totalCostValuation / 100000).toFixed(2)} Lakh
          </p>
          <p className="text-xs text-slate-400 mt-1">Purchase cost of current physical inventory</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Retail Valuation</span>
          <p className="text-2xl font-black text-slate-900 mt-2">
            ₹{(totalRetailValuation / 100000).toFixed(2)} Lakh
          </p>
          <p className="text-xs text-slate-400 mt-1">Realizable gross retail revenue at MRP</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Margin Spread</span>
          <p className="text-2xl font-black text-emerald-600 mt-2">
            {Math.round(((totalRetailValuation - totalCostValuation) / totalRetailValuation) * 100)}%
          </p>
          <p className="text-xs text-slate-400 mt-1">Overall product portfolio margin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: BIS Safety Compliance Audit */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            BIS (IS 9873) Compliance Status by SKU
          </h2>

          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{p.name}</span>
                  {p.isBisCompliant ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      PASSED
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 animate-pulse">
                      RENEWAL NEEDED
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
                  <span>CM/L: {p.bisRegistrationNumber}</span>
                  <span>Safety: {p.safetyStandard}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 6 Cols: Interactive Contribution Margin Calculator */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Calculator className="h-4 w-4 text-blue-600" />
            Unit Economics & Contribution Margin Calculator
          </h2>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Selling Price (₹ MRP)</label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Product Cost (₹)</label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Carton & Packaging (₹)</label>
              <input
                type="number"
                value={packagingCost}
                onChange={(e) => setPackagingCost(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Courier Shipping (₹)</label>
              <input
                type="number"
                value={courierCost}
                onChange={(e) => setCourierCost(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-slate-900"
              />
            </div>
          </div>

          {/* Computed Results Showcase */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-300">
              <span>GST Tax ({gstRate}% Slab)</span>
              <span className="font-mono font-bold text-white">₹{gstAmount}</span>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-300">
              <span>Total Operational Costs</span>
              <span className="font-mono font-bold text-white">₹{totalCost}</span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-blue-300 font-bold">Contribution Margin (CM2)</p>
                <p className="text-2xl font-black text-emerald-400 mt-0.5">₹{contributionMargin}</p>
              </div>
              <span className="text-base font-black px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {marginPercentage}% Margin
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
