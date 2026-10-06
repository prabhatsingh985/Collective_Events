'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Product,
  HotWheelsProduct,
  SingleCardProduct,
  GradedCardProduct,
  SealedCardProduct,
  SuppliesProduct,
} from '@/types/store'
import { useStore } from '@/lib/store/useStore'
import { Heart, ShoppingBag, Check, Flame, Sparkles, Star } from 'lucide-react'

interface ProductRowCardProps {
  product: Product
}

export function ProductRowCard({ product }: ProductRowCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore()
  const [isAdded, setIsAdded] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const isFavorite = isInWishlist(product.id)
  const isUnique = 'isUniqueItem' in product && (product as any).isUniqueItem

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const result = addToCart(product, 1)
    if (result.success) {
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    } else {
      setToastMessage(result.message)
      setTimeout(() => setToastMessage(null), 3000)
    }
  }

  const isHotWheels = product.productType === 'hot-wheels'
  const hw = isHotWheels ? (product as HotWheelsProduct) : null
  const single = product.productType === 'card-single' ? (product as SingleCardProduct) : null
  const graded = product.productType === 'card-graded' ? (product as GradedCardProduct) : null
  const sealed = product.productType === 'card-sealed' ? (product as SealedCardProduct) : null

  return (
    <div className="group rounded-2xl bg-pure-canvas border border-silver/60 hover:border-silver/90 hover:shadow-card p-4 transition-all duration-200 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Thumbnail */}
      <div className="relative w-full sm:w-28 sm:h-28 aspect-square rounded-xl overflow-hidden bg-fog/20 shrink-0 border border-silver/40">
        <Image src={product.images[0]} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform" />
        {product.discountPercent > 0 && (
          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-600 text-pure-canvas">
            {product.discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 w-full sm:w-auto">
        <div className="flex items-center gap-2 mb-1 text-[11px] text-slate">
          {hw && <span className="font-semibold text-orange-600">{hw.series} • {hw.year}</span>}
          {single && <span className="font-semibold text-emerald-600">{single.sport} • {single.team}</span>}
          {graded && <span className="font-semibold text-amber-600">{graded.gradingCompany} {graded.grade}</span>}
          {sealed && <span className="font-semibold text-blue-600">{sealed.packType}</span>}
          <span>•</span>
          <span className="font-mono">SKU: {product.sku}</span>
        </div>

        <Link href={`/shop/products/${product.slug}`} className="hover:underline">
          <h3 className="font-extrabold text-sm sm:text-base text-midnight-ink truncate">{product.title}</h3>
        </Link>

        <p className="text-xs text-slate line-clamp-1 mt-1">{product.description}</p>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          {isUnique && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Only 1 In Vault
            </span>
          )}
          {product.stock <= 3 && !isUnique && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-900">
              Only {product.stock} left
            </span>
          )}
          {product.badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/[0.04] text-midnight-ink border border-silver/40">
              {product.badge}
            </span>
          )}
          <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>{product.rating}</span>
            <span className="text-slate font-normal">({product.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Pricing & Add to Cart Action */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-silver/40">
        <div className="text-left sm:text-right">
          <div className="text-base sm:text-lg font-extrabold text-midnight-ink">
            ₹{product.price.toLocaleString('en-IN')}
          </div>
          {product.mrp > product.price && (
            <div className="text-xs text-slate line-through">
              ₹{product.mrp.toLocaleString('en-IN')}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleWishlist(product.id)}
            className="p-2 rounded-full border border-silver/50 hover:border-midnight-ink text-slate hover:text-red-500 transition-colors"
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className={`px-4 py-2 rounded-[8px] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
              product.stock <= 0
                ? 'bg-silver text-slate cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-600 text-pure-canvas'
                : 'bg-midnight-ink text-pure-canvas hover:opacity-90 active:scale-[0.98]'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>

        {toastMessage && (
          <span className="text-[10px] font-bold text-red-600 animate-shake">{toastMessage}</span>
        )}
      </div>
    </div>
  )
}
