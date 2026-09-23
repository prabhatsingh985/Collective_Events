'use client'

import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 
    | 'primary' 
    | 'secondary' 
    | 'outline' 
    | 'white' 
    | 'ghost' 
    | 'dark' 
    | 'pill' 
    | 'rsvp-going' 
    | 'rsvp-maybe' 
    | 'rsvp-cant'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  icon?: React.ReactNode
  fullWidth?: boolean
  isLoading?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  // Partiful sizing
  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs font-bold tracking-tight',
    md: 'px-6 py-2.5 text-sm font-bold tracking-[-0.03em]',
    lg: 'px-8 py-3.5 text-base font-bold tracking-[-0.04em]',
    icon: 'w-10 h-10 p-0 flex items-center justify-center',
  }

  // Partiful button variants: Primary is strictly black fill (#000000) with white text & 8px radius
  const variantClasses = {
    primary:
      'bg-midnight-ink text-pure-canvas rounded-[8px] hover:opacity-85 active:scale-[0.98] transition-all duration-150 shadow-sm border border-transparent',
    secondary:
      'bg-transparent text-midnight-ink border border-silver hover:border-midnight-ink hover:bg-black/[0.03] rounded-[8px] active:scale-[0.98] transition-all duration-150',
    outline:
      'bg-transparent text-midnight-ink border border-midnight-ink hover:bg-black/[0.04] rounded-[8px] active:scale-[0.98] transition-all duration-150',
    white:
      'bg-pure-canvas text-midnight-ink rounded-[8px] hover:bg-pure-canvas/90 active:scale-[0.98] transition-all duration-150 shadow-sm border border-silver/50',
    dark:
      'bg-midnight-ink text-pure-canvas rounded-[8px] hover:opacity-90 active:scale-[0.98] transition-all duration-150',
    ghost:
      'bg-transparent text-midnight-ink hover:bg-black/[0.05] rounded-[4px] transition-all duration-150',
    pill:
      'bg-midnight-ink text-pure-canvas rounded-full px-5 py-2 text-xs font-bold tracking-tight hover:opacity-85 active:scale-[0.98] transition-all duration-150',
    // RSVP Semantic variants
    'rsvp-going':
      'bg-[#31c431] text-pure-canvas rounded-full hover:opacity-90 active:scale-[0.98] transition-all duration-150 shadow-sm',
    'rsvp-maybe':
      'bg-[#ffae00] text-midnight-ink rounded-full hover:opacity-90 active:scale-[0.98] transition-all duration-150 shadow-sm',
    'rsvp-cant':
      'bg-[#ff0000] text-pure-canvas rounded-full hover:opacity-90 active:scale-[0.98] transition-all duration-150 shadow-sm',
  }

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
        fullWidth ? 'w-full' : ''
      } ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      {children}
    </button>
  )
}
