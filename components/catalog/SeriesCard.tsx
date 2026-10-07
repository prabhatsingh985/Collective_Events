'use client'

import React from 'react'
import Link from 'next/link'
import { Series } from '@/data/hotwheels/types'
import { getCastingsBySeries, getCategoryMeta } from '@/data/hotwheels'
import { Layers, ArrowRight, ShieldCheck, Flame } from 'lucide-react'

interface SeriesCardProps {
  series: Series
  className?: string
}

export function SeriesCard({ series, className = '' }: SeriesCardProps) {
  const castings = getCastingsBySeries(series.id)
  const meta = getCategoryMeta(series.category)

  return (
    <Link
      href={`/catalog/series/${series.id}`}
      className={`group relative bg-pure-canvas rounded-xl border border-silver/60 p-5 shadow-[rgba(0,0,0,0.04)_0px_2px_8px_0px] hover:shadow-[rgba(0,0,0,0.08)_0px_8px_20px_0px] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              meta ? meta.badgeBg : 'bg-slate/10 text-slate'
            }`}
          >
            {meta?.name || series.category}
          </span>
          {series.scale && (
            <span className="text-[11px] font-semibold text-slate bg-black/[0.04] px-2 py-0.5 rounded-md">
              {series.scale}
            </span>
          )}
        </div>

        <h3 className="font-bold text-base text-midnight-ink group-hover:text-midnight-blue transition-colors line-clamp-1 mb-1.5 flex items-center gap-1.5">
          <span>{series.name}</span>
          {series.isExclusive && (
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 rounded border border-yellow-500/30">
              RLC / Club
            </span>
          )}
        </h3>

        {series.description && (
          <p className="text-xs text-graphite line-clamp-2 leading-relaxed font-normal mb-3">
            {series.description}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-silver/40 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" />
          {castings.length > 0 ? (
            <span className="text-midnight-ink font-bold">
              {castings.length} {castings.length === 1 ? 'casting' : 'castings'}
            </span>
          ) : (
            <span>Reference Index</span>
          )}
        </span>

        <span className="font-bold text-midnight-ink group-hover:text-midnight-blue flex items-center gap-1">
          <span>View Series</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  )
}
