'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  getCastingById,
  getSeriesById,
  getCategoryMeta,
  Casting,
} from '@/data/hotwheels'
import { useApp } from '@/context/AppContext'
import { VerifiedBadge } from '@/components/catalog/VerifiedBadge'
import { EventCard } from '@/components/events/EventCard'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import {
  ArrowLeft,
  Calendar,
  Layers,
  Sparkles,
  Bookmark,
  Check,
  Compass,
  Flame,
  Info,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Plus,
} from 'lucide-react'

export default function CastingDetailPage() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string)
  const casting = getCastingById(id || '')

  const { addCollectionItem, collectionItems, events } = useApp()
  const [justAdded, setJustAdded] = useState(false)

  if (!casting) {
    return (
      <div className="min-h-[60vh] max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Flame className="w-12 h-12 text-slate mx-auto" />
        <h1 className="text-2xl font-bold text-midnight-ink">Casting Not Found</h1>
        <p className="text-sm text-slate">
          The casting record &ldquo;{id}&rdquo; does not exist in the reference catalog.
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

  const series = getSeriesById(casting.seriesId)
  const meta = series ? getCategoryMeta(series.category) : undefined

  // Check if this casting is already in the user's collection
  const isAlreadyInVault = useMemo(() => {
    return collectionItems.some(
      (item) =>
        item.castingName?.toLowerCase() === casting.name.toLowerCase() ||
        item.title.toLowerCase() === casting.name.toLowerCase()
    )
  }, [collectionItems, casting.name])

  // Events featuring this series
  const eventsFeaturingSeries = useMemo(() => {
    if (!series) return []
    return events.filter(
      (evt) =>
        evt.featuredSeries?.includes(series.id) ||
        evt.hotWheelsDetails?.featuredSeries?.includes(series.id) ||
        evt.tags?.some((t) => t.toLowerCase() === series.name.toLowerCase())
    )
  }, [events, series])

  const handleAddToCollection = () => {
    addCollectionItem({
      title: casting.name,
      subtitle: `${casting.scale} Scale · ${series?.name || 'Hot Wheels'} (${casting.year})`,
      category: 'hot-wheels',
      year: casting.year,
      seriesOrSet: series?.name || 'Hot Wheels Catalog',
      castingName: casting.name,
      toySeries: series?.name || 'Mainline',
      condition: 'Mint on Card (MOC)',
      estimatedValue: 499,
      isOwned: true,
      description:
        casting.notes ||
        `Indexed reference catalog casting from ${series?.name || 'Hot Wheels'} (${casting.year}).`,
      photos: [
        casting.imageUrl ||
          'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=600&q=80',
      ],
      tradeStatus: 'not-for-trade',
    })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 3000)
  }

  const displayImage =
    casting.imageUrl ||
    'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=1200&q=80'

  return (
    <div className="min-h-screen bg-pure-canvas pb-24 space-y-12 select-none">
      {/* 1. HEADER & BREADCRUMB */}
      <section className="bg-gradient-to-b from-party-pink/20 to-pure-canvas border-b border-silver/50 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center gap-2 text-xs font-medium text-slate">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1.5 hover:text-midnight-ink font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </Link>
            <span>/</span>
            {series && (
              <>
                <Link
                  href={`/catalog/series/${series.id}`}
                  className="hover:text-midnight-ink"
                >
                  {series.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-midnight-ink font-bold truncate">{casting.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Image / Showcase */}
            <div className="lg:col-span-5 space-y-3">
              <div className="relative aspect-4/3 sm:aspect-16/10 w-full bg-silver/20 rounded-2xl overflow-hidden border border-silver/80 shadow-md">
                <ImageWithFallback
                  src={displayImage}
                  alt={casting.name}
                  fill
                  className="object-cover"
                />

                <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
                  <span className="px-3 py-1 bg-midnight-ink/90 text-pure-canvas text-xs font-bold rounded-full backdrop-blur-md shadow-sm">
                    Class of {casting.year}
                  </span>
                  <VerifiedBadge verified={casting.verified} size="md" />
                </div>
              </div>

              {/* Verified Status Banner */}
              <div
                className={`p-4 rounded-xl border text-xs space-y-1 ${
                  casting.verified
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-300'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  {casting.verified ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Verified Archive Entry</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>Unverified Community Placeholder</span>
                    </>
                  )}
                </div>
                <p className="leading-relaxed font-normal">
                  {casting.verified
                    ? 'This casting is officially verified for historical existence (debuted in 1968). Specifications, decos, and variants remain open for archive verification.'
                    : 'This entry is an unverified placeholder record. Per catalog policy, no designer or deco specifications are presented as fact until verified against primary historical sources.'}
                </p>
              </div>
            </div>

            {/* Right: Specs & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  {series && (
                    <Link
                      href={`/catalog/series/${series.id}`}
                      className={`text-xs font-bold px-3 py-1 rounded-full border transition-colors ${
                        meta ? meta.badgeBg : 'bg-slate/10 text-slate'
                      }`}
                    >
                      Series: {series.name}
                    </Link>
                  )}
                  <Link
                    href={`/catalog/year/${casting.year}`}
                    className="text-xs font-bold px-3 py-1 rounded-full bg-black/[0.05] text-midnight-ink border border-silver/40 hover:border-midnight-ink transition-colors"
                  >
                    Year: {casting.year}
                  </Link>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-black/[0.05] text-midnight-ink border border-silver/40">
                    Scale: {casting.scale}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-midnight-ink tracking-tight">
                  {casting.name}
                </h1>

                {casting.notes && (
                  <p className="text-sm text-graphite leading-relaxed font-medium">
                    {casting.notes}
                  </p>
                )}
              </div>

              {/* Actions: Add to Vault */}
              <div className="p-4 bg-pure-canvas border border-silver/80 rounded-2xl shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-midnight-ink block">
                    Personal Collection Integration
                  </span>
                  <p className="text-xs text-slate">
                    Sync this model directly to your CollectorEvents vault &amp; wishlist.
                  </p>
                </div>

                <button
                  onClick={handleAddToCollection}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
                    justAdded || isAlreadyInVault
                      ? 'bg-emerald-600 text-pure-canvas shadow-emerald-600/20'
                      : 'bg-midnight-ink text-pure-canvas hover:opacity-85'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Vault! 💎</span>
                    </>
                  ) : isAlreadyInVault ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>In Your Vault (Add Again)</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add to My Collection</span>
                    </>
                  )}
                </button>
              </div>

              {/* Technical Specifications Grid (Respecting no hallucinated specs rule) */}
              <div className="bg-pure-canvas border border-silver/80 rounded-2xl p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-midnight-ink uppercase tracking-wider border-b border-silver/30 pb-2">
                  Catalog Specifications
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate block">Model / Casting Name</span>
                    <span className="font-bold text-midnight-ink text-sm">{casting.name}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate block">Model Year</span>
                    <span className="font-bold text-midnight-ink text-sm">
                      <Link
                        href={`/catalog/year/${casting.year}`}
                        className="hover:underline flex items-center gap-1"
                      >
                        {casting.year}
                        <ExternalLink className="w-3 h-3 text-slate" />
                      </Link>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate block">Series Assignment</span>
                    <span className="font-bold text-midnight-ink text-sm">
                      {series ? (
                        <Link
                          href={`/catalog/series/${series.id}`}
                          className="hover:underline flex items-center gap-1"
                        >
                          {series.name}
                          <ExternalLink className="w-3 h-3 text-slate" />
                        </Link>
                      ) : (
                        'Reference Mainline'
                      )}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate block">Scale</span>
                    <span className="font-bold text-midnight-ink text-sm">{casting.scale}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate block">Collector Number</span>
                    <span className="font-bold text-midnight-ink text-sm">
                      {casting.collectorNumber ? casting.collectorNumber : 'Unassigned / Not Documented'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate block">Original Casting Designer</span>
                    <span className="font-bold text-midnight-ink text-sm">
                      {casting.designer ? casting.designer : 'Pending Archive Verification'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate block">Debut Color / Tampos</span>
                    <span className="font-bold text-midnight-ink text-sm">
                      {casting.color ? casting.color : 'Multiple Variations / Undefined'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate block">Verification State</span>
                    <span className="font-bold text-midnight-ink text-sm flex items-center gap-1.5">
                      <VerifiedBadge verified={casting.verified} size="sm" showLabel={true} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EVENTS FEATURING THIS SERIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-silver/40 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-midnight-ink flex items-center gap-2">
              <Compass className="w-5 h-5 text-midnight-ink" />
              <span>Events Featuring This Series</span>
            </h2>
            <p className="text-xs text-slate">
              Gatherings tagged with {series?.name || 'this series'} where collectors hunt and trade these castings.
            </p>
          </div>

          {eventsFeaturingSeries.length > 0 && (
            <span className="text-xs font-bold text-slate bg-black/[0.04] px-3 py-1 rounded-full">
              {eventsFeaturingSeries.length} Gathering{eventsFeaturingSeries.length === 1 ? '' : 's'} Found
            </span>
          )}
        </div>

        {eventsFeaturingSeries.length === 0 ? (
          <div className="bg-pure-canvas border border-silver/70 rounded-2xl p-8 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-slate mx-auto" />
            <h3 className="text-sm font-bold text-midnight-ink">
              No Upcoming Gatherings Tagged With &ldquo;{series?.name || 'This Series'}&rdquo; Yet
            </h3>
            <p className="text-xs text-slate max-w-md mx-auto">
              Are you planning to showcase or trade this casting at an upcoming swap meet? Host an event and tag the series to bring local collectors together!
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-midnight-ink text-pure-canvas text-xs font-bold rounded-lg hover:opacity-85"
            >
              <span>Host an Event With This Series</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventsFeaturingSeries.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
