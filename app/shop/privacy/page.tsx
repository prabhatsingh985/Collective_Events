import React from 'react'
import { Metadata } from 'next'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'

export const metadata: Metadata = {
  title: 'Privacy Policy | CollectorEvents Store',
  description: 'How we protect your collector personal information and shipping details.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-pure-canvas text-midnight-ink flex flex-col font-sans selection:bg-party-pink selection:text-midnight-ink">
      <StoreNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full pb-20 space-y-6 text-xs text-slate leading-relaxed">
        <h1 className="text-3xl font-black text-midnight-ink tracking-tight pb-4 border-b border-silver/50 font-display">
          Privacy Policy
        </h1>

        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-pure-canvas border border-silver/60 space-y-2 shadow-sm">
            <h2 className="text-sm font-bold text-midnight-ink font-display">1. Data Collection & Shipping Information</h2>
            <p className="text-slate">
              We collect your full name, mobile number, delivery address, and pincode exclusively for shipping fulfillment via BlueDart Air and Delhivery. We never sell, rent, or trade your personal collector details with third parties.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-pure-canvas border border-silver/60 space-y-2 shadow-sm">
            <h2 className="text-sm font-bold text-midnight-ink font-display">2. Local Storage Persistence</h2>
            <p className="text-slate">
              Your cart items, saved wishlist, and recent search history are stored directly within your browser's localStorage for maximum speed and privacy.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-pure-canvas border border-silver/60 space-y-2 shadow-sm">
            <h2 className="text-sm font-bold text-midnight-ink font-display">3. Payment Security</h2>
            <p className="text-slate">
              Payment credentials (UPI IDs, card numbers) are processed through 256-bit SSL encrypted payment gateway interfaces. CollectorEvents does not store raw credit card numbers or CVV codes.
            </p>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  )
}
