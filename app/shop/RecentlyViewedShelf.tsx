'use client'

import React, { useEffect, useState } from 'react'
import { Eye, ChevronRight } from 'lucide-react'
import { useStore } from '@/lib/store/useStore'
import { getProductById } from '@/lib/api/products'
import { Product } from '@/types/store'
import { ProductCard } from '@/components/store/ProductCard'

export function RecentlyViewedShelf() {
  const { recentlyViewedIds, hasHydrated } = useStore()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    if (!hasHydrated || recentlyViewedIds.length === 0) return

    let isMounted = true
    const loadProducts = async () => {
      const items: Product[] = []
      for (const id of recentlyViewedIds.slice(0, 4)) {
        const prod = await getProductById(id)
        if (prod) items.push(prod)
      }
      if (isMounted) setProducts(items)
    }

    loadProducts()
    return () => {
      isMounted = false
    }
  }, [recentlyViewedIds, hasHydrated])

  if (!hasHydrated || products.length === 0) return null

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-850">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Eye className="w-4 h-4 text-zinc-400" />
            <span>Collector History</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Recently Viewed
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
