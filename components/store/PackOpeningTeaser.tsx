'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Sparkles, Flame, RefreshCw, ShoppingBag, Check, Zap } from 'lucide-react'
import { useStore } from '@/lib/store/useStore'
import { ALL_PRODUCTS } from '@/lib/mock-store-data'

export function PackOpeningTeaser() {
  const { addToCart, setCartOpen } = useStore()
  const [packType, setPackType] = useState<'card' | 'hw'>('card')
  const [state, setState] = useState<'idle' | 'ripping' | 'revealed'>('idle')
  const [revealedIndex, setRevealedIndex] = useState(0)

  // Samples to reveal
  const cardPool = [
    ALL_PRODUCTS.find((p) => p.id === 'card-3') || ALL_PRODUCTS[1], // Haaland Downtown
    ALL_PRODUCTS.find((p) => p.id === 'card-4') || ALL_PRODUCTS[2], // Lamine Yamal Auto
    ALL_PRODUCTS.find((p) => p.id === 'card-9') || ALL_PRODUCTS[3], // Pedri BGS 9.5
  ]

  const hwPool = [
    ALL_PRODUCTS.find((p) => p.id === 'hw-1') || ALL_PRODUCTS[0], // Datsun 240Z Super $TH
    ALL_PRODUCTS.find((p) => p.id === 'hw-2') || ALL_PRODUCTS[1], // Skyline GT-R RLC Chrome
    ALL_PRODUCTS.find((p) => p.id === 'hw-4') || ALL_PRODUCTS[3], // '67 Camaro
  ]

  const currentPool = packType === 'card' ? cardPool : hwPool
  const revealedProduct = currentPool[revealedIndex % currentPool.length]

  const handleRip = () => {
    setState('ripping')
    setTimeout(() => {
      setState('revealed')
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: packType === 'card' ? ['#00d4aa', '#ffb703', '#ffffff'] : ['#ff5400', '#ffd000', '#111111'],
        })
      } catch (e) {
        // Fallback if canvas-confetti is not loaded
      }
    }, 1200)
  }

  const handleReset = () => {
    setState('idle')
    setRevealedIndex((prev) => prev + 1)
  }

  const handleClaim = () => {
    if (revealedProduct) {
      addToCart(revealedProduct, 1)
      setCartOpen(true)
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto rounded-2xl bg-zinc-950 border border-zinc-800 p-5 shadow-2xl overflow-hidden select-none">
      {/* Background Foil Mesh */}
      <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-transparent blur-2xl pointer-events-none" />

      {/* Header with Switcher */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Interactive Pack Teaser
          </span>
        </div>

        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          <button
            onClick={() => {
              setPackType('card')
              setState('idle')
            }}
            className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
              packType === 'card'
                ? 'bg-cards-stadium text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Hobby Pack
          </button>
          <button
            onClick={() => {
              setPackType('hw')
              setState('idle')
            }}
            className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
              packType === 'hw'
                ? 'bg-hw-orange text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Die-Cast Blister
          </button>
        </div>
      </div>

      {/* Interactive Stage */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden flex items-center justify-center bg-zinc-900/90 border border-zinc-800">
        <AnimatePresence mode="wait">
          {state === 'idle' && (
            <motion.div
              key="idle-pack"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center justify-center p-6 text-center cursor-pointer group"
              onClick={handleRip}
            >
              {packType === 'card' ? (
                <div className="relative w-36 h-48 rounded-lg bg-gradient-to-br from-indigo-900 via-emerald-800 to-amber-900 border-2 border-amber-400/50 shadow-2xl flex flex-col justify-between p-3 card-foil-shine group-hover:scale-105 transition-transform duration-300">
                  <div className="text-[10px] font-mono font-black text-amber-300 tracking-widest uppercase">
                    PANINI PRIZM
                  </div>
                  <div className="flex flex-col items-center">
                    <Sparkles className="w-8 h-8 text-amber-300 animate-bounce" />
                    <span className="text-xs font-black text-white mt-1">SEALED HOBBY</span>
                    <span className="text-[9px] text-zinc-300">Guaranteed Auto or Case Hit</span>
                  </div>
                  <div className="text-[9px] font-mono text-zinc-400 text-center">
                    PULL TO RIP ⚡
                  </div>
                </div>
              ) : (
                <div className="relative w-36 h-48 rounded-lg bg-gradient-to-br from-zinc-800 via-orange-950 to-zinc-900 border-2 border-orange-500/60 shadow-2xl flex flex-col justify-between p-3 group-hover:scale-105 transition-transform duration-300">
                  <div className="text-[10px] font-black text-hw-yellow tracking-widest uppercase flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-hw-flame fill-hw-flame" />
                    <span>RLC EXCLUSIVE</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-8 rounded bg-orange-600/30 border border-orange-400 flex items-center justify-center text-[10px] font-bold text-white shadow-inner">
                      1:64 DIE-CAST
                    </div>
                    <span className="text-xs font-black text-white mt-2">MINT CLAMSHELL</span>
                    <span className="text-[9px] text-zinc-300">Spectraflame Paint Finish</span>
                  </div>
                  <div className="text-[9px] font-mono text-amber-400 text-center">
                    POP BLISTER ⚡
                  </div>
                </div>
              )}

              <button className="mt-4 px-4 py-2 rounded-full bg-white text-black font-black text-xs hover:bg-zinc-200 transition-colors flex items-center gap-2 shadow-lg group-hover:scale-105">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Click to Rip Teaser ({packType === 'card' ? 'Football Card' : 'Hot Wheels'})</span>
              </button>
            </motion.div>
          )}

          {state === 'ripping' && (
            <motion.div
              key="ripping"
              initial={{ rotate: -5 }}
              animate={{ rotate: [5, -5, 5, 0], scale: [1, 1.08, 0.95, 1.1] }}
              transition={{ duration: 1.1, repeat: 0 }}
              className="flex flex-col items-center justify-center gap-3"
            >
              <div className="relative w-32 h-44 rounded-lg bg-gradient-to-r from-amber-400 via-red-500 to-emerald-400 animate-pulse flex items-center justify-center text-white font-black text-sm shadow-2xl">
                <Sparkles className="w-10 h-10 animate-spin text-white" />
              </div>
              <span className="font-mono text-xs font-black uppercase text-amber-400 tracking-wider animate-pulse">
                Ripping factory foil seal...
              </span>
            </motion.div>
          )}

          {state === 'revealed' && revealedProduct && (
            <motion.div
              key="revealed"
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="flex flex-col items-center justify-center p-3 w-full h-full"
            >
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-lg overflow-hidden border-2 border-amber-400 shadow-2xl">
                <Image
                  src={revealedProduct.images[0]}
                  alt={revealedProduct.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono font-bold text-amber-300">
                  {revealedProduct.badge || 'GRAIL HIT'}
                </div>
              </div>

              <div className="mt-2 text-center max-w-[280px]">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                  HIT REVEALED 🎉
                </span>
                <h4 className="text-xs font-bold text-white line-clamp-1">
                  {revealedProduct.title}
                </h4>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-sm font-extrabold text-amber-300 font-mono">
                    ₹{revealedProduct.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-zinc-400 line-through">
                    ₹{revealedProduct.mrp.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleClaim}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-colors flex items-center gap-1.5 shadow"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add To Cart</span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Rip Another</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer hint */}
      <div className="mt-3 text-[11px] text-zinc-400 text-center flex items-center justify-center gap-1.5">
        <span>Authentic Mint Castings & Panini Wax</span>
        <span>•</span>
        <span className="text-zinc-500">Zero resealed packs guaranteed</span>
      </div>
    </div>
  )
}
