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
        colors: ['#f8c4ff', '#96c4ff', '#d9c58b', '#000000', '#31c431'],
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
        <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-700 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 block">
          Payment & Allocation Confirmed
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-midnight-ink tracking-tight font-display">
          Thank You for Your Collector Order!
        </h1>

        <p className="text-xs sm:text-sm text-slate max-w-md mx-auto">
          Order <strong className="text-midnight-ink font-mono font-bold">{order?.id}</strong> has been allocated in our Mumbai WMS vault. BlueDart Air Express tracking is generated below.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            onClick={handlePrintInvoice}
            className="px-4 py-2 rounded-[8px] bg-pure-canvas border border-silver text-xs font-bold text-midnight-ink hover:border-midnight-ink flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Download Tax Invoice</span>
          </button>

          <Link
            href="/shop/account?tab=orders"
            className="px-4 py-2 rounded-[8px] bg-midnight-ink hover:opacity-90 text-pure-canvas text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Truck className="w-3.5 h-3.5 text-party-pink" />
            <span>Track Live on Timeline</span>
          </Link>
        </div>
      </div>

      {/* Order Details Card (Printable) */}
      {order && (
        <div className="rounded-3xl bg-pure-canvas border border-silver/60 p-6 sm:p-8 space-y-6 shadow-sm print:bg-white print:text-black print:border-none">
          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-silver/40 text-xs">
            <div>
              <span className="text-ash block">Order Identifier</span>
              <span className="font-mono font-extrabold text-midnight-ink text-sm">{order.id}</span>
            </div>
            <div>
              <span className="text-ash block">Invoice Number</span>
              <span className="font-mono font-bold text-slate">{order.invoiceNumber || 'INV-2026-881'}</span>
            </div>
            <div>
              <span className="text-ash block">Order Date</span>
              <span className="text-slate font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div>
              <span className="text-ash block">Status</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 font-mono">
                {order.status}
              </span>
            </div>
          </div>

          {/* Courier & AWB Bar */}
          <div className="p-4 rounded-2xl bg-black/[0.02] border border-silver/50 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-orange-600 shrink-0" />
              <div>
                <span className="font-bold text-midnight-ink block">{order.courier || 'BlueDart Air Express'}</span>
                <span className="text-[11px] text-slate">
                  AWB Barcode: <strong className="text-midnight-ink font-mono">{order.trackingAwb || 'BLUEDART-AIR-782194'}</strong>
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Armored Bubble Wrap Fitted
            </span>
          </div>

          {/* Purchased Items */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate">
              Allocated Vault Items
            </h3>
            <div className="divide-y divide-silver/40 text-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate">{item.quantity}x</span>
                    <div>
                      <span className="font-bold text-midnight-ink block truncate max-w-md">
                        {item.product.title}
                      </span>
                      <span className="text-[11px] text-ash font-mono">
                        SKU: {item.product.sku}
                      </span>
                    </div>
                  </div>
                  <span className="font-extrabold text-midnight-ink shrink-0">
                    ₹{((item.priceAtPurchase || item.product.price) * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-silver/40 text-xs">
            <div>
              <span className="font-bold text-slate block mb-1">Delivery Destination:</span>
              <p className="text-midnight-ink font-bold">{order.shippingAddress.fullName}</p>
              <p className="text-slate text-[11px] mt-0.5">
                {order.shippingAddress.addressLine}, {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                <strong className="text-midnight-ink font-mono">{order.shippingAddress.pincode}</strong>
              </p>
              <p className="text-ash font-mono text-[11px] mt-1">
                Phone: {order.shippingAddress.phone}
              </p>
            </div>

            <div className="space-y-1.5 text-slate">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-extrabold text-midnight-ink">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount</span>
                  <span className="font-mono">-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-mono">{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-midnight-ink pt-2 border-t border-silver/40">
                <span>Total Paid ({order.paymentMethod})</span>
                <span className="font-mono text-lg text-midnight-ink">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back Link */}
      <div className="mt-8 text-center">
        <Link
          href="/shop"
          className="text-xs font-bold text-slate hover:text-midnight-ink flex items-center justify-center gap-1 transition-colors"
        >
          <span>Back to CollectorEvents Store</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </main>
  )
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-pure-canvas text-midnight-ink flex flex-col font-sans selection:bg-party-pink selection:text-midnight-ink">
      <StoreNavbar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-xs text-slate">Loading order receipt...</div>}>
        <OrderSuccessContent />
      </Suspense>
      <StoreFooter />
    </div>
  )
}
