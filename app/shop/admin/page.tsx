'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts'
import {
  LayoutDashboard,
  Package,
  Boxes,
  Truck,
  Zap,
  Tag,
  UploadCloud,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  DollarSign,
  ChevronDown,
  Flame,
  Sparkles,
  Edit,
  Trash2,
  Eye,
  FileSpreadsheet,
} from 'lucide-react'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'
import { useStore } from '@/lib/store/useStore'
import { ALL_PRODUCTS, MOCK_DROPS, MOCK_COUPONS } from '@/lib/mock-store-data'
import { Product, Order, Drop, Coupon } from '@/types/store'

const REVENUE_DATA = [
  { day: 'Mon', revenue: 42000, hotWheels: 18000, cards: 24000 },
  { day: 'Tue', revenue: 58000, hotWheels: 32000, cards: 26000 },
  { day: 'Wed', revenue: 38000, hotWheels: 14000, cards: 24000 },
  { day: 'Thu', revenue: 76000, hotWheels: 46000, cards: 30000 },
  { day: 'Fri', revenue: 89000, hotWheels: 41000, cards: 48000 },
  { day: 'Sat', revenue: 112000, hotWheels: 62000, cards: 50000 },
  { day: 'Sun (Drop)', revenue: 165000, hotWheels: 95000, cards: 70000 },
]

export default function AdminStorePage() {
  const { orders } = useStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'orders' | 'drops' | 'coupons' | 'csv' | 'addProduct'>('overview')

  // Products State for Inventory
  const [productList, setProductList] = useState<Product[]>(ALL_PRODUCTS)
  const [searchInventory, setSearchInventory] = useState('')
  const [filterType, setFilterType] = useState('all')

  // New Product Form State
  const [prodType, setProdType] = useState<'hot-wheels' | 'card-single' | 'card-sealed' | 'card-graded' | 'supplies'>('hot-wheels')
  const [prodTitle, setProdTitle] = useState('')
  const [prodPrice, setProdPrice] = useState(1499)
  const [prodMrp, setProdMrp] = useState(1999)
  const [prodStock, setProdStock] = useState(5)
  const [prodCasting, setProdCasting] = useState('')
  const [prodSeries, setProdSeries] = useState('Car Culture Premium')
  const [prodCondition, setProdCondition] = useState('Mint on Card (MOC)')
  const [prodPlayer, setProdPlayer] = useState('')
  const [prodGrade, setProdGrade] = useState('10 Gem Mint')
  const [prodAddedSuccess, setProdAddedSuccess] = useState(false)

  // Orders Management State
  const [allOrders, setAllOrders] = useState<Order[]>(orders)
  const [orderStatusFilter, setOrderStatusFilter] = useState('all')

  // Drops Management State
  const [dropsList, setDropsList] = useState<Drop[]>(MOCK_DROPS)
  const [newDropTitle, setNewDropTitle] = useState('')
  const [newDropLimit, setNewDropLimit] = useState(2)

  // Coupons State
  const [couponsList, setCouponsList] = useState<Coupon[]>(MOCK_COUPONS)
  const [newCouponCode, setNewCouponCode] = useState('')
  const [newCouponValue, setNewCouponValue] = useState(15)

  // Bulk CSV Mock State
  const [csvUploaded, setCsvUploaded] = useState(false)

  // Handlers
  const handleUpdateStock = (id: string, delta: number) => {
    setProductList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p))
    )
  }

  const handleUpdateOrderStatus = (orderId: string, newStatus: any) => {
    setAllOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    )
  }

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prodTitle) return

    const newProd: any = {
      id: `prod-${Date.now()}`,
      slug: prodTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: prodTitle,
      productType: prodType,
      category: prodType === 'hot-wheels' ? 'hot-wheels' : prodType === 'supplies' ? 'supplies' : 'trading-cards',
      mrp: prodMrp,
      price: prodPrice,
      discountPercent: Math.round(((prodMrp - prodPrice) / prodMrp) * 100),
      stock: prodStock,
      rating: 5.0,
      reviewsCount: 1,
      images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'],
      description: 'Collector-grade vault addition verified by authentication team.',
      features: ['100% genuine guaranteed', 'Armored packing included'],
      isFeatured: true,
      isNewArrival: true,
      isBackInStock: false,
      isDropExclusive: false,
      tags: ['New Release', prodType],
      createdAt: new Date().toISOString(),
      sku: `VAULT-${Math.floor(1000 + Math.random() * 9000)}`,
    }

    if (prodType === 'hot-wheels') {
      newProd.castingName = prodCasting || prodTitle
      newProd.series = prodSeries
      newProd.scale = '1:64'
      newProd.year = 2024
      newProd.color = 'Spectraflame'
      newProd.wheelType = 'Real Riders Rubber Tires'
      newProd.packagingCondition = prodCondition
      newProd.treasureHuntType = 'None'
      newProd.isChase = false
    }

    setProductList([newProd, ...productList])
    setProdAddedSuccess(true)
    setTimeout(() => {
      setProdAddedSuccess(false)
      setActiveTab('inventory')
    }, 1500)
  }

  // Filtered Inventory
  const filteredProducts = productList.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(searchInventory.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchInventory.toLowerCase())
    const matchType = filterType === 'all' || p.productType === filterType
    return matchSearch && matchType
  })

  return (
    <div className="min-h-screen bg-pure-canvas text-midnight-ink flex flex-col font-sans selection:bg-party-pink selection:text-midnight-ink">
      <StoreNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-silver/50 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase bg-party-pink/40 text-midnight-ink border border-party-pink">
                SELLER VAULT MANAGER
              </span>
              <span className="text-xs text-slate font-mono">CollectorEvents WMS Mumbai Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-midnight-ink tracking-tight font-display">
              Seller & Inventory Operations
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('addProduct')}
              className="px-4 py-2 rounded-xl bg-midnight-ink hover:bg-midnight-ink/90 text-pure-canvas font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
            <button
              onClick={() => setActiveTab('csv')}
              className="px-4 py-2 rounded-xl bg-fog hover:bg-silver/40 text-midnight-ink text-xs font-bold flex items-center gap-1.5 border border-silver/60 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Bulk CSV</span>
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-silver/50 mb-8 overflow-x-auto text-xs font-bold">
          {[
            { id: 'overview', label: 'Dashboard & Sales', icon: LayoutDashboard },
            { id: 'inventory', label: `Inventory Table (${productList.length})`, icon: Boxes },
            { id: 'orders', label: `Orders & Dispatch (${allOrders.length})`, icon: Truck },
            { id: 'drops', label: `Drops Scheduler (${dropsList.length})`, icon: Zap },
            { id: 'coupons', label: `Coupons Manager (${couponsList.length})`, icon: Tag },
            { id: 'addProduct', label: 'Add / Edit Item', icon: Plus },
            { id: 'csv', label: 'CSV Bulk Import', icon: UploadCloud },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 transition-all whitespace-nowrap border-b-2 ${
                  isActive
                    ? 'border-midnight-ink text-midnight-ink bg-fog/60'
                    : 'border-transparent text-slate hover:text-midnight-ink hover:bg-fog/30'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-midnight-ink' : 'text-slate'}`} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* ================= TAB 1: OVERVIEW DASHBOARD ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-pure-canvas border border-silver/60 space-y-2 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-slate flex items-center justify-between">
                  <span>Today's Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </span>
                <div className="font-mono text-2xl sm:text-3xl font-black text-midnight-ink">
                  ₹58,990
                </div>
                <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+24.5% vs yesterday</span>
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-pure-canvas border border-silver/60 space-y-2 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-slate flex items-center justify-between">
                  <span>Active Orders</span>
                  <Package className="w-4 h-4 text-blue-600" />
                </span>
                <div className="font-mono text-2xl sm:text-3xl font-black text-midnight-ink">
                  {allOrders.length}
                </div>
                <span className="text-[11px] text-slate">
                  2 Pending BlueDart scan
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-pure-canvas border border-silver/60 space-y-2 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-slate flex items-center justify-between">
                  <span>Low Stock Grails</span>
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </span>
                <div className="font-mono text-2xl sm:text-3xl font-black text-amber-700">
                  {productList.filter((p) => p.stock <= 2).length} items
                </div>
                <span className="text-[11px] text-slate">
                  Under 2 copies in stock
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-pure-canvas border border-silver/60 space-y-2 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-slate flex items-center justify-between">
                  <span>Collector Rating</span>
                  <Sparkles className="w-4 h-4 text-party-pink" />
                </span>
                <div className="font-mono text-2xl sm:text-3xl font-black text-midnight-ink">
                  4.95 / 5.0
                </div>
                <span className="text-[11px] text-emerald-700">
                  100% Positive packing feedback
                </span>
              </div>
            </div>

            {/* Sales Chart with Recharts */}
            <div className="p-6 rounded-3xl bg-pure-canvas border border-silver/60 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-base text-midnight-ink font-display">
                    7-Day Sales Volume: Hot Wheels vs Sports Cards
                  </h3>
                  <p className="text-xs text-slate">
                    Revenue performance across both collector categories in INR (₹)
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-orange-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
                    <span>Hot Wheels</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <span>Trading Cards</span>
                  </span>
                </div>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA}>
                    <defs>
                      <linearGradient id="hwGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ea580c" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#6b7280" fontSize={11} />
                    <YAxis stroke="#6b7280" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '1rem', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                    />
                    <Area type="monotone" dataKey="hotWheels" stroke="#ea580c" strokeWidth={2} fillOpacity={1} fill="url(#hwGrad)" name="Hot Wheels" />
                    <Area type="monotone" dataKey="cards" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#cardGrad)" name="Trading Cards" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: INVENTORY TABLE ================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-pure-canvas border border-silver/60 shadow-sm">
              <div className="relative flex-1 w-full sm:w-auto">
                <Search className="w-4 h-4 text-slate absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchInventory}
                  onChange={(e) => setSearchInventory(e.target.value)}
                  placeholder="Search casting, card, or SKU..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-fog/50 border border-silver/60 text-xs text-midnight-ink placeholder-slate focus:outline-none focus:border-midnight-ink"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="p-2 rounded-xl bg-fog/50 border border-silver/60 text-xs text-midnight-ink focus:outline-none focus:border-midnight-ink"
                >
                  <option value="all">All Product Types</option>
                  <option value="hot-wheels">Hot Wheels</option>
                  <option value="card-sealed">Sealed Wax</option>
                  <option value="card-single">Card Singles</option>
                  <option value="card-graded">Graded Slabs</option>
                  <option value="supplies">Supplies</option>
                </select>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="rounded-3xl bg-pure-canvas border border-silver/60 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-midnight-ink">
                  <thead className="bg-fog/60 text-[11px] uppercase tracking-wider text-slate border-b border-silver/50">
                    <tr>
                      <th className="py-3 px-4 font-bold">Item & SKU</th>
                      <th className="py-3 px-4 font-bold">Category</th>
                      <th className="py-3 px-4 font-bold">Price / MRP</th>
                      <th className="py-3 px-4 font-bold">Stock</th>
                      <th className="py-3 px-4 font-bold">Status</th>
                      <th className="py-3 px-4 text-right font-bold">Inline Stock Adjust</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-silver/40">
                    {filteredProducts.map((p) => {
                      const isLow = p.stock <= 2
                      return (
                        <tr key={p.id} className="hover:bg-fog/30 transition-colors">
                          <td className="py-3 px-4 flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-fog shrink-0 border border-silver/60">
                              <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-midnight-ink block truncate max-w-xs">{p.title}</span>
                              <span className="text-[10px] font-mono text-slate">{p.sku}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-fog text-midnight-ink border border-silver/60">
                              {p.productType}
                            </span>
                          </td>

                          <td className="py-3 px-4 font-mono">
                            <strong className="text-midnight-ink">₹{p.price.toLocaleString('en-IN')}</strong>
                            <span className="text-slate line-through text-[11px] block">
                              ₹{p.mrp.toLocaleString('en-IN')}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`font-mono font-bold px-2 py-0.5 rounded text-xs border ${
                                p.stock === 0
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : isLow
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}
                            >
                              {p.stock} units
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            {p.stock > 0 ? (
                              <span className="text-emerald-700 text-[11px] font-semibold">Active</span>
                            ) : (
                              <span className="text-red-700 text-[11px] font-semibold">Out of Stock</span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1 bg-fog p-1 rounded-xl border border-silver/60">
                              <button
                                onClick={() => handleUpdateStock(p.id, -1)}
                                className="px-2 py-0.5 text-midnight-ink hover:bg-silver/40 rounded font-bold transition-colors"
                              >
                                -
                              </button>
                              <span className="font-mono px-2 text-xs font-bold text-midnight-ink">{p.stock}</span>
                              <button
                                onClick={() => handleUpdateStock(p.id, 1)}
                                className="px-2 py-0.5 text-midnight-ink hover:bg-silver/40 rounded font-bold transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: ORDERS MANAGEMENT ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="rounded-3xl bg-pure-canvas border border-silver/60 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-silver/50 flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-midnight-ink font-display">Collector Consignments & Tracking</h3>
                <span className="text-xs text-slate font-mono">{allOrders.length} Total Orders</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-midnight-ink">
                  <thead className="bg-fog/60 text-[11px] uppercase tracking-wider text-slate border-b border-silver/50">
                    <tr>
                      <th className="py-3 px-4 font-bold">Order & Date</th>
                      <th className="py-3 px-4 font-bold">Customer & City</th>
                      <th className="py-3 px-4 font-bold">Total</th>
                      <th className="py-3 px-4 font-bold">Carrier & AWB</th>
                      <th className="py-3 px-4 font-bold">Status</th>
                      <th className="py-3 px-4 text-right font-bold">Operations Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-silver/40">
                    {allOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-fog/30 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-midnight-ink block">{o.id}</span>
                          <span className="text-[10px] text-slate">
                            {new Date(o.createdAt).toLocaleDateString()}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-bold text-midnight-ink block">{o.shippingAddress.fullName}</span>
                          <span className="text-[11px] text-slate">
                            {o.shippingAddress.city} ({o.shippingAddress.pincode})
                          </span>
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-midnight-ink">
                          ₹{o.total.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-midnight-ink font-bold block">{o.courier}</span>
                          <span className="text-[10px] font-mono text-slate">{o.trackingAwb}</span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {o.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right space-x-1.5">
                          {o.status === 'PACKED' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(o.id, 'IN_TRANSIT')}
                              className="px-2.5 py-1 rounded-xl bg-midnight-ink text-pure-canvas text-[11px] font-bold hover:bg-midnight-ink/90 transition-all"
                            >
                              Dispatch Air Manifest
                            </button>
                          )}
                          {o.status !== 'DELIVERED' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(o.id, 'DELIVERED')}
                              className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition-all"
                            >
                              Mark Delivered
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: DROPS SCHEDULER ================= */}
        {activeTab === 'drops' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dropsList.map((drop) => (
                <div key={drop.id} className="p-5 rounded-3xl bg-pure-canvas border border-silver/60 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700 border border-red-200 font-mono">
                      {drop.status}
                    </span>
                    <span className="text-xs font-mono text-slate">
                      Limit {drop.maxPerCustomer}/customer
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-midnight-ink line-clamp-1">{drop.title}</h4>
                  <p className="text-xs text-slate line-clamp-2">{drop.description}</p>
                  <div className="pt-2 text-xs space-y-1 font-mono text-slate border-t border-silver/40">
                    <div>Total Allocation: {drop.totalStock} units</div>
                    <div>Remaining: <strong className="text-orange-600">{drop.remainingStock}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: COUPONS MANAGER ================= */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {couponsList.map((c) => (
                <div key={c.code} className="p-5 rounded-3xl bg-pure-canvas border border-silver/60 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base font-black text-midnight-ink bg-fog px-2.5 py-1 rounded-xl border border-silver/60">
                      {c.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-midnight-ink font-medium">{c.description}</p>
                  <div className="text-[11px] text-slate font-mono">
                    Discount: {c.type === 'percent' ? `${c.value}%` : `₹${c.value}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: ADD PRODUCT FORM ================= */}
        {activeTab === 'addProduct' && (
          <div className="max-w-2xl mx-auto rounded-3xl bg-pure-canvas border border-silver/60 p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-black text-midnight-ink pb-3 border-b border-silver/50 font-display">
              Catalog New Collector Casting or Wax
            </h2>

            {prodAddedSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Product successfully cataloged and published to vault!</span>
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="text-midnight-ink font-bold block mb-1">Product Category</label>
                <select
                  value={prodType}
                  onChange={(e) => setProdType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-fog/50 border border-silver/60 text-midnight-ink text-xs focus:outline-none focus:border-midnight-ink"
                >
                  <option value="hot-wheels">Hot Wheels Die-Cast 1:64</option>
                  <option value="card-sealed">Sealed Sports Card Box / Wax</option>
                  <option value="card-single">Sports Card Single (Raw)</option>
                  <option value="card-graded">Graded Slab (PSA 10 / BGS 9.5)</option>
                  <option value="supplies">Protective Supplies (Clamshells / Cases)</option>
                </select>
              </div>

              <div>
                <label className="text-midnight-ink font-bold block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1971 Datsun 240Z Super Treasure Hunt ($TH)"
                  value={prodTitle}
                  onChange={(e) => setProdTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-fog/50 border border-silver/60 text-midnight-ink text-xs placeholder-slate focus:outline-none focus:border-midnight-ink"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-midnight-ink font-bold block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-fog/50 border border-silver/60 text-midnight-ink font-mono text-xs focus:outline-none focus:border-midnight-ink"
                  />
                </div>
                <div>
                  <label className="text-midnight-ink font-bold block mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={prodMrp}
                    onChange={(e) => setProdMrp(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-fog/50 border border-silver/60 text-midnight-ink font-mono text-xs focus:outline-none focus:border-midnight-ink"
                  />
                </div>
                <div>
                  <label className="text-midnight-ink font-bold block mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-fog/50 border border-silver/60 text-midnight-ink font-mono text-xs focus:outline-none focus:border-midnight-ink"
                  />
                </div>
              </div>

              {/* Dynamic fields */}
              {prodType === 'hot-wheels' && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-midnight-ink font-bold block mb-1">Casting Series</label>
                    <select
                      value={prodSeries}
                      onChange={(e) => setProdSeries(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-fog/50 border border-silver/60 text-midnight-ink text-xs focus:outline-none focus:border-midnight-ink"
                    >
                      <option>Super Treasure Hunt ($TH)</option>
                      <option>Red Line Club (RLC)</option>
                      <option>Car Culture Premium</option>
                      <option>Boulevard</option>
                      <option>Mainline</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-midnight-ink font-bold block mb-1">Blister Packaging Condition</label>
                    <select
                      value={prodCondition}
                      onChange={(e) => setProdCondition(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-fog/50 border border-silver/60 text-midnight-ink text-xs focus:outline-none focus:border-midnight-ink"
                    >
                      <option>Mint on Card (MOC)</option>
                      <option>Short Card MOC</option>
                      <option>Card Creased / Soft Corners</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-midnight-ink hover:bg-midnight-ink/90 text-pure-canvas font-bold text-xs uppercase tracking-wider transition-all"
              >
                Publish to Vault Catalog
              </button>
            </form>
          </div>
        )}

        {/* ================= TAB 7: BULK CSV IMPORT ================= */}
        {activeTab === 'csv' && (
          <div className="max-w-2xl mx-auto rounded-3xl bg-pure-canvas border border-silver/60 p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-black text-midnight-ink pb-3 border-b border-silver/50 font-display">
              Bulk CSV Inventory Ingestion
            </h2>

            <div
              onClick={() => setCsvUploaded(true)}
              className="border-2 border-dashed border-silver hover:border-midnight-ink p-8 rounded-2xl text-center cursor-pointer bg-fog/30 transition-colors"
            >
              <UploadCloud className="w-10 h-10 text-slate mx-auto mb-2" />
              <span className="font-bold text-sm text-midnight-ink block">
                Click or Drop Collector Catalog CSV
              </span>
              <span className="text-xs text-slate block mt-1">
                Columns: SKU, Title, Type, Series, Condition, Price, Stock
              </span>
            </div>

            {csvUploaded && (
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  ✓ Parsed hot_wheels_case_2026.csv (42 rows ready)
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCsvUploaded(false)
                    setActiveTab('inventory')
                  }}
                  className="w-full py-3 rounded-xl bg-midnight-ink hover:bg-midnight-ink/90 text-pure-canvas font-bold text-xs transition-all"
                >
                  Commit Batch Import to Database
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <StoreFooter />
    </div>
  )
}
