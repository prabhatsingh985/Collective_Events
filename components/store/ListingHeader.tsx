'use client'

import React from 'react'
import { LayoutGrid, List, SlidersHorizontal, ArrowUpDown } from 'lucide-react'

interface ListingHeaderProps {
  title: string
  subtitle: string
  totalCount: number
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  sortBy: string
  onSortByChange: (sort: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating') => void
  onOpenMobileFilters: () => void
  badge?: string
}

export function ListingHeader({
  title,
  subtitle,
  totalCount,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortByChange,
  onOpenMobileFilters,
  badge,
}: ListingHeaderProps) {
  return (
    <div className="pb-6 mb-6 border-b border-silver/40 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-party-pink/50 text-midnight-ink border border-party-pink/70">
              {badge}
            </span>
          )}
          <span className="text-xs font-mono font-bold text-slate">
            Showing <strong className="text-midnight-ink">{totalCount}</strong> verified items
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-midnight-ink tracking-tight">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-slate mt-1 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
        {/* Mobile Filter Toggle */}
        <button
          onClick={onOpenMobileFilters}
          className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-pure-canvas border border-silver text-xs font-bold text-midnight-ink shadow-sm"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-midnight-blue" />
          <span>Filters</span>
        </button>

        {/* View Mode Switcher */}
        <div className="hidden sm:flex items-center bg-pure-canvas border border-silver rounded-[8px] overflow-hidden shadow-sm">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 transition-colors ${
              viewMode === 'grid' ? 'bg-midnight-ink text-pure-canvas' : 'text-slate hover:text-midnight-ink'
            }`}
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 border-l border-silver transition-colors ${
              viewMode === 'list' ? 'bg-midnight-ink text-pure-canvas' : 'text-slate hover:text-midnight-ink'
            }`}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as any)}
              className="appearance-none bg-pure-canvas border border-silver hover:border-midnight-ink text-xs font-semibold text-midnight-ink py-2 pl-3.5 pr-8 rounded-[8px] focus:outline-none focus:border-midnight-ink cursor-pointer shadow-sm"
            >
              <option value="featured">Sort: Featured & Grails</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Latest Vault Arrivals</option>
              <option value="rating">Highest Collector Rating</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  )
}
