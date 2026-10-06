'use client';

import React, { useState } from 'react';
import { useWms } from '../../context/WmsContext';
import {
  ArrowDownToLine,
  FileCheck2,
  ShieldCheck,
  Building,
  Calendar,
  CheckCircle2,
  AlertCircle,
  X,
  PackageCheck,
  Plus,
} from 'lucide-react';
import { PurchaseOrder } from '../../lib/types';

export default function InboundPage() {
  const { purchaseOrders, receiveGRN } = useWms();
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [showGRNModal, setShowGRNModal] = useState<PurchaseOrder | null>(null);

  // GRN Form State
  const [acceptedQty, setAcceptedQty] = useState(100);
  const [rejectedQty, setRejectedQty] = useState(2);
  const [qcNotes, setQcNotes] = useState('All cartons inspected. 2 units rejected for torn packaging.');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleGRNSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showGRNModal) return;
    const res = receiveGRN(showGRNModal.id, acceptedQty, rejectedQty);
    setFeedback(res.message);
    setTimeout(() => {
      setFeedback(null);
      setShowGRNModal(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ArrowDownToLine className="h-6 w-6 text-blue-600" />
            Inbound Procurement, GRN & QC Lab
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Supplier Goods Receipt Notes (GRN) with mandatory Bureau of Indian Standards (BIS) gatekeeping inspection.
          </p>
        </div>

        <button
          onClick={() => alert('New Purchase Order creation wizard: Select Indian toy supplier, configure HSN 95030030 tax slabs & set expected arrival.')}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Create Purchase Order
        </button>
      </div>

      {/* PO Cards / Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-sm text-slate-900">Purchase Orders In Pipeline</h2>
              <span className="text-xs text-slate-400">{purchaseOrders.length} active orders</span>
            </div>

            <div className="divide-y divide-slate-100">
              {purchaseOrders.map((po) => (
                <div key={po.id} className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900">{po.poNumber}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            po.status === 'RECEIVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : po.status === 'PARTIAL'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {po.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700 mt-1 flex items-center gap-1.5">
                        <Building className="h-3.5 w-3.5 text-slate-400" />
                        {po.supplierName}
                      </p>
                      <p className="text-[11px] font-mono text-slate-400">GSTIN: {po.supplierGstin}</p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-base font-black text-slate-900">₹{po.totalAmount.toLocaleString('en-IN')}</p>
                      <p className="text-[11px] text-slate-400 flex sm:justify-end items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3" /> Due: {po.expectedDate}
                      </p>
                    </div>
                  </div>

                  {/* Line Items */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 space-y-1.5">
                    {po.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <div>
                          <span className="font-semibold text-slate-800">{it.productName}</span>
                          <span className="font-mono text-[10px] text-slate-400 ml-1.5">({it.sku})</span>
                        </div>
                        <div className="text-right font-medium text-slate-600">
                          {it.receivedQty}/{it.orderedQty} recvd @ ₹{it.unitPrice}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action row */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    {po.status !== 'RECEIVED' ? (
                      <button
                        onClick={() => {
                          setShowGRNModal(po);
                          setAcceptedQty(po.items[0]?.orderedQty || 50);
                          setRejectedQty(0);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                      >
                        <FileCheck2 className="h-3.5 w-3.5" />
                        Receive & Generate GRN
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> GRN Completed & Stock Stored
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: BIS QC Standard Guide */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-3">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              BIS Inbound Quality Gate Checklist
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Every shipment must pass mandatory checks before generating the Goods Receipt Note (GRN):
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-800">1. ISI Mark & License Check</p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Confirm 7-digit CM/L number is legibly embossed on each retail pack.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-800">2. Physical Drop & Sharp Edge (IS 9873-1)</p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Verify no sharp points, detachable chokable parts (especially for &lt;36 months age grade).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-800">3. Non-Toxic Material Audit (IS 9873-3)</p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Certify heavy metals (Lead, Cadmium, Phthalates) are within safety thresholds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GRN & QC Receive Modal */}
      {showGRNModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <PackageCheck className="h-5 w-5 text-blue-600" />
                GRN Inbound QC: {showGRNModal.poNumber}
              </h3>
              <button
                onClick={() => setShowGRNModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {feedback && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> {feedback}
              </div>
            )}

            <form onSubmit={handleGRNSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Supplier</label>
                <input
                  type="text"
                  disabled
                  value={showGRNModal.supplierName}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">QC Passed (Good Units)</label>
                  <input
                    type="number"
                    min="0"
                    value={acceptedQty}
                    onChange={(e) => setAcceptedQty(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-900"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Moves to Putaway Task Queue</p>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">QC Rejected / Defective</label>
                  <input
                    type="number"
                    min="0"
                    value={rejectedQty}
                    onChange={(e) => setRejectedQty(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold text-rose-600"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Quarantined for Supplier RTV</p>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Inspector Notes</label>
                <textarea
                  rows={3}
                  value={qcNotes}
                  onChange={(e) => setQcNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  placeholder="Record packaging conditions, ISI stamp verification..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowGRNModal(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md transition-colors"
                >
                  Generate GRN & Create Putaway Tasks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
