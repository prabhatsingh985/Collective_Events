'use client';

import React, { useState } from 'react';
import { useWms } from '../../context/WmsContext';
import {
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Boxes,
  Truck,
  ShieldAlert,
} from 'lucide-react';
import { Order } from '../../lib/types';

export default function ReturnsPage() {
  const { orders, triageReturn } = useWms();
  const [feedback, setFeedback] = useState<string | null>(null);

  const rtoOrders = orders.filter((o) => o.status === 'RTO');

  const handleTriage = (orderId: string, action: 'RESTOCK' | 'SCRAP') => {
    const res = triageReturn(orderId, action);
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <RotateCcw className="h-6 w-6 text-blue-600" />
            Customer Returns & Courier RTO Quarantine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Reverse logistics triage: Grade returned toys, restock sealed boxes, and scrap unsealed/damaged packages.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
          Pending RTO Triage: {rtoOrders.length} packages
        </span>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* RTO Queue Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rtoOrders.length > 0 ? (
          rtoOrders.map((ord) => (
            <div
              key={ord.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-sm text-slate-900">{ord.orderNumber}</span>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">AWB: {ord.awbNumber}</p>
                </div>

                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  RTO Received
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <p className="font-semibold text-slate-800">Customer: {ord.customerName}</p>
                <p className="text-slate-500">
                  {ord.city}, {ord.state} ({ord.pincode})
                </p>
                <div className="pt-1 flex items-center gap-2 text-rose-600 text-[11px] font-medium">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Reason: Delivery Attempt Failed (Customer phone unreachable 3x)
                </div>
              </div>

              {/* Triage Decision Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  onClick={() => handleTriage(ord.id, 'SCRAP')}
                  className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Reject / Scrap
                </button>

                <button
                  onClick={() => handleTriage(ord.id, 'RESTOCK')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Boxes className="h-3.5 w-3.5" />
                  Verified Sealed - Restock
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-12 text-center rounded-2xl border border-dashed border-slate-200 bg-white">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
            <h3 className="font-bold text-sm text-slate-800">Quarantine Clean</h3>
            <p className="text-xs text-slate-400 mt-1">All reverse packages have been triaged.</p>
          </div>
        )}
      </div>
    </div>
  );
}
