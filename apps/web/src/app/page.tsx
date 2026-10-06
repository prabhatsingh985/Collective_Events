'use client';

import React from 'react';
import Link from 'next/link';
import { useWms } from '../context/WmsContext';
import {
  Boxes,
  TrendingUp,
  AlertTriangle,
  Truck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Building,
  QrCode,
  PackagePlus,
  SendHorizontal,
} from 'lucide-react';

export default function DashboardPage() {
  const { products, orders, pickTasks, alerts, auditLogs, currentUser } = useWms();

  // Metrics calculation
  const totalUnitsOnHand = products.reduce((sum, p) => sum + p.onHand, 0);
  const totalValuationCost = products.reduce((sum, p) => sum + p.onHand * p.costPrice, 0);
  const totalValuationRetail = products.reduce((sum, p) => sum + p.onHand * p.sellingPrice, 0);
  const nonCompliantCount = products.filter((p) => !p.isBisCompliant).length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING' || o.status === 'PICKING').length;
  const shippedOrdersCount = orders.filter((o) => o.status === 'SHIPPED' || o.status === 'DELIVERED').length;
  const slaAdherenceRate = Math.round((shippedOrdersCount / Math.max(orders.length, 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 p-6 rounded-2xl text-white shadow-xl shadow-slate-900/10 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1 text-blue-400 font-semibold text-xs tracking-wider uppercase">
            <Building className="h-4 w-4" />
            <span>Bangalore Central DC • BLR-TOY-DC-01</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
            Namaste, {currentUser.name} 👋
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Real-time Toy Warehouse Operations Hub with integrated BIS safety audits, GST taxation, S-Curve picking sequence, and automated courier routing.
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <Link
            href="/picking"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-xs text-white shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02]"
          >
            <QrCode className="h-4 w-4" />
            <span>Launch Wave Pick</span>
          </Link>
          <Link
            href="/inbound"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md font-semibold text-xs text-white border border-white/20 transition-all hover:scale-[1.02]"
          >
            <PackagePlus className="h-4 w-4" />
            <span>Receive Goods</span>
          </Link>
          <Link
            href="/shipping"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 font-semibold text-xs text-slate-950 shadow-md transition-all hover:scale-[1.02]"
          >
            <SendHorizontal className="h-4 w-4" />
            <span>Shipment Dispatch</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Inventory Valuation */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inventory Valuation</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              ₹{(totalValuationCost / 100000).toFixed(2)} Lakh
            </p>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1.5">
              <span>Retail Value: ₹{(totalValuationRetail / 100000).toFixed(2)}L</span>
              <span className="font-semibold text-emerald-600">54% Margin</span>
            </div>
          </div>
        </div>

        {/* Card 2: On-Hand Physical Stock */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">On-Hand Stock</span>
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Boxes className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              {totalUnitsOnHand.toLocaleString('en-IN')} Units
            </p>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1.5">
              <span>Across {products.length} Active SKUs</span>
              <span className="font-semibold text-blue-600">88% In Storage</span>
            </div>
          </div>
        </div>

        {/* Card 3: SLA & Orders Queue */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fulfillment SLA</span>
            <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              {slaAdherenceRate}%
            </p>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1.5">
              <span>{pendingOrdersCount} Orders Pending</span>
              <span className="font-semibold text-indigo-600">Avg. 4.2h SLA</span>
            </div>
          </div>
        </div>

        {/* Card 4: BIS Toy Safety Audit */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">BIS Safety Audit</span>
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${
              nonCompliantCount === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}>
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <p className="text-2xl font-black text-slate-900 tracking-tight">
                {products.length - nonCompliantCount}/{products.length}
              </p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                nonCompliantCount === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {nonCompliantCount === 0 ? '100% PASS' : `${nonCompliantCount} AUDIT FLAG`}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              IS 9873 (Parts 1, 2, 3) Compliant
            </p>
          </div>
        </div>
      </div>

      {/* Critical Operational Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Wave Picks & Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Wave Pick Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <QrCode className="h-4 w-4 text-blue-600" />
                  Wave Pick Tasks (S-Curve Route Optimized)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pre-sequenced by aisle traversal for minimum picker walking distance
                </p>
              </div>
              <Link href="/picking" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                Open Scanner <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-2.5">Seq</th>
                    <th className="pb-2.5">Bin Code</th>
                    <th className="pb-2.5">SKU & Toy Name</th>
                    <th className="pb-2.5 text-center">Qty</th>
                    <th className="pb-2.5">Order #</th>
                    <th className="pb-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pickTasks.slice(0, 4).map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 font-mono font-bold text-blue-600">#{task.routeSequence}</td>
                      <td className="py-3 font-mono font-semibold text-slate-900">
                        <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200">
                          {task.locationCode}
                        </span>
                      </td>
                      <td className="py-3 max-w-xs">
                        <p className="font-semibold text-slate-800 truncate">{task.productName}</p>
                        <p className="text-[11px] font-mono text-slate-400">{task.sku}</p>
                      </td>
                      <td className="py-3 text-center font-bold text-slate-900">{task.quantity}</td>
                      <td className="py-3 font-mono text-slate-600">{task.orderNumber}</td>
                      <td className="py-3 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            task.status === 'PICKED'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-800 animate-pulse'
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Outbound Orders Queue */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-indigo-600" />
                  Active Outbound Orders
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Omnichannel orders across Shopify, Amazon, and B2B Retail (Hamleys/FirstCry)
                </p>
              </div>
              <Link href="/orders" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                View All <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {orders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">{order.orderNumber}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700">
                        {order.channel.replace('B2C_', '').replace('B2B_', '')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {order.customerName} • {order.city}, {order.state} ({order.pincode})
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 text-xs">
                    <div className="text-right">
                      <p className="font-bold text-slate-900">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                      <p className="text-[11px] text-slate-400">{order.itemsCount} Items</p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        order.status === 'SHIPPED'
                          ? 'bg-blue-100 text-blue-700'
                          : order.status === 'PACKED'
                          ? 'bg-purple-100 text-purple-700'
                          : order.status === 'RTO'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Alerts & Real-time Audit Trail */}
        <div className="space-y-6">
          {/* Active Alerts Box */}
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50/70 to-white p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Priority Warehouse Alerts ({alerts.length})
            </h2>
            <div className="space-y-3">
              {alerts.map((alt) => (
                <div key={alt.id} className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-xs">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        alt.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {alt.type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400">{alt.timestamp}</span>
                  </div>
                  <p className="font-semibold text-slate-900 mt-1.5">{alt.title}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">{alt.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Immutable Audit Log Stream */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Live Audit Trail
              </h2>
              <Link href="/audit" className="text-xs text-blue-600 hover:underline">
                View Ledger
              </Link>
            </div>

            <div className="space-y-3">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="text-xs pb-3 border-b border-slate-100 last:border-none last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-[10px] text-blue-600 px-1.5 py-0.5 rounded bg-blue-50">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {log.timestamp.split(' ')[1] || log.timestamp}
                    </span>
                  </div>
                  <p className="text-slate-700 text-xs mt-1 leading-snug">{log.details}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    by {log.userName} ({log.userRole})
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
