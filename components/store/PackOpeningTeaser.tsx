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
    <div className="relative w-full max-w-md mx-auto rounded-3xl bg-pure-canvas border border-silver/70 p-6 shadow-card overflow-hidden select-none">
      {/* Background Foil Mesh */}
      <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-party-pink/20 blur-3xl pointer-events-none" />

      {/* Header with Switcher */}
      <div className="flex items-center justify-between pb-3 border-b border-silver/40 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-midnight-ink">
            Interactive Pack Reveal
          </span>
        </div>

        <div className="flex items-center gap-1 bg-black/[0.04] p-1 rounded-full border border-silver/40">
          <button
            onClick={() => {
              setPackType('card')
              setState('idle')
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
              packType === 'card'
                ? 'bg-midnight-ink text-pure-canvas shadow-sm'
                : 'text-slate hover:text-midnight-ink'
            }`}
          >
            Hobby Pack
          </button>
          <button
            onClick={() => {
              setPackType('hw')
              setState('idle')
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
              packType === 'hw'
                ? 'bg-orange-600 text-pure-canvas shadow-sm'
                : 'text-slate hover:text-midnight-ink'
            }`}
          >
            Die-Cast Blister
          </button>
        </div>
      </div>

      {/* Interactive Stage */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden flex items-center justify-center bg-black/[0.02] border border-silver/50">
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
                <div className="relative w-36 h-48 rounded-xl bg-gradient-to-br from-indigo-900 via-emerald-800 to-amber-900 border-2 border-amber-400/50 shadow-xl flex flex-col justify-between p-3 card-foil-shine group-hover:scale-105 transition-transform duration-300">
                  <div className="text-[10px] font-mono font-black text-amber-300 tracking-widest uppercase">
                    PANINI PRIZM
                  </div>
                  <div className="text-center">
                    <Sparkles className="w-8 h-8 text-yellow-300 mx-auto animate-pulse" />
                    <span className="text-xs font-black text-white mt-1 block">HOBBY PACK</span>
                  </div>
                  <div className="text-[9px] font-mono text-zinc-300 text-right">TAMPER SEALED</div>
                </div>
              ) : (
                <div className="relative w-36 h-48 rounded-xl bg-gradient-to-br from-blue-900 via-orange-800 to-red-950 border-2 border-orange-400/50 shadow-xl flex flex-col justify-between p-3 hw-blister-gloss group-hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <Flame className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-[10px] font-black text-yellow-300">SUPER $TH</span>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl">🏎️</span>
                    <span className="text-[11px] font-black text-white mt-1 block">1:64 DIE-CAST</span>
                  </div>
                  <div className="text-[9px] font-mono text-zinc-300 text-right">UNPUNCHED CARD</div>
                </div>
              )}

              <p className="mt-4 text-xs font-bold text-midnight-ink flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-orange-600 fill-orange-600 animate-bounce" />
                <span>Click to {packType === 'card' ? 'rip pack' : 'pop blister card'}!</span>
              </p>
            </motion.div>
          )}

          {state === 'ripping' && (
            <motion.div
              key="ripping-anim"
              initial={{ scale: 1 }}
              animate={{
                rotate: [-2, 2, -3, 3, 0],
                scale: [1, 1.05, 0.95, 1.1, 1],
              }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
              className="flex flex-col items-center justify-center text-center p-6"
            >
              <div className="w-16 h-16 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mb-3" />
              <p className="text-xs font-extrabold uppercase tracking-wider text-midnight-ink">
                Inspecting Holograms & Corners...
              </p>
            </motion.div>
          )}

          {state === 'revealed' && revealedProduct && (
            <motion.div
              key="revealed-hit"
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="p-4 w-full h-full flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-fog/20 shrink-0 border border-silver/50">
                  <Image
                    src={revealedProduct.images[0]}
                    alt={revealedProduct.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-party-pink text-midnight-ink inline-block mb-1">
                    Vault Hit Pulled!
                  </span>
                  <h4 className="font-extrabold text-xs text-midnight-ink line-clamp-2">
                    {revealedProduct.title}
                  </h4>
                  <div className="text-sm font-extrabold text-midnight-ink mt-1">
                    ₹{revealedProduct.price.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-silver/40">
                <button
                  onClick={handleClaim}
                  className="flex-1 py-2 rounded-[8px] bg-midnight-ink hover:opacity-90 text-pure-canvas text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add Hit to Cart</span>
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 rounded-[8px] bg-pure-canvas border border-silver/60 text-slate hover:text-midnight-ink transition-colors"
                  title="Rip another"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
