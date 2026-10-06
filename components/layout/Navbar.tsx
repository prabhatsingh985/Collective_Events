'use client'

import React, { useState } from 'react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { Search, Bell, Bookmark, Plus, Menu, X, Sparkles, ShoppingBag, Flame } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const { notifications, savedEventIds, currentUser, setIsSearchOpen, cartItems, setIsCartOpen } = useApp()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length
  const savedCount = savedEventIds.length
  const cartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0)

  const navLinks = [
    { label: 'Explore Drops', href: '/events' },
    { label: '🔥 Hot Wheels Store', href: '/shop' },
    { label: 'My Vault', href: '/collection' },
    { label: 'Trade Hub', href: '/trades' },
    { label: 'Community', href: '/community' },
  ]


  const isActive = (href: string) => pathname === href || pathname?.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-40 bg-pure-canvas/95 backdrop-blur-md border-b border-silver/40 select-none">
      {/* Partiful Top Announcement Banner */}
      <div className="bg-party-pink text-midnight-ink py-1.5 px-4 text-center text-xs font-semibold tracking-tight border-b border-party-pink/40 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-midnight-blue shrink-0" />
        <span>Die-Cast Swaps & Sports Card Box Breaks across Mumbai, Delhi & Bengaluru</span>
        <Sparkles className="w-3.5 h-3.5 text-midnight-blue shrink-0" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center gap-6">
          <NextLink href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-[8px] bg-midnight-ink text-pure-canvas flex items-center justify-center font-bold text-sm tracking-tight shadow-sm group-hover:scale-105 transition-transform">
              ✨
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-midnight-ink leading-none">
                Crate<span className="text-slate">Meet</span>
              </span>
              <span className="text-[10px] font-medium tracking-tight text-ash leading-tight">
                Die-Cast & Card Gatherings
              </span>
            </div>
          </NextLink>

          {/* Desktop Nav Items with Partiful Warm Sand Active State */}
          <nav className="hidden lg:flex items-center gap-1 pl-4 border-l border-silver/40">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <NextLink
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 text-sm font-semibold rounded-[4px] transition-all relative ${
                    active
                      ? 'text-midnight-ink font-bold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-warm-sand'
                      : 'text-slate hover:text-midnight-ink hover:bg-black/[0.03]'
                  }`}
                >
                  {link.label}
                </NextLink>
              )
            })}
          </nav>
        </div>

        {/* Center: Quick Search Trigger */}
        <div className="hidden md:flex flex-1 max-w-xs lg:max-w-md mx-2">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-4 py-2 bg-black/[0.03] hover:bg-black/[0.05] border border-silver/50 rounded-full text-slate hover:text-midnight-ink transition-all text-xs font-medium"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate" />
              <span>Search drops, cards, cities...</span>
            </span>
            <kbd className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-pure-canvas border border-silver/70 rounded-full text-graphite shadow-sm">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, Notifications, Profile & Host CTA */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden w-9 h-9 rounded-full border border-silver/50 flex items-center justify-center text-graphite hover:text-midnight-ink"
            aria-label="Open search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Saved Events Bookmark */}
          <NextLink
            href="/saved"
            className="relative w-9 h-9 rounded-full border border-silver/50 bg-pure-canvas flex items-center justify-center text-graphite hover:text-midnight-ink hover:border-silver transition-colors"
            title="Saved Events"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-midnight-ink text-pure-canvas text-[10px] font-bold rounded-full flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </NextLink>

          {/* Notifications Bell */}
          <NextLink
            href="/notifications"
            className="relative w-9 h-9 rounded-full border border-silver/50 bg-pure-canvas flex items-center justify-center text-graphite hover:text-midnight-ink hover:border-silver transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-party-pink text-midnight-ink border border-pure-canvas text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadNotifsCount}
              </span>
            )}
          </NextLink>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative w-9 h-9 rounded-full border border-silver/50 bg-pure-canvas flex items-center justify-center text-midnight-ink hover:border-midnight-ink transition-colors"
            title="Open Collector Cart"
          >
            <ShoppingBag className="w-4 h-4 text-midnight-ink" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-pure-canvas text-[10px] font-extrabold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile Mini Badge */}
          <NextLink
            href={`/profile/${currentUser.username}`}

            className="hidden sm:flex items-center gap-2 p-1 pr-3 rounded-full border border-silver/60 bg-pure-canvas hover:border-midnight-ink transition-colors"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover"
            />
            <span className="text-xs font-semibold text-midnight-ink">
              @{currentUser.username}
            </span>
          </NextLink>

          {/* Partiful Primary CTA: Filled Black Button with 8px radius */}
          <NextLink
            href="/create"
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2 bg-midnight-ink text-pure-canvas font-bold text-sm rounded-[8px] hover:opacity-85 active:scale-[0.98] transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Host Meet</span>
          </NextLink>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-full border border-silver/50 flex items-center justify-center text-midnight-ink"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-pure-canvas border-t border-silver/40 p-4 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <NextLink
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`p-3 text-center text-xs font-semibold rounded-lg border transition-all ${
                  isActive(link.href)
                    ? 'bg-midnight-ink text-pure-canvas border-midnight-ink'
                    : 'bg-black/[0.02] text-midnight-ink border-silver/50'
                }`}
              >
                {link.label}
              </NextLink>
            ))}
          </div>

          <div className="pt-2 border-t border-silver/30 flex flex-col gap-2">
            <NextLink
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg border border-silver/60 text-center font-medium text-xs text-graphite hover:text-midnight-ink"
            >
              Organizer Dashboard
            </NextLink>
            <NextLink
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg border border-silver/60 text-center font-medium text-xs text-slate hover:text-midnight-ink"
            >
              Admin Moderation
            </NextLink>
            <NextLink
              href="/create"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-midnight-ink text-pure-canvas text-center font-bold text-xs rounded-lg hover:opacity-85"
            >
              + Host an Event
            </NextLink>
          </div>
        </div>
      )}
    </header>
  )
}
