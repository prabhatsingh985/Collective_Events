'use client'

import React, { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { EventCard } from '@/components/events/EventCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  MapPin,
  Map as MapIcon,
  X,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronDown,
} from 'lucide-react'
import Link from 'next/link'
import { allHotwheelsSeries } from '@/data/hotwheels'

function EventsDiscoveryContent() {
  const searchParams = useSearchParams()
  const { events } = useApp()

  // State from URL or defaults
  const initialCategory = searchParams.get('category') || 'all'
  const initialCity = searchParams.get('city') || 'all'
  const initialQuery = searchParams.get('q') || ''
  const initialType = searchParams.get('type') || 'all'
  const initialSeries = searchParams.get('series') || 'all'
  const initialFeatured = searchParams.get('featured') === 'true'

  const [search, setSearch] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)
  const [city, setCity] = useState(initialCity)
  const [eventType, setEventType] = useState(initialType)
  const [seriesFilter, setSeriesFilter] = useState(initialSeries)
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'popularity' | 'price-asc' | 'price-desc'>('date')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showMap, setShowMap] = useState(false)
  const [selectedPinEventId, setSelectedPinEventId] = useState<string | null>(null)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Sync if URL searchParams change
  useEffect(() => {
    if (searchParams.get('category')) setCategory(searchParams.get('category')!)
    if (searchParams.get('city')) setCity(searchParams.get('city')!)
    if (searchParams.get('q')) setSearch(searchParams.get('q')!)
    if (searchParams.get('type')) setEventType(searchParams.get('type')!)
    if (searchParams.get('series')) setSeriesFilter(searchParams.get('series')!)
  }, [searchParams])

  // Filter logic
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchesTitle = evt.title.toLowerCase().includes(q)
        const matchesTagline = evt.tagline.toLowerCase().includes(q)
        const matchesCity = evt.city.toLowerCase().includes(q)
        const matchesTags = evt.tags.some((t) => t.toLowerCase().includes(q))
        if (!matchesTitle && !matchesTagline && !matchesCity && !matchesTags) {
          return false
        }
      }

      // Category
      if (category !== 'all' && evt.category !== category) {
        return false
      }

      // Series filter
      if (seriesFilter !== 'all') {
        const hasSeries =
          evt.featuredSeries?.includes(seriesFilter) ||
          evt.hotWheelsDetails?.featuredSeries?.includes(seriesFilter) ||
          evt.tags?.some((t) => t.toLowerCase() === seriesFilter.toLowerCase())
        if (!hasSeries) return false
      }

      // City
      if (city !== 'all' && evt.city.toLowerCase() !== city.toLowerCase()) {
        return false
      }

      // Event Type
      if (eventType !== 'all' && evt.eventType !== eventType) {
        return false
      }

      // Price
      if (priceFilter === 'free' && evt.priceMin > 0) return false
      if (priceFilter === 'paid' && evt.priceMin === 0) return false

      // Featured check
      if (initialFeatured && !evt.isFeatured) return false

      return true
    }).sort((a, b) => {
      if (sortBy === 'popularity') {
        return b.attendeesCount + b.savedCount - (a.attendeesCount + a.savedCount)
      }
      if (sortBy === 'price-asc') {
        return a.priceMin - b.priceMin
      }
      if (sortBy === 'price-desc') {
        return b.priceMin - a.priceMin
      }
      return 0
    })
  }, [events, search, category, seriesFilter, city, eventType, priceFilter, sortBy, initialFeatured])

  // Active filters count
  const activeFiltersCount = [
    category !== 'all',
    city !== 'all',
    eventType !== 'all',
    seriesFilter !== 'all',
    priceFilter !== 'all',
    search.trim() !== '',
  ].filter(Boolean).length

  const clearAllFilters = () => {
    setSearch('')
    setCategory('all')
    setCity('all')
    setEventType('all')
    setSeriesFilter('all')
    setPriceFilter('all')
  }

  const pinSelectedEvent = events.find((e) => e.id === selectedPinEventId)

  return (
    <div className="min-h-screen bg-pure-canvas pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* 1. Header Bar */}
      <div className="border-b border-silver/40 pb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-party-pink/40 text-midnight-ink text-xs font-bold">
                Directory
              </span>
              <span className="text-xs font-semibold text-slate">
                {filteredEvents.length} Collector Meets
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-midnight-ink mt-1">
              Collector Event Discovery
            </h1>
            <p className="text-xs text-slate mt-1 font-normal">
              Discover 1:64 scale die-cast toy car meets, Super Treasure Hunt exchanges, and graded sports card summits.
            </p>
          </div>

          {/* View Toggles & Mobile Filter Trigger */}
          <div className="flex items-center gap-2">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-3.5 py-2 border border-silver rounded-[8px] bg-pure-canvas text-xs font-bold flex items-center gap-1.5 shadow-sm text-midnight-ink"
            >
              <SlidersHorizontal className="w-4 h-4 text-midnight-blue" />
              <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            {/* Map View Toggle */}
            <button
              onClick={() => setShowMap(!showMap)}
              className={`px-3.5 py-2 border rounded-[8px] text-xs font-bold flex items-center gap-1.5 transition-colors ${
                showMap
                  ? 'bg-midnight-ink text-pure-canvas border-midnight-ink'
                  : 'bg-pure-canvas text-midnight-ink border-silver hover:border-midnight-ink'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>{showMap ? 'Hide Map' : 'Map View'}</span>
            </button>

            {/* Grid / List Toggles */}
            <div className="hidden sm:flex items-center border border-silver rounded-[8px] overflow-hidden bg-pure-canvas">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid' ? 'bg-midnight-ink text-pure-canvas' : 'text-slate hover:text-midnight-ink'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 border-l border-silver transition-colors ${
                  viewMode === 'list' ? 'bg-midnight-ink text-pure-canvas' : 'text-slate hover:text-midnight-ink'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Applied Filters Chips Row */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-medium text-slate">
              Active:
            </span>
            {search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/[0.04] border border-silver/60 rounded-full text-xs font-semibold text-midnight-ink">
                &quot;{search}&quot;
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-midnight-ink" onClick={() => setSearch('')} />
              </span>
            )}
            {category !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/[0.04] border border-silver/60 rounded-full text-xs font-semibold text-midnight-ink">
                {category}
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-midnight-ink" onClick={() => setCategory('all')} />
              </span>
            )}
            {city !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/[0.04] border border-silver/60 rounded-full text-xs font-semibold text-midnight-ink">
                {city}
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-midnight-ink" onClick={() => setCity('all')} />
              </span>
            )}
            {seriesFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-semibold text-amber-900 dark:text-amber-300 capitalize">
                🏎️ {seriesFilter.replace(/-/g, ' ')}
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-midnight-ink" onClick={() => setSeriesFilter('all')} />
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold text-midnight-ink hover:underline ml-2 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* 2. Interactive Mock Map View (Toggleable) */}
      {showMap && (
        <div className="bg-pure-canvas border border-silver/50 rounded-2xl p-4 md:p-6 shadow-xl space-y-4 animate-pack-reveal">
          <div className="flex items-center justify-between border-b border-silver/40 pb-3">
            <div>
              <h3 className="font-bold text-lg text-midnight-ink flex items-center gap-2">
                <MapPin className="w-4 h-4 text-midnight-blue" /> Interactive City Coordinates
              </h3>
              <p className="text-xs text-slate">
                Select any coordinate pin to view venue details and active registrations.
              </p>
            </div>
            <button
              onClick={() => setShowMap(false)}
              className="w-7 h-7 rounded-full border border-silver flex items-center justify-center text-slate hover:text-midnight-ink"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Map Canvas */}
            <div className="lg:col-span-2 relative h-[360px] md:h-[400px] bg-midnight-blue/5 rounded-xl border border-silver/50 overflow-hidden flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center p-8">
                {[
                  { id: 'evt-1', city: 'Mumbai', top: '56%', left: '32%' },
                  { id: 'evt-2', city: 'Bengaluru', top: '74%', left: '44%' },
                  { id: 'evt-3', city: 'Delhi', top: '32%', left: '42%' },
                  { id: 'evt-4', city: 'Pune', top: '60%', left: '36%' },
                  { id: 'evt-5', city: 'Hyderabad', top: '64%', left: '48%' },
                  { id: 'evt-6', city: 'Chennai', top: '76%', left: '52%' },
                  { id: 'evt-7', city: 'Kolkata', top: '48%', left: '68%' },
                  { id: 'evt-8', city: 'Jaipur', top: '38%', left: '38%' },
                ].map((pin) => {
                  const isSelected = selectedPinEventId === pin.id
                  return (
                    <button
                      key={pin.id}
                      onClick={() => setSelectedPinEventId(pin.id)}
                      style={{ top: pin.top, left: pin.left }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform ${
                        isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-md border-2 border-pure-canvas ${
                          isSelected
                            ? 'bg-midnight-ink text-pure-canvas ring-4 ring-black/20'
                            : 'bg-pure-canvas text-midnight-ink'
                        }`}
                      >
                        📍
                      </div>
                      <span className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-pure-canvas text-midnight-ink px-2 py-0.5 text-[10px] font-bold rounded-full shadow-sm border border-silver/50 pointer-events-none">
                        {pin.city}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Pin Popover Detail Panel */}
            <div className="bg-black/[0.02] border border-silver/50 rounded-xl p-5 flex flex-col justify-between">
              {pinSelectedEvent ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Badge variant={pinSelectedEvent.category === 'hot-wheels' ? 'category-diecast' : 'category-cards'} size="sm">
                      {pinSelectedEvent.category}
                    </Badge>
                    <h4 className="font-bold text-base text-midnight-ink leading-snug">
                      {pinSelectedEvent.title}
                    </h4>
                    <p className="text-xs text-slate">
                      {pinSelectedEvent.venue}, {pinSelectedEvent.city}
                    </p>
                  </div>

                  <div className="p-3 bg-pure-canvas rounded-lg border border-silver/40 space-y-1 text-xs">
                    <p className="text-midnight-ink flex items-center justify-between">
                      <span className="text-slate">Date:</span>
                      <span className="font-bold">{pinSelectedEvent.date}</span>
                    </p>
                    <p className="text-midnight-ink flex items-center justify-between">
                      <span className="text-slate">Admissions:</span>
                      <span className="font-bold text-rsvp-going">
                        {pinSelectedEvent.priceMin === 0 ? 'FREE' : `₹${pinSelectedEvent.priceMin}`}
                      </span>
                    </p>
                  </div>

                  <Link
                    href={`/events/${pinSelectedEvent.id}`}
                    className="w-full py-2.5 bg-midnight-ink text-pure-canvas font-bold text-xs rounded-[8px] text-center block hover:opacity-85 transition-opacity shadow-sm"
                  >
                    View Event Details →
                  </Link>
                </div>
              ) : (
                <div className="text-center py-12 text-slate text-xs">
                  Click any pin on the map to preview meet details.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Body: Sidebar Filters + Event Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* DESKTOP FILTERS SIDEBAR */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-pure-canvas border border-silver/50 rounded-2xl p-6 shadow-[rgba(0,0,0,0.06)_0px_2px_12px_0px] space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-silver/40 pb-3">
              <h3 className="font-bold text-sm text-midnight-ink flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-midnight-blue" /> Filter Drops
              </h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-slate hover:text-midnight-ink font-semibold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate">Search</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Keywords, castings, sets..."
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-[8px] border border-silver bg-pure-canvas text-midnight-ink focus:outline-none focus:border-midnight-ink placeholder:text-ash"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 text-xs rounded-[8px] border border-silver bg-pure-canvas text-midnight-ink focus:outline-none focus:border-midnight-ink cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="hot-wheels">🏎️ Hot Wheels (1:64 Die-Cast Toys)</option>
                <option value="football-cards">⚽ Football & Sports Cards</option>
                <option value="die-cast">🚗 Precision 1:64 Scale Models</option>
              </select>
              <p className="text-[10px] text-amber-900 font-medium bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 leading-tight">
                💡 Hot Wheels = die-cast toy collecting (1:64 scale), not real cars.
              </p>
            </div>

            {/* Hot Wheels Series Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate flex items-center justify-between">
                <span>Hot Wheels Series</span>
                {seriesFilter !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setSeriesFilter('all')}
                    className="text-[10px] text-slate hover:text-midnight-ink font-semibold"
                  >
                    Reset
                  </button>
                )}
              </label>
              <select
                value={seriesFilter}
                onChange={(e) => setSeriesFilter(e.target.value)}
                className="w-full p-2.5 text-xs rounded-[8px] border border-silver bg-pure-canvas text-midnight-ink focus:outline-none focus:border-midnight-ink cursor-pointer"
              >
                <option value="all">All Series</option>
                {allHotwheelsSeries.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>


            {/* City */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 text-xs rounded-[8px] border border-silver bg-pure-canvas text-midnight-ink focus:outline-none focus:border-midnight-ink cursor-pointer"
              >
                <option value="all">All Cities</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Pune">Pune</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Jaipur">Jaipur</option>
              </select>
            </div>

            {/* Event Format */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate">Event Format</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full p-2.5 text-xs rounded-[8px] border border-silver bg-pure-canvas text-midnight-ink focus:outline-none focus:border-midnight-ink cursor-pointer"
              >
                <option value="all">All Formats</option>
                <option value="swap-meet">Open Swap Meet</option>
                <option value="exhibition">Exhibition / Showcase</option>
                <option value="grading-day">PSA Grading Day</option>
                <option value="auction">Live Auction</option>
                <option value="race-night">Downhill Drag Race</option>
                <option value="tournament">Trading Card Tournament</option>
              </select>
            </div>

            {/* Pricing Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate">Admission</label>
              <div className="grid grid-cols-3 gap-1">
                {(['all', 'free', 'paid'] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setPriceFilter(tier)}
                    className={`py-1.5 text-xs font-bold rounded-[6px] capitalize border transition-all ${
                      priceFilter === tier
                        ? 'bg-midnight-ink text-pure-canvas border-midnight-ink'
                        : 'border-silver bg-pure-canvas text-slate hover:text-midnight-ink'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Order */}
            <div className="space-y-1.5 pt-2 border-t border-silver/40">
              <label className="text-xs font-bold text-slate">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full p-2 text-xs rounded-[8px] border border-silver bg-pure-canvas text-midnight-ink focus:outline-none focus:border-midnight-ink cursor-pointer"
              >
                <option value="date">Upcoming Date</option>
                <option value="popularity">Most RSVPs</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </aside>

        {/* EVENTS LIST / GRID */}
        <div className="lg:col-span-3 space-y-6">
          {filteredEvents.length === 0 ? (
            <div className="bg-pure-canvas border border-silver/50 rounded-2xl p-12 text-center space-y-4 shadow-sm">
              <span className="text-4xl">🔍</span>
              <h3 className="font-bold text-xl text-midnight-ink">
                No collector meets match your filters
              </h3>
              <p className="text-slate text-xs max-w-sm mx-auto">
                Try broadening your city selection or resetting applied search keywords.
              </p>
              <Button variant="primary" onClick={clearAllFilters} size="sm">
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 lg:hidden">
          <div
            className="fixed inset-0 bg-midnight-ink/40 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-pure-canvas rounded-t-2xl sm:rounded-2xl border border-silver/50 p-6 space-y-5 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-silver/40">
              <h3 className="font-bold text-base text-midnight-ink">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-7 h-7 rounded-full border border-silver flex items-center justify-center text-slate hover:text-midnight-ink"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Filter Controls */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-silver bg-pure-canvas"
                >
                  <option value="all">All Categories</option>
                  <option value="hot-wheels">🏎️ Hot Wheels (1:64 Die-Cast Toys)</option>
                  <option value="football-cards">⚽ Football & Sports Cards</option>
                  <option value="die-cast">🚗 Precision 1:64 Scale Models</option>
                </select>
                <p className="text-[10px] text-amber-900 font-medium bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 leading-tight">
                  💡 Hot Wheels = die-cast toy collecting (1:64 scale), not real cars.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate">Hot Wheels Series</label>
                <select
                  value={seriesFilter}
                  onChange={(e) => setSeriesFilter(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-silver bg-pure-canvas"
                >
                  <option value="all">All Series</option>
                  {allHotwheelsSeries.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>


              <div className="space-y-1">
                <label className="text-xs font-bold text-slate">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-silver bg-pure-canvas"
                >
                  <option value="all">All Cities</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => setMobileFilterOpen(false)}
            >
              Apply ({filteredEvents.length} Meets)
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function EventsDiscoveryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-pure-canvas pt-28 pb-16 flex items-center justify-center">
          <div className="text-sm font-semibold text-slate animate-pulse">
            Loading Collector Radar...
          </div>
        </div>
      }
    >
      <EventsDiscoveryContent />
    </Suspense>
  )
}
