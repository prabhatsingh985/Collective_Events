import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles, Flame, ShieldCheck, Heart, ArrowRight } from 'lucide-react'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'
import { StoreMobileNav } from '@/components/store/StoreMobileNav'

export const metadata: Metadata = {
  title: 'About CrateMeet Store | India’s Die-Cast & Sports Card Marketplace',
  description: 'Built by collectors for collectors. Bridging Indian die-cast and sports card culture.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans selection:bg-hw-orange selection:text-white">
      <StoreNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full pb-20 space-y-8">
        <div className="space-y-3 pb-6 border-b border-zinc-800">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-hw-yellow" />
            <span>Our Story</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Built by Collectors. For the Culture.
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            From car meetups in Mumbai to packed box-break tables in Bengaluru, CrateMeet was born out of a simple frustration: it was too hard for Indian collectors to get pristine die-cast grails and sealed sports card wax without paying extortionate customs or receiving creased blister cards.
          </p>
        </div>

        <div className="space-y-6 text-xs text-zinc-300 leading-relaxed">
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-hw-orange" />
              <span>Die-Cast Toy Car Culture</span>
            </h2>
            <p className="text-zinc-400">
              We treat 1:64 die-cast cars not as disposable toys, but as miniature works of automotive engineering. Spectraflame paint, Red Line Club serialization, and Real Riders rubber treads represent an enduring passion. Every casting we curate is preserved in crystal clamshell armor.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Sports Trading Card Vault</span>
            </h2>
            <p className="text-zinc-400">
              The thrill of pulling an autographed rookie or ripping a Panini Prizm hobby box should be accessible to Indian sports enthusiasts. We source directly through verified international channels with unbroken manufacturer seals.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <span>Physical Events & Swap Meets</span>
            </h2>
            <p className="text-zinc-400">
              The store operates alongside the CrateMeet events platform, where collectors gather across India to swap, trade, and showcase their collections. Check out our physical community meetups anytime!
            </p>
            <div className="pt-2">
              <Link
                href="/events"
                className="inline-flex items-center gap-1.5 font-bold text-hw-orange hover:underline text-xs"
              >
                <span>Explore Upcoming Physical Collector Meets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <StoreFooter />
      <StoreMobileNav />
    </div>
  )
}
