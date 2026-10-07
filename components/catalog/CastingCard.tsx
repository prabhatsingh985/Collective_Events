'use client'

import React from 'react'
import Link from 'next/link'
import { Casting } from '@/data/hotwheels/types'
import { getSeriesById } from '@/data/hotwheels'
import { VerifiedBadge } from './VerifiedBadge'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { ArrowUpRight, Calendar, Compass } from 'lucide-react'

interface CastingCardProps {
  casting: Casting
  className?: string
}

export function CastingCard({ casting, className = '' }: CastingCardProps) {
  const series = getSeriesById(casting.seriesId)

  // Default clean aesthetic die-cast thumbnail fallback
  const fallbackImage =
    casting.imageUrl ||
    'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=600&q=80'

  return (
    <div
      className={`group relative bg-pure-canvas rounded-xl border border-silver/60 overflow-hidden shadow-[rgba(0,0,0,0.04)_0px_2px_8px_0px] hover:shadow-[rgba(0,0,0,0.08)_0px_8px_20px_0px] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Card Thumbnail / Header */}
        <Link href={`/catalog/casting/${casting.id}`} className="block relative h-40 w-full bg-silver/20 overflow-hidden">
          <ImageWithFallback
            src={fallbackImage}
            alt={casting.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-1 pointer-events-none">
            <span className="px-2 py-0.5 bg-midnight-ink/90 text-pure-canvas text-[11px] font-bold rounded-full backdrop-blur-md">
              {casting.year}
            </span>
            <VerifiedBadge verified={casting.verified} size="sm" />
          </div>

          <div className="absolute bottom-2 right-2">
            <span className="px-2 py-0.5 bg-pure-canvas/90 text-midnight-ink text-[10px] font-bold rounded-md backdrop-blur-md shadow-xs border border-silver/40">
              {casting.scale}
            </span>
          </div>
        </Link>

        {/* Content */}
        <div className="p-4 space-y-2">
          <div className="text-[11px] font-semibold text-slate truncate">
            {series ? (
              <Link
                href={`/catalog/series/${series.id}`}
                className="hover:text-midnight-ink hover:underline"
              >
                {series.name}
              </Link>
            ) : (
              <span>Hot Wheels Catalog</span>
            )}
          </div>

          <Link href={`/catalog/casting/${casting.id}`}>
            <h3 className="font-bold text-base text-midnight-ink group-hover:text-midnight-blue transition-colors line-clamp-1 leading-snug">
              {casting.name}
            </h3>
          </Link>

          {casting.notes && (
            <p className="text-xs text-graphite line-clamp-2 leading-relaxed font-normal">
              {casting.notes}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 pt-0">
        <div className="pt-3 border-t border-silver/40 flex items-center justify-between">
          <Link
            href={`/catalog/year/${casting.year}`}
            className="text-xs font-semibold text-slate hover:text-midnight-ink flex items-center gap-1"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Class of {casting.year}</span>
          </Link>

          <Link
            href={`/catalog/casting/${casting.id}`}
            className="text-xs font-bold text-midnight-ink group-hover:text-midnight-blue flex items-center gap-1"
          >
            <span>Specs</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
