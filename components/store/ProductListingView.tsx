'use client'

import React, { useState, useMemo } from 'react'
import { Product } from '@/types/store'
import { FilterSidebar, FilterState } from './FilterSidebar'
import { ListingHeader } from './ListingHeader'
import { ProductCard } from './ProductCard'
import { ProductRowCard } from './ProductRowCard'
import { PackageOpen, Sparkles } from 'lucide-react'

interface ProductListingViewProps {
  initialProducts: Product[]
  category: 'all' | 'hot-wheels' | 'cards' | 'sealed' | 'graded' | 'supplies'
  title: string
  subtitle: string
  badge?: string
  initialFilters?: Partial<FilterState>
}

export function ProductListingView({
  initialProducts,
  category,
  title,
  subtitle,
  badge,
  initialFilters = {},
}: ProductListingViewProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating'>('featured')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [displayCount, setDisplayCount] = useState(12)

  // Filter and sort items client-side
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts]

    if (filters.inStockOnly) {
      result = result.filter((p) => p.stock > 0)
    }

    if (filters.minPrice !== undefined) {
      result = result.filter((p) => p.price >= filters.minPrice!)
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= filters.maxPrice!)
    }

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.sku.toLowerCase().includes(q)
      )
    }

    // Hot wheels filters
    if (filters.series) {
      result = result.filter((p) => (p as any).series === filters.series)
    }
    if (filters.treasureHuntType) {
      result = result.filter((p) => (p as any).treasureHuntType === filters.treasureHuntType)
    }
    if (filters.packagingCondition) {
      result = result.filter((p) => (p as any).packagingCondition === filters.packagingCondition)
    }

    // Card filters
    if (filters.league) {
      result = result.filter((p) => (p as any).league === filters.league)
    }
    if (filters.isRookie) {
      result = result.filter((p) => (p as any).isRookie)
    }
    if (filters.isAutograph) {
      result = result.filter((p) => (p as any).isAutograph)
    }
    if (filters.gradingCompany) {
      result = result.filter((p) => (p as any).gradingCompany === filters.gradingCompany)
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
        break
    }

    return result
  }, [initialProducts, filters, sortBy])

  const visibleProducts = filteredProducts.slice(0, displayCount)

  const handleResetFilters = () => {
    setFilters({})
  }

  return (
    <div className="flex gap-8">
      {/* Sidebar (Desktop + Mobile Drawer) */}
      <FilterSidebar
        category={category}
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
        totalCount={filteredProducts.length}
        isOpenMobile={isMobileFilterOpen}
        onCloseMobile={() => setIsMobileFilterOpen(false)}
      />

      {/* Main Listing Area */}
      <div className="flex-1 min-w-0">
        <ListingHeader
          title={title}
          subtitle={subtitle}
          badge={badge}
          totalCount={filteredProducts.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
        />

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-500 mb-4">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-lg text-white">No items found</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm">
              We couldn't find any collector items matching your selected criteria. Try adjusting or clearing your filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-5 px-4 py-2 rounded-xl bg-hw-orange hover:bg-orange-600 text-white font-bold text-xs transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {visibleProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-3">
                {visibleProducts.map((p) => (
                  <ProductRowCard key={p.id} product={p} />
                ))}
              </div>
            )}

            {/* Load More Pagination Button */}
            {displayCount < filteredProducts.length && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setDisplayCount((prev) => prev + 12)}
                  className="px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-200 hover:text-white transition-all shadow"
                >
                  Load More ({filteredProducts.length - displayCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
