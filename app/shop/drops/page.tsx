import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Zap, Clock, Users, ArrowRight, ShieldCheck, Flame, Sparkles } from 'lucide-react'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'
import { CountdownTimer } from '@/components/store/CountdownTimer'
import { getDrops } from '@/lib/api/drops'
import { Drop } from '@/types/store'

export const metadata: Metadata = {
  title: 'Collector Drops & Pre-Orders | Super $TH & Prizm Hobby Wax | CrateMeet',
  description:
    'Join scheduled grail drops for rare Hot Wheels Super Treasure Hunts and Panini Prizm hobby boxes. Strict customer allocations with live waitlist.',
}

export default async function DropsPage() {
  const drops = await getDrops()

  const liveDrops = drops.filter((d) => d.status === 'live')
  const upcomingDrops = drops.filter((d) => d.status === 'upcoming')
  const pastDrops = drops.filter((d) => d.status === 'ended')

  return (
    <div className="min-h-screen bg-pure-canvas text-midnight-ink flex flex-col font-sans selection:bg-party-pink selection:text-midnight-ink">
      <StoreNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-20 lg:pb-12 space-y-12">
        {/* Header Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-fog/30 via-party-pink/20 to-sky-periwinkle/20 border border-silver/70 p-8 sm:p-12 shadow-sm">
          <div className="max-w-2xl">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-midnight-ink text-pure-canvas inline-flex items-center gap-1.5 shadow mb-3">
              <Zap className="w-3.5 h-3.5 text-party-pink fill-party-pink" />
              <span>Grail Drops & Allocations</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-midnight-ink tracking-tight font-display">
              Exclusive Limited Collector Drops
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-slate leading-relaxed">
              To keep rare castings and hobby wax away from bulk bots, all grails drop in scheduled allocations with a strict purchase limit (max 1 or 2 per customer) and a 10-minute cart reservation hold.
            </p>
          </div>
        </div>

        {/* 1. LIVE DROPS */}
        {liveDrops.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-silver/40">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-midnight-ink tracking-tight">
                Live Drops Right Now
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {liveDrops.map((drop) => (
                <div
                  key={drop.id}
                  className="rounded-3xl bg-pure-canvas border border-silver/70 overflow-hidden shadow-sm hover:shadow-card transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-[16/9] w-full bg-fog/20 overflow-hidden">
                    <Image
                      src={drop.bannerImage}
                      alt={drop.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow animate-pulse">
                        LIVE NOW
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/80 text-white backdrop-blur-sm">
                        Max {drop.maxPerCustomer} / Customer
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-extrabold text-midnight-ink group-hover:underline transition-colors">
                        {drop.title}
                      </h3>
                      <p className="text-xs text-slate mt-1.5 leading-relaxed">
                        {drop.description}
                      </p>
                    </div>

                    {/* Stock Bar */}
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate font-medium">Vault Allocation Stock:</span>
                        <span className="font-bold text-orange-600">
                          {drop.remainingStock} of {drop.totalStock} left
                        </span>
                      </div>
                      <div className="w-full bg-fog/30 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-orange-600 h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.round((drop.remainingStock / drop.totalStock) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Countdown & Action */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-silver/40">
                      <CountdownTimer targetDate={drop.endsAt} compact label="Closes In:" />

                      <Link
                        href={`/shop/drops/${drop.slug}`}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-[8px] bg-midnight-ink hover:opacity-90 text-pure-canvas font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98"
                      >
                        <span>Enter Drop Vault</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2. UPCOMING DROPS */}
        {upcomingDrops.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-silver/40">
              <Clock className="w-5 h-5 text-midnight-ink" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-midnight-ink tracking-tight">
                Upcoming Drops Calendar
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingDrops.map((drop) => (
                <div
                  key={drop.id}
                  className="rounded-3xl bg-pure-canvas border border-silver/60 overflow-hidden shadow-sm hover:shadow-card transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-[16/9] w-full bg-fog/20 overflow-hidden">
                    <Image
                      src={drop.bannerImage}
                      alt={drop.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/80 text-white shadow">
                        UPCOMING
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/90 text-midnight-ink shadow-sm">
                        Total {drop.totalStock} Allocated
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-extrabold text-midnight-ink group-hover:underline transition-colors">
                        {drop.title}
                      </h3>
                      <p className="text-xs text-slate mt-1.5 leading-relaxed">
                        {drop.description}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-black/[0.02] border border-silver/40 text-xs flex items-center justify-between">
                      <span className="text-slate">Drop Time:</span>
                      <span className="font-mono font-bold text-midnight-ink">
                        {new Date(drop.startsAt).toLocaleString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-silver/40">
                      <CountdownTimer targetDate={drop.startsAt} compact label="Drops In:" />

                      <Link
                        href={`/shop/drops/${drop.slug}`}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-[8px] bg-black/[0.05] hover:bg-black/[0.08] border border-silver text-midnight-ink font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                      >
                        <span>Join Waitlist</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <StoreFooter />
    </div>
  )
}
