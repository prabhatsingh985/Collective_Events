import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  variant?: 'light' | 'dark' | 'auto' | 'mark-only'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showTagline?: boolean
  href?: string
  className?: string
}

export function Logo({
  variant = 'light',
  size = 'md',
  showTagline = false,
  href,
  className = '',
}: LogoProps) {
  const heights = {
    sm: 24,
    md: 32,
    lg: 40,
    xl: 52,
  }

  const markSizes = {
    sm: 24,
    md: 32,
    lg: 40,
    xl: 52,
  }

  const h = heights[size]
  const markSize = markSizes[size]

  const content = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {variant === 'mark-only' ? (
        <Image
          src="/brand/logo-mark.png"
          alt="CollectorEvents"
          width={markSize}
          height={markSize}
          className="object-contain group-hover:scale-105 transition-transform"
          priority
        />
      ) : (
        <div className="flex items-center gap-2.5">
          <Image
            src="/brand/logo-mark.png"
            alt="CollectorEvents"
            width={markSize}
            height={markSize}
            className="object-contain group-hover:scale-105 transition-transform shrink-0"
            priority
          />
          <div className="flex flex-col">
            <div className="flex items-baseline font-extrabold tracking-tight leading-none text-xl lg:text-2xl">
              <span className={variant === 'dark' ? 'text-pure-canvas' : 'text-slate-900'}>
                Collector
              </span>
              <span className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent">
                Events
              </span>
            </div>
            {showTagline && (
              <span className={`text-[10px] font-medium tracking-tight mt-0.5 ${variant === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Events for People Who Collect Experiences
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    )
  }

  return content
}
