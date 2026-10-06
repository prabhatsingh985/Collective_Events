'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ShoppingBag,
  Flame,
  Sparkles,
  Package,
  Layers,
  Zap,
  Clock,
  ShieldCheck,
  Search,
  Heart,
  SlidersHorizontal,
} from 'lucide-react'
import { useStore } from '@/lib/store/useStore'
import { StoreCartDrawer } from './StoreCartDrawer'
import { StoreSearchModal } from './StoreSearchModal'

export function StoreNavbar() {
  const pathname = usePathname()
  const { cart, wishlist, setCartOpen, setSearchOpen, reservationExpiresAt, clearReservationTimer } = useStore()
  const [timeLeft, setTimeLeft] = useState<string | null>(null)

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const wishlistCount = wishlist.length

  const storeCategories = [
    { label: 'All Grails', href: '/shop' },
    { label: '🔥 Hot Wheels (1:64)', href: '/shop/hot-wheels' },
    { label: '⚡ Sports Cards', href: '/shop/cards' },
    { label: '📦 Sealed Wax', href: '/shop/sealed' },
    { label: '🛡️ Graded Slabs', href: '/shop/graded' },
    { label: '🧰 Supplies', href: '/shop/supplies' },
    { label: '🚀 Drops Calendar', href: '/shop/drops', badge: 'LIVE' },
  ]

  // Reservation countdown ticker
  useEffect(() => {
    if (!reservationExpiresAt) {
      setTimeLeft(null)
      return
    }

    const interval = setInterval(() => {
      const diff = reservationExpiresAt - Date.now()
      if (diff <= 0) {
        setTimeLeft(null)
        clearReservationTimer()
      } else {
        const mins = Math.floor(diff / 60000)
        const secs = Math.floor((diff % 60000) / 1000)
        setTimeLeft(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [reservationExpiresAt, clearReservationTimer])

  const isActive = (href: string) => {
    if (href === '/shop') return pathname === '/shop'
    return pathname === href || pathname?.startsWith(`${href}/`)
  }

  return (
    <>
      {/* Sleek Partiful Store Category & Status Ribbon */}
      <div className="sticky top-16 z-30 bg-pure-canvas/95 backdrop-blur-md border-b border-silver/50 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          {/* Left: Scrollable Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 min-w-0">
            <span className="hidden xl:inline-flex items-center gap-1.5 text-xs font-extrabold text-midnight-ink mr-2 pr-3 border-r border-silver/50 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
              <span>COLLECTOR STORE</span>
            </span>

            {storeCategories.map((cat) => {
              const active = isActive(cat.href)
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    active
                      ? 'bg-midnight-ink text-pure-canvas shadow-sm'
                      : 'bg-black/[0.03] text-slate hover:text-midnight-ink hover:bg-black/[0.06] border border-silver/40'
                  }`}
                >
                  <span>{cat.label}</span>
                  {cat.badge && (
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                        active
                          ? 'bg-party-pink text-midnight-ink'
                          : 'bg-party-pink/40 text-midnight-ink border border-party-pink/60'
                      }`}
                    >
                      {cat.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right: Reservation Timer, Search trigger & Cart Pill */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Active Hold Reservation Pill */}
            {timeLeft && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-full text-xs font-bold animate-pulse">
                <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                <span>Vault Hold:</span>
                <span className="font-mono text-amber-700">{timeLeft}</span>
              </div>
            )}

            {/* Quick Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-1.5 rounded-full border border-silver/50 bg-pure-canvas text-slate hover:text-midnight-ink hover:border-midnight-ink transition-colors"
              title="Search store grails (⌘K)"
              aria-label="Search store"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/shop/account?tab=wishlist"
              className="relative p-1.5 rounded-full border border-silver/50 bg-pure-canvas text-slate hover:text-midnight-ink hover:border-midnight-ink transition-colors"
              title="View Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-party-pink text-midnight-ink text-[10px] font-extrabold flex items-center justify-center border border-pure-canvas">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Trigger Pill with Count & Total */}
            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-midnight-ink text-pure-canvas hover:opacity-90 active:scale-[0.98] transition-all text-xs font-bold shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Cart</span>
              {cartCount > 0 && (
                <>
                  <span className="w-4 h-4 rounded-full bg-orange-600 text-pure-canvas text-[10px] font-black flex items-center justify-center">
                    {cartCount}
                  </span>
                  <span className="hidden sm:inline font-mono font-normal text-[11px] text-pure-canvas/80">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Global Store Cart Drawer & Search Modal */}
      <StoreCartDrawer />
      <StoreSearchModal />
    </>
  )
}
