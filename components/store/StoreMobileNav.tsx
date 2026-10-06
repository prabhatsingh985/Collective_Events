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
    { label: 'Hot Wheels', href: '/shop/hot-wheels', icon: Flame, color: 'text-hw-orange' },
    { label: 'Cards', href: '/shop/cards', icon: Sparkles, color: 'text-emerald-500' },
    { label: 'Wishlist', href: '/shop/account?tab=wishlist', icon: Heart, badge: wishlistCount },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 text-white select-none py-2 px-3 shadow-2xl">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 relative px-2 py-1 transition-colors ${
                isActive ? 'text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${item.color || ''}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-black min-w-[14px] text-center">
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
          className="flex flex-col items-center gap-1 relative px-2 py-1 text-zinc-400 hover:text-white transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-hw-yellow" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full bg-hw-orange text-white text-[9px] font-black min-w-[14px] text-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Cart</span>
        </button>
      </div>
    </nav>
  )
}
