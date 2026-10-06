'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Search,
  ShoppingBag,
  Heart,
  Flame,
  Sparkles,
  Shield,
  Menu,
  X,
  Package,
  Layers,
  ArrowRight,
  User,
  Zap,
} from 'lucide-react'
import { useStore } from '@/lib/store/useStore'
import { CountdownTimer } from './CountdownTimer'
import { StoreCartDrawer } from './StoreCartDrawer'

export function StoreNavbar() {
  const pathname = usePathname()
  const { cart, wishlist, setCartOpen, setSearchOpen } = useStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)
  const wishlistCount = wishlist.length

  const categories = [
    { label: 'Hot Wheels', href: '/shop/hot-wheels', icon: Flame, color: 'text-hw-orange' },
    { label: 'Trading Cards', href: '/shop/cards', icon: Sparkles, color: 'text-emerald-500' },
    { label: 'Sealed Wax', href: '/shop/sealed', icon: Package, color: 'text-blue-500' },
    { label: 'Graded Slabs', href: '/shop/graded', icon: Layers, color: 'text-amber-500' },
    { label: 'Supplies', href: '/shop/supplies', icon: Shield, color: 'text-zinc-400' },
    { label: 'Drops', href: '/shop/drops', icon: Zap, color: 'text-purple-400', badge: 'LIVE' },
  ]

  const isActive = (href: string) => pathname === href || pathname?.startsWith(`${href}/`)

  return (
    <>
      <header className="sticky top-0 z-40 bg-zinc-950 text-white border-b border-zinc-800 shadow-xl select-none">
        {/* Top Ticker: Drop Timer & Trust Highlights */}
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800/80 px-4 py-1.5 text-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-hw-flame animate-ping" />
              <span className="font-extrabold text-[11px] text-zinc-300 uppercase tracking-wider">
                Next Drop Live:
              </span>
              <CountdownTimer
                targetDate="2026-10-08T06:00:00Z"
                compact
              />
            </div>

            <div className="hidden md:flex items-center gap-4 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1">
                <span className="text-emerald-400">✓</span> 100% Factory Sealed Panini / Topps Wax
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="text-amber-400">✓</span> Mint-on-Card Hot Wheels Blister Inspection
              </span>
              <span>•</span>
              <span className="text-zinc-300 font-bold">
                FREE BlueDart Air shipping above ₹999
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <Link
                href="/events"
                className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Collector Events & Meets</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-5">
            <Link href="/shop" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-hw-orange to-red-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-orange-600/20 group-hover:scale-105 transition-transform">
                ⚡
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-black text-xl tracking-tight text-white">
                    CRATE<span className="text-hw-orange">STORE</span>
                  </span>
                  <span className="text-[10px] font-mono font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    VAULT
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-zinc-400 tracking-tight mt-0.5">
                  Hot Wheels & Sports Cards India
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 pl-4 border-l border-zinc-800">
              {categories.map((cat) => {
                const active = isActive(cat.href)
                const Icon = cat.icon
                return (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 relative ${
                      active
                        ? 'bg-zinc-800 text-white shadow-inner'
                        : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${cat.color}`} />
                    <span>{cat.label}</span>
                    {cat.badge && (
                      <span className="px-1 py-0.2 rounded text-[9px] font-black bg-purple-600 text-white uppercase animate-pulse">
                        {cat.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Center/Right: Quick Search Trigger */}
          <div className="hidden md:flex flex-1 max-w-xs mx-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all text-xs font-medium group shadow-inner"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-hw-orange transition-colors" />
                <span>Search Datsun $TH, Prizm, Yamal...</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400 border border-zinc-700">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist Button */}
            <Link
              href="/shop/account?tab=wishlist"
              className="relative p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white font-black text-[10px] flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-hw-orange to-red-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-orange-600/20 transition-transform active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-white font-mono text-[11px]">
                {cartCount}
              </span>
            </button>

            {/* Account / Vault */}
            <Link
              href="/shop/account"
              className="hidden sm:flex items-center gap-1.5 p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
              title="Collector Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-4 space-y-3">
            {/* Mobile Search button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                setSearchOpen(true)
              }}
              className="w-full flex items-center gap-2 px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 text-xs font-medium"
            >
              <Search className="w-4 h-4" />
              <span>Search Hot Wheels, players, sealed wax...</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {categories.map((cat) => {
                const Icon = cat.icon
                return (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 text-xs font-bold text-zinc-200"
                  >
                    <Icon className={`w-4 h-4 ${cat.color}`} />
                    <span>{cat.label}</span>
                  </Link>
                )
              })}
            </div>

            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
              <Link
                href="/shop/account"
                onClick={() => setMobileMenuOpen(false)}
                className="text-zinc-300 font-bold hover:text-white"
              >
                My Account & Orders
              </Link>
              <Link
                href="/events"
                onClick={() => setMobileMenuOpen(false)}
                className="text-hw-orange font-bold hover:underline"
              >
                Back to Events Platform →
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Slide-out Cart Drawer */}
      <StoreCartDrawer />
    </>
  )
}
