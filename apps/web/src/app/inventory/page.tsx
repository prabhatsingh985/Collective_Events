'use client';

import React, { useState } from 'react';
import { useWms } from '../../context/WmsContext';
import {
  Boxes,
  ShieldCheck,
  ShieldAlert,
  Barcode,
  Search,
  Filter,
  ArrowRightLeft,
  SlidersHorizontal,
  X,
  Check,
  Printer,
  Sparkles,
} from 'lucide-react';
import { Product } from '../../lib/types';

export default function InventoryPage() {
  const { products, transferStock, adjustStock, locations } = useWms();
  const [search, setSearch] = useState('');
  const [filterBis, setFilterBis] = useState<'ALL' | 'COMPLIANT' | 'NON_COMPLIANT'>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showBarcodeModal, setShowBarcodeModal] = useState<Product | null>(null);
  const [showTransferModal, setShowTransferModal] = useState<Product | null>(null);

  // Transfer form state
  const [toLoc, setToLoc] = useState('A-01-A-01');
  const [transferQty, setTransferQty] = useState(1);
  const [adjustmentQty, setAdjustmentQty] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState('COUNT_CORRECTION');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode.includes(search);
    const matchesBis =
      filterBis === 'ALL'
        ? true
        : filterBis === 'COMPLIANT'
        ? p.isBisCompliant
        : !p.isBisCompliant;
    return matchesSearch && matchesBis;
  });

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showTransferModal) return;
    const res = transferStock(showTransferModal.sku, 'STORAGE-DEFAULT', toLoc, Number(transferQty));
    setActionFeedback(res.message);
    setTimeout(() => {
      setActionFeedback(null);
      setShowTransferModal(null);
    }, 1500);
  };

  const handleAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showTransferModal) return;
    const res = adjustStock(showTransferModal.sku, Number(adjustmentQty), adjustmentReason);
    setActionFeedback(res.message);
    setTimeout(() => {
      setActionFeedback(null);
      setShowTransferModal(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Boxes className="h-6 w-6 text-blue-600" />
            Toy Inventory & BIS Safety Compliance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Indian Standard IS 9873 compliance tracking, HSN 95030030 tax classifications & multi-bucket stock levels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
            Total SKUs: {products.length}
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            Compliant: {products.filter((p) => p.isBisCompliant).length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search toy by name, SKU, or EAN barcode..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
          <button
            onClick={() => setFilterBis('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
              filterBis === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Toys
          </button>
          <button
            onClick={() => setFilterBis('COMPLIANT')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
              filterBis === 'COMPLIANT'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            BIS Verified
          </button>
          <button
            onClick={() => setFilterBis('NON_COMPLIANT')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 ${
              filterBis === 'NON_COMPLIANT'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            Audit Review
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Toy SKU & Description</th>
                <th className="py-3.5 px-4">BIS Standard & HSN</th>
                <th className="py-3.5 px-4">Age / Material</th>
                <th className="py-3.5 px-4 text-center">Cost / Retail</th>
                <th className="py-3.5 px-4 text-center">Available Stock</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-blue-50/40 transition-colors">
                  {/* SKU & Name */}
                  <td className="py-4 px-4 max-w-sm">
                    <div className="flex items-start gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200">
                        {p.sku.split('-')[1]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">{p.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-[11px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-semibold">
                            {p.sku}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            EAN: {p.barcode}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* BIS Compliance & HSN */}
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        {p.isBisCompliant ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <ShieldCheck className="h-3 w-3" /> ISI Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                            <ShieldAlert className="h-3 w-3" /> Recertification Required
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-slate-600">{p.bisRegistrationNumber}</p>
                      <p className="text-[10px] text-slate-400">HSN: {p.hsnCode} • GST: {p.gstRate}%</p>
                    </div>
                  </td>

                  {/* Age & Material */}
                  <td className="py-4 px-4">
                    <p className="font-semibold text-slate-800">{p.ageGrading}</p>
                    <p className="text-[11px] text-slate-500 truncate max-w-xs">{p.materialType}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{p.weightGrams}g • {p.lengthCm}x{p.widthCm}x{p.heightCm} cm</p>
                  </td>

                  {/* Prices */}
                  <td className="py-4 px-4 text-center">
                    <p className="font-bold text-slate-900">₹{p.sellingPrice}</p>
                    <p className="text-[11px] text-slate-400">Cost: ₹{p.costPrice}</p>
                    <span className="text-[10px] font-semibold text-emerald-600">
                      {Math.round(((p.sellingPrice - p.costPrice) / p.sellingPrice) * 100)}% Margin
                    </span>
                  </td>

                  {/* Stock Buckets */}
                  <td className="py-4 px-4 text-center">
                    <p className="text-base font-black text-slate-900">{p.available}</p>
                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                      <span title="On-Hand">OH: {p.onHand}</span>
                      <span>•</span>
                      <span title="Reserved">Res: {p.reserved}</span>
                      {p.damaged ? <span className="text-rose-500 font-bold">• Dmg: {p.damaged}</span> : null}
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setShowBarcodeModal(p)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        title="Print / View Shelf Barcode"
                      >
                        <Barcode className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setShowTransferModal(p);
                          setAdjustmentQty(0);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                      >
                        <ArrowRightLeft className="h-3.5 w-3.5" />
                        Move / Adjust
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Barcode / Shelf Label Modal */}
      {showBarcodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Barcode className="h-5 w-5 text-blue-600" />
                Shelf Label & Barcode
              </h3>
              <button
                onClick={() => setShowBarcodeModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Simulated Shelf Label Preview */}
            <div className="mt-4 p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-center">
              <div className="border border-slate-900 bg-white p-4 rounded-lg shadow-sm text-slate-900 text-left">
                <div className="flex items-start justify-between border-b border-slate-800 pb-2">
                  <div>
                    <p className="font-black text-sm uppercase tracking-wider">{showBarcodeModal.brand}</p>
                    <p className="font-bold text-xs text-slate-800 leading-tight mt-0.5">{showBarcodeModal.name}</p>
                  </div>
                  <span className="text-[10px] font-black border border-slate-900 px-1 py-0.5">
                    {showBarcodeModal.ageGrading}
                  </span>
                </div>

                {/* Simulated SVG Barcode Lines */}
                <div className="my-3 py-2 bg-slate-50 border border-slate-200 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-[2px] h-12 w-full max-w-[240px] justify-center">
                    {Array.from({ length: 42 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-full bg-slate-950 ${i % 3 === 0 ? 'w-1' : i % 5 === 0 ? 'w-1.5' : 'w-[2px]'}`}
                      />
                    ))}
                  </div>
                  <p className="font-mono text-xs font-bold tracking-widest mt-1">
                    {showBarcodeModal.barcode}
                  </p>
                </div>

                <div className="grid grid-cols-2 text-[10px] text-slate-700 pt-2 border-t border-slate-800">
                  <div>
                    <p>SKU: <span className="font-bold">{showBarcodeModal.sku}</span></p>
                    <p>BIS: <span className="font-bold">{showBarcodeModal.bisRegistrationNumber}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black">MRP: ₹{showBarcodeModal.sellingPrice}</p>
                    <p className="text-[9px] text-slate-500">Incl. of all taxes</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowBarcodeModal(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Sending print command to Zebra Thermal Printer for SKU: ${showBarcodeModal.sku}`);
                  setShowBarcodeModal(null);
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md flex items-center gap-1.5"
              >
                <Printer className="h-4 w-4" />
                Print 4x2" Label
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Transfer & Adjustment Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-blue-600" />
                Transfer or Adjust: {showTransferModal.sku}
              </h3>
              <button
                onClick={() => setShowTransferModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {actionFeedback && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <Check className="h-4 w-4" /> {actionFeedback}
              </div>
            )}

            <div className="mt-4 space-y-6">
              {/* Option 1: Inter-bin Transfer */}
              <form onSubmit={handleTransfer} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-xs uppercase text-slate-700 tracking-wider">
                  Option 1: Bin-to-Bin Stock Relocation
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-500 mb-1">Target Bin</label>
                    <select
                      value={toLoc}
                      onChange={(e) => setToLoc(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white font-mono"
                    >
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.code}>
                          {loc.code} ({loc.zone})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      max={showTransferModal.available}
                      value={transferQty}
                      onChange={(e) => setTransferQty(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Confirm Bin Transfer
                </button>
              </form>

              {/* Option 2: Physical Count Adjustment */}
              <form onSubmit={handleAdjust} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-xs uppercase text-slate-700 tracking-wider">
                  Option 2: Physical Count Audit Correction
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-500 mb-1">Delta (+ / -)</label>
                    <input
                      type="number"
                      value={adjustmentQty}
                      onChange={(e) => setAdjustmentQty(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      placeholder="e.g. +5 or -2"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Audit Reason</label>
                    <select
                      value={adjustmentReason}
                      onChange={(e) => setAdjustmentReason(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="COUNT_CORRECTION">Cycle Count Discrepancy</option>
                      <option value="FOUND">Found in Aisle/Lost Found</option>
                      <option value="DAMAGE">Damaged Packaging / Broken</option>
                      <option value="LOSS">Shrinkage / Missing</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Write Adjustment to Immutable Ledger
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
