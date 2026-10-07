'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import { useApp } from '@/context/AppContext'
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle,
  Truck,
  Tag,
  CreditCard,
  MapPin,
  ExternalLink,
} from 'lucide-react'

export function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
    currentUser,
  } = useApp()

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'success'>('cart')
  const [couponCode, setCouponCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0)
  const [discountCodeMessage, setDiscountCodeMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null)

  // Shipping Form State
  const [customerName, setCustomerName] = useState(currentUser.name || 'Shreyash Srivastava')
  const [customerPhone, setCustomerPhone] = useState('+91 98201 55902')
  const [customerEmail, setCustomerEmail] = useState('shreyash@collectorevents.com')
  const [customerAddress, setCustomerAddress] = useState('Flat 402, Sea Green Apartments, Bandra West')
  const [customerCity, setCustomerCity] = useState('Mumbai')
  const [customerPincode, setCustomerPincode] = useState('400050')
  const [customerState, setCustomerState] = useState('Maharashtra')
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Cash on Delivery'>('UPI')

  if (!isCartOpen) return null

  const totalItems = cartItems.reduce((acc, curr) => acc + curr.quantity, 0)
  const subtotal = cartItems.reduce(
    (acc, curr) => acc + curr.product.price * curr.quantity,
    0
  )
  const shippingFee = subtotal >= 999 ? 0 : 99
  const totalAmount = Math.max(0, subtotal - appliedDiscount + shippingFee)

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    const code = couponCode.trim().toUpperCase()
    if (code === 'COLLECTOR10' || code === 'CRATE10') {
      const discount = Math.round(subtotal * 0.1)
      setAppliedDiscount(discount)
      setDiscountCodeMessage('Coupon COLLECTOR10 applied! 10% collector discount saved.')
    } else if (code === 'MINT200') {
      setAppliedDiscount(200)
      setDiscountCodeMessage('Coupon MINT200 applied! ₹200 instant savings.')
    } else {
      setDiscountCodeMessage('Invalid coupon code. Try COLLECTOR10 or MINT200.')
    }
  }

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const order = await placeOrder(
        {
          name: customerName,
          phone: customerPhone,
          email: customerEmail,
          address: customerAddress,
          city: customerCity,
          pincode: customerPincode,
          state: customerState,
        },
        paymentMethod,
        appliedDiscount
      )

      setPlacedOrderId(order.id)
      setCheckoutStep('success')

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#ff4444', '#f8c4ff', '#96c4ff', '#000000', '#20c997'],
        })
      } catch {}
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsCartOpen(false)
    if (checkoutStep === 'success') {
      setCheckoutStep('cart')
      setPlacedOrderId(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-pure-canvas shadow-2xl flex flex-col justify-between border-l border-silver">
          {/* Header */}
          <div className="p-5 border-b border-silver/60 bg-sky-periwinkle/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-midnight-ink text-pure-canvas flex items-center justify-center font-bold text-sm">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-midnight-ink flex items-center gap-2">
                  <span>Collector Cart</span>
                  <span className="px-2 py-0.5 bg-party-pink/60 text-midnight-ink rounded-full text-xs font-bold">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'}
                  </span>
                </h3>
                <p className="text-[11px] text-slate font-medium">
                  1:64 Die-Cast Toy Collectibles · Prime Fulfillment
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full border border-silver/60 flex items-center justify-center text-graphite hover:text-midnight-ink hover:bg-fog transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* STEP 1: CART ITEMS */}
            {checkoutStep === 'cart' && (
              <>
                {cartItems.length === 0 ? (
                  <div className="py-16 text-center space-y-4">
                    <div className="w-16 h-16 bg-fog rounded-full mx-auto flex items-center justify-center text-3xl">
                      🏎️
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-base text-midnight-ink">
                        Your Collector Cart is Empty
                      </h4>
                      <p className="text-xs text-slate max-w-xs mx-auto">
                        Discover rare Super Treasure Hunts, RLC exclusives, and Car Culture die-cast castings.
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="px-5 py-2.5 bg-midnight-ink text-pure-canvas text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Browse Hot Wheels Store
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Free shipping progress */}
                    <div className="p-3 bg-fog/70 border border-silver/50 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-midnight-ink">
                        <span className="flex items-center gap-1.5 text-[11px]">
                          <Truck className="w-3.5 h-3.5 text-spearmint" />
                          {subtotal >= 999
                            ? '🎉 You unlocked FREE Collector Express Delivery!'
                            : `Add ₹${999 - subtotal} more for FREE Express Delivery`}
                        </span>
                        <span className="text-[10px] text-slate">Min ₹999</span>
                      </div>
                      <div className="w-full bg-silver/60 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-spearmint h-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (subtotal / 999) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Cart Items List */}
                    <div className="space-y-3">
                      {cartItems.map(({ product, quantity }) => (
                        <div
                          key={product.id}
                          className="p-3 bg-black/[0.02] border border-silver/60 rounded-xl flex gap-3 items-start relative group"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-16 h-16 object-cover rounded-lg border border-silver/50 shrink-0"
                          />

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="px-2 py-0.5 bg-sky-periwinkle text-midnight-ink text-[10px] font-bold rounded-full truncate">
                                {product.series}
                              </span>
                              <button
                                onClick={() => removeFromCart(product.id)}
                                className="text-slate hover:text-crimson transition-colors p-1"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <h4 className="font-bold text-xs text-midnight-ink line-clamp-1">
                              {product.title}
                            </h4>

                            <div className="text-[10px] text-slate space-y-0.5">
                              <p>🛞 {product.wheelType}</p>
                              <p>📦 {product.packagingCondition}</p>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-sm text-midnight-ink">
                                  ₹{product.price * quantity}
                                </span>
                                {quantity > 1 && (
                                  <span className="text-[10px] text-slate">
                                    (₹{product.price} each)
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center border border-silver rounded-lg bg-pure-canvas">
                                <button
                                  onClick={() => updateCartQuantity(product.id, quantity - 1)}
                                  className="p-1 hover:bg-fog text-slate hover:text-midnight-ink"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-2 text-xs font-bold text-midnight-ink">
                                  {quantity}
                                </span>
                                <button
                                  onClick={() => updateCartQuantity(product.id, quantity + 1)}
                                  className="p-1 hover:bg-fog text-slate hover:text-midnight-ink"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Coupon Box */}
                    <form onSubmit={handleApplyCoupon} className="space-y-1.5 pt-2">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-slate" />
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Enter promo code (e.g. CRATE10)"
                            className="w-full pl-9 pr-3 py-2 bg-pure-canvas border border-silver rounded-lg text-xs font-semibold text-midnight-ink uppercase placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-black/[0.06] hover:bg-black/[0.1] text-midnight-ink text-xs font-bold rounded-lg border border-silver transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      {discountCodeMessage && (
                        <p className={`text-[11px] font-semibold ${appliedDiscount > 0 ? 'text-spearmint' : 'text-crimson'}`}>
                          {discountCodeMessage}
                        </p>
                      )}
                    </form>

                    {/* Packaging & BIS Assurance */}
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1 text-[11px] text-amber-950">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900">
                        <ShieldCheck className="w-4 h-4 text-amber-700" />
                        <span>Armored Packaging Guarantee</span>
                      </div>
                      <p className="text-[10px] text-amber-900/90 leading-relaxed">
                        All Hot Wheels 1:64 blisters are shipped in double-walled corrugated cartons with custom corner edge protectors and bubble pillows to guarantee zero card crease.
                      </p>
                    </div>
                  </>
                )}
              </>
            )}

            {/* STEP 2: SHIPPING & PAYMENT DETAILS */}
            {checkoutStep === 'shipping' && (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-silver/60">
                  <h4 className="font-bold text-sm text-midnight-ink flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-midnight-blue" />
                    <span>Delivery & Payment Information</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="text-xs text-slate hover:text-midnight-ink font-semibold"
                  >
                    ← Back to Cart
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-midnight-ink block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-semibold text-midnight-ink block mb-1">
                        Mobile Phone *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-midnight-ink block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-midnight-ink block mb-1">
                      Street Address / Flat / Floor *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-midnight-ink block mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerCity}
                        onChange={(e) => setCustomerCity(e.target.value)}
                        className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-midnight-ink block mb-1">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerPincode}
                        onChange={(e) => setCustomerPincode(e.target.value)}
                        className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-midnight-ink block mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerState}
                        onChange={(e) => setCustomerState(e.target.value)}
                        className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                      />
                    </div>
                  </div>

                  {/* Payment method selection */}
                  <div>
                    <label className="text-[11px] font-semibold text-midnight-ink block mb-1.5">
                      Payment Mode *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'UPI', label: 'Instant UPI (GPay/PhonePe)', icon: '⚡' },
                        { id: 'Card', label: 'Debit/Credit Card', icon: '💳' },
                        { id: 'Cash on Delivery', label: 'Pay on Delivery', icon: '💵' },
                      ].map((m) => (
                        <div
                          key={m.id}
                          onClick={() => setPaymentMethod(m.id as any)}
                          className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                            paymentMethod === m.id
                              ? 'border-midnight-ink bg-midnight-ink text-pure-canvas font-bold shadow-sm'
                              : 'border-silver bg-pure-canvas text-graphite hover:border-slate'
                          }`}
                        >
                          <div className="text-base mb-0.5">{m.icon}</div>
                          <div className="text-[10px] leading-tight font-semibold">{m.id}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-spearmint hover:opacity-90 text-pure-canvas font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-4"
                >
                  {isSubmitting ? (
                    <span className="animate-spin">⏳ Placing Order...</span>
                  ) : (
                    <>
                      <span>Confirm & Place Order (₹{totalAmount})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 3: ORDER SUCCESS & WMS ROUTING CONFIRMATION */}
            {checkoutStep === 'success' && (
              <div className="py-8 text-center space-y-5">
                <div className="w-16 h-16 bg-spearmint/20 text-spearmint rounded-full mx-auto flex items-center justify-center text-3xl">
                  <CheckCircle className="w-10 h-10" />
                </div>

                <div className="space-y-1.5">
                  <span className="px-3 py-1 bg-spearmint/15 text-spearmint text-xs font-bold rounded-full">
                    Order Confirmed & Paid
                  </span>
                  <h3 className="font-extrabold text-xl text-midnight-ink">
                    Thank You for Your Order!
                  </h3>
                  <p className="text-xs text-slate font-medium">
                    Order ID: <strong className="text-midnight-ink font-mono font-bold">#{placedOrderId}</strong>
                  </p>
                </div>

                <div className="p-4 bg-fog/80 border border-silver rounded-2xl text-left space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-silver/60 pb-2">
                    <span className="text-slate">Estimated Dispatch:</span>
                    <span className="font-bold text-midnight-ink">Within 24 Hours</span>
                  </div>
                  <div className="flex items-center justify-between text-xs border-b border-silver/60 pb-2">
                    <span className="text-slate">Courier Partner:</span>
                    <span className="font-bold text-midnight-ink">BlueDart Air Express</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate">Fulfillment Engine:</span>
                    <span className="font-bold text-midnight-blue">CollectorEvents WMS Hub</span>
                  </div>
                </div>

                <div className="p-3 bg-sky-periwinkle/30 border border-sky-periwinkle rounded-xl text-xs text-midnight-ink text-left space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-midnight-blue">
                    <span>🏭 Admin Fulfillment Status:</span>
                  </p>
                  <p className="text-[11px] text-slate">
                    This order is now live in the internal <strong>Admin Warehouse Management System (WMS)</strong> for automated S-Curve wave picking, box packing, and AWB generation.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <Link
                    href="/admin"
                    onClick={handleClose}
                    className="w-full py-2.5 bg-midnight-ink text-pure-canvas text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:opacity-90 shadow-sm"
                  >
                    <span>View in Admin WMS Hub</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={handleClose}
                    className="w-full py-2.5 bg-pure-canvas border border-silver text-graphite text-xs font-bold rounded-xl hover:bg-fog"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions when on Cart step */}
          {checkoutStep === 'cart' && cartItems.length > 0 && (
            <div className="p-5 border-t border-silver/60 bg-fog/40 space-y-3">
              {/* Pricing breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate">
                  <span>Subtotal ({totalItems} castings):</span>
                  <span className="font-semibold text-midnight-ink">₹{subtotal}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-spearmint font-semibold">
                    <span>Collector Discount:</span>
                    <span>-₹{appliedDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate">
                  <span>Shipping (Collector Express):</span>
                  <span>{shippingFee === 0 ? <strong className="text-spearmint">FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-midnight-ink pt-1.5 border-t border-silver/60">
                  <span>Total Amount:</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              <button
                onClick={() => setCheckoutStep('shipping')}
                className="w-full py-3.5 bg-midnight-ink hover:opacity-90 text-pure-canvas font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
