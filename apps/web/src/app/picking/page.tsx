'use client';

import React, { useState } from 'react';
import { useWms } from '../../context/WmsContext';
import {
  QrCode,
  Barcode,
  MapPin,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Compass,
} from 'lucide-react';
import { PickTask } from '../../lib/types';

export default function PickingPage() {
  const { pickTasks, products, confirmPickTask } = useWms();

  const [activeTask, setActiveTask] = useState<PickTask>(
    pickTasks.find((t) => t.status === 'PENDING') || pickTasks[0]
  );
  const [scannedProductBarcode, setScannedProductBarcode] = useState('');
  const [scannedLocBarcode, setScannedLocBarcode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const activeProduct = products.find((p) => p.sku === activeTask?.sku);

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    const result = confirmPickTask(activeTask.id, scannedProductBarcode, scannedLocBarcode);

    if (result.success) {
      setSuccessMsg(result.message);
      setScannedProductBarcode('');
      setScannedLocBarcode('');

      // Auto-advance to next pending task
      const nextPending = pickTasks.find(
        (t) => t.status === 'PENDING' && t.id !== activeTask.id
      );
      if (nextPending) {
        setTimeout(() => {
          setActiveTask(nextPending);
          setSuccessMsg(null);
        }, 1200);
      }
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleSimulateCorrectScan = () => {
    if (!activeProduct || !activeTask) return;
    setScannedProductBarcode(activeProduct.barcode);
    setScannedLocBarcode(activeTask.locationCode);
  };

  const handleSimulateWrongScan = () => {
    setScannedProductBarcode('WRONG-BARCODE-999');
    setScannedLocBarcode('LOC-WRONG-BIN');
  };

  const pendingCount = pickTasks.filter((t) => t.status === 'PENDING').length;
  const completedCount = pickTasks.filter((t) => t.status === 'PICKED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <QrCode className="h-6 w-6 text-blue-600" />
            Scan-First Wave Picking (S-Curve Routing)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Barcode-verified picker terminal. Eliminates wrong SKU shipments via double-scan verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            Pending: {pendingCount}
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            Picked: {completedCount}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Wave Pick Route Sequence List */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Compass className="h-4 w-4 text-blue-600" />
              S-Curve Pick Path Sequence
            </h2>
            <span className="text-xs font-mono text-slate-400">Wave #PL-2026-101</span>
          </div>

          <div className="space-y-2.5">
            {pickTasks.map((task) => {
              const isSelected = activeTask?.id === task.id;
              const isDone = task.status === 'PICKED';

              return (
                <div
                  key={task.id}
                  onClick={() => {
                    setActiveTask(task);
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-500/20'
                      : isDone
                      ? 'border-slate-200 bg-emerald-50/40 opacity-70'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-white border border-slate-200 text-blue-700">
                        Step #{task.routeSequence}
                      </span>
                      <span className="font-mono font-bold text-xs text-slate-900 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {task.locationCode}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <p className="font-semibold text-xs text-slate-800 mt-2 line-clamp-1">
                    {task.productName}
                  </p>

                  <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1">
                    <span className="font-mono">{task.sku}</span>
                    <span className="font-bold text-slate-900">Qty: {task.quantity} pcs</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Handheld Barcode Scanner Terminal UI */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Barcode className="h-4 w-4 text-blue-600" />
              Rugged Scanner Emulation Console
            </h2>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Double-Scan Locked
            </span>
          </div>

          {activeTask ? (
            <div className="space-y-6">
              {/* Target Location & SKU Showcase */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-lg space-y-3">
                <div className="flex items-center justify-between text-xs text-blue-300">
                  <span>Current Pick Stop</span>
                  <span className="font-mono font-bold">Route Step #{activeTask.routeSequence}</span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-mono font-black tracking-tight text-white">
                    {activeTask.locationCode}
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    Pick <strong className="text-amber-400 text-base">{activeTask.quantity}</strong> units
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <p className="font-bold text-sm text-slate-100 leading-snug">{activeTask.productName}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-1">
                    <span>SKU: {activeTask.sku}</span>
                    <span>•</span>
                    <span>Order: {activeTask.orderNumber}</span>
                  </div>
                </div>
              </div>

              {/* Status Notifications */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5 animate-shake">
                  <AlertOctagon className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Scan Verification Failed!</p>
                    <p className="text-[11px] font-normal mt-0.5">{errorMsg}</p>
                  </div>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Double-Scan Form */}
              <form onSubmit={handleScanSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    1. Scan Location Bin Barcode
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={scannedLocBarcode}
                      onChange={(e) => setScannedLocBarcode(e.target.value)}
                      placeholder={`Scan bin (e.g. ${activeTask.locationCode})`}
                      className="w-full pl-9 pr-4 py-2.5 font-mono text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    2. Scan Toy Packaging EAN Barcode
                  </label>
                  <div className="relative">
                    <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={scannedProductBarcode}
                      onChange={(e) => setScannedProductBarcode(e.target.value)}
                      placeholder={`Scan product EAN (e.g. ${activeProduct?.barcode})`}
                      className="w-full pl-9 pr-4 py-2.5 font-mono text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Confirm Verified Pick
                </button>
              </form>

              {/* Simulation Quick-Triggers for Testing */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <span className="font-bold text-[11px] text-slate-500 uppercase tracking-wider block">
                  Quick Scanner Test Simulators
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleSimulateCorrectScan}
                    className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Fill Correct Barcodes
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulateWrongScan}
                    className="px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                  >
                    <AlertOctagon className="h-3.5 w-3.5" />
                    Simulate Wrong Barcode (Fail Test)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-12 text-center">No tasks available in wave.</p>
          )}
        </div>
      </div>
    </div>
  );
}
