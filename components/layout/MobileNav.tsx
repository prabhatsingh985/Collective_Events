'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, PlusCircle, MessageSquare, Layers } from 'lucide-react'

export function MobileNav() {
  const pathname = usePathname()

  const tabs = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Explore', href: '/events', icon: Compass },
    { label: 'Host', href: '/create', icon: PlusCircle, highlight: true },
    { label: 'Feed', href: '/community', icon: MessageSquare },
    { label: 'Vault', href: '/collection', icon: Layers },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname?.startsWith(href)
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-pure-canvas/95 backdrop-blur-md border-t border-silver py-1.5 px-3 select-none shadow-card">
      <div className="grid grid-cols-5 gap-1 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = isActive(tab.href)

          if (tab.highlight) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center justify-center py-0.5 text-midnight-ink"
              >
                <div className="w-9 h-9 rounded-full bg-midnight-ink text-pure-canvas flex items-center justify-center shadow-sm hover:bg-graphite transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold tracking-tight mt-0.5">
                  {tab.label}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                active ? 'text-midnight-ink font-bold' : 'text-slate hover:text-midnight-ink'
              }`}
            >
              <div className="relative p-1">
                <Icon className="w-5 h-5" />
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-warm-sand" />
                )}
              </div>
              <span className="text-[10px] font-semibold tracking-tight mt-0.5">
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
