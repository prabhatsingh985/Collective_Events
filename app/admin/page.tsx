'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useApp } from '@/context/AppContext'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { ShopOrder, OrderFulfillmentStatus } from '@/types'
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Star,
  Users,
  AlertTriangle,
  BarChart,
  Sliders,
  ArrowUp,
  ArrowDown,
  Trash2,
  Package,
  Truck,
  RotateCw,
  QrCode,
  MapPin,
  Clock,
  Printer,
  ChevronRight,
  Zap,
  Flame,
  Check,
  Search,
} from 'lucide-react'

export default function AdminDashboardPage() {
  const {
    events,
    users,
    addToast,
    shopProducts,
    shopOrders,
    updateOrderStatus,
    updateProductStock,
  } = useApp()

  const [adminTab, setAdminTab] = useState<
    'moderation' | 'warehouse' | 'reported' | 'users' | 'curation' | 'analytics'
  >('warehouse') // default to warehouse fulfillment hub for admin

  // WMS Filter State
  const [wmsOrderFilter, setWmsOrderFilter] = useState<string>('ALL')
  const [activeWaveModalOrder, setActiveWaveModalOrder] = useState<ShopOrder | null>(null)
  const [activePackModalOrder, setActivePackModalOrder] = useState<ShopOrder | null>(null)
  const [activeLabelModalOrder, setActiveLabelModalOrder] = useState<ShopOrder | null>(null)

  // Mock Moderation Queue
  const [moderationQueue, setModerationQueue] = useState([
    {
      id: 'mod-1',
      title: 'South Delhi Die-Cast Late Night Paddock',
      organizer: '@delhi_guild',
      category: 'Hot Wheels',
      city: 'Delhi',
      submittedAt: '35 mins ago',
      status: 'pending',
    },
    {
      id: 'mod-2',
      title: 'Bengaluru Champions League Case Break Night',
      organizer: '@bengaluru_cards',
      category: 'Football Cards',
      city: 'Bengaluru',
      submittedAt: '2 hours ago',
      status: 'pending',
    },
  ])

  // Reported items
  const [reportedItems, setReportedItems] = useState([
    {
      id: 'rep-1',
      type: 'Listing Report',
      title: 'Counterfeit Redline Camaro (Faux Bearing Wheels)',
      reportedBy: '@kabir_diecast',
      reason: 'Suspected reproduction casting sold as authentic 1968 Hong Kong original.',
      status: 'review',
    },
  ])

  const handleModerationAction = (id: string, action: 'approved' | 'rejected' | 'featured') => {
    setModerationQueue(moderationQueue.filter((m) => m.id !== id))
    addToast({
      type: action === 'approved' ? 'success' : action === 'featured' ? 'success' : 'info',
      title: `Event ${action.toUpperCase()}! 🛡️`,
      message: `Moderation task has been executed.`,
    })
  }

  // WMS Order Calculations
  const filteredOrders = shopOrders.filter((ord) => {
    if (wmsOrderFilter === 'ALL') return true
    return ord.status === wmsOrderFilter
  })

  const pendingCount = shopOrders.filter((o) => o.status === 'PENDING_ALLOCATION').length
  const allocatedCount = shopOrders.filter((o) => o.status === 'ALLOCATED').length
  const pickingCount = shopOrders.filter((o) => o.status === 'PICKING').length
  const packedCount = shopOrders.filter((o) => o.status === 'PACKED').length
  const dispatchedCount = shopOrders.filter((o) => o.status === 'DISPATCHED').length

  const totalStockUnits = shopProducts.reduce((acc, p) => acc + p.stockCount, 0)

  // Actions for order fulfillment pipeline
  const handleAllocate = (orderId: string) => {
    updateOrderStatus(orderId, 'ALLOCATED', {
      pickWaveId: `WAVE-2026-${Math.floor(100 + Math.random() * 900)}`,
      pickerName: 'Unassigned Picker',
    })
  }

  const handleStartPicking = (order: ShopOrder) => {
    setActiveWaveModalOrder(order)
  }

  const handleConfirmPick = (orderId: string) => {
    updateOrderStatus(orderId, 'PICKING', {
      pickedAt: new Date().toISOString(),
      pickerName: 'S-Curve Route Agent (Aisle 01-03)',
    })
    setActiveWaveModalOrder(null)
  }

  const handleOpenPackModal = (order: ShopOrder) => {
    setActivePackModalOrder(order)
  }

  const handleConfirmPack = (orderId: string, carton: string, weightKg: number) => {
    updateOrderStatus(orderId, 'PACKED', {
      recommendedCarton: carton,
      packedWeightKg: weightKg,
      packedAt: new Date().toISOString(),
    })
    setActivePackModalOrder(null)
  }

  const handleGenerateAwb = (orderId: string) => {
    const courier = 'BlueDart Express'
    const awb = `BD-${Math.floor(100000000 + Math.random() * 900000000)}`
    updateOrderStatus(orderId, 'DISPATCHED', {
      courier,
      trackingAwb: awb,
      dispatchedAt: new Date().toISOString(),
    })
    const updated = shopOrders.find((o) => o.id === orderId)
    if (updated) {
      setActiveLabelModalOrder({
        ...updated,
        status: 'DISPATCHED',
        wms: {
          ...(updated.wms || {}),
          courier,
          trackingAwb: awb,
          dispatchedAt: new Date().toISOString(),
        },
      })
    }
  }

  return (
    <div className="min-h-screen bg-pure-canvas pb-20 select-none">
      {/* Top Header Bar */}
      <div className="bg-sky-periwinkle border-b border-silver/80 pt-10 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="bg-midnight-ink text-pure-canvas p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-card">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-spearmint animate-pulse" />
              <span className="font-bold text-xs uppercase tracking-wider">
                CollectorEvents Internal Administration & WMS Operations
              </span>
              <span className="px-2 py-0.5 bg-pure-canvas/20 rounded-full text-[10px] text-pure-canvas font-mono">
                ROLE: SuperAdmin (WMS Authorized)
              </span>
            </div>
            <div className="text-xs text-ash flex items-center gap-2">
              <span>Signed in as SuperAdmin (Shreyash Srivastava)</span>
              <Link
                href="/shop"
                className="px-2.5 py-1 bg-pure-canvas/10 hover:bg-pure-canvas/20 rounded-lg text-[11px] text-pure-canvas font-semibold transition-colors"
              >
                Go to Shop →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Admin Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-fog/70 border border-silver p-1 rounded-full w-fit">
          {[
            { id: 'warehouse', label: `🏭 Warehouse & Fulfillment WMS (${shopOrders.length})` },
            { id: 'moderation', label: `Moderation Queue (${moderationQueue.length})` },
            { id: 'reported', label: `Flagged Reports (${reportedItems.length})` },
            { id: 'users', label: `User Directory (${users.length})` },
            { id: 'curation', label: 'Homepage Curation' },
            { id: 'analytics', label: 'Platform Telemetry' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                adminTab === tab.id
                  ? 'bg-midnight-ink text-pure-canvas shadow-sm'
                  : 'text-slate hover:text-midnight-ink hover:bg-pure-canvas'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB: WAREHOUSE & FULFILLMENT (WMS) */}
        {adminTab === 'warehouse' && (
          <div className="space-y-8">
            {/* Top WMS KPI Metrics Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              <div className="p-4 bg-pure-canvas rounded-2xl border border-silver/70 shadow-sm space-y-1">
                <span className="text-[10px] font-bold text-slate uppercase tracking-wider block">
                  Active Die-Cast SKUs
                </span>
                <p className="text-2xl font-extrabold text-midnight-ink font-display">
                  {shopProducts.length}
                </p>
                <span className="text-[10px] text-spearmint font-semibold">1:64 Toy Models</span>
              </div>

              <div className="p-4 bg-pure-canvas rounded-2xl border border-silver/70 shadow-sm space-y-1">
                <span className="text-[10px] font-bold text-slate uppercase tracking-wider block">
                  Warehouse Stock Units
                </span>
                <p className="text-2xl font-extrabold text-midnight-ink font-display">
                  {totalStockUnits}
                </p>
                <span className="text-[10px] text-slate font-medium">Bays A-D Active</span>
              </div>

              <div className="p-4 bg-pure-canvas rounded-2xl border border-silver/70 shadow-sm space-y-1">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                  Pending Orders
                </span>
                <p className="text-2xl font-extrabold text-amber-900 font-display">
                  {pendingCount + allocatedCount + pickingCount}
                </p>
                <span className="text-[10px] text-amber-800 font-semibold">Needs Fulfillment</span>
              </div>

              <div className="p-4 bg-pure-canvas rounded-2xl border border-silver/70 shadow-sm space-y-1">
                <span className="text-[10px] font-bold text-spearmint uppercase tracking-wider block">
                  Packed & Ready
                </span>
                <p className="text-2xl font-extrabold text-spearmint font-display">
                  {packedCount}
                </p>
                <span className="text-[10px] text-slate font-medium">Divisor 5000 Verified</span>
              </div>

              <div className="p-4 bg-pure-canvas rounded-2xl border border-silver/70 shadow-sm space-y-1">
                <span className="text-[10px] font-bold text-midnight-blue uppercase tracking-wider block">
                  Dispatched Today
                </span>
                <p className="text-2xl font-extrabold text-midnight-blue font-display">
                  {dispatchedCount}
                </p>
                <span className="text-[10px] text-spearmint font-semibold">BlueDart Express AWB</span>
              </div>
            </div>

            {/* SECTION 1: ORDER FULFILLMENT PIPELINE */}
            <div className="bg-pure-canvas border border-silver rounded-2xl p-6 shadow-card space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-silver/60 pb-4">
                <div>
                  <h3 className="font-extrabold text-lg text-midnight-ink flex items-center gap-2">
                    <span>Store Orders Fulfillment Pipeline</span>
                    <span className="px-2 py-0.5 bg-party-pink/40 text-midnight-ink text-xs font-bold rounded-full">
                      {shopOrders.length} Total Orders
                    </span>
                  </h3>
                  <p className="text-xs text-slate mt-0.5">
                    Orders placed via the customer-facing Hot Wheels shop. Automated S-curve pick routing, carton packing, and courier AWB generation.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto bg-fog/60 p-1 rounded-xl border border-silver/60">
                  {[
                    { id: 'ALL', label: 'All' },
                    { id: 'PENDING_ALLOCATION', label: `Pending (${pendingCount})` },
                    { id: 'ALLOCATED', label: `Allocated (${allocatedCount})` },
                    { id: 'PICKING', label: `Picking (${pickingCount})` },
                    { id: 'PACKED', label: `Packed (${packedCount})` },
                    { id: 'DISPATCHED', label: `Dispatched (${dispatchedCount})` },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setWmsOrderFilter(f.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        wmsOrderFilter === f.id
                          ? 'bg-midnight-ink text-pure-canvas shadow-sm font-bold'
                          : 'text-slate hover:text-midnight-ink'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate space-y-2">
                  <Package className="w-8 h-8 mx-auto text-silver" />
                  <p>No orders currently in this fulfillment stage.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const statusColor =
                      order.status === 'PENDING_ALLOCATION'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : order.status === 'ALLOCATED'
                        ? 'bg-sky-100 text-sky-800 border-sky-300'
                        : order.status === 'PICKING'
                        ? 'bg-purple-100 text-purple-800 border-purple-300'
                        : order.status === 'PACKED'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-spearmint/20 text-spearmint border-spearmint/40'

                    return (
                      <div
                        key={order.id}
                        className="p-5 bg-fog/40 border border-silver rounded-2xl space-y-4 hover:border-slate/50 transition-colors"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-silver/50 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-extrabold text-sm text-midnight-ink">
                              #{order.id}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusColor}`}
                            >
                              {order.status.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-slate">
                              {new Date(order.createdAt).toLocaleDateString()} at{' '}
                              {new Date(order.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-xs text-slate">Total Value:</span>{' '}
                            <span className="font-extrabold text-sm text-midnight-ink font-display">
                              ₹{order.totalAmount}
                            </span>{' '}
                            <span className="text-[10px] text-slate">({order.paymentMethod})</span>
                          </div>
                        </div>

                        {/* Order Details & Items Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Items Column */}
                          <div className="md:col-span-2 space-y-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate block">
                              Ordered Castings ({order.totalItems} items):
                            </span>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-3 p-2 bg-pure-canvas border border-silver/60 rounded-xl text-xs"
                                >
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-10 h-10 object-cover rounded-lg border border-silver shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-bold text-midnight-ink truncate">
                                      {item.title}
                                    </p>
                                    <div className="flex items-center gap-2 text-[11px] text-slate">
                                      <span>Qty: {item.quantity}</span>
                                      <span>·</span>
                                      <span className="font-mono text-midnight-blue font-bold">
                                        Loc: {item.location}
                                      </span>
                                      <span>·</span>
                                      <span>SKU: {item.sku}</span>
                                    </div>
                                  </div>
                                  <span className="font-bold text-midnight-ink">
                                    ₹{item.price * item.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Customer & Shipping Destination */}
                          <div className="p-3.5 bg-pure-canvas border border-silver/60 rounded-xl space-y-2 text-xs">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate block">
                              Consignee & Shipping:
                            </span>
                            <div className="space-y-0.5 text-midnight-ink">
                              <p className="font-bold">{order.customer.name}</p>
                              <p className="text-slate text-[11px]">{order.customer.phone}</p>
                              <p className="text-slate text-[11px]">{order.customer.address}</p>
                              <p className="text-slate text-[11px]">
                                {order.customer.city}, {order.customer.state} -{' '}
                                <strong className="text-midnight-ink">{order.customer.pincode}</strong>
                              </p>
                            </div>

                            {order.wms?.trackingAwb && (
                              <div className="pt-2 border-t border-silver/50">
                                <p className="text-[10px] text-slate">Courier & Tracking AWB:</p>
                                <p className="font-mono font-bold text-spearmint text-xs">
                                  {order.wms.courier} · {order.wms.trackingAwb}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* WMS Pipeline Action Controls */}
                        <div className="pt-3 border-t border-silver/50 flex items-center justify-between gap-3 flex-wrap">
                          <div className="text-xs text-slate flex items-center gap-2">
                            {order.wms?.pickWaveId && (
                              <span className="font-mono font-bold text-[11px] text-midnight-blue bg-sky-periwinkle/30 px-2 py-0.5 rounded">
                                {order.wms.pickWaveId}
                              </span>
                            )}
                            {order.wms?.recommendedCarton && (
                              <span className="text-[11px] bg-fog px-2 py-0.5 rounded border border-silver/60">
                                Box: {order.wms.recommendedCarton}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {order.status === 'PENDING_ALLOCATION' && (
                              <button
                                onClick={() => handleAllocate(order.id)}
                                className="px-4 py-2 bg-midnight-ink text-pure-canvas text-xs font-bold rounded-xl hover:opacity-90 shadow-sm flex items-center gap-1.5"
                              >
                                <Zap className="w-3.5 h-3.5" />
                                <span>Allocate Inventory & Batch</span>
                              </button>
                            )}

                            {order.status === 'ALLOCATED' && (
                              <button
                                onClick={() => handleStartPicking(order)}
                                className="px-4 py-2 bg-midnight-blue text-pure-canvas text-xs font-bold rounded-xl hover:opacity-90 shadow-sm flex items-center gap-1.5"
                              >
                                <Package className="w-3.5 h-3.5" />
                                <span>Start S-Curve Wave Pick</span>
                              </button>
                            )}

                            {order.status === 'PICKING' && (
                              <button
                                onClick={() => handleOpenPackModal(order)}
                                className="px-4 py-2 bg-spearmint text-pure-canvas text-xs font-bold rounded-xl hover:opacity-90 shadow-sm flex items-center gap-1.5"
                              >
                                <Package className="w-3.5 h-3.5" />
                                <span>Pack with Divisor 5000</span>
                              </button>
                            )}

                            {order.status === 'PACKED' && (
                              <button
                                onClick={() => handleGenerateAwb(order.id)}
                                className="px-4 py-2 bg-midnight-ink text-pure-canvas text-xs font-bold rounded-xl hover:opacity-90 shadow-sm flex items-center gap-1.5"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Generate BlueDart AWB & Dispatch</span>
                              </button>
                            )}

                            {order.status === 'DISPATCHED' && (
                              <button
                                onClick={() => setActiveLabelModalOrder(order)}
                                className="px-4 py-2 bg-pure-canvas border border-silver text-midnight-ink text-xs font-bold rounded-xl hover:bg-fog shadow-sm flex items-center gap-1.5"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Print Thermal Shipping Label</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* SECTION 2: WAREHOUSE SKU INVENTORY & BIN LOCATIONS */}
            <div className="bg-pure-canvas border border-silver rounded-2xl p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-silver/60 pb-3">
                <div>
                  <h3 className="font-extrabold text-lg text-midnight-ink">
                    1:64 Scale Die-Cast Bin Locations & Stock
                  </h3>
                  <p className="text-xs text-slate">
                    Physical warehouse layout with AISLE-BAY-SHELF coordinates and BIS safety certification tracking.
                  </p>
                </div>
                <span className="text-xs font-bold text-spearmint">
                  ✓ 100% BIS IS 9873 Compliant
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-silver bg-fog/60 text-slate uppercase text-[10px] font-bold">
                      <th className="p-3">SKU & Image</th>
                      <th className="p-3">1:64 Toy Casting</th>
                      <th className="p-3">Series</th>
                      <th className="p-3">Bin Location</th>
                      <th className="p-3">Stock Units</th>
                      <th className="p-3">BIS Safety Mark</th>
                      <th className="p-3 text-right">Inventory Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-silver/60">
                    {shopProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-fog/30 transition-colors">
                        <td className="p-3 font-mono font-bold text-midnight-ink flex items-center gap-2">
                          <img
                            src={prod.images[0]}
                            alt={prod.title}
                            className="w-8 h-8 rounded object-cover border border-silver shrink-0"
                          />
                          <span>{prod.sku}</span>
                        </td>
                        <td className="p-3 font-semibold text-midnight-ink">
                          {prod.castingName}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-party-pink/30 rounded-full font-bold text-[10px]">
                            {prod.series}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-midnight-blue">
                          {prod.warehouseLocation}
                        </td>
                        <td className="p-3">
                          <span
                            className={`font-bold font-display ${
                              prod.stockCount <= 3 ? 'text-crimson' : 'text-midnight-ink'
                            }`}
                          >
                            {prod.stockCount} in bin
                          </span>
                        </td>
                        <td className="p-3 text-slate text-[11px]">
                          {prod.bisRegistrationNo}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                updateProductStock(prod.id, prod.stockCount + 10)
                                addToast({
                                  type: 'success',
                                  title: 'Stock Updated! 📦',
                                  message: `Restocked 10 units for ${prod.castingName}.`,
                                })
                              }}
                              className="px-2.5 py-1 bg-pure-canvas border border-silver text-xs font-bold rounded hover:bg-fog text-midnight-ink"
                            >
                              +10 Units
                            </button>
                            <button
                              onClick={() => {
                                updateProductStock(prod.id, prod.stockCount + 25)
                                addToast({
                                  type: 'success',
                                  title: 'Restocked Case! 📦',
                                  message: `Added factory case (25 units) to ${prod.castingName}.`,
                                })
                              }}
                              className="px-2.5 py-1 bg-midnight-ink text-pure-canvas text-xs font-bold rounded hover:opacity-90"
                            >
                              +Case (25)
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: MODERATION QUEUE */}
        {adminTab === 'moderation' && (
          <div className="bg-pure-canvas border border-silver rounded-2xl p-6 shadow-card space-y-6">
            <div className="flex items-center justify-between border-b border-silver/60 pb-3">
              <h3 className="font-display font-bold text-base text-midnight-ink">
                Event Publication Review Queue ({moderationQueue.length})
              </h3>
              <span className="text-xs text-slate">SLA Target: &lt; 2 Hours</span>
            </div>

            {moderationQueue.length > 0 ? (
              <div className="space-y-3">
                {moderationQueue.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-fog/50 border border-silver rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="soft-pink" size="sm">
                          {item.category}
                        </Badge>
                        <span className="text-slate text-[11px]">{item.city} · Submitted {item.submittedAt}</span>
                      </div>
                      <h4 className="font-semibold text-sm text-midnight-ink">{item.title}</h4>
                      <p className="text-[11px] text-slate">Host Organizer: {item.organizer}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleModerationAction(item.id, 'featured')}
                        className="px-3 py-1.5 bg-pure-canvas text-midnight-ink border border-silver rounded-lg text-xs font-bold hover:bg-fog flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Star className="w-3.5 h-3.5" /> Feature
                      </button>
                      <button
                        onClick={() => handleModerationAction(item.id, 'approved')}
                        className="px-3 py-1.5 bg-spearmint text-pure-canvas rounded-lg text-xs font-bold hover:opacity-90 flex items-center gap-1.5 transition-opacity shadow-sm"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => handleModerationAction(item.id, 'rejected')}
                        className="px-3 py-1.5 bg-pure-canvas text-crimson border border-silver rounded-lg text-xs font-bold hover:bg-fog flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate text-center py-8">Review queue is empty.</p>
            )}
          </div>
        )}

        {/* TAB 2: FLAGGED REPORTS */}
        {adminTab === 'reported' && (
          <div className="bg-pure-canvas border border-silver rounded-2xl p-6 shadow-card space-y-4">
            <h3 className="font-display font-bold text-base text-midnight-ink border-b border-silver/60 pb-3">
              Flagged Community Reports ({reportedItems.length})
            </h3>
            {reportedItems.map((rep) => (
              <div key={rep.id} className="p-4 bg-fog/40 border border-silver rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-midnight-ink">{rep.title}</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full text-[10px] font-bold">
                    Under Review
                  </span>
                </div>
                <p className="text-xs text-slate">{rep.reason}</p>
                <p className="text-[11px] text-slate font-medium">Reported by: {rep.reportedBy}</p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: USERS & ORGANIZERS */}
        {adminTab === 'users' && (
          <div className="bg-pure-canvas border border-silver rounded-2xl p-6 shadow-card space-y-4">
            <h3 className="font-display font-bold text-base text-midnight-ink border-b border-silver/60 pb-3">
              Registered Collector Directory ({users.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-silver bg-fog/50 text-slate uppercase text-[10px] font-semibold">
                    <th className="p-3">User</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Role / Badge</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-silver/60">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-fog/30 transition-colors">
                      <td className="p-3 font-semibold">
                        <Link href={`/profile/${u.username}`} className="text-midnight-ink hover:underline">
                          {u.name} (@{u.username})
                        </Link>
                      </td>
                      <td className="p-3 text-slate">{u.location}</td>
                      <td className="p-3 text-slate">{u.verified ? 'Verified Collector' : 'Collector'}</td>
                      <td className="p-3 font-bold text-midnight-ink font-display">{u.stats.itemsCount}</td>
                      <td className="p-3">
                        <span className="text-spearmint font-semibold">Active</span>
                      </td>
                      <td className="p-3 text-right">
                        <button className="px-2.5 py-1 rounded-lg border border-silver text-slate hover:text-midnight-ink text-xs font-semibold hover:bg-fog">
                          Suspend
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: HOMEPAGE CURATION */}
        {adminTab === 'curation' && (
          <div className="bg-pure-canvas border border-silver rounded-2xl p-6 shadow-card space-y-4">
            <h3 className="font-display font-bold text-base text-midnight-ink border-b border-silver/60 pb-3">
              Featured Meets Reordering Controls
            </h3>
            <div className="space-y-2">
              {events.slice(0, 5).map((evt, idx) => (
                <div
                  key={evt.id}
                  className="p-3 bg-fog/50 border border-silver rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-midnight-ink text-pure-canvas flex items-center justify-center font-bold text-xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-xs text-midnight-ink">{evt.title}</p>
                      <p className="text-[11px] text-slate">{evt.city} · {evt.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button className="p-1 rounded-lg border border-silver bg-pure-canvas hover:bg-fog text-slate hover:text-midnight-ink">
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 rounded-lg border border-silver bg-pure-canvas hover:bg-fog text-slate hover:text-midnight-ink">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: TELEMETRY & ANALYTICS */}
        {adminTab === 'analytics' && (
          <div className="bg-pure-canvas border border-silver rounded-2xl p-6 shadow-card space-y-6">
            <h3 className="font-display font-bold text-base text-midnight-ink border-b border-silver/60 pb-3">
              System Telemetry & Platform Volume
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-silver bg-pure-canvas shadow-card space-y-1">
                <span className="text-slate uppercase text-[10px] font-semibold block">Total Gross GMV</span>
                <p className="text-xl font-bold font-display text-midnight-ink">₹32,48,500</p>
              </div>
              <div className="p-4 rounded-xl border border-silver bg-pure-canvas shadow-card space-y-1">
                <span className="text-slate uppercase text-[10px] font-semibold block">Active Passes</span>
                <p className="text-xl font-bold font-display text-midnight-ink">1,842</p>
              </div>
              <div className="p-4 rounded-xl border border-silver bg-pure-canvas shadow-card space-y-1">
                <span className="text-slate uppercase text-[10px] font-semibold block">Trade Velocity</span>
                <p className="text-xl font-bold font-display text-midnight-ink">58 Trades/Wk</p>
              </div>
              <div className="p-4 rounded-xl border border-silver bg-pure-canvas shadow-card space-y-1">
                <span className="text-slate uppercase text-[10px] font-semibold block">Server Uptime</span>
                <p className="text-xl font-bold font-display text-spearmint">99.98%</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* S-CURVE WAVE PICKING MODAL */}
      {activeWaveModalOrder && (
        <Modal
          isOpen={!!activeWaveModalOrder}
          onClose={() => setActiveWaveModalOrder(null)}
          title={`S-Curve Wave Picking: #${activeWaveModalOrder.id}`}
          subtitle="Shortest path routing through warehouse aisles for 1:64 die-cast toy card extraction."
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="p-3 bg-sky-periwinkle/30 border border-sky-periwinkle rounded-xl text-xs space-y-1">
              <p className="font-bold text-midnight-blue flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Optimized S-Curve Path Calculated:</span>
              </p>
              <p className="text-slate font-mono text-[11px]">
                Start Dock → Aisle 01 (Bay B) → Aisle 02 (Bay A) → Packing Station 04
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate block">
                Items to Pick & Verify:
              </span>
              {activeWaveModalOrder.items.map((it, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-fog/50 border border-silver rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={it.image}
                      alt={it.title}
                      className="w-10 h-10 object-cover rounded-lg border border-silver"
                    />
                    <div>
                      <p className="font-bold text-midnight-ink">{it.title}</p>
                      <p className="text-slate font-mono text-[11px]">
                        Bin: <strong className="text-midnight-blue">{it.location}</strong> · Qty: {it.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-spearmint/15 text-spearmint font-bold text-[11px] rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Scan OK</span>
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleConfirmPick(activeWaveModalOrder.id)}
              className="w-full py-3 bg-midnight-blue text-pure-canvas text-xs font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <span>Confirm Pick & Handover to Packing Station</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </Modal>
      )}

      {/* PACKING WITH DIVISOR 5000 MODAL */}
      {activePackModalOrder && (
        <Modal
          isOpen={!!activePackModalOrder}
          onClose={() => setActivePackModalOrder(null)}
          title={`Smart Packing Station (Divisor 5000): #${activePackModalOrder.id}`}
          subtitle="Volumetric weight calculation and armored carton selection for die-cast blisters."
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="p-3.5 bg-fog/70 border border-silver rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate">Carton Recommendation:</span>
                <span className="font-bold text-midnight-ink">
                  {activePackModalOrder.totalItems <= 2 ? 'Carton S (18 x 12 x 6 cm)' : 'Carton M (24 x 16 x 8 cm)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate">Volumetric Weight (Divisor 5000):</span>
                <span className="font-mono font-bold text-midnight-blue">
                  {activePackModalOrder.totalItems <= 2 ? '0.26 kg' : '0.61 kg'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate">Actual Scale Weight:</span>
                <span className="font-mono font-bold text-midnight-ink">
                  {(activePackModalOrder.totalItems * 0.05 + 0.15).toFixed(2)} kg
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate block">
                Die-Cast Collector Protection Checklist:
              </span>
              <div className="space-y-1.5 text-xs text-slate">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-midnight-ink" />
                  <span>Blister bubble protected with air pillow / foam cushion</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-midnight-ink" />
                  <span>Cardboard corner edge protectors fitted on card tabs</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-midnight-ink" />
                  <span>Tamper-evident holographic security tape applied</span>
                </label>
              </div>
            </div>

            <button
              onClick={() =>
                handleConfirmPack(
                  activePackModalOrder.id,
                  activePackModalOrder.totalItems <= 2 ? 'Carton S (18x12x6)' : 'Carton M (24x16x8)',
                  activePackModalOrder.totalItems <= 2 ? 0.26 : 0.61
                )
              }
              className="w-full py-3 bg-spearmint text-pure-canvas text-xs font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              <span>Seal Carton & Mark Ready for Courier</span>
            </button>
          </div>
        </Modal>
      )}

      {/* THERMAL SHIPPING LABEL MODAL */}
      {activeLabelModalOrder && (
        <Modal
          isOpen={!!activeLabelModalOrder}
          onClose={() => setActiveLabelModalOrder(null)}
          title={`Thermal Shipping Label: ${activeLabelModalOrder.wms?.trackingAwb || activeLabelModalOrder.id}`}
          subtitle="Printable standard 4x6 carrier shipping label."
          maxWidth="md"
        >
          <div className="space-y-4">
            {/* Visual Thermal Label */}
            <div className="p-4 bg-pure-canvas border-2 border-black rounded-lg text-black font-sans space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <div>
                  <h4 className="text-base font-extrabold uppercase tracking-tight">
                    {activeLabelModalOrder.wms?.courier || 'BlueDart Air Express'}
                  </h4>
                  <p className="text-[10px] font-bold">COLLECTOR PRIORITY AIR DISPATCH</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 border border-black text-xs font-extrabold">
                    {activeLabelModalOrder.paymentMethod === 'Cash on Delivery' ? 'COD' : 'PREPAID'}
                  </span>
                </div>
              </div>

              {/* Barcode Mock */}
              <div className="py-2 text-center border-b border-black">
                <div className="h-10 bg-black/90 w-4/5 mx-auto rounded-sm flex items-center justify-center text-pure-canvas font-mono text-xs tracking-widest">
                  ||||| | ||||| || |||||| | |||
                </div>
                <p className="font-mono text-xs font-bold mt-1">
                  AWB: {activeLabelModalOrder.wms?.trackingAwb || 'BD-882941092'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] border-b border-black pb-2">
                <div>
                  <p className="font-bold text-[10px] uppercase text-graphite">SHIP TO:</p>
                  <p className="font-bold">{activeLabelModalOrder.customer.name}</p>
                  <p>{activeLabelModalOrder.customer.address}</p>
                  <p>
                    {activeLabelModalOrder.customer.city}, {activeLabelModalOrder.customer.state}
                  </p>
                  <p className="font-bold text-sm">{activeLabelModalOrder.customer.pincode}</p>
                </div>
                <div>
                  <p className="font-bold text-[10px] uppercase text-graphite">SHIP FROM:</p>
                  <p className="font-bold">CollectorEvents WMS Hub (Mumbai)</p>
                  <p>Gate 3, Bandra Kurla Complex</p>
                  <p>Mumbai, MH 400051</p>
                  <p className="mt-1 font-mono text-[10px]">Weight: {activeLabelModalOrder.wms?.packedWeightKg || '0.35'} kg</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-bold">
                <span>ORDER: #{activeLabelModalOrder.id}</span>
                <span>ITEMS: {activeLabelModalOrder.totalItems} CASTINGS</span>
                <span>BIS: IS 9873 COMPLIANT</span>
              </div>
            </div>

            <button
              onClick={() => {
                window.print()
              }}
              className="w-full py-2.5 bg-midnight-ink text-pure-canvas text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90"
            >
              <Printer className="w-4 h-4" />
              <span>Print Label to Zebra Thermal Printer</span>
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
