'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  User,
  Package,
  Heart,
  MapPin,
  Bell,
  RotateCcw,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Camera,
  Trash2,
  Upload,
  ArrowRight,
  Plus,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'
import { StoreMobileNav } from '@/components/store/StoreMobileNav'
import { StoreSearchModal } from '@/components/store/StoreSearchModal'
import { useStore } from '@/lib/store/useStore'
import { ALL_PRODUCTS } from '@/lib/mock-store-data'
import { Order, OrderStatus } from '@/types/store'

export default function AccountPage() {
  const {
    orders,
    wishlist,
    toggleWishlist,
    addToCart,
    addresses,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    cancelOrder,
    requestReturn,
  } = useStore()

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'alerts' | 'auth'>('orders')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  // Return Flow Modal State
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null)
  const [returnReason, setReturnReason] = useState('Blister Card Soft Corner in Transit')
  const [returnNotes, setReturnNotes] = useState('')
  const [returnPhotoUrl, setReturnPhotoUrl] = useState<string | null>(null)
  const [returnSuccess, setReturnSuccess] = useState(false)

  // Cancel Flow State
  const [cancelReason, setCancelReason] = useState('Ordered by mistake')
  const [cancelModalOrderId, setCancelModalOrderId] = useState<string | null>(null)

  // Auth Mock State
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [authStep, setAuthStep] = useState<'phone' | 'otp'>('phone')
  const [phoneInput, setPhoneInput] = useState('9820155902')
  const [otpInput, setOtpInput] = useState('')

  // Selected Order Object
  const activeOrder = orders.find((o) => o.id === selectedOrderId) || orders[0]

  // Wishlist Products
  const wishlistProducts = ALL_PRODUCTS.filter((p) => wishlist.includes(p.id))

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!returnOrderId) return
    requestReturn(returnOrderId, {
      reason: returnReason,
      notes: returnNotes,
      photoUrl: returnPhotoUrl || undefined,
    })
    setReturnSuccess(true)
    setTimeout(() => {
      setReturnSuccess(false)
      setReturnOrderId(null)
    }, 2500)
  }

  const handleConfirmCancel = () => {
    if (!cancelModalOrderId) return
    cancelOrder(cancelModalOrderId, cancelReason)
    setCancelModalOrderId(null)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans selection:bg-hw-orange selection:text-white">
      <StoreNavbar />
      <StoreSearchModal />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-20">
        {/* User Profile Header */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-hw-orange to-red-600 flex items-center justify-center font-black text-white text-xl shadow-lg">
              SS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">Shreyash Srivastava</h1>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  VIP Collector
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                +91 98201 55902 • shreyash@cratemeet.com
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/collection"
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-hw-yellow" />
              <span>View My Vault Collection</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 mb-8 overflow-x-auto">
          {[
            { id: 'orders', label: `My Orders (${orders.length})`, icon: Package },
            { id: 'wishlist', label: `Wishlist (${wishlist.length})`, icon: Heart },
            { id: 'addresses', label: `Saved Addresses (${addresses.length})`, icon: MapPin },
            { id: 'alerts', label: 'Restock Alerts', icon: Bell },
            { id: 'auth', label: 'Auth & Security', icon: User },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition-all whitespace-nowrap border-b-2 ${
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

        {/* ================= TAB 1: MY ORDERS & TRACKING TIMELINE ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-zinc-900/40 rounded-2xl border border-zinc-800 p-8">
                <Package className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No Orders Placed Yet</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Your purchase history and live BlueDart package tracking will show up here.
                </p>
                <Link
                  href="/shop"
                  className="mt-4 inline-block px-4 py-2 rounded-xl bg-hw-orange text-white text-xs font-bold"
                >
                  Explore Store
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Orders List (5 cols) */}
                <div className="lg:col-span-5 space-y-3">
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-zinc-400">
                    Order History
                  </h3>
                  {orders.map((order) => {
                    const isSelected = activeOrder?.id === order.id
                    return (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrderId(order.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-zinc-850 border-hw-orange shadow-lg'
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-black text-sm text-white">
                            {order.id}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                              order.status === 'DELIVERED'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : order.status === 'CANCELLED'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>

                        <div className="mt-2 text-xs text-zinc-400">
                          <span>{order.items.length} item(s)</span>
                          <span> • </span>
                          <span className="font-mono font-bold text-white">
                            ₹{order.total.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="mt-2 text-[11px] text-zinc-500 flex items-center justify-between">
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          <span className="text-zinc-400">{order.courier}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Selected Order Detail & Live Timeline (7 cols) */}
                {activeOrder && (
                  <div className="lg:col-span-7 rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-6 shadow-xl">
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-zinc-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-mono text-lg font-black text-white">{activeOrder.id}</h3>
                          <span className="text-xs text-zinc-500 font-mono">
                            {activeOrder.invoiceNumber}
                          </span>
                        </div>
                        <span className="text-xs text-zinc-400">
                          Placed on {new Date(activeOrder.createdAt).toLocaleString()}
                        </span>
                      </div>

                      {/* Actions: Cancel / Return */}
                      <div className="flex items-center gap-2">
                        {activeOrder.status === 'DELIVERED' && (
                          <button
                            onClick={() => setReturnOrderId(activeOrder.id)}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-amber-400 flex items-center gap-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Request Return / Replacement</span>
                          </button>
                        )}

                        {activeOrder.status !== 'DELIVERED' && activeOrder.status !== 'CANCELLED' && (
                          <button
                            onClick={() => setCancelModalOrderId(activeOrder.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800 text-xs font-bold text-red-300"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Timeline: Packed -> Label Generated -> Picked Up -> In Transit -> Out for Delivery -> Delivered */}
                    <div>
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-hw-orange" />
                        <span>Live Courier Dispatch Timeline</span>
                      </h4>

                      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
                        {activeOrder.timeline.map((step, idx) => {
                          return (
                            <div key={idx} className="relative">
                              <div
                                className={`absolute -left-[27px] top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                  step.completed
                                    ? 'bg-emerald-500 border-emerald-400 text-black'
                                    : 'bg-zinc-950 border-zinc-700 text-zinc-500'
                                }`}
                              >
                                {step.completed && <CheckCircle2 className="w-3 h-3 text-black" />}
                              </div>

                              <div>
                                <div className="flex flex-wrap items-center justify-between gap-1">
                                  <h5
                                    className={`text-xs font-bold ${
                                      step.completed ? 'text-white' : 'text-zinc-500'
                                    }`}
                                  >
                                    {step.title}
                                  </h5>
                                  {step.timestamp && (
                                    <span className="text-[10px] font-mono text-zinc-400">
                                      {step.timestamp}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                                  {step.description}
                                </p>
                                {step.location && (
                                  <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
                                    Location: {step.location}
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Allocated Products in Order */}
                    <div className="pt-4 border-t border-zinc-800 space-y-3">
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-zinc-400">
                        Vault Consignment Items
                      </h4>
                      <div className="divide-y divide-zinc-800">
                        {activeOrder.items.map((item, i) => (
                          <div key={i} className="py-3 flex items-center justify-between gap-4 text-xs">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-lg bg-black overflow-hidden shrink-0 border border-zinc-800">
                                <Image src={item.product.images[0]} alt={item.product.title} fill className="object-cover" />
                              </div>
                              <div>
                                <span className="font-bold text-white block">{item.product.title}</span>
                                <span className="text-[11px] text-zinc-400">Qty: {item.quantity}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-white">
                                ₹{(item.priceAtPurchase * item.quantity).toLocaleString('en-IN')}
                              </span>

                              {/* Collection Integration Feature */}
                              {activeOrder.status === 'DELIVERED' && (
                                <Link
                                  href={`/collection?addTitle=${encodeURIComponent(item.product.title)}&type=${item.product.category}`}
                                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] font-bold text-hw-yellow flex items-center gap-1 transition-colors"
                                  title="Add to CrateMeet Collector Vault"
                                >
                                  <Sparkles className="w-3 h-3" />
                                  <span>Add to My Collection</span>
                                </Link>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address & Pricing */}
                    <div className="pt-4 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-400">
                      <div>
                        <span className="font-bold text-zinc-300 block mb-1">Delivered To:</span>
                        <p className="text-white font-medium">{activeOrder.shippingAddress.fullName}</p>
                        <p className="text-[11px] text-zinc-400">
                          {activeOrder.shippingAddress.addressLine}, {activeOrder.shippingAddress.city} -{' '}
                          {activeOrder.shippingAddress.pincode}
                        </p>
                      </div>
                      <div className="space-y-1 text-right">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span className="font-mono text-white">₹{activeOrder.subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between font-bold text-white text-sm pt-1 border-t border-zinc-800">
                          <span>Total Paid:</span>
                          <span className="font-mono">₹{activeOrder.total.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: WISHLIST ================= */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h2 className="text-xl font-black text-white">Collector Saved Wishlist</h2>
              <span className="text-xs text-zinc-400">{wishlistProducts.length} items</span>
            </div>

            {wishlistProducts.length === 0 ? (
              <div className="text-center py-16 bg-zinc-900/40 rounded-2xl border border-zinc-800 p-8">
                <Heart className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">Your Wishlist is Empty</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Click the heart icon on any Super $TH or sports card to save it for later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistProducts.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex gap-3.5 items-center justify-between">
                    <div className="relative w-16 h-16 rounded-lg bg-black overflow-hidden shrink-0 border border-zinc-800">
                      <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/shop/products/${p.slug}`} className="font-bold text-xs text-white hover:text-hw-orange truncate block">
                        {p.title}
                      </Link>
                      <span className="font-mono font-bold text-xs text-emerald-400 block mt-1">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button
                        onClick={() => addToCart(p, 1)}
                        className="px-3 py-1.5 rounded-lg bg-hw-orange hover:bg-orange-600 text-white font-bold text-[11px]"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="text-[10px] text-zinc-400 hover:text-red-400 text-center"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: SAVED ADDRESSES ================= */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h2 className="text-xl font-black text-white">Saved Vault Delivery Addresses</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{addr.fullName}</span>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        Primary Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400">
                    {addr.addressLine}, {addr.city}, {addr.state} -{' '}
                    <strong className="text-zinc-200 font-mono">{addr.pincode}</strong>
                  </p>
                  <p className="text-xs text-zinc-500 font-mono">Mobile: {addr.phone}</p>
                  <div className="pt-2 flex items-center justify-between text-xs">
                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-hw-orange hover:underline font-bold"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="text-zinc-500 hover:text-red-400 ml-auto"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: RESTOCK ALERTS ================= */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-white pb-3 border-b border-zinc-800">
              Active Restock & Price-Drop Notifications
            </h2>
            <div className="space-y-3">
              {[
                { title: '1971 Datsun 240Z Super $TH', status: 'In Stock Alert Active', time: 'Monitored daily' },
                { title: 'Panini Prizm Premier League Hobby Box', status: 'Target: Under ₹30,000', time: 'Price alert active' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-purple-400" />
                    <div>
                      <span className="font-bold text-white block">{item.title}</span>
                      <span className="text-zinc-400 text-[11px]">{item.status}</span>
                    </div>
                  </div>
                  <span className="text-zinc-500 font-mono text-[11px]">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: AUTH UI MOCK ================= */}
        {activeTab === 'auth' && (
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="text-center space-y-1">
              <h3 className="font-black text-lg text-white">Collector Security & OTP Access</h3>
              <p className="text-xs text-zinc-400">
                Log into your verified phone number to manage saved cards, orders, and drops.
              </p>
            </div>

            {authStep === 'phone' ? (
              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="text-zinc-400 block mb-1">Mobile Phone Number</label>
                  <div className="flex gap-2">
                    <span className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 font-mono">
                      +91
                    </span>
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="flex-1 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthStep('otp')}
                  className="w-full py-3 rounded-xl bg-hw-orange text-white font-bold text-xs uppercase tracking-wider"
                >
                  Send Login OTP
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-2 text-xs">
                <p className="text-[11px] text-emerald-400">
                  OTP sent to +91 {phoneInput}. Enter 1234 to verify.
                </p>
                <input
                  type="text"
                  maxLength={4}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="Enter 4-digit OTP"
                  className="w-full p-2.5 text-center tracking-widest text-lg rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsLoggedIn(true)
                    setActiveTab('orders')
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider"
                >
                  Verify & Log In
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= RETURN REQUEST MODAL ================= */}
        {returnOrderId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-hw-orange" />
                  <span>Request Return / Replacement ({returnOrderId})</span>
                </h3>
                <button
                  onClick={() => setReturnOrderId(null)}
                  className="text-zinc-500 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {returnSuccess ? (
                <div className="p-6 text-center text-xs space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="font-bold text-sm text-white">Replacement Request Initiated!</h4>
                  <p className="text-zinc-400">
                    Our inspection team has approved a reverse BlueDart pickup. You will receive an SMS label within 2 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReturnSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="text-zinc-300 font-bold block mb-1">Reason for Return</label>
                    <select
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs"
                    >
                      <option>Blister Card Soft Corner in Transit</option>
                      <option>Cracked Blister Bubble</option>
                      <option>Factory Card Crease</option>
                      <option>Panini Shrink Wrap Scuff / Blemish</option>
                      <option>Received Incorrect Casting Variant</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-300 font-bold block mb-1">Collector Notes</label>
                    <textarea
                      rows={3}
                      value={returnNotes}
                      onChange={(e) => setReturnNotes(e.target.value)}
                      placeholder="Describe the condition issue in detail..."
                      className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs placeholder-zinc-500"
                    />
                  </div>

                  {/* Photo Upload UI (Mock) */}
                  <div>
                    <label className="text-zinc-300 font-bold block mb-1">
                      Upload Damage Photo / Corner Inspection
                    </label>
                    <div className="border-2 border-dashed border-zinc-800 rounded-xl p-4 text-center cursor-pointer hover:border-zinc-700 bg-zinc-900/40">
                      <Camera className="w-6 h-6 text-zinc-500 mx-auto mb-1" />
                      <span className="text-[11px] text-zinc-400 block">
                        Drag and drop photos or click to upload
                      </span>
                      <span className="text-[10px] text-zinc-600 block mt-0.5">
                        JPEG / PNG / WEBP up to 10MB
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setReturnOrderId(null)}
                      className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-hw-orange text-white font-bold"
                    >
                      Submit Return Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ================= CANCEL ORDER MODAL ================= */}
        {cancelModalOrderId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-6 space-y-4 shadow-2xl">
              <h3 className="font-extrabold text-base text-white">Cancel Order {cancelModalOrderId}?</h3>
              <p className="text-xs text-zinc-400">
                Are you sure you want to cancel? If this order contained limited drop allocations, the reserved slots will be released immediately.
              </p>
              <div>
                <label className="text-zinc-400 text-xs block mb-1">Reason for cancellation</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs"
                >
                  <option>Ordered by mistake</option>
                  <option>Found elsewhere</option>
                  <option>Need to change delivery address</option>
                  <option>Other reason</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalOrderId(null)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white text-xs"
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <StoreFooter />
      <StoreMobileNav />
    </div>
  )
}
