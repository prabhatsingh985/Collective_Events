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
import { StoreMobileNav } from '@/components/store/StoreMobileNav'
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
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans selection:bg-hw-orange selection:text-white">
      <StoreNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-zinc-800 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase bg-amber-500 text-black">
                SELLER VAULT MANAGER
              </span>
              <span className="text-xs text-zinc-400 font-mono">CrateMeet WMS Mumbai Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Seller & Inventory Operations
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('addProduct')}
              className="px-4 py-2 rounded-xl bg-hw-orange hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-orange-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
            <button
              onClick={() => setActiveTab('csv')}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-bold flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Bulk CSV</span>
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-zinc-800 mb-8 overflow-x-auto text-xs font-bold">
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
                    ? 'border-hw-orange text-white bg-zinc-900/60'
                    : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-hw-orange' : 'text-zinc-500'}`} />
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
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                  <span>Today's Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </span>
                <div className="font-mono text-2xl sm:text-3xl font-black text-white">
                  ₹58,990
                </div>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+24.5% vs yesterday</span>
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                  <span>Active Orders</span>
                  <Package className="w-4 h-4 text-blue-400" />
                </span>
                <div className="font-mono text-2xl sm:text-3xl font-black text-white">
                  {allOrders.length}
                </div>
                <span className="text-[11px] text-zinc-400">
                  2 Pending BlueDart scan
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                  <span>Low Stock Grails</span>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </span>
                <div className="font-mono text-2xl sm:text-3xl font-black text-amber-300">
                  {productList.filter((p) => p.stock <= 2).length} items
                </div>
                <span className="text-[11px] text-zinc-400">
                  Under 2 copies in stock
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                  <span>Collector Rating</span>
                  <Sparkles className="w-4 h-4 text-hw-yellow" />
                </span>
                <div className="font-mono text-2xl sm:text-3xl font-black text-white">
                  4.95 / 5.0
                </div>
                <span className="text-[11px] text-emerald-400">
                  100% Positive packing feedback
                </span>
              </div>
            </div>

            {/* Sales Chart with Recharts */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    7-Day Sales Volume: Hot Wheels vs Sports Cards
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Revenue performance across both collector categories in INR (₹)
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-hw-orange">
                    <span className="w-2.5 h-2.5 rounded-full bg-hw-orange" />
                    <span>Hot Wheels</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>Trading Cards</span>
                  </span>
                </div>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA}>
                    <defs>
                      <linearGradient id="hwGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff5400" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#ff5400" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="day" stroke="#71717a" fontSize={11} />
                    <YAxis stroke="#71717a" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '0.75rem', fontSize: '12px' }}
                      formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                    />
                    <Area type="monotone" dataKey="hotWheels" stroke="#ff5400" strokeWidth={2} fillOpacity={1} fill="url(#hwGrad)" name="Hot Wheels" />
                    <Area type="monotone" dataKey="cards" stroke="#00d4aa" strokeWidth={2} fillOpacity={1} fill="url(#cardGrad)" name="Trading Cards" />
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="relative flex-1 w-full sm:w-auto">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchInventory}
                  onChange={(e) => setSearchInventory(e.target.value)}
                  placeholder="Search casting, card, or SKU..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-hw-orange"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300"
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
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-850 text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">Item & SKU</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price / MRP</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Inline Stock Adjust</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {filteredProducts.map((p) => {
                      const isLow = p.stock <= 2
                      return (
                        <tr key={p.id} className="hover:bg-zinc-850/50 transition-colors">
                          <td className="py-3 px-4 flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-black shrink-0 border border-zinc-800">
                              <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-white block truncate max-w-xs">{p.title}</span>
                              <span className="text-[10px] font-mono text-zinc-500">{p.sku}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300">
                              {p.productType}
                            </span>
                          </td>

                          <td className="py-3 px-4 font-mono">
                            <strong className="text-white">₹{p.price.toLocaleString('en-IN')}</strong>
                            <span className="text-zinc-500 line-through text-[11px] block">
                              ₹{p.mrp.toLocaleString('en-IN')}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                                p.stock === 0
                                  ? 'bg-red-500/20 text-red-400'
                                  : isLow
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-emerald-500/20 text-emerald-400'
                              }`}
                            >
                              {p.stock} units
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            {p.stock > 0 ? (
                              <span className="text-emerald-400 text-[11px] font-semibold">Active</span>
                            ) : (
                              <span className="text-red-400 text-[11px] font-semibold">Out of Stock</span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                              <button
                                onClick={() => handleUpdateStock(p.id, -1)}
                                className="px-2 py-0.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded font-bold"
                              >
                                -
                              </button>
                              <span className="font-mono px-2 text-xs font-bold text-white">{p.stock}</span>
                              <button
                                onClick={() => handleUpdateStock(p.id, 1)}
                                className="px-2 py-0.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded font-bold"
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
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl">
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-white">Collector Consignments & Tracking</h3>
                <span className="text-xs text-zinc-400 font-mono">{allOrders.length} Total Orders</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-850 text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">Order & Date</th>
                      <th className="py-3 px-4">Customer & City</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Carrier & AWB</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Operations Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {allOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-zinc-850/50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-white block">{o.id}</span>
                          <span className="text-[10px] text-zinc-500">
                            {new Date(o.createdAt).toLocaleDateString()}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-bold text-white block">{o.shippingAddress.fullName}</span>
                          <span className="text-[11px] text-zinc-400">
                            {o.shippingAddress.city} ({o.shippingAddress.pincode})
                          </span>
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-white">
                          ₹{o.total.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-zinc-300 font-bold block">{o.courier}</span>
                          <span className="text-[10px] font-mono text-zinc-500">{o.trackingAwb}</span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400">
                            {o.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right space-x-1.5">
                          {o.status === 'PACKED' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(o.id, 'IN_TRANSIT')}
                              className="px-2.5 py-1 rounded bg-hw-orange text-white text-[11px] font-bold"
                            >
                              Dispatch Air Manifest
                            </button>
                          )}
                          {o.status !== 'DELIVERED' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(o.id, 'DELIVERED')}
                              className="px-2.5 py-1 rounded bg-emerald-600 text-white text-[11px] font-bold"
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
                <div key={drop.id} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-600 text-white font-mono">
                      {drop.status}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      Limit {drop.maxPerCustomer}/customer
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white line-clamp-1">{drop.title}</h4>
                  <p className="text-xs text-zinc-400 line-clamp-2">{drop.description}</p>
                  <div className="pt-2 text-xs space-y-1 font-mono text-zinc-400">
                    <div>Total Allocation: {drop.totalStock} units</div>
                    <div>Remaining: <strong className="text-hw-yellow">{drop.remainingStock}</strong></div>
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
                <div key={c.code} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base font-black text-white bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800">
                      {c.code}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-medium">{c.description}</p>
                  <div className="text-[11px] text-zinc-500 font-mono">
                    Discount: {c.type === 'percent' ? `${c.value}%` : `₹${c.value}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: ADD PRODUCT FORM ================= */}
        {activeTab === 'addProduct' && (
          <div className="max-w-2xl mx-auto rounded-2xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-2xl">
            <h2 className="text-xl font-black text-white pb-3 border-b border-zinc-800">
              Catalog New Collector Casting or Wax
            </h2>

            {prodAddedSuccess && (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Product successfully cataloged and published to vault!</span>
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 font-bold block mb-1">Product Category</label>
                <select
                  value={prodType}
                  onChange={(e) => setProdType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                >
                  <option value="hot-wheels">Hot Wheels Die-Cast 1:64</option>
                  <option value="card-sealed">Sealed Sports Card Box / Wax</option>
                  <option value="card-single">Sports Card Single (Raw)</option>
                  <option value="card-graded">Graded Slab (PSA 10 / BGS 9.5)</option>
                  <option value="supplies">Protective Supplies (Clamshells / Cases)</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 font-bold block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1971 Datsun 240Z Super Treasure Hunt ($TH)"
                  value={prodTitle}
                  onChange={(e) => setProdTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 font-bold block mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={prodMrp}
                    onChange={(e) => setProdMrp(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* Dynamic fields */}
              {prodType === 'hot-wheels' && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-zinc-400 font-bold block mb-1">Casting Series</label>
                    <select
                      value={prodSeries}
                      onChange={(e) => setProdSeries(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                    >
                      <option>Super Treasure Hunt ($TH)</option>
                      <option>Red Line Club (RLC)</option>
                      <option>Car Culture Premium</option>
                      <option>Boulevard</option>
                      <option>Mainline</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-zinc-400 font-bold block mb-1">Blister Packaging Condition</label>
                    <select
                      value={prodCondition}
                      onChange={(e) => setProdCondition(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
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
                className="w-full py-3.5 rounded-xl bg-hw-orange hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-600/20"
              >
                Publish to Vault Catalog
              </button>
            </form>
          </div>
        )}

        {/* ================= TAB 7: BULK CSV IMPORT ================= */}
        {activeTab === 'csv' && (
          <div className="max-w-2xl mx-auto rounded-2xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-black text-white pb-3 border-b border-zinc-800">
              Bulk CSV Inventory Ingestion
            </h2>

            <div
              onClick={() => setCsvUploaded(true)}
              className="border-2 border-dashed border-zinc-700 hover:border-hw-orange p-8 rounded-2xl text-center cursor-pointer bg-zinc-950/60 transition-colors"
            >
              <UploadCloud className="w-10 h-10 text-zinc-500 mx-auto mb-2" />
              <span className="font-bold text-sm text-white block">
                Click or Drop Collector Catalog CSV
              </span>
              <span className="text-xs text-zinc-500 block mt-1">
                Columns: SKU, Title, Type, Series, Condition, Price, Stock
              </span>
            </div>

            {csvUploaded && (
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                  ✓ Parsed hot_wheels_case_2026.csv (42 rows ready)
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCsvUploaded(false)
                    setActiveTab('inventory')
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Commit Batch Import to Database
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <StoreFooter />
      <StoreMobileNav />
    </div>
  )
}
