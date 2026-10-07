'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  ABOUT_HOTWHEELS,
  allCategories,
  ALL_YEARS,
  allHotwheelsSeries,
  getFeaturedSeries,
  searchCatalog,
  hotwheelsCastings,
  SeriesCategory,
  Series,
  Casting,
} from '@/data/hotwheels'
import { CategoryTile } from '@/components/catalog/CategoryTile'
import { YearChip } from '@/components/catalog/YearChip'
import { SeriesCard } from '@/components/catalog/SeriesCard'
import { CastingCard } from '@/components/catalog/CastingCard'
import { VerifiedBadge } from '@/components/catalog/VerifiedBadge'
import {
  Search,
  SlidersHorizontal,
  Flame,
  Calendar,
  Layers,
  Sparkles,
  Info,
  ShieldCheck,
  ArrowRight,
  X,
  Compass,
} from 'lucide-react'

export default function CatalogIndexPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<SeriesCategory | 'all'>('all')
  const [activeTab, setActiveTab] = useState<'all' | 'series' | 'castings'>('all')

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 250)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Filtered / Search results
  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return null
    }
    return searchCatalog(debouncedQuery)
  }, [debouncedQuery])

  const featuredSeries = useMemo(() => getFeaturedSeries(), [])

  // Filtered series when a category is selected (or all)
  const displayedSeries = useMemo(() => {
    if (selectedCategory === 'all') {
      return allHotwheelsSeries
    }
    return allHotwheelsSeries.filter((s) => s.category === selectedCategory)
  }, [selectedCategory])

  // Year casting count lookup for year chips
  const yearCastingCounts = useMemo(() => {
    const map = new Map<number, number>()
    hotwheelsCastings.forEach((c) => {
      map.set(c.year, (map.get(c.year) || 0) + 1)
    })
    return map
  }, [])

  return (
    <div className="min-h-screen bg-pure-canvas pb-24 space-y-12 select-none">
      {/* 1. HERO & ARCHIVE NARRATIVE */}
      <section className="relative overflow-hidden bg-gradient-to-b from-party-pink/30 via-pure-canvas to-pure-canvas border-b border-silver/50 pt-10 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Breadcrumb & Pill */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>Reference Archive</span>
            </span>
            <span className="text-xs font-semibold text-slate">
              1968 — 2026 Definitive Die-Cast Index
            </span>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-midnight-ink tracking-tight leading-tight">
              Hot Wheels Reference{' '}
              <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 bg-clip-text text-transparent">
                Catalog
              </span>
            </h1>
            <p className="text-sm sm:text-base text-graphite font-medium leading-relaxed">
              Explore 58+ years of Hot Wheels history inspired by community wiki archives.
              Browse by iconic series, discover releases by year, tag event meetups, and sync castings straight to your personal vault.
            </p>
          </div>

          {/* Historical blurb card */}
          <div className="max-w-3xl bg-pure-canvas border border-silver/80 rounded-2xl p-4 sm:p-5 shadow-[rgba(0,0,0,0.04)_0px_2px_8px_0px] flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-xs sm:text-sm">
              <span className="font-bold text-midnight-ink block">Historical Background</span>
              <p className="text-slate leading-relaxed font-normal">{ABOUT_HOTWHEELS}</p>
            </div>
          </div>

          {/* Global Catalog Search Bar */}
          <div className="max-w-3xl pt-2">
            <div className="relative">
              <Search className="w-5 h-5 text-slate absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="catalog-global-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search castings, series, scales (e.g. Deora, Flying Colors, 1968, Car Culture)..."
                className="w-full pl-12 pr-10 py-3.5 bg-pure-canvas border border-silver/80 rounded-xl text-sm font-semibold text-midnight-ink placeholder:text-ash focus:outline-none focus:ring-2 focus:ring-midnight-ink shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate hover:text-midnight-ink rounded-md"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Search Results Overlay / Section */}
            {searchResults && (
              <div className="mt-4 bg-pure-canvas border border-silver/80 rounded-2xl p-5 shadow-xl space-y-5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-silver/40 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-midnight-ink">Search Results for &ldquo;{debouncedQuery}&rdquo;</span>
                    <span className="text-[11px] font-semibold text-slate bg-black/[0.05] px-2 py-0.5 rounded-full">
                      {searchResults.castings.length + searchResults.series.length} matches
                    </span>
                  </div>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-semibold text-slate hover:text-midnight-ink"
                  >
                    Clear results
                  </button>
                </div>

                {searchResults.castings.length === 0 && searchResults.series.length === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <Compass className="w-8 h-8 text-slate mx-auto" />
                    <p className="text-sm font-bold text-midnight-ink">No catalog matches found</p>
                    <p className="text-xs text-slate max-w-md mx-auto">
                      Try searching by year (e.g. 1968), series name (e.g. Red Line Club, Classics), or casting name (e.g. Deora).
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Series Matches */}
                    {searchResults.series.length > 0 && (
                      <div className="space-y-3">
                        <span className="text-xs font-bold text-slate uppercase tracking-wider block">
                          Matching Series ({searchResults.series.length})
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {searchResults.series.slice(0, 6).map((ser) => (
                            <SeriesCard key={ser.id} series={ser} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Castings Matches */}
                    {searchResults.castings.length > 0 && (
                      <div className="space-y-3">
                        <span className="text-xs font-bold text-slate uppercase tracking-wider block">
                          Matching Castings ({searchResults.castings.length})
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {searchResults.castings.map((c) => (
                            <CastingCard key={c.id} casting={c} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. BROWSE BY YEAR STRIP (1968 - 2026) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-silver/40 pb-3">
          <div className="space-y-0.5">
            <h2 className="text-lg sm:text-xl font-bold text-midnight-ink flex items-center gap-2">
              <Calendar className="w-5 h-5 text-midnight-ink" />
              <span>Browse by Release Year</span>
            </h2>
            <p className="text-xs text-slate">
              Explore castings chronologically from the 1968 Sweet 16 debut through 2026.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate">
            58 Consecutive Model Years
          </span>
        </div>

        {/* Horizontal scrollable year strip with styled pills */}
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-silver">
            {ALL_YEARS.map((yr) => (
              <YearChip
                key={yr}
                year={yr}
                href={`/catalog/year/${yr}`}
                castingCount={yearCastingCounts.get(yr)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. SEVEN CORE CATEGORY TILES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-silver/40 pb-3">
          <div className="space-y-0.5">
            <h2 className="text-xl sm:text-2xl font-bold text-midnight-ink flex items-center gap-2">
              <Layers className="w-5 h-5 text-midnight-ink" />
              <span>Explore Series by Category</span>
            </h2>
            <p className="text-xs text-slate">
              Classified across 7 primary collector branches inspired by the Hot Wheels Wiki.
            </p>
          </div>

          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs font-bold text-midnight-ink hover:underline flex items-center gap-1"
            >
              <span>Show All Categories</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 7 Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allCategories.map((cat) => (
            <CategoryTile
              key={cat.id}
              category={cat}
              isSelected={selectedCategory === cat.id}
              onClick={() =>
                setSelectedCategory((prev) => (prev === cat.id ? 'all' : cat.id))
              }
            />
          ))}
        </div>
      </section>

      {/* 4. FEATURED / INDEXED SERIES LIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-silver/40 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-midnight-ink flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>
                {selectedCategory === 'all'
                  ? 'Featured Landmark Series'
                  : `Series in ${allCategories.find((c) => c.id === selectedCategory)?.name}`}
              </span>
            </h2>
            <p className="text-xs text-slate">
              {selectedCategory === 'all'
                ? 'High-demand mainline and specialty series curated for collectors.'
                : `${displayedSeries.length} series categorized under this era.`}
            </p>
          </div>

          <span className="text-xs font-bold text-slate bg-black/[0.04] px-3 py-1 rounded-full">
            {displayedSeries.length} Series Indexed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {(selectedCategory === 'all' ? featuredSeries : displayedSeries).map((ser) => (
            <SeriesCard key={ser.id} series={ser} />
          ))}
        </div>
      </section>

      {/* 5. REFERENCE CASTINGS PREVIEW (Deora + Placeholders) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-silver/40 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-midnight-ink flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Reference Castings Index</span>
            </h2>
            <p className="text-xs text-slate">
              Strictly verified historical records alongside clearly-marked community placeholders.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <VerifiedBadge verified={true} size="sm" />
            <VerifiedBadge verified={false} size="sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {hotwheelsCastings.map((c) => (
            <CastingCard key={c.id} casting={c} />
          ))}
        </div>
      </section>
    </div>
  )
}
