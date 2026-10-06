'use client'

import React, { useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import confetti from 'canvas-confetti'
import {
  CheckCircle2,
  Package,
  Truck,
  Printer,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'
import { StoreMobileNav } from '@/components/store/StoreMobileNav'
import { useStore } from '@/lib/store/useStore'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || 'ORD-9921'
  const { orders } = useStore()

  const order = orders.find((o) => o.id === orderId) || orders[0]

  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#ff5400', '#ffd000', '#00d4aa', '#ffffff'],
      })
    } catch (e) {}
  }, [])

  const handlePrintInvoice = () => {
    window.print()
  }

  return (
    <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full pb-20">
      {/* Success Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block">
          Payment & Allocation Confirmed
        </span>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Thank You for Your Collector Order!
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
          Order <strong className="text-white font-mono">{order?.id}</strong> has been allocated in our Mumbai WMS vault. BlueDart Air Express tracking is generated below.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            onClick={handlePrintInvoice}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-200 hover:text-white flex items-center gap-1.5 shadow"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Download Tax Invoice</span>
          </button>

          <Link
            href="/shop/account?tab=orders"
            className="px-4 py-2 rounded-xl bg-hw-orange hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-orange-600/20"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Track Live on Timeline</span>
          </Link>
        </div>
      </div>

      {/* Order Details Card (Printable) */}
      {order && (
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-2xl print:bg-white print:text-black print:border-none">
          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-800 text-xs">
            <div>
              <span className="text-zinc-500 block">Order Identifier</span>
              <span className="font-mono font-black text-white text-sm">{order.id}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Invoice Number</span>
              <span className="font-mono text-zinc-300">{order.invoiceNumber}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Order Date</span>
              <span className="text-zinc-300">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Status</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 font-mono">
                {order.status}
              </span>
            </div>
          </div>

          {/* Courier & AWB Bar */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-hw-orange shrink-0" />
              <div>
                <span className="font-bold text-white block">{order.courier}</span>
                <span className="text-[11px] text-zinc-500">
                  AWB Barcode: <strong className="text-zinc-300 font-mono">{order.trackingAwb}</strong>
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
              Armored Bubble Wrap Fitted
            </span>
          </div>

          {/* Purchased Items */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400">
              Allocated Vault Items
            </h3>
            <div className="divide-y divide-zinc-800 text-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-zinc-400">{item.quantity}x</span>
                    <div>
                      <span className="font-bold text-white block truncate max-w-md">
                        {item.product.title}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        SKU: {item.product.sku}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-white shrink-0">
                    ₹{(item.priceAtPurchase * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-800 text-xs">
            <div>
              <span className="font-bold text-zinc-400 block mb-1">Delivery Destination:</span>
              <p className="text-white font-medium">{order.shippingAddress.fullName}</p>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                {order.shippingAddress.addressLine}, {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                <strong className="text-zinc-300 font-mono">{order.shippingAddress.pincode}</strong>
              </p>
              <p className="text-zinc-500 font-mono text-[11px] mt-1">
                Phone: {order.shippingAddress.phone}
              </p>
            </div>

            <div className="space-y-1.5 text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-white">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span className="font-mono">-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-mono">{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-zinc-800">
                <span>Total Paid ({order.paymentMethod})</span>
                <span className="font-mono text-lg text-white">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back Link */}
      <div className="mt-8 text-center">
        <Link
          href="/shop"
          className="text-xs font-bold text-zinc-400 hover:text-white flex items-center justify-center gap-1 transition-colors"
        >
          <span>Back to CrateMeet Store</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </main>
  )
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans selection:bg-hw-orange selection:text-white">
      <StoreNavbar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-xs text-zinc-400">Loading order receipt...</div>}>
        <OrderSuccessContent />
      </Suspense>
      <StoreFooter />
      <StoreMobileNav />
    </div>
  )
}
