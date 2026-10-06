import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Zap, Clock, Users, ArrowRight, ShieldCheck, Flame, Sparkles } from 'lucide-react'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'
import { StoreMobileNav } from '@/components/store/StoreMobileNav'
import { StoreSearchModal } from '@/components/store/StoreSearchModal'
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
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans selection:bg-hw-orange selection:text-white">
      <StoreNavbar />
      <StoreSearchModal />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-20 lg:pb-12 space-y-12">
        {/* Header Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-red-950 via-zinc-900 to-purple-950 border border-zinc-800 p-8 sm:p-12 shadow-2xl">
          <div className="max-w-2xl">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-hw-flame text-white inline-flex items-center gap-1.5 shadow mb-3">
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Grail Drops & Allocations</span>
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Exclusive Limited Collector Drops
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
              To keep rare castings and hobby wax away from bulk bots, all grails drop in scheduled allocations with a strict purchase limit (max 1 or 2 per customer) and a 10-minute cart reservation hold.
            </p>
          </div>
        </div>

        {/* 1. LIVE DROPS */}
        {liveDrops.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Live Drops Right Now
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {liveDrops.map((drop) => (
                <div
                  key={drop.id}
                  className="rounded-2xl bg-zinc-900 border-2 border-orange-500/60 overflow-hidden shadow-2xl flex flex-col justify-between group"
                >
                  <div className="relative aspect-[16/9] w-full bg-black overflow-hidden">
                    <Image
                      src={drop.bannerImage}
                      alt={drop.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-lg animate-pulse">
                        LIVE NOW
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/80 text-white backdrop-blur-sm">
                        Max {drop.maxPerCustomer} / Customer
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-black text-white group-hover:text-hw-orange transition-colors">
                        {drop.title}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                        {drop.description}
                      </p>
                    </div>

                    {/* Stock Bar */}
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-mono">
                        <span className="text-zinc-400">Vault Allocation Stock:</span>
                        <span className="font-bold text-hw-yellow">
                          {drop.remainingStock} of {drop.totalStock} left
                        </span>
                      </div>
                      <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-hw-orange h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.round((drop.remainingStock / drop.totalStock) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Countdown & Action */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800">
                      <CountdownTimer targetDate={drop.endsAt} compact label="Closes In:" />

                      <Link
                        href={`/shop/drops/${drop.slug}`}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-hw-orange hover:bg-orange-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20"
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
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
              <Clock className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Upcoming Drops Calendar
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingDrops.map((drop) => (
                <div
                  key={drop.id}
                  className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl flex flex-col justify-between group"
                >
                  <div className="relative aspect-[16/9] w-full bg-black overflow-hidden">
                    <Image
                      src={drop.bannerImage}
                      alt={drop.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-black shadow-lg">
                        UPCOMING
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/80 text-white">
                        Limit {drop.maxPerCustomer}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors">
                        {drop.title}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                        {drop.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                      <Users className="w-4 h-4 text-purple-400" />
                      <span>{drop.waitlistCount} collectors on priority waitlist</span>
                    </div>

                    {/* Countdown & Action */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800">
                      <CountdownTimer targetDate={drop.startsAt} label="Drop Starts In:" />

                      <Link
                        href={`/shop/drops/${drop.slug}`}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
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

        {/* 3. ARCHIVED DROPS */}
        {pastDrops.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-zinc-850">
            <h2 className="text-lg font-black text-zinc-400 uppercase tracking-wider">
              Past Archived Allocations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pastDrops.map((drop) => (
                <div
                  key={drop.id}
                  className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60 opacity-60"
                >
                  <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">
                    ENDED • ALLOCATED
                  </span>
                  <h4 className="font-bold text-sm text-zinc-300 mt-1 truncate">{drop.title}</h4>
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{drop.tagline}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <StoreFooter />
      <StoreMobileNav />
    </div>
  )
}
