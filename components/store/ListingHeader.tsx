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
    <div className="pb-6 mb-6 border-b border-zinc-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-hw-orange text-white">
              {badge}
            </span>
          )}
          <span className="text-xs font-mono text-zinc-400">
            Showing <strong className="text-white">{totalCount}</strong> verified items
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
        {/* Mobile Filter Toggle */}
        <button
          onClick={onOpenMobileFilters}
          className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-200"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-hw-orange" />
          <span>Filters</span>
        </button>

        {/* View Mode Switcher */}
        <div className="hidden sm:flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'grid' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === 'list' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'
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
              className="appearance-none bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-200 py-1.5 pl-3 pr-8 rounded-lg focus:outline-none focus:border-hw-orange cursor-pointer"
            >
              <option value="featured">Sort: Featured & Grails</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Latest Vault Arrivals</option>
              <option value="rating">Highest Collector Rating</option>
            </select>
            <ArrowUpDown className="w-3 h-3 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  )
}
