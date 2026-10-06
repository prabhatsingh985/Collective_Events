import React from 'react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Zap, Clock, Users, ArrowLeft, ShieldCheck, Flame, Sparkles } from 'lucide-react'

import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'
import { StoreMobileNav } from '@/components/store/StoreMobileNav'
import { StoreSearchModal } from '@/components/store/StoreSearchModal'
import { CountdownTimer } from '@/components/store/CountdownTimer'
import { ProductCard } from '@/components/store/ProductCard'
import { getDropBySlug, getDropItems } from '@/lib/api/drops'
import { DropWaitlistButton } from './DropWaitlistButton'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const drop = await getDropBySlug(params.slug)
  if (!drop) return { title: 'Drop Not Found | CrateMeet' }

  return {
    title: `${drop.title} | Grail Drop | CrateMeet`,
    description: drop.description,
  }
}

export default async function DropDetailPage({ params }: PageProps) {
  const drop = await getDropBySlug(params.slug)
  if (!drop) {
    notFound()
  }

  const items = await getDropItems(drop)

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans selection:bg-hw-orange selection:text-white">
      <StoreNavbar />
      <StoreSearchModal />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-20 space-y-10">
        <Link
          href="/shop/drops"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Drops Calendar</span>
        </Link>

        {/* Drop Hero Card */}
        <div className="rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl">
          <div className="relative aspect-[21/9] w-full bg-black overflow-hidden">
            <Image
              src={drop.bannerImage}
              alt={drop.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      drop.status === 'live'
                        ? 'bg-red-600 text-white shadow-lg animate-pulse'
                        : 'bg-amber-500 text-black shadow-lg'
                    }`}
                  >
                    {drop.status === 'live' ? 'DROP LIVE' : 'UPCOMING DROP'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-black/80 text-white border border-white/10">
                    Max Limit: {drop.maxPerCustomer} Per Collector
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {drop.title}
                </h1>
                <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-2xl">{drop.tagline}</p>
              </div>

              <div className="shrink-0 bg-zinc-950/90 p-4 rounded-2xl border border-zinc-800 shadow-xl backdrop-blur-md">
                <CountdownTimer
                  targetDate={drop.status === 'live' ? drop.endsAt : drop.startsAt}
                  label={drop.status === 'live' ? 'Drop Closes In:' : 'Launches In:'}
                />
              </div>
            </div>
          </div>

          {/* Allocation & Waitlist Action Bar */}
          <div className="p-6 sm:p-8 bg-zinc-950 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6 w-full sm:w-auto">
              {/* Stock Bar */}
              <div className="flex-1 sm:w-60 space-y-1 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-zinc-400">Vault Allocation:</span>
                  <span className="font-bold text-hw-yellow">
                    {drop.remainingStock} of {drop.totalStock} left
                  </span>
                </div>
                <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-hw-orange h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.round((drop.remainingStock / drop.totalStock) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400 font-mono">
                <Users className="w-4 h-4 text-purple-400" />
                <span>{drop.waitlistCount} Joined Waitlist</span>
              </div>
            </div>

            {/* Waitlist Button */}
            <DropWaitlistButton drop={drop} />
          </div>
        </div>

        {/* Drop Details & Cart Reservation Rule */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
            <span className="font-bold text-hw-orange uppercase tracking-wider block">
              1. Strict Quantity Limitation
            </span>
            <p className="text-zinc-400 leading-relaxed">
              To guarantee fairness, this drop enforces a strict limit of{' '}
              <strong className="text-white">{drop.maxPerCustomer} unit(s)</strong> per shipping address and mobile number.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
            <span className="font-bold text-amber-400 uppercase tracking-wider block">
              2. 10-Minute Cart Hold
            </span>
            <p className="text-zinc-400 leading-relaxed">
              When added to your cart, items are reserved for exactly 10 minutes. If checkout is not authorized in time, the stock returns to the public pool.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
            <span className="font-bold text-emerald-400 uppercase tracking-wider block">
              3. Guaranteed Armored Packaging
            </span>
            <p className="text-zinc-400 leading-relaxed">
              All drop items are pre-fitted with crystal PET clamshells and corner edge guards prior to BlueDart air cargo dispatch.
            </p>
          </div>
        </div>

        {/* Drop Items Shelves */}
        <div className="space-y-6">
          <div className="pb-3 border-b border-zinc-800">
            <h2 className="text-xl font-black text-white tracking-tight">
              Allocated Drop Items ({items.length})
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Items included exclusively within this scheduled allocation.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {items.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </main>

      <StoreFooter />
      <StoreMobileNav />
    </div>
  )
}
