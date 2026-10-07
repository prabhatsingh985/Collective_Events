import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getDropBySlug, getDropItems } from '@/lib/api/drops'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'
import { ProductCard } from '@/components/store/ProductCard'
import { CountdownTimer } from '@/components/store/CountdownTimer'
import { DropWaitlistButton } from '@/components/store/DropWaitlistButton'
import { ArrowLeft, Clock, Users, ShieldCheck, Flame, Zap } from 'lucide-react'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const drop = await getDropBySlug(params.slug)
  if (!drop) {
    return {
      title: 'Drop Not Found | CollectorEvents',
    }
  }

  return {
    title: `${drop.title} | Official Vault Drop Allocation | CollectorEvents`,
    description: drop.description,
    openGraph: {
      title: drop.title,
      description: drop.description,
      images: [drop.bannerImage],
    },
  }
}

export default async function DropDetailPage({ params }: PageProps) {
  const drop = await getDropBySlug(params.slug)

  if (!drop) {
    notFound()
  }

  const items = await getDropItems(drop)

  return (
    <div className="min-h-screen bg-pure-canvas text-midnight-ink flex flex-col font-sans selection:bg-party-pink selection:text-midnight-ink">
      <StoreNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-20 space-y-10">
        <Link
          href="/shop/drops"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate hover:text-midnight-ink transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Drops Calendar</span>
        </Link>

        {/* Drop Hero Card */}
        <div className="rounded-3xl overflow-hidden bg-pure-canvas border border-silver/70 shadow-sm">
          <div className="relative aspect-[21/9] w-full bg-fog/20 overflow-hidden">
            <Image
              src={drop.bannerImage}
              alt={drop.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                      drop.status === 'live'
                        ? 'bg-red-600 text-white shadow-lg animate-pulse'
                        : 'bg-party-pink text-midnight-ink shadow-md font-bold'
                    }`}
                  >
                    {drop.status === 'live' ? 'DROP LIVE' : 'UPCOMING DROP'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-black/70 text-white border border-white/20">
                    Max Limit: {drop.maxPerCustomer} Per Collector
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {drop.title}
                </h1>
                <p className="text-xs sm:text-sm text-zinc-200 mt-1 max-w-2xl">{drop.tagline}</p>
              </div>

              <div className="shrink-0 bg-white/95 p-4 rounded-2xl border border-silver/60 shadow-lg text-midnight-ink">
                <CountdownTimer
                  targetDate={drop.status === 'live' ? drop.endsAt : drop.startsAt}
                  label={drop.status === 'live' ? 'Drop Closes In:' : 'Launches In:'}
                />
              </div>
            </div>
          </div>

          {/* Allocation & Waitlist Action Bar */}
          <div className="p-6 sm:p-8 bg-pure-canvas border-t border-silver/40 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6 w-full sm:w-auto">
              {/* Stock Bar */}
              <div className="flex-1 sm:w-60 space-y-1 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-slate font-medium">Vault Allocation:</span>
                  <span className="font-bold text-orange-600">
                    {drop.remainingStock} of {drop.totalStock} left
                  </span>
                </div>
                <div className="w-full bg-fog/30 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-orange-600 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.round((drop.remainingStock / drop.totalStock) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2 text-xs text-slate font-mono">
                <Users className="w-4 h-4 text-midnight-blue" />
                <span>{drop.waitlistCount} Joined Waitlist</span>
              </div>
            </div>

            {/* Waitlist Button */}
            <DropWaitlistButton drop={drop} />
          </div>
        </div>

        {/* Drop Details & Cart Reservation Rule */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-5 rounded-2xl bg-pure-canvas border border-silver/60 space-y-2 shadow-sm">
            <span className="font-extrabold text-orange-600 uppercase tracking-wider block">
              1. Strict Quantity Limitation
            </span>
            <p className="text-slate leading-relaxed">
              To guarantee fairness, this drop enforces a strict limit of{' '}
              <strong className="text-midnight-ink font-bold">{drop.maxPerCustomer} unit(s)</strong> per shipping address and mobile number.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-pure-canvas border border-silver/60 space-y-2 shadow-sm">
            <span className="font-extrabold text-amber-800 uppercase tracking-wider block">
              2. 10-Minute Cart Hold
            </span>
            <p className="text-slate leading-relaxed">
              When added to your cart, items are reserved for exactly 10 minutes. If checkout is not authorized in time, the stock returns to the public pool.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-pure-canvas border border-silver/60 space-y-2 shadow-sm">
            <span className="font-extrabold text-emerald-700 uppercase tracking-wider block">
              3. Guaranteed Armored Packaging
            </span>
            <p className="text-slate leading-relaxed">
              All drop items are pre-fitted with crystal PET clamshells and corner edge guards prior to BlueDart air cargo dispatch.
            </p>
          </div>
        </div>

        {/* Drop Items Shelves */}
        <div className="space-y-6">
          <div className="pb-3 border-b border-silver/40">
            <h2 className="text-xl font-extrabold text-midnight-ink tracking-tight font-display">
              Allocated Drop Items ({items.length})
            </h2>
            <p className="text-xs text-slate mt-1">
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
    </div>
  )
}
