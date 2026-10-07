'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ALL_YEARS,
  CATALOG_YEAR_START,
  CATALOG_YEAR_END,
  getCastingsByYear,
  getSeriesById,
  allHotwheelsSeries,
  Casting,
} from '@/data/hotwheels'
import { CastingCard } from '@/components/catalog/CastingCard'
import { YearChip } from '@/components/catalog/YearChip'
import { VerifiedBadge } from '@/components/catalog/VerifiedBadge'
import {
  Calendar,
  ArrowLeft,
  ArrowRight,
  Layers,
  Flame,
  Info,
  ShieldCheck,
} from 'lucide-react'

export default function CatalogYearPage() {
  const params = useParams()
  const rawYear = Array.isArray(params?.year) ? params.year[0] : (params?.year as string)
  const currentYear = Number(rawYear) || 1968

  const isValidYear =
    !isNaN(currentYear) &&
    currentYear >= CATALOG_YEAR_START &&
    currentYear <= CATALOG_YEAR_END

  const castingsForYear = useMemo(() => {
    if (!isValidYear) return []
    return getCastingsByYear(currentYear)
  }, [isValidYear, currentYear])

  // Group castings by series
  const groupedBySeries = useMemo(() => {
    const map = new Map<string, Casting[]>()
    castingsForYear.forEach((c) => {
      const list = map.get(c.seriesId) || []
      list.push(c)
      map.set(c.seriesId, list)
    })
    return Array.from(map.entries()).map(([seriesId, items]) => ({
      series: getSeriesById(seriesId) || {
        id: seriesId,
        name: seriesId.replace(/-/g, ' ').toUpperCase(),
        category: 'miscellaneous',
      },
      castings: items,
    }))
  }, [castingsForYear])

  if (!isValidYear) {
    return (
      <div className="min-h-[60vh] max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Calendar className="w-12 h-12 text-slate mx-auto" />
        <h1 className="text-2xl font-bold text-midnight-ink">Invalid Year</h1>
        <p className="text-sm text-slate">
          The catalog spans model years {CATALOG_YEAR_START} through {CATALOG_YEAR_END}.
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

  const prevYear = currentYear > CATALOG_YEAR_START ? currentYear - 1 : null
  const nextYear = currentYear < CATALOG_YEAR_END ? currentYear + 1 : null

  return (
    <div className="min-h-screen bg-pure-canvas pb-24 space-y-10 select-none">
      {/* 1. HEADER SECTION */}
      <section className="bg-gradient-to-b from-party-pink/20 to-pure-canvas border-b border-silver/50 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1.5 hover:text-midnight-ink font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </Link>
            <span>/</span>
            <span className="text-slate">Years</span>
            <span>/</span>
            <span className="text-midnight-ink font-bold">{currentYear}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                  🗓️ Class of {currentYear}
                </span>
                <span className="text-xs font-semibold text-slate">
                  {currentYear === 1968
                    ? 'Inaugural Year — The Original 16'
                    : currentYear === 2026
                    ? 'Current Release Season'
                    : `Hot Wheels Archive`}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-midnight-ink tracking-tight">
                {currentYear} Hot Wheels Catalog
              </h1>
              <p className="text-sm sm:text-base text-graphite font-medium">
                {castingsForYear.length > 0
                  ? `Showing ${castingsForYear.length} model${castingsForYear.length === 1 ? '' : 's'} indexed across ${groupedBySeries.length} series for ${currentYear}.`
                  : `Model year ${currentYear} reference archive entries and series breakdown.`}
              </p>
            </div>

            {/* Prev / Next Year Steppers */}
            <div className="flex items-center gap-2 shrink-0">
              {prevYear ? (
                <Link
                  href={`/catalog/year/${prevYear}`}
                  className="px-3.5 py-2 rounded-xl bg-pure-canvas border border-silver/80 text-xs font-bold text-midnight-ink hover:border-midnight-ink flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{prevYear}</span>
                </Link>
              ) : (
                <span className="px-3.5 py-2 rounded-xl bg-black/[0.04] text-xs font-bold text-ash cursor-not-allowed">
                  Debut 1968
                </span>
              )}

              {nextYear ? (
                <Link
                  href={`/catalog/year/${nextYear}`}
                  className="px-3.5 py-2 rounded-xl bg-pure-canvas border border-silver/80 text-xs font-bold text-midnight-ink hover:border-midnight-ink flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <span>{nextYear}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <span className="px-3.5 py-2 rounded-xl bg-black/[0.04] text-xs font-bold text-ash cursor-not-allowed">
                  2026 Latest
                </span>
              )}
            </div>
          </div>

          {/* Quick Year Horizontal Jump Strip */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate uppercase tracking-wider block mb-2">
              Jump to another year
            </span>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {ALL_YEARS.map((yr) => (
                <YearChip
                  key={yr}
                  year={yr}
                  isActive={yr === currentYear}
                  href={`/catalog/year/${yr}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. CASTINGS GROUPED BY SERIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {castingsForYear.length === 0 ? (
          <div className="bg-pure-canvas border border-silver/80 rounded-2xl p-10 text-center space-y-3">
            <Calendar className="w-10 h-10 text-slate mx-auto" />
            <h3 className="text-base font-bold text-midnight-ink">
              No Castings Currently Indexed for {currentYear}
            </h3>
            <p className="text-xs text-slate max-w-md mx-auto">
              Per catalog rules, only models verified from primary archives or explicitly flagged as community placeholders are indexed. Check 1968 for the verified &ldquo;Deora&rdquo; casting or explore series taxonomies.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                href="/catalog/year/1968"
                className="px-4 py-2 bg-midnight-ink text-pure-canvas text-xs font-bold rounded-lg hover:opacity-85"
              >
                View 1968 Inaugural Year
              </Link>
              <Link
                href="/catalog"
                className="px-4 py-2 bg-pure-canvas border border-silver/80 text-xs font-bold text-midnight-ink rounded-lg hover:border-midnight-ink"
              >
                All Series
              </Link>
            </div>
          </div>
        ) : (
          groupedBySeries.map(({ series, castings }) => (
            <div key={series.id} className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-silver/40 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <Link
                    href={`/catalog/series/${series.id}`}
                    className="font-bold text-lg text-midnight-ink hover:text-midnight-blue transition-colors"
                  >
                    {series.name}
                  </Link>
                  <span className="text-xs text-slate font-semibold">
                    ({castings.length} model{castings.length === 1 ? '' : 's'})
                  </span>
                </div>

                <Link
                  href={`/catalog/series/${series.id}`}
                  className="text-xs font-bold text-slate hover:text-midnight-ink flex items-center gap-1"
                >
                  <span>View Series Overview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {castings.map((c) => (
                  <CastingCard key={c.id} casting={c} />
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  )
}
