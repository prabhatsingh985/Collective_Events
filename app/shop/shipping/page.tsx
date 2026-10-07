import React from 'react'
import { Metadata } from 'next'
import { Truck, Box, ShieldCheck, Clock, MapPin, CheckCircle2 } from 'lucide-react'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'

export const metadata: Metadata = {
  title: 'Shipping & Armored Packaging Guarantee | CollectorEvents Store',
  description: 'How we pack and deliver Hot Wheels and sports card wax safely across India.',
}

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-pure-canvas text-midnight-ink flex flex-col font-sans selection:bg-party-pink selection:text-midnight-ink">
      <StoreNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full pb-20 space-y-8">
        <div className="space-y-3 pb-6 border-b border-silver/50">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200 inline-flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            <span>Armored Logistics</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-midnight-ink tracking-tight font-display">
            Shipping & Armored Packaging Promise
          </h1>
          <p className="text-xs sm:text-sm text-slate leading-relaxed">
            Standard e-commerce packaging ruins blister cards. Here is how we guarantee factory-mint condition on every delivery.
          </p>
        </div>

        <div className="space-y-6 text-xs text-slate leading-relaxed">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-pure-canvas border border-silver/60 space-y-2 shadow-sm">
              <span className="font-bold text-midnight-ink text-sm block font-display">1. Free Clamshell Cases</span>
              <p className="text-slate">
                All premium Hot Wheels castings ($TH, RLC, Car Culture) ship inside heavy 0.50mm PET crystal clamshell protectors at zero extra charge.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-pure-canvas border border-silver/60 space-y-2 shadow-sm">
              <span className="font-bold text-midnight-ink text-sm block font-display">2. Rigid Foam Corners</span>
              <p className="text-slate">
                Die-cast blister corners are isolated using high-density shock-absorbing foam corner blocks to eliminate transport crush.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-pure-canvas border border-silver/60 space-y-2 shadow-sm">
              <span className="font-bold text-midnight-ink text-sm block font-display">3. 5-Ply Export Cartons</span>
              <p className="text-slate">
                We never use flimsy envelopes or thin mailer bags. Everything ships in double-wall corrugated heavy boxes with security seal tape.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-pure-canvas border border-silver/60 space-y-3 shadow-sm">
            <h2 className="text-base font-extrabold text-midnight-ink font-display">Carrier Speeds & Timelines</h2>
            <div className="divide-y divide-silver/40 pt-2">
              <div className="py-2.5 flex justify-between">
                <span className="font-bold text-midnight-ink">Mumbai Metropolitan Region (MMR)</span>
                <span className="font-mono text-emerald-700 font-semibold">24 Hours (Next Day Air)</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="font-bold text-midnight-ink">Tier 1 Metro (Delhi, Bengaluru, Hyderabad, Chennai, Kolkata)</span>
                <span className="font-mono text-emerald-700 font-semibold">24-48 Hours (BlueDart Air)</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="font-bold text-midnight-ink">Rest of India (19,000+ PIN codes)</span>
                <span className="font-mono text-slate">2-4 Business Days</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  )
}
