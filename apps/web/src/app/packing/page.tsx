'use client';

import React, { useState } from 'react';
import { useWms } from '../../context/WmsContext';
import {
  PackageCheck,
  Box,
  Scale,
  Printer,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';
import { Order } from '../../lib/types';
import Link from 'next/link';

export default function PackingPage() {
  const { orders, packaging, packAndShipOrder } = useWms();

  const packableOrders = orders.filter((o) => o.status === 'PICKED' || o.status === 'PACKED');
  const [selectedOrder, setSelectedOrder] = useState<Order>(packableOrders[0] || orders[0]);
  const [selectedBox, setSelectedBox] = useState(packaging[1]?.code || 'BOX-MEDIUM');
  const [actualWeightKg, setActualWeightKg] = useState(1.4);
  const [courierName, setCourierName] = useState('Delhivery Surface');
  const [dispatchResult, setDispatchResult] = useState<{ awb: string; msg: string } | null>(null);

  const currentBoxObj = packaging.find((b) => b.code === selectedBox) || packaging[0];

  // Volumetric Weight calculation: (L * W * H) / 5000 (Indian courier standard)
  const volumetricWeightKg = Number(
    ((currentBoxObj.lengthCm * currentBoxObj.widthCm * currentBoxObj.heightCm) / 5000).toFixed(2)
  );

  const chargeableWeightKg = Math.max(actualWeightKg, volumetricWeightKg);

  const handlePackAndDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    const res = packAndShipOrder(selectedOrder.id, selectedBox, courierName);
    if (res.success) {
      setDispatchResult({ awb: res.awb, msg: res.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <PackageCheck className="h-6 w-6 text-blue-600" />
            Packing Station & Volumetric Optimization
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Corrugated carton sizing, dead-weight vs volumetric freight calculator (Divisor 5000), and automated packing slip generation.
          </p>
        </div>

        <Link
          href="/shipping"
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
        >
          Courier Dispatch Desk <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Orders Ready for Packing */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Box className="h-4 w-4 text-blue-600" />
              Packing Table Queue
            </h2>
            <span className="text-xs text-slate-400">{packableOrders.length} orders ready</span>
          </div>

          <div className="space-y-2.5">
            {packableOrders.map((ord) => {
              const isSelected = selectedOrder?.id === ord.id;
              return (
                <div
                  key={ord.id}
                  onClick={() => {
                    setSelectedOrder(ord);
                    setDispatchResult(null);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-slate-900">{ord.orderNumber}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ord.status === 'PACKED'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>

                  <p className="font-semibold text-xs text-slate-800 mt-1.5">
                    {ord.customerName} • {ord.city} ({ord.pincode})
                  </p>

                  <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1">
                    <span>{ord.itemsCount} Toys</span>
                    <span className="font-bold text-slate-900">₹{ord.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Box Selection & Volumetric Calculator */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Scale className="h-4 w-4 text-blue-600" />
              Box Sizer & Freight Calculator
            </h2>
            <span className="text-xs font-mono text-slate-400">Order: {selectedOrder?.orderNumber}</span>
          </div>

          {dispatchResult && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Package Sealed & AWB Generated!
              </p>
              <p className="font-mono text-xs">Tracking AWB: <strong>{dispatchResult.awb}</strong></p>
              <p className="text-slate-600">{dispatchResult.msg}</p>
            </div>
          )}

          <form onSubmit={handlePackAndDispatch} className="space-y-5 text-xs">
            {/* Box Selection Radio Cards */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                1. Select Packaging Carton / Mailer
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {packaging.map((box) => (
                  <div
                    key={box.id}
                    onClick={() => setSelectedBox(box.code)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedBox === box.code
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{box.code}</span>
                      <span className="text-[10px] text-slate-500">₹{box.unitCost}/box</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{box.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {box.lengthCm} × {box.widthCm} × {box.heightCm} cm • Max {box.maxWeightKg}kg
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Weighing Scale Input */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Scale Dead Weight (kg)</label>
                <input
                  type="number"
                  step="0.05"
                  min="0.1"
                  value={actualWeightKg}
                  onChange={(e) => setActualWeightKg(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-mono font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Volumetric Weight (kg)</label>
                <input
                  type="text"
                  disabled
                  value={`${volumetricWeightKg} kg`}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 font-mono font-bold text-slate-700"
                />
                <p className="text-[10px] text-slate-400 mt-1">(L×W×H)/5000</p>
              </div>
            </div>

            {/* Freight Chargeable Comparison Alert */}
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>
                  Billable Freight Weight: <strong>{chargeableWeightKg} kg</strong> (
                  {chargeableWeightKg === volumetricWeightKg ? 'Volumetric rule applies' : 'Dead weight rule applies'}
                  )
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-200 text-indigo-800">
                Divisor 5000
              </span>
            </div>

            {/* Courier Choice */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Courier Partner</label>
              <select
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800"
              >
                <option value="Delhivery Surface">Delhivery Surface Express (Surface Logistics)</option>
                <option value="BlueDart Air">BlueDart Express Apex (Priority Air Freight)</option>
                <option value="XpressBees E-Com">XpressBees E-Commerce (Regional Ground)</option>
              </select>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => alert(`Printing standard packing slip for Order #${selectedOrder?.orderNumber}`)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold flex items-center gap-1.5"
              >
                <Printer className="h-4 w-4" />
                Print Packing Slip
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-transform hover:scale-[1.01]"
              >
                <CheckCircle2 className="h-4 w-4" />
                Seal Box & Dispatch
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
