'use client';

import React, { useState } from 'react';
import { useWms } from '../../context/WmsContext';
import {
  Truck,
  SendHorizontal,
  Barcode,
  Search,
  ExternalLink,
  MapPin,
  Clock,
  Printer,
  X,
  CheckCircle2,
} from 'lucide-react';
import { Order } from '../../lib/types';

export default function ShippingPage() {
  const { orders } = useWms();
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const shippedOrders = orders.filter((o) => o.status === 'SHIPPED' || o.courier);

  const filtered = shippedOrders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      (o.awbNumber && o.awbNumber.toLowerCase().includes(search.toLowerCase())) ||
      o.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Truck className="h-6 w-6 text-blue-600" />
            Courier Dispatch Desk & Logistics Manifest
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Integrated courier dispatch with Delhivery Surface, BlueDart Air, and XpressBees APIs.
          </p>
        </div>

        <button
          onClick={() => alert('Generating Daily Dispatch Handover Manifest for courier pickup handover...')}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Printer className="h-4 w-4" />
          Print Daily Handover Manifest
        </button>
      </div>

      {/* Courier Partner Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-900 text-sm">Delhivery Surface</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Surface Express Logistics (Pan-India)</p>
          <div className="mt-3 flex justify-between items-center text-xs">
            <span className="text-slate-400">Cut-off: 18:30 IST</span>
            <span className="font-bold text-blue-600">SLA 98.4%</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-900 text-sm">BlueDart Air Apex</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Priority Air Freight (Metro Cities)</p>
          <div className="mt-3 flex justify-between items-center text-xs">
            <span className="text-slate-400">Cut-off: 20:00 IST</span>
            <span className="font-bold text-blue-600">SLA 99.1%</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-900 text-sm">XpressBees E-Com</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Regional Ground Fulfillment</p>
          <div className="mt-3 flex justify-between items-center text-xs">
            <span className="text-slate-400">Cut-off: 17:00 IST</span>
            <span className="font-bold text-blue-600">SLA 96.8%</span>
          </div>
        </div>
      </div>

      {/* Dispatches Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by Order #, AWB, Recipient..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <span className="text-xs text-slate-400 font-medium">
            {filtered.length} packages dispatched today
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Order # & AWB</th>
                <th className="py-3.5 px-4">Courier Partner</th>
                <th className="py-3.5 px-4">Destination Pincode</th>
                <th className="py-3.5 px-4">Recipient</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-4">
                    <p className="font-mono font-bold text-slate-900">{ord.orderNumber}</p>
                    <p className="font-mono text-[11px] text-blue-600 font-semibold mt-0.5">
                      AWB: {ord.awbNumber || 'PENDING-GEN'}
                    </p>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-semibold text-slate-800">{ord.courier || 'Delhivery Surface'}</span>
                    <span className="block text-[10px] text-slate-400">Pre-Paid Manifest</span>
                  </td>

                  <td className="py-4 px-4 font-mono font-semibold text-slate-700">
                    {ord.pincode} ({ord.city})
                  </td>

                  <td className="py-4 px-4">
                    <p className="font-semibold text-slate-800">{ord.customerName}</p>
                    <p className="text-[11px] text-slate-400">{ord.state}</p>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-[11px] inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Barcode className="h-3.5 w-3.5 text-blue-600" />
                      View Shipping Label
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shipping Label Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Barcode className="h-5 w-5 text-blue-600" />
                Shipping Label Preview
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Indian Format Shipping Label Mockup */}
            <div className="mt-4 p-4 border-2 border-slate-900 rounded-xl bg-white text-slate-900 font-mono text-xs space-y-3">
              <div className="flex justify-between items-center border-b-2 border-slate-900 pb-2">
                <div>
                  <p className="font-black text-sm">{selectedOrder.courier || 'DELHIVERY EXPRESS'}</p>
                  <p className="text-[10px]">ROUTING: BLR/HYD/MUM</p>
                </div>
                <div className="text-right">
                  <span className="font-black text-sm border-2 border-slate-900 px-2 py-0.5">PREPAID</span>
                </div>
              </div>

              {/* Barcode Mockup */}
              <div className="py-2 text-center bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-center gap-[2px] h-10 w-full">
                  {Array.from({ length: 38 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-full bg-slate-950 ${i % 2 === 0 ? 'w-[3px]' : 'w-[1.5px]'}`}
                    />
                  ))}
                </div>
                <p className="text-xs font-black tracking-widest mt-1">
                  AWB: {selectedOrder.awbNumber || 'DEL-284910284'}
                </p>
              </div>

              {/* Ship To Address */}
              <div className="border-t border-b border-slate-900 py-2 text-[11px] leading-tight space-y-0.5">
                <p className="font-bold">SHIP TO:</p>
                <p className="font-bold text-xs">{selectedOrder.customerName}</p>
                <p>{selectedOrder.city}, {selectedOrder.state}</p>
                <p className="font-black text-sm">PIN: {selectedOrder.pincode}</p>
              </div>

              {/* Shipper Origin Address */}
              <div className="text-[10px] text-slate-600 leading-tight">
                <p className="font-bold text-slate-900">RETURN/SHIPPER ADDRESS:</p>
                <p>KhelWMS Toy Fulfillment Center (BLR-TOY-DC-01)</p>
                <p>Plot 42, Electronic City Ph-2, Bengaluru 560100</p>
                <p>GSTIN: 29AABCU9603R1ZX</p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Sending command to Thermal Label Printer for AWB #${selectedOrder.awbNumber}`);
                  setSelectedOrder(null);
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md flex items-center gap-1.5"
              >
                <Printer className="h-4 w-4" />
                Print 4x6" Thermal AWB
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
