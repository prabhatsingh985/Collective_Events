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
    <div className="group rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-4 transition-all flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Thumbnail */}
      <div className="relative w-full sm:w-28 sm:h-28 aspect-square rounded-lg overflow-hidden bg-black shrink-0 border border-zinc-800">
        <Image src={product.images[0]} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform" />
        {product.discountPercent > 0 && (
          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-600 text-white">
            {product.discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 w-full sm:w-auto">
        <div className="flex items-center gap-2 mb-1 text-[11px] text-zinc-400">
          {hw && <span className="font-semibold text-hw-orange">{hw.series} • {hw.year}</span>}
          {single && <span className="font-semibold text-emerald-400">{single.sport} • {single.team}</span>}
          {graded && <span className="font-semibold text-amber-400">{graded.gradingCompany} {graded.grade}</span>}
          {sealed && <span className="font-semibold text-blue-400">{sealed.packType}</span>}
          <span>•</span>
          <span>SKU: {product.sku}</span>
        </div>

        <Link href={`/shop/products/${product.slug}`} className="hover:text-hw-orange transition-colors">
          <h3 className="font-bold text-base text-white truncate">{product.title}</h3>
        </Link>

        <p className="text-xs text-zinc-400 line-clamp-1 mt-1">{product.description}</p>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          {isUnique && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Only 1 In Vault
            </span>
          )}
          {product.stock <= 3 && !isUnique && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-600/20 text-orange-400">
              Only {product.stock} left
            </span>
          )}
          {product.badge && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300">
              {product.badge}
            </span>
          )}
          <div className="flex items-center gap-1 text-[11px] text-amber-400">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>{product.rating}</span>
            <span className="text-zinc-500">({product.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Price & Action */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
        <div className="text-left sm:text-right">
          <div className="font-mono text-lg font-black text-white">
            ₹{product.price.toLocaleString('en-IN')}
          </div>
          {product.mrp > product.price && (
            <span className="text-xs text-zinc-500 line-through">
              ₹{product.mrp.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleWishlist(product.id)}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-red-500 transition-colors"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              product.stock <= 0
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-hw-orange hover:bg-orange-600 text-white'
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
      </div>
    </div>
  )
}
