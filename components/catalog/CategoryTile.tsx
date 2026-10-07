'use client'

import React from 'react'
import Link from 'next/link'
import { CategoryMeta } from '@/data/hotwheels/types'
import { getSeriesByCategory } from '@/data/hotwheels'
import { Layers, ArrowRight } from 'lucide-react'

interface CategoryTileProps {
  category: CategoryMeta
  isSelected?: boolean
  onClick?: () => void
}

export function CategoryTile({ category, isSelected = false, onClick }: CategoryTileProps) {
  const seriesCount = getSeriesByCategory(category.id).length

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
        isSelected
          ? 'bg-midnight-ink text-pure-canvas border-midnight-ink shadow-lg -translate-y-1'
          : 'bg-pure-canvas border-silver/60 hover:border-midnight-ink/50 hover:shadow-card hover:-translate-y-0.5'
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
              isSelected
                ? 'bg-pure-canvas/20 text-pure-canvas border-pure-canvas/30'
                : category.badgeBg
            }`}
          >
            {category.era}
          </span>
          <span
            className={`text-xs font-semibold flex items-center gap-1 ${
              isSelected ? 'text-pure-canvas/80' : 'text-slate'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {seriesCount} series
          </span>
        </div>

        <h3
          className={`font-bold text-lg leading-snug tracking-tight mb-1.5 transition-colors ${
            isSelected
              ? 'text-pure-canvas'
              : 'text-midnight-ink group-hover:text-midnight-blue'
          }`}
        >
          {category.name}
        </h3>

        <p
          className={`text-xs leading-relaxed line-clamp-2 ${
            isSelected ? 'text-pure-canvas/80' : 'text-graphite font-normal'
          }`}
        >
          {category.shortDesc}
        </p>
      </div>

      <div className="pt-4 mt-3 border-t border-silver/30 flex items-center justify-between text-xs font-bold">
        <span
          className={
            isSelected
              ? 'text-pure-canvas/90'
              : 'text-slate group-hover:text-midnight-ink transition-colors'
          }
        >
          Explore Series
        </span>
        <ArrowRight
          className={`w-4 h-4 transform group-hover:translate-x-1 transition-transform ${
            isSelected ? 'text-pure-canvas' : 'text-slate group-hover:text-midnight-ink'
          }`}
        />
      </div>
    </div>
  )
}
