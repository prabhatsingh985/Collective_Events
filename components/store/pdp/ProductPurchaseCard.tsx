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
    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-6 shadow-2xl">
      {/* Price Header */}
      <div>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-3xl sm:text-4xl font-black text-white">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.mrp > product.price && (
            <span className="text-base text-zinc-400 line-through">
              ₹{product.mrp.toLocaleString('en-IN')}
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-600 text-white shadow">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1.5 text-xs text-zinc-400">
          <span className="text-zinc-300 font-medium">Inclusive of 18% GST</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">Free Armored Shipping (orders ₹999+)</span>
        </div>
      </div>

      {/* Stock Urgency Indicator */}
      <div>
        {isOutOfStock ? (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-900/60 text-xs text-red-300 flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>Currently Out of Stock in Vault</span>
          </div>
        ) : isUnique ? (
          <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800/80 text-xs text-amber-200 flex items-center justify-between font-bold">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Only 1 Available — Unique Collector Piece</span>
            </span>
            <span className="text-[10px] font-mono text-amber-300 uppercase">Limit 1/Customer</span>
          </div>
        ) : product.stock <= 3 ? (
          <div className="p-3 rounded-xl bg-orange-950/60 border border-orange-800/80 text-xs text-orange-200 flex items-center gap-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            <span>Low Stock Alert: Only {product.stock} units remaining</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>In Stock — Ready for Express Dispatch</span>
          </div>
        )}
      </div>

      {/* Error Message Toast */}
      {toastError && (
        <div className="p-3 rounded-xl bg-red-900/40 border border-red-800 text-xs text-red-200 font-semibold animate-shake">
          {toastError}
        </div>
      )}

      {/* Out of Stock Alert Form */}
      {isOutOfStock ? (
        <div className="pt-2">
          {alertSubmitted ? (
            <p className="text-xs text-emerald-400 font-bold">
              ✓ We will alert you the moment this casting / pack is restocked!
            </p>
          ) : (
            <form onSubmit={handleRestockAlert} className="space-y-2">
              <span className="text-xs font-bold text-zinc-300 block">
                Notify me when restocked:
              </span>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-hw-orange"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-colors shrink-0"
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
            <span className="text-xs font-bold text-zinc-300">Quantity:</span>
            {isUnique ? (
              <span className="px-3 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono font-bold text-zinc-400">
                1 (Single Copy Locked)
              </span>
            ) : (
              <div className="flex items-center border border-zinc-700 rounded-xl overflow-hidden bg-zinc-950">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 text-xs transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 font-mono text-xs font-black text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 text-xs transition-colors disabled:opacity-30"
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
              className="w-full py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
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
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-hw-orange to-red-600 hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-orange-600/20 transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Instant Buy Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Wishlist Button */}
      <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
        <button
          onClick={() => toggleWishlist(product.id)}
          className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          <span>{isFavorite ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
        </button>

        <span className="text-[11px] font-mono text-zinc-500">
          SKU: {product.sku}
        </span>
      </div>

      {/* Trust Mini Strip */}
      <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 space-y-1.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>100% Genuine BIS / Panini Tamper-Seal Inspected</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Secure Encrypted UPI & Card Checkout</span>
        </div>
      </div>
    </div>
  )
}
