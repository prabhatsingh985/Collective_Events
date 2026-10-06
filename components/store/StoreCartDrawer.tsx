'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { useStore } from '@/lib/store/useStore'
import { validateCoupon } from '@/lib/api/coupons'

export function StoreCartDrawer() {
  const {
    cart,
    isCartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    reservationExpiresAt,
    clearReservationTimer,
  } = useStore()

  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState<string | null>(null)
  const [timeLeftFormatted, setTimeLeftFormatted] = useState<string | null>(null)

  // Subtotal calculations
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
  const gstPortion = Math.round((subtotal * 18) / 118) // 18% embedded GST

  // Reservation countdown ticker
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

  if (!isCartOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-zinc-900" />
              <h2 className="font-extrabold text-lg text-zinc-900">Your Collector Cart</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-zinc-200 text-zinc-700">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Reservation Timer Banner */}
          {timeLeftFormatted && (
            <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs text-amber-900 font-medium">
              <div className="flex items-center gap-1.5 font-bold">
                <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                <span>Drop items reserved for:</span>
              </div>
              <span className="font-mono font-extrabold text-sm text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                {timeLeftFormatted}
              </span>
            </div>
          )}

          {/* Free Shipping Progress */}
          <div className="px-5 py-3 bg-zinc-100/70 border-b border-zinc-200 text-xs">
            {amountNeededForFreeShipping > 0 ? (
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between font-medium text-zinc-700">
                  <span>
                    Add <strong className="text-zinc-900">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> for FREE BlueDart Air shipping
                  </span>
                  <span className="font-bold text-zinc-900">
                    {Math.round((subtotal / freeShippingThreshold) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>🎉 Unlocked FREE India-wide Armored Shipping!</span>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-zinc-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
                <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-base text-zinc-800">Your cart is empty</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                  Browse our factory-sealed sports card boxes and mint-on-card Hot Wheels castings.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setCartOpen(false)}
                  className="mt-4 px-4 py-2 rounded-lg bg-zinc-900 text-white font-bold text-xs hover:bg-black transition-colors"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              cart.map((item) => {
                const isUnique = 'isUniqueItem' in item.product && (item.product as any).isUniqueItem
                return (
                  <div key={item.product.id} className="py-4 first:pt-0 last:pb-0 flex gap-3.5">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <Link
                            href={`/shop/products/${item.product.slug}`}
                            onClick={() => setCartOpen(false)}
                            className="font-bold text-xs text-zinc-900 line-clamp-2 hover:text-hw-flame transition-colors leading-tight"
                          >
                            {item.product.title}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-zinc-400 hover:text-red-500 transition-colors p-0.5"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Specs badge */}
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-zinc-500">
                          {isUnique && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-mono font-bold">
                              Vault Single (1 of 1)
                            </span>
                          )}
                          <span>Stock: {item.product.stock}</span>
                        </div>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-2 pt-1">
                        {isUnique ? (
                          <span className="text-[11px] font-mono text-zinc-500 font-bold">Qty: 1</span>
                        ) : (
                          <div className="flex items-center border border-zinc-200 rounded-md overflow-hidden bg-zinc-50">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="px-2 py-1 text-zinc-600 hover:bg-zinc-200 text-xs transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 font-mono text-xs font-bold text-zinc-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="px-2 py-1 text-zinc-600 hover:bg-zinc-200 text-xs transition-colors disabled:opacity-30"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        <div className="text-right">
                          <span className="font-mono font-bold text-sm text-zinc-900">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer & Order Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-zinc-200 bg-zinc-50/80 space-y-3">
              {/* High-value COD Warning */}
              {grandTotal > 7500 && (
                <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Orders above ₹7,500 require prepaid payment (UPI/Card). Cash on Delivery is disabled for high-value vault safety.
                  </span>
                </div>
              )}

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Coupon (CRATE10, MINT200)"
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:border-zinc-800 bg-white font-mono uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-black text-white text-xs font-bold transition-colors"
                >
                  Apply
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded border border-emerald-200">
                  <span className="font-mono font-bold">Code {appliedCoupon.code} applied!</span>
                  <button
                    onClick={() => applyCoupon(null)}
                    className="text-emerald-700 hover:text-red-600 text-[11px] font-bold"
                  >
                    Remove
                  </button>
                </div>
              )}

              {couponError && <p className="text-[11px] text-red-600 font-medium">{couponError}</p>}

              {/* Price Breakdown */}
              <div className="space-y-1 text-xs text-zinc-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-zinc-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon Savings</span>
                    <span className="font-mono">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>BlueDart Armored Shipping</span>
                  <span className="font-mono">
                    {shippingFee === 0 ? <strong className="text-emerald-600 uppercase text-[10px]">FREE</strong> : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-zinc-400">
                  <span>GST (18% included)</span>
                  <span className="font-mono">₹{gstPortion.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-zinc-900 pt-2 border-t border-zinc-200">
                  <span>Total Amount</span>
                  <span className="font-mono text-base">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/shop/checkout"
                  onClick={() => setCartOpen(false)}
                  className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-black text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 px-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>100% Collector Grade Packaging</span>
                  </span>
                  <Link
                    href="/shop/cart"
                    onClick={() => setCartOpen(false)}
                    className="font-bold underline text-zinc-700 hover:text-black"
                  >
                    View Full Cart
                  </Link>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
