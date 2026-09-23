import React from 'react'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 
    | 'category-hw' 
    | 'category-cards' 
    | 'category-diecast'
    | 'magenta' 
    | 'violet' 
    | 'orange' 
    | 'neutral' 
    | 'psa' 
    | 'grail'
    | 'success'
    | 'soft-pink'
    | 'soft-periwinkle'
    | 'soft-mint'
    | 'default'
    | 'rsvp-going'
    | 'rsvp-maybe'
    | 'rsvp-cant'
  size?: 'sm' | 'md'
  className?: string
  icon?: React.ReactNode
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  icon,
}: BadgeProps) {
  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5 font-bold tracking-tight',
    md: 'text-xs px-3 py-1 font-bold tracking-tight',
  }

  // Partiful 960px rounded-full badges with subtle tints & high contrast
  const variantClasses: Record<string, string> = {
    'category-hw': 'bg-black/[0.06] text-midnight-ink border border-black/10',
    'category-cards': 'bg-sky-periwinkle/30 text-midnight-blue border border-sky-periwinkle/50',
    'category-diecast': 'bg-party-pink/30 text-midnight-ink border border-party-pink/60',
    magenta: 'bg-party-pink/40 text-midnight-ink border border-party-pink',
    violet: 'bg-[#001666]/10 text-midnight-blue border border-[#001666]/20',
    orange: 'bg-[#ffae00]/20 text-midnight-ink border border-[#ffae00]/40',
    neutral: 'bg-black/[0.05] text-midnight-ink border border-black/[0.08]',
    default: 'bg-black/[0.05] text-midnight-ink border border-black/[0.08]',
    psa: 'bg-pure-canvas text-midnight-ink border border-silver font-bold shadow-sm',
    grail: 'bg-warm-sand/30 text-midnight-ink border border-warm-sand font-bold',
    success: 'bg-[#31c431]/20 text-[#1b7a1b] border border-[#31c431]/30 font-bold',
    'soft-pink': 'bg-party-pink/35 text-midnight-ink border border-party-pink/60',
    'soft-periwinkle': 'bg-sky-periwinkle/35 text-midnight-blue border border-sky-periwinkle/60',
    'soft-mint': 'bg-spearmint/20 text-[#0d684d] border border-spearmint/40 font-bold',
    'rsvp-going': 'bg-[#31c431] text-pure-canvas font-bold',
    'rsvp-maybe': 'bg-[#ffae00] text-midnight-ink font-bold',
    'rsvp-cant': 'bg-[#ff0000] text-pure-canvas font-bold',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full select-none ${sizeClasses[size]} ${variantClasses[variant] || variantClasses.neutral} ${className}`}
    >
      {icon && <span className="flex-shrink-0 text-xs">{icon}</span>}
      {children}
    </span>
  )
}
