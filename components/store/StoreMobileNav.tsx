'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Flame, Sparkles, Heart, ShoppingBag, Home, User } from 'lucide-react'
import { useStore } from '@/lib/store/useStore'

export function StoreMobileNav() {
  const pathname = usePathname()
  const { cart, wishlist, setCartOpen } = useStore()

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)
  const wishlistCount = wishlist.length

  const items = [
    { label: 'Store', href: '/shop', icon: Home },
    { label: 'Hot Wheels', href: '/shop/hot-wheels', icon: Flame, color: 'text-orange-600' },
    { label: 'Cards', href: '/shop/cards', icon: Sparkles, color: 'text-emerald-600' },
    { label: 'Wishlist', href: '/shop/account?tab=wishlist', icon: Heart, badge: wishlistCount },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-pure-canvas/95 backdrop-blur-md border-t border-silver/60 text-midnight-ink select-none py-2 px-3 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 relative px-2 py-1 transition-colors ${
                isActive ? 'text-midnight-ink font-bold' : 'text-slate hover:text-midnight-ink'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${item.color || ''}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full bg-red-600 text-pure-canvas text-[9px] font-black min-w-[14px] text-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          )
        })}

        {/* Cart Trigger */}
        <button
          onClick={() => setCartOpen(true)}
          className="flex flex-col items-center gap-1 relative px-2 py-1 text-slate hover:text-midnight-ink transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-midnight-ink" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full bg-orange-600 text-pure-canvas text-[9px] font-black min-w-[14px] text-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Cart</span>
        </button>

        {/* Account Link */}
        <Link
          href="/shop/account"
          className={`flex flex-col items-center gap-1 relative px-2 py-1 transition-colors ${
            pathname.startsWith('/shop/account') ? 'text-midnight-ink font-bold' : 'text-slate hover:text-midnight-ink'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Account</span>
        </Link>
      </div>
    </nav>
  )
}
