import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles, Flame, ShieldCheck, Heart, ArrowRight } from 'lucide-react'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'

export const metadata: Metadata = {
  title: 'About CrateMeet Store | India’s Die-Cast & Sports Card Marketplace',
  description: 'Built by collectors for collectors. Bridging Indian die-cast and sports card culture.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-pure-canvas text-midnight-ink flex flex-col font-sans selection:bg-party-pink selection:text-midnight-ink">
      <StoreNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full pb-20 space-y-8">
        <div className="space-y-3 pb-6 border-b border-silver/50">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-party-pink/30 text-midnight-ink border border-party-pink/60 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-party-pink" />
            <span>Our Story</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-midnight-ink tracking-tight font-display">
            Built by Collectors. For the Culture.
          </h1>
          <p className="text-xs sm:text-sm text-slate leading-relaxed">
            From car meetups in Mumbai to packed box-break tables in Bengaluru, CrateMeet was born out of a simple frustration: it was too hard for Indian collectors to get pristine die-cast grails and sealed sports card wax without paying extortionate customs or receiving creased blister cards.
          </p>
        </div>

        <div className="space-y-6 text-xs text-slate leading-relaxed">
          <div className="p-6 rounded-3xl bg-pure-canvas border border-silver/60 space-y-3 shadow-sm">
            <h2 className="text-base font-extrabold text-midnight-ink flex items-center gap-2 font-display">
              <Flame className="w-5 h-5 text-orange-600" />
              <span>Die-Cast Toy Car Culture</span>
            </h2>
            <p className="text-slate">
              We treat 1:64 die-cast cars not as disposable toys, but as miniature works of automotive engineering. Spectraflame paint, Red Line Club serialization, and Real Riders rubber treads represent an enduring passion. Every casting we curate is preserved in crystal clamshell armor.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-pure-canvas border border-silver/60 space-y-3 shadow-sm">
            <h2 className="text-base font-extrabold text-midnight-ink flex items-center gap-2 font-display">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>Sports Trading Card Vault</span>
            </h2>
            <p className="text-slate">
              The thrill of pulling an autographed rookie or ripping a Panini Prizm hobby box should be accessible to Indian sports enthusiasts. We source directly through verified international channels with unbroken manufacturer seals.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-pure-canvas border border-silver/60 space-y-3 shadow-sm">
            <h2 className="text-base font-extrabold text-midnight-ink flex items-center gap-2 font-display">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>Physical Events & Swap Meets</span>
            </h2>
            <p className="text-slate">
              The store operates alongside the CrateMeet events platform, where collectors gather across India to swap, trade, and showcase their collections. Check out our physical community meetups anytime!
            </p>
            <div className="pt-2">
              <Link
                href="/events"
                className="inline-flex items-center gap-1.5 font-bold text-midnight-ink hover:underline text-xs"
              >
                <span>Explore Upcoming Physical Collector Meets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  )
}
