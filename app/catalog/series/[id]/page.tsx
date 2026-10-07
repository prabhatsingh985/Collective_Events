'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'
import {
  getSeriesById,
  getCastingsBySeries,
  getCategoryMeta,
  allHotwheelsSeries,
  ALL_YEARS,
} from '@/data/hotwheels'
import { useApp } from '@/context/AppContext'
import { CastingCard } from '@/components/catalog/CastingCard'
import { EventCard } from '@/components/events/EventCard'
import {
  Layers,
  Calendar,
  Compass,
  ArrowLeft,
  Flame,
  ShieldCheck,
  Filter,
  SlidersHorizontal,
  X,
  Sparkles,
} from 'lucide-react'

export default function SeriesDetailPage() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string)
  const series = getSeriesById(id || '')
  const { events } = useApp()

  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all')
  const [selectedScale, setSelectedScale] = useState<string | 'all'>('all')

  if (!series) {
    return (
      <div className="min-h-[60vh] max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Layers className="w-12 h-12 text-slate mx-auto" />
        <h1 className="text-2xl font-bold text-midnight-ink">Series Not Found</h1>
        <p className="text-sm text-slate">
          The series identifier &ldquo;{id}&rdquo; does not match any indexed catalog series.
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 px-4 py-2 bg-midnight-ink text-pure-canvas rounded-lg text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    )
  }

  const meta = getCategoryMeta(series.category)
  const allSeriesCastings = getCastingsBySeries(series.id)

  // Distinct years and scales present in this series
  const availableYears = useMemo(() => {
    const set = new Set<number>()
    allSeriesCastings.forEach((c) => set.add(c.year))
    return Array.from(set).sort((a, b) => a - b)
  }, [allSeriesCastings])

  const availableScales = useMemo(() => {
    const set = new Set<string>()
    if (series.scale) set.add(series.scale)
    allSeriesCastings.forEach((c) => {
      if (c.scale) set.add(c.scale)
    })
    return Array.from(set)
  }, [allSeriesCastings, series.scale])

  // Filtered castings
  const filteredCastings = useMemo(() => {
    return allSeriesCastings.filter((c) => {
      if (selectedYear !== 'all' && c.year !== selectedYear) return false
      if (selectedScale !== 'all' && c.scale !== selectedScale) return false
      return true
    })
  }, [allSeriesCastings, selectedYear, selectedScale])

  // Find events featuring this series
  const matchingEvents = useMemo(() => {
    return events.filter(
      (evt) =>
        evt.featuredSeries?.includes(series.id) ||
        evt.hotWheelsDetails?.featuredSeries?.includes(series.id) ||
        evt.tags?.some((t) => t.toLowerCase() === series.name.toLowerCase())
    )
  }, [events, series.id, series.name])

  return (
    <div className="min-h-screen bg-pure-canvas pb-24 space-y-10 select-none">
      {/* 1. HEADER SECTION */}
      <section className="bg-gradient-to-b from-party-pink/20 to-pure-canvas border-b border-silver/50 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Back button & Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1.5 hover:text-midnight-ink font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </Link>
            <span>/</span>
            <span className="text-slate">{meta?.name || series.category}</span>
            <span>/</span>
            <span className="text-midnight-ink font-bold truncate">{series.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    meta ? meta.badgeBg : 'bg-slate/10 text-slate'
                  }`}
                >
                  {meta?.name || series.category}
                </span>

                {series.scale && (
                  <span className="text-xs font-bold bg-black/[0.05] text-midnight-ink px-3 py-1 rounded-full border border-silver/40">
                    Scale: {series.scale}
                  </span>
                )}

                {series.isExclusive && (
                  <span className="text-xs font-extrabold uppercase px-2.5 py-1 bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 rounded-full border border-yellow-500/30">
                    ✨ Collector Exclusive
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-midnight-ink tracking-tight">
                {series.name}
              </h1>

              {series.description && (
                <p className="text-sm sm:text-base text-graphite font-medium leading-relaxed">
                  {series.description}
                </p>
              )}
            </div>

            {/* Quick Stats Card */}
            <div className="bg-pure-canvas border border-silver/80 rounded-2xl p-5 shadow-sm space-y-3 md:w-64 shrink-0">
              <span className="text-xs font-bold text-slate uppercase tracking-wider block">
                Series Info
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-silver/30 pb-1.5">
                  <span className="text-slate">Category:</span>
                  <span className="font-bold text-midnight-ink">{meta?.name || 'Mainline'}</span>
                </div>
                <div className="flex justify-between border-b border-silver/30 pb-1.5">
                  <span className="text-slate">Era:</span>
                  <span className="font-bold text-midnight-ink">{meta?.era || 'All-Time'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">Indexed Castings:</span>
                  <span className="font-bold text-midnight-ink">{allSeriesCastings.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CASTINGS LIST WITH FILTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-silver/40 pb-4">
          <div className="space-y-0.5">
            <h2 className="text-xl sm:text-2xl font-bold text-midnight-ink flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <span>Castings in {series.name}</span>
            </h2>
            <p className="text-xs text-slate">
              Showing {filteredCastings.length} of {allSeriesCastings.length} indexed models
            </p>
          </div>

          {/* Filters: Year & Scale */}
          <div className="flex flex-wrap items-center gap-2">
            {availableYears.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-bold text-slate">Year:</span>
                <select
                  aria-label="Filter by release year"
                  value={selectedYear}
                  onChange={(e) =>
                    setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))
                  }
                  className="px-2.5 py-1.5 bg-pure-canvas border border-silver/80 rounded-lg text-xs font-bold text-midnight-ink focus:outline-none focus:ring-1 focus:ring-midnight-ink"
                >
                  <option value="all">All Years</option>
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {availableScales.length > 1 && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-bold text-slate">Scale:</span>
                <select
                  aria-label="Filter by scale"
                  value={selectedScale}
                  onChange={(e) => setSelectedScale(e.target.value)}
                  className="px-2.5 py-1.5 bg-pure-canvas border border-silver/80 rounded-lg text-xs font-bold text-midnight-ink focus:outline-none focus:ring-1 focus:ring-midnight-ink"
                >
                  <option value="all">All Scales</option>
                  {availableScales.map((sc) => (
                    <option key={sc} value={sc}>
                      {sc}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(selectedYear !== 'all' || selectedScale !== 'all') && (
              <button
                onClick={() => {
                  setSelectedYear('all')
                  setSelectedScale('all')
                }}
                className="text-xs font-bold text-slate hover:text-midnight-ink flex items-center gap-1 px-2 py-1.5 border border-silver/60 rounded-lg"
              >
                <span>Reset</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Castings Grid / Empty State */}
        {filteredCastings.length === 0 ? (
          <div className="bg-pure-canvas border border-silver/80 rounded-2xl p-10 text-center space-y-3">
            <Layers className="w-10 h-10 text-slate mx-auto" />
            <h3 className="text-base font-bold text-midnight-ink">
              No Castings Currently Indexed for This Filter
            </h3>
            <p className="text-xs text-slate max-w-md mx-auto">
              This series is fully cataloged in the taxonomy structure. As individual year models are verified against primary archives, they will be listed here.
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-midnight-ink hover:underline pt-2"
            >
              <span>Explore other catalog series</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCastings.map((c) => (
              <CastingCard key={c.id} casting={c} />
            ))}
          </div>
        )}
      </section>

      {/* 3. EVENTS FEATURING THIS SERIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-6 border-t border-silver/40">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-midnight-ink flex items-center gap-2">
              <Compass className="w-5 h-5 text-midnight-ink" />
              <span>Events Featuring {series.name}</span>
            </h2>
            <p className="text-xs text-slate">
              Meetups, box breaks, and collector swap meets tagged with this series.
            </p>
          </div>
          {matchingEvents.length > 0 && (
            <span className="text-xs font-bold text-slate bg-black/[0.04] px-3 py-1 rounded-full">
              {matchingEvents.length} Gathering{matchingEvents.length === 1 ? '' : 's'}
            </span>
          )}
        </div>

        {matchingEvents.length === 0 ? (
          <div className="bg-pure-canvas border border-silver/70 rounded-2xl p-8 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-slate mx-auto" />
            <h3 className="text-sm font-bold text-midnight-ink">
              No Upcoming Gatherings Tagged With This Series Yet
            </h3>
            <p className="text-xs text-slate max-w-md mx-auto">
              Are you hosting a die-cast swap meet or collector trading pit featuring {series.name}? Tag this series when creating your event!
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-midnight-ink text-pure-canvas text-xs font-bold rounded-lg hover:opacity-85"
            >
              <span>Host a {series.name} Gathering</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
