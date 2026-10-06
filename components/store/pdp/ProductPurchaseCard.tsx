'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ShoppingBag,
  Zap,
  Heart,
  Plus,
  Minus,
  Check,
  ShieldCheck,
  Lock,
  Bell,
  AlertCircle,
} from 'lucide-react'
import { Product } from '@/types/store'
import { useStore } from '@/lib/store/useStore'

interface ProductPurchaseCardProps {
  product: Product
}

export function ProductPurchaseCard({ product }: ProductPurchaseCardProps) {
  const router = useRouter()
  const { addToCart, isInWishlist, toggleWishlist, setCartOpen } = useStore()
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [toastError, setToastError] = useState<string | null>(null)
  const [alertEmail, setAlertEmail] = useState('')
  const [alertSubmitted, setAlertSubmitted] = useState(false)

  const isFavorite = isInWishlist(product.id)
  const isUnique = 'isUniqueItem' in product && (product as any).isUniqueItem
  const isOutOfStock = product.stock <= 0

  const handleAddToCart = () => {
    const res = addToCart(product, quantity)
    if (res.success) {
      setIsAdded(true)
      setCartOpen(true)
      setTimeout(() => setIsAdded(false), 2000)
    } else {
      setToastError(res.message)
      setTimeout(() => setToastError(null), 3500)
    }
  }

  const handleBuyNow = () => {
    const res = addToCart(product, quantity)
    if (res.success) {
      router.push('/shop/checkout')
    } else {
      setToastError(res.message)
    }
  }

  const handleRestockAlert = (e: React.FormEvent) => {
    e.preventDefault()
    if (!alertEmail.trim()) return
    setAlertSubmitted(true)
  }

  return (
    <div className="rounded-3xl bg-pure-canvas border border-silver/70 p-6 space-y-6 shadow-card">
      {/* Price Header */}
      <div>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl sm:text-4xl font-extrabold text-midnight-ink font-display">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.mrp > product.price && (
            <span className="text-base text-slate line-through">
              ₹{product.mrp.toLocaleString('en-IN')}
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-600 text-pure-canvas shadow-sm">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1.5 text-xs text-slate">
          <span className="text-midnight-ink font-medium">Inclusive of 18% GST</span>
          <span>•</span>
          <span className="text-emerald-700 font-semibold">Free Armored Air Shipping (orders ₹999+)</span>
        </div>
      </div>

      {/* Stock Urgency Indicator */}
      <div>
        {isOutOfStock ? (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Currently Out of Stock in Vault</span>
          </div>
        ) : isUnique ? (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between font-bold">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>Only 1 Available — Unique Collector Piece</span>
            </span>
            <span className="text-[10px] font-mono text-amber-800 uppercase px-2 py-0.5 bg-amber-100 rounded">
              Limit 1/Customer
            </span>
          </div>
        ) : product.stock <= 3 ? (
          <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-900 flex items-center gap-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            <span>Low Stock Alert: Only {product.stock} units remaining</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>In Stock — Ready for Express Dispatch</span>
          </div>
        )}
      </div>

      {/* Error Message Toast */}
      {toastError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold animate-shake">
          {toastError}
        </div>
      )}

      {/* Out of Stock Alert Form */}
      {isOutOfStock ? (
        <div className="pt-2">
          {alertSubmitted ? (
            <p className="text-xs text-emerald-700 font-bold">
              ✓ We will alert you the moment this casting / pack is restocked!
            </p>
          ) : (
            <form onSubmit={handleRestockAlert} className="space-y-2">
              <span className="text-xs font-bold text-midnight-ink block">
                Notify me when restocked:
              </span>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-xs rounded-[8px] bg-pure-canvas border border-silver text-midnight-ink placeholder:text-ash focus:outline-none focus:border-midnight-ink"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-[8px] bg-midnight-ink text-pure-canvas text-xs font-bold transition-opacity hover:opacity-85 shrink-0"
                >
                  Alert Me
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* Purchase Controls */
        <div className="space-y-4">
          {/* Quantity Selector (Hidden or locked if unique item) */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-midnight-ink">Quantity:</span>
            {isUnique ? (
              <span className="px-3 py-1 rounded-[8px] bg-black/[0.04] border border-silver text-xs font-mono font-bold text-slate">
                1 (Single Copy Locked)
              </span>
            ) : (
              <div className="flex items-center border border-silver rounded-[8px] overflow-hidden bg-pure-canvas">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-slate hover:text-midnight-ink hover:bg-black/[0.04] text-xs transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 font-mono text-xs font-extrabold text-midnight-ink">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="px-3 py-1.5 text-slate hover:text-midnight-ink hover:bg-black/[0.04] text-xs transition-colors disabled:opacity-30"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 rounded-[8px] bg-black/[0.04] hover:bg-black/[0.08] border border-silver/70 text-midnight-ink font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full py-3.5 rounded-[8px] bg-midnight-ink text-pure-canvas hover:opacity-90 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
            >
              <Zap className="w-4 h-4 text-party-pink fill-party-pink" />
              <span>Instant Buy Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Wishlist Button */}
      <div className="pt-2 border-t border-silver/40 flex items-center justify-between">
        <button
          onClick={() => toggleWishlist(product.id)}
          className="flex items-center gap-2 text-xs font-bold text-slate hover:text-midnight-ink transition-colors"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          <span>{isFavorite ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
        </button>

        <span className="text-[11px] font-mono text-ash">
          SKU: {product.sku}
        </span>
      </div>

      {/* Trust Mini Strip */}
      <div className="pt-2 border-t border-silver/40 text-[11px] text-slate space-y-1.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>100% Genuine BIS / Panini Tamper-Seal Inspected</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Secure Encrypted UPI & Card Checkout</span>
        </div>
      </div>
    </div>
  )
}
