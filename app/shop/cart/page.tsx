'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  Clock,
  AlertTriangle,
  Heart,
  ChevronRight,
  Package,
} from 'lucide-react'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'
import { StoreMobileNav } from '@/components/store/StoreMobileNav'
import { StoreSearchModal } from '@/components/store/StoreSearchModal'
import { useStore } from '@/lib/store/useStore'
import { validateCoupon } from '@/lib/api/coupons'

export default function CartFullPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    reservationExpiresAt,
    clearReservationTimer,
    toggleWishlist,
    isInWishlist,
  } = useStore()

  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState<string | null>(null)
  const [timeLeftFormatted, setTimeLeftFormatted] = useState<string | null>(null)

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const freeShippingThreshold = 999
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)
  const shippingFee = subtotal >= freeShippingThreshold || cart.length === 0 ? 0 : 99

  let discount = 0
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discount = Math.round((subtotal * appliedCoupon.value) / 100)
    } else {
      discount = appliedCoupon.value
    }
  }

  const grandTotal = Math.max(0, subtotal - discount + shippingFee)
  const gstPortion = Math.round((subtotal * 18) / 118)

  // Hold reservation timer
  useEffect(() => {
    if (!reservationExpiresAt) {
      setTimeLeftFormatted(null)
      return
    }

    const interval = setInterval(() => {
      const diff = reservationExpiresAt - Date.now()
      if (diff <= 0) {
        setTimeLeftFormatted(null)
        clearReservationTimer()
      } else {
        const mins = Math.floor(diff / 60000)
        const secs = Math.floor((diff % 60000) / 1000)
        setTimeLeftFormatted(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [reservationExpiresAt, clearReservationTimer])

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    setCouponError(null)
    if (!couponInput.trim()) return

    const res = await validateCoupon(couponInput, subtotal)
    if (res.valid && res.coupon) {
      applyCoupon(res.coupon)
      setCouponInput('')
    } else {
      setCouponError(res.error || 'Invalid coupon code')
    }
  }

  const handleSaveForLater = (productId: string) => {
    toggleWishlist(productId)
    removeFromCart(productId)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans selection:bg-hw-orange selection:text-white">
      <StoreNavbar />
      <StoreSearchModal />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-20 lg:pb-12">
        {/* Title & Reservation Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-zinc-800 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-7 h-7 text-hw-orange" />
              <span>Collector Cart ({cart.reduce((a, b) => a + b.quantity, 0)} Items)</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Items in your cart are inspected and packed with armored clamshell cases.
            </p>
          </div>

          {timeLeftFormatted && (
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs text-amber-200">
              <Clock className="w-4 h-4 text-amber-500 animate-spin" />
              <span>Limited drop items reserved for:</span>
              <span className="font-mono font-black text-sm bg-amber-500/20 px-2 py-0.5 rounded text-amber-300">
                {timeLeftFormatted}
              </span>
            </div>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto text-zinc-500 mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-white">Your Cart is Empty</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Start building your collection with factory sealed hobby boxes and rare Super $TH castings.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/shop/hot-wheels"
                className="px-4 py-2 rounded-xl bg-hw-orange text-white font-bold text-xs"
              >
                Explore Hot Wheels
              </Link>
              <Link
                href="/shop/cards"
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                Explore Trading Cards
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Line Items List (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free shipping bar */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
                {amountNeededForFreeShipping > 0 ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-zinc-300 font-medium">
                      <span>
                        Add <strong className="text-white">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more for FREE BlueDart Air express shipping
                      </span>
                      <span className="font-mono font-bold text-hw-orange">
                        {Math.round((subtotal / freeShippingThreshold) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Truck className="w-4 h-4" />
                    <span>Unlocked FREE Armored BlueDart Air express delivery!</span>
                  </div>
                )}
              </div>

              {/* Items Card */}
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden divide-y divide-zinc-800">
                {cart.map((item) => {
                  const isUnique = 'isUniqueItem' in item.product && (item.product as any).isUniqueItem
                  return (
                    <div key={item.product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div className="flex gap-4 items-center">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-black shrink-0 border border-zinc-800">
                          <Image src={item.product.images[0]} alt={item.product.title} fill className="object-cover" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1 text-[11px] text-zinc-500">
                            <span>{item.product.productType}</span>
                            <span>•</span>
                            <span className="font-mono">{item.product.sku}</span>
                          </div>
                          <Link
                            href={`/shop/products/${item.product.slug}`}
                            className="font-bold text-sm sm:text-base text-white hover:text-hw-orange transition-colors line-clamp-1"
                          >
                            {item.product.title}
                          </Link>
                          {isUnique && (
                            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Single Copy Locked (1 of 1)
                            </span>
                          )}
                          <div className="mt-2 flex items-center gap-4 text-xs">
                            <button
                              onClick={() => handleSaveForLater(item.product.id)}
                              className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                            >
                              <Heart className="w-3.5 h-3.5" />
                              <span>Save for later</span>
                            </button>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Quantity & Unit Total */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                        {isUnique ? (
                          <span className="text-xs font-mono font-bold text-zinc-400">Qty: 1</span>
                        ) : (
                          <div className="flex items-center border border-zinc-750 rounded-lg overflow-hidden bg-zinc-950">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="px-2.5 py-1 text-zinc-400 hover:bg-zinc-800 text-xs transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 font-mono text-xs font-black text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="px-2.5 py-1 text-zinc-400 hover:bg-zinc-800 text-xs transition-colors disabled:opacity-30"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        <div className="text-right">
                          <span className="font-mono text-base sm:text-lg font-black text-white">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Order Summary (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-4 shadow-xl">
                <h3 className="font-extrabold text-base text-white border-b border-zinc-800 pb-3">
                  Order Summary
                </h3>

                {/* High Value Alert */}
                {grandTotal > 7500 && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      High-value order (above ₹7,500). Cash on Delivery is unavailable to ensure insured armored courier handling.
                    </span>
                  </div>
                )}

                {/* Coupon Code Form */}
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Coupon Code"
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-hw-orange font-mono uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-xs bg-emerald-500/10 border border-emerald-500/30 p-2 rounded-lg text-emerald-300">
                      <span className="font-mono font-bold">Code {appliedCoupon.code} applied!</span>
                      <button onClick={() => applyCoupon(null)} className="text-red-400 hover:underline text-[11px]">
                        Remove
                      </button>
                    </div>
                  )}
                  {couponError && <p className="text-xs text-red-400">{couponError}</p>}
                </form>

                {/* Breakup */}
                <div className="space-y-2 text-xs text-zinc-400 pt-2 border-t border-zinc-800">
                  <div className="flex justify-between">
                    <span>Cart Subtotal</span>
                    <span className="font-mono text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Coupon Discount</span>
                      <span className="font-mono">-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>BlueDart Air Armored Shipping</span>
                    <span className="font-mono">
                      {shippingFee === 0 ? <strong className="text-emerald-400 uppercase text-[10px]">FREE</strong> : `₹${shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-500">
                    <span>Included 18% GST</span>
                    <span className="font-mono">₹{gstPortion.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-white pt-3 border-t border-zinc-800">
                    <span>Total Amount</span>
                    <span className="font-mono text-lg text-white">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/shop/checkout"
                  className="w-full py-3.5 rounded-xl bg-hw-orange hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 transition-transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>Proceed to Multi-Step Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="pt-2 text-[11px] text-zinc-500 text-center flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Collector Grade Clamshell & Bubble Packing</span>
                </div>
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
