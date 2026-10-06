'use client'

import React, { useState } from 'react'
import Image, { ImageProps } from 'next/image'

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  src?: string | null
  fallbackSrc?: string
}

export function ImageWithFallback({
  src,
  fallbackSrc = 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=800&q=80',
  alt,
  className = '',
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const finalSrc = error || !src ? fallbackSrc : src

  return (
    <div className={`relative overflow-hidden bg-silver/20 ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-silver/20 animate-pulse flex items-center justify-center text-slate text-xs">
          Loading...
        </div>
      )}
      <Image
        src={finalSrc}
        alt={alt || 'Collectible'}
        className={`transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
        {...props}
      />
    </div>
  )
}
