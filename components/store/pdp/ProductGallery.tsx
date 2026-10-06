'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ZoomIn, Sparkles, Flame, Eye } from 'lucide-react'

interface ProductGalleryProps {
  images: string[]
  title: string
  isHotWheels?: boolean
  isCard?: boolean
  badge?: string
}

export function ProductGallery({
  images,
  title,
  isHotWheels = false,
  isCard = false,
  badge,
}: ProductGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  const currentImage = images[selectedIdx] || images[0]

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setMousePos({ x, y })
  }

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-4 select-none">
      {/* Thumbnails (Horizontal on mobile, vertical on sm+) */}
      <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-96 pb-2 sm:pb-0 shrink-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIdx(idx)}
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-zinc-900 border-2 transition-all ${
              selectedIdx === idx
                ? 'border-hw-orange shadow-lg shadow-orange-500/20 scale-102'
                : 'border-zinc-800 hover:border-zinc-700 opacity-70 hover:opacity-100'
            }`}
          >
            <Image src={img} alt={`${title} angle ${idx + 1}`} fill className="object-cover" />
            <span className="absolute bottom-1 right-1 text-[9px] font-mono font-bold bg-black/80 px-1 rounded text-zinc-300">
              #{idx + 1}
            </span>
          </button>
        ))}
      </div>

      {/* Main Image Stage */}
      <div className="flex-1 relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl group">
        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
          {badge && (
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-hw-orange text-white shadow-xl flex items-center gap-1.5">
              {isHotWheels && <Flame className="w-3.5 h-3.5 text-hw-yellow fill-hw-yellow" />}
              {isCard && <Sparkles className="w-3.5 h-3.5 text-yellow-300" />}
              <span>{badge}</span>
            </span>
          )}
        </div>

        {/* Zoom Hint */}
        <div className="absolute bottom-4 right-4 z-20 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-sm text-zinc-300 text-xs font-medium flex items-center gap-1.5 border border-white/10 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-3.5 h-3.5 text-hw-orange" />
          <span>Hover to Zoom</span>
        </div>

        {/* Interactive Magnifier Stage */}
        <div
          className="relative w-full h-full cursor-crosshair overflow-hidden"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <Image
            src={currentImage}
            alt={title}
            fill
            priority
            className={`object-cover transition-transform duration-200 ${
              isCard ? 'card-foil-shine' : 'hw-blister-gloss'
            }`}
            style={
              isZoomed
                ? {
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    transform: 'scale(2.2)',
                  }
                : undefined
            }
          />
        </div>
      </div>
    </div>
  )
}
