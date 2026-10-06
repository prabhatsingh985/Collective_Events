import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { RotateCcw, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'
import { StoreMobileNav } from '@/components/store/StoreMobileNav'

export const metadata: Metadata = {
  title: 'Returns & 7-Day Collector Inspection Policy | CrateMeet Store',
  description: 'Zero hassle returns and replacements for collector blister cards and sealed boxes.',
}

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans selection:bg-hw-orange selection:text-white">
      <StoreNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full pb-20 space-y-8">
        <div className="space-y-3 pb-6 border-b border-zinc-800">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 inline-flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Inspection Guarantee</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            7-Day Collector Returns & Replacements
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            We understand card corners and blister clarity matter immensely. If an item arrives with transit blemishes, we arrange a reverse pickup with zero fuss.
          </p>
        </div>

        <div className="space-y-6 text-xs text-zinc-300 leading-relaxed">
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <h2 className="text-base font-extrabold text-white">Eligible Replacement Criteria</h2>
            <ul className="space-y-2 text-zinc-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Blister card creased or dented bubble incurred during courier transit.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Factory shrink wrap tear or damaged tamper seal on sealed card boxes.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Discrepancy in certification number on PSA or Beckett graded slabs.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <h2 className="text-base font-extrabold text-white">How to File a Return</h2>
            <p className="text-zinc-400">
              Navigate to <Link href="/shop/account?tab=orders" className="text-hw-orange underline font-bold">My Orders</Link>, select your delivered order, and click "Request Return / Replacement". Upload a quick photo of the corner issue and our Mumbai team will approve a BlueDart reverse pickup within 2 hours.
            </p>
          </div>
        </div>
      </main>

      <StoreFooter />
      <StoreMobileNav />
    </div>
  )
}
