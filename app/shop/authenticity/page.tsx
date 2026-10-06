import React from 'react'
import { Metadata } from 'next'
import { ShieldCheck, CheckCircle2, Lock, Award, Eye, FileText } from 'lucide-react'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'

export const metadata: Metadata = {
  title: 'Authenticity Guarantee & Grading Policy | CrateMeet Store',
  description: 'Our verification promise for Hot Wheels die-cast castings and Panini/Topps sports cards.',
}

export default function AuthenticityPolicyPage() {
  return (
    <div className="min-h-screen bg-pure-canvas text-midnight-ink flex flex-col font-sans selection:bg-party-pink selection:text-midnight-ink">
      <StoreNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full pb-20 space-y-8">
        <div className="space-y-3 pb-6 border-b border-silver/50">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Collector Trust Assurance</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-midnight-ink tracking-tight font-display">
            Authenticity & Inspection Verification Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate leading-relaxed">
            Every die-cast casting, sealed wax box, and graded slab in our vault is physically inspected by veteran collectors before listing.
          </p>
        </div>

        <div className="space-y-6 text-xs text-slate leading-relaxed">
          <div className="p-6 rounded-3xl bg-pure-canvas border border-silver/60 space-y-3 shadow-sm">
            <h2 className="text-base font-extrabold text-midnight-ink flex items-center gap-2 font-display">
              <span className="text-orange-600 font-mono">1.</span>
              <span>Hot Wheels & Die-Cast Authenticity (BIS IS 9873)</span>
            </h2>
            <p className="text-slate">
              We exclusively stock genuine Mattel die-cast castings originating from official Mattel India distributors or licensed international direct shipments. All castings carry verifiable factory date-codes embossed on the die-cast metal base plate and comply with Bureau of Indian Standards (BIS) Toy Safety Standard IS 9873.
            </p>
            <ul className="space-y-1.5 pt-1 text-slate">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Super Treasure Hunt ($TH) verification: Spectraflame paint depth and Real Riders rubber treads verified.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Zero re-glued or re-sealed blister cards. Crystal bubbles inspected for hairline cracks.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-pure-canvas border border-silver/60 space-y-3 shadow-sm">
            <h2 className="text-base font-extrabold text-midnight-ink flex items-center gap-2 font-display">
              <span className="text-emerald-600 font-mono">2.</span>
              <span>Sports Trading Cards: Zero Reseals Promise</span>
            </h2>
            <p className="text-slate">
              We know the fear of bought-out resealed boxes in the card hobby. Every hobby box and retail blaster sold at CrateMeet comes with intact, unbroken manufacturer hologram shrink wrap from Panini America or Topps / Fanatics.
            </p>
            <ul className="space-y-1.5 pt-1 text-slate">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>No weighed packs or picked hobby cases.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Certified On-Card Autographs carry manufacturer holographic guarantee badges on reverse.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-pure-canvas border border-silver/60 space-y-3 shadow-sm">
            <h2 className="text-base font-extrabold text-midnight-ink flex items-center gap-2 font-display">
              <span className="text-amber-600 font-mono">3.</span>
              <span>PSA & Beckett (BGS) Graded Slabs</span>
            </h2>
            <p className="text-slate">
              Every graded slab sold carries a unique certification number that can be independently checked on the PSA or Beckett Certification Verification online registries. Slabs are inspected under UV light to ensure sonic welded plastic seals are undisturbed.
            </p>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  )
}
