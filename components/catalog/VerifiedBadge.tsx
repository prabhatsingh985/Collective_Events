'use client'

import React from 'react'
import { CheckCircle2, AlertTriangle } from 'lucide-react'

interface VerifiedBadgeProps {
  verified: boolean
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function VerifiedBadge({
  verified,
  size = 'md',
  showLabel = true,
  className = '',
}: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }

  if (verified) {
    return (
      <span
        title="Verified against source archive documents"
        className={`inline-flex items-center font-bold rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 ${sizeClasses[size]} ${className}`}
      >
        <CheckCircle2 className={`${iconSizes[size]} text-emerald-600 dark:text-emerald-400 shrink-0`} />
        {showLabel && <span>Verified Archive</span>}
      </span>
    )
  }

  return (
    <span
      title="Unverified placeholder data awaiting historical archive confirmation"
      className={`inline-flex items-center font-bold rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 ${sizeClasses[size]} ${className}`}
    >
      <AlertTriangle className={`${iconSizes[size]} text-amber-600 dark:text-amber-400 shrink-0`} />
      {showLabel && <span>Unverified (Placeholder)</span>}
    </span>
  )
}
