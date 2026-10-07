'use client'

import React from 'react'
import Link from 'next/link'

interface YearChipProps {
  year: number
  isActive?: boolean
  castingCount?: number
  href?: string
  onClick?: () => void
}

export function YearChip({
  year,
  isActive = false,
  castingCount,
  href,
  onClick,
}: YearChipProps) {
  const content = (
    <>
      <span>{year}</span>
      {castingCount !== undefined && castingCount > 0 && (
        <span
          className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
            isActive
              ? 'bg-pure-canvas text-midnight-ink'
              : 'bg-midnight-ink/10 text-midnight-ink dark:bg-pure-canvas/20 dark:text-pure-canvas'
          }`}
        >
          {castingCount}
        </span>
      )}
    </>
  )

  const classes = `inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold rounded-lg border transition-all duration-150 whitespace-nowrap shrink-0 ${
    isActive
      ? 'bg-midnight-ink text-pure-canvas border-midnight-ink shadow-sm'
      : 'bg-pure-canvas text-graphite border-silver/70 hover:border-midnight-ink hover:text-midnight-ink'
  }`

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  )
}
