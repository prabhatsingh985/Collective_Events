'use client';

import React, { useState } from 'react';
import { useWms } from '../../context/WmsContext';
import {
  ShoppingCart,
  Search,
  Filter,
  Truck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  PackageCheck,
  SendHorizontal,
} from 'lucide-react';
import { Order } from '../../lib/types';
import Link from 'next/link';

export default function OrdersPage() {
  const { orders } = useWms();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0]);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' ? true : o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-blue-600" />
            Omnichannel Outbound Orders & Fulfillment
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time fulfillment stream across D2C Web, Amazon Marketplace, Quick Commerce, and B2B Wholesale.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/picking"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5"
          >
            Start Wave Pick
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order #, Customer, City..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'PENDING', 'PICKING', 'PACKED', 'SHIPPED', 'RTO'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List & Selected Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Orders Table */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Order # & Channel</th>
                  <th className="py-3.5 px-4">Customer & Location</th>
                  <th className="py-3.5 px-4 text-center">Amount</th>
                  <th className="py-3.5 px-4 text-center">SLA Clock</th>
                  <th className="py-3.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((ord) => {
                  const isSelected = selectedOrder?.id === ord.id;
                  return (
                    <tr
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/70' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="py-4 px-4">
                        <p className="font-mono font-bold text-slate-900 text-xs sm:text-sm">{ord.orderNumber}</p>
                        <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {ord.channel}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <p className="font-semibold text-slate-800">{ord.customerName}</p>
                        <p className="text-[11px] text-slate-500">
                          {ord.city}, {ord.state} ({ord.pincode})
                        </p>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <p className="font-bold text-slate-900">₹{ord.totalAmount.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-slate-400">{ord.itemsCount} Items</p>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-600 font-medium">
                          <Clock className="h-3.5 w-3.5 text-amber-500" />
                          <span>{ord.slaHoursRemaining}h left</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            ord.status === 'SHIPPED'
                              ? 'bg-blue-100 text-blue-700'
                              : ord.status === 'PACKED'
                              ? 'bg-purple-100 text-purple-700'
                              : ord.status === 'RTO'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Order Detail Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          {selectedOrder ? (
            <div className="space-y-4 text-xs">
              <div className="pb-3 border-b border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Order Details</span>
                <p className="text-xl font-mono font-black text-slate-900 mt-0.5">{selectedOrder.orderNumber}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {selectedOrder.channel}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Recipient & Delivery</p>
                <p className="font-bold text-slate-900">{selectedOrder.customerName}</p>
                <p className="text-slate-600">
                  {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}
                </p>
                <p className="text-[10px] text-slate-400">Country: India</p>
              </div>

              {/* Courier & AWB */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Logistics & Courier</p>
                {selectedOrder.courier ? (
                  <>
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Truck className="h-3.5 w-3.5 text-blue-600" />
                      {selectedOrder.courier}
                    </p>
                    <p className="font-mono text-slate-600 font-semibold">
                      AWB: {selectedOrder.awbNumber}
                    </p>
                  </>
                ) : (
                  <p className="text-slate-400 italic">No courier assigned yet. Pending packing completion.</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Link
                  href="/packing"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <PackageCheck className="h-4 w-4" />
                  Proceed to Packing Station
                </Link>
                <Link
                  href="/shipping"
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <SendHorizontal className="h-4 w-4" />
                  Open Courier Dispatch Desk
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-8 text-center">Select an order to inspect.</p>
          )}
        </div>
      </div>
    </div>
  );
}
