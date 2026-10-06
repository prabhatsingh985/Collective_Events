'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Product,
  HotWheelsProduct,
  SealedCardProduct,
  SingleCardProduct,
  GradedCardProduct,
  SuppliesProduct,
} from '@/types/store'
import { useStore } from '@/lib/store/useStore'
import {
  Heart,
  ShoppingBag,
  Check,
  Flame,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Star,
  Eye,
} from 'lucide-react'

interface ProductCardProps {
  product: Product
  priority?: boolean
  className?: string
}

export function ProductCard({ product, priority = false, className = '' }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist, addRecentlyViewed, setCartOpen } = useStore()
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

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product.id)
  }

  // Type Guards & Helpers
  const isHotWheels = product.productType === 'hot-wheels'
  const isCard = product.productType.startsWith('card-')
  const isGraded = product.productType === 'card-graded'

  const hw = isHotWheels ? (product as HotWheelsProduct) : null
  const sealed = product.productType === 'card-sealed' ? (product as SealedCardProduct) : null
  const single = product.productType === 'card-single' ? (product as SingleCardProduct) : null
  const graded = isGraded ? (product as GradedCardProduct) : null
  const supply = product.productType === 'supplies' ? (product as SuppliesProduct) : null

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`group relative flex flex-col rounded-xl overflow-hidden bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-xl transition-all duration-300 ${
        isHotWheels ? 'hover:shadow-orange-500/10' : isCard ? 'hover:shadow-emerald-500/10' : ''
      } ${className}`}
      onClick={() => addRecentlyViewed(product.id)}
    >
      {/* Visual Header / Rarity Badges */}
      <div className="relative aspect-square w-full bg-zinc-100 overflow-hidden flex items-center justify-center">
        {/* Graded Slab Frame Header */}
        {graded && (
          <div className="absolute top-0 inset-x-0 z-20 bg-zinc-900 border-b border-zinc-800 px-3 py-1.5 flex items-center justify-between text-[11px] font-mono text-white">
            <span className="font-bold flex items-center gap-1">
              <span className="px-1.5 py-0.2 rounded bg-amber-500 text-black font-black text-[10px]">
                {graded.gradingCompany}
              </span>
              <span>{graded.grade}</span>
            </span>
            <span className="text-zinc-400 text-[10px]">#{graded.certNumber}</span>
          </div>
        )}

        {/* Product Image */}
        <Link href={`/shop/products/${product.slug}`} className="w-full h-full block relative">
          <div className="w-full h-full relative">
            <Image
              src={product.images[0] || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={priority}
              className={`object-cover object-center group-hover:scale-105 transition-transform duration-500 ${
                isCard ? 'card-foil-shine' : 'hw-blister-gloss'
              }`}
            />
          </div>

          {/* Foil Shine Overlay for Cards */}
          {isCard && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-tr from-transparent via-emerald-400/10 to-amber-300/15" />
          )}

          {/* Blister Gloss reflection for Hot Wheels */}
          {isHotWheels && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-b from-white/20 via-transparent to-black/20" />
          )}
        </Link>

        {/* Top Badges (Left) */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1.5 items-start">
          {isHotWheels && hw?.treasureHuntType === 'Super $TH' && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-hw-yellow text-black shadow-md flex items-center gap-1 border border-black/20">
              <Flame className="w-3 h-3 text-hw-flame fill-hw-flame" />
              <span>Super $TH</span>
            </span>
          )}

          {isHotWheels && hw?.treasureHuntType === 'Regular TH' && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-black shadow-md flex items-center gap-1">
              <Flame className="w-3 h-3 text-black" />
              <span>Treasure Hunt</span>
            </span>
          )}

          {isHotWheels && hw?.series === 'Red Line Club (RLC)' && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-md">
              RLC Exclusive
            </span>
          )}

          {single?.isRookie && (
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-cards-stadium text-white shadow-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
              <span>RC Rookie</span>
            </span>
          )}

          {single?.isAutograph && (
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-md">
              On-Card Auto
            </span>
          )}

          {sealed && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white shadow-md">
              {sealed.packType}
            </span>
          )}

          {product.badge && !hw?.treasureHuntType && !single?.isRookie && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-900/90 text-white shadow-sm backdrop-blur-sm">
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Heart Button (Top Right) */}
        <button
          onClick={handleWishlist}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-zinc-700 hover:text-red-500 shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-zinc-600'
            }`}
          />
        </button>

        {/* Stock Urgency Tag (Bottom of image) */}
        <div className="absolute bottom-2 inset-x-2 z-20 flex justify-between items-center pointer-events-none">
          {product.stock <= 0 ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white shadow">
              Sold Out
            </span>
          ) : isUnique ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-black shadow font-mono">
              Only 1 In Vault
            </span>
          ) : product.stock <= 3 ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white shadow">
              Only {product.stock} Left
            </span>
          ) : null}

          {product.discountPercent > 0 && (
            <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Category / Sub-series micro-label */}
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 mb-1">
            {isHotWheels && (
              <>
                <span className="font-semibold text-hw-orange">{hw?.series}</span>
                <span>•</span>
                <span>{hw?.scale}</span>
                <span>•</span>
                <span>{hw?.year}</span>
              </>
            )}
            {isCard && (
              <>
                <span className="font-semibold text-emerald-600">
                  {single?.sport || sealed?.sport || graded?.sport}
                </span>
                <span>•</span>
                <span>{single?.team || sealed?.brand || graded?.team}</span>
              </>
            )}
            {supply && (
              <>
                <span className="font-semibold text-blue-600">Protective Supplies</span>
                <span>•</span>
                <span>Pack of {supply.packSize}</span>
              </>
            )}
          </div>

          {/* Product Title */}
          <Link href={`/shop/products/${product.slug}`} className="group-hover:text-hw-flame transition-colors">
            <h3 className="font-bold text-sm text-zinc-900 leading-snug line-clamp-2">
              {product.title}
            </h3>
          </Link>

          {/* Condition / Card Spec snippet */}
          <div className="mt-1.5 text-xs text-zinc-600 line-clamp-1">
            {isHotWheels && (
              <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{hw?.packagingCondition}</span>
                {hw?.wheelType.includes('Real Riders') && <span className="font-semibold text-zinc-700">• Rubber Tires</span>}
              </span>
            )}
            {single && (
              <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>{single.cardCondition}</span>
                {single.printRun && <span className="font-mono font-bold text-zinc-800">• {single.printRun}</span>}
              </span>
            )}
            {graded && (
              <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>{graded.slabCondition}</span>
                <span>• Cert: {graded.certNumber}</span>
              </span>
            )}
            {sealed && (
              <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span>{sealed.cardsPerPack} Cards/Pack • {sealed.packsPerBox} Packs</span>
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Action */}
        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-base text-zinc-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-zinc-400 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-zinc-400 font-medium">Incl. GST + Armored Pack</span>
          </div>

          {/* Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 shadow-sm ${
              product.stock <= 0
                ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-900 hover:bg-black text-white hover:scale-102 active:scale-98'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>

        {/* Error / Urgency Toast */}
        {toastMessage && (
          <div className="text-[11px] font-semibold text-red-600 bg-red-50 p-1.5 rounded border border-red-200 animate-shake">
            {toastMessage}
          </div>
        )}
      </div>
    </motion.div>
  )
}
