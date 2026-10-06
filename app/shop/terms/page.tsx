import React from 'react'
import { Metadata } from 'next'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'
import { StoreMobileNav } from '@/components/store/StoreMobileNav'

export const metadata: Metadata = {
  title: 'Terms of Service | CrateMeet Store',
  description: 'Terms and conditions governing purchases, drops, allocations, and collector sales.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans selection:bg-hw-orange selection:text-white">
      <StoreNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full pb-20 space-y-6 text-xs text-zinc-300 leading-relaxed">
        <h1 className="text-3xl font-black text-white tracking-tight pb-4 border-b border-zinc-800">
          Terms of Service & Collector Sales
        </h1>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
            <h2 className="text-sm font-bold text-white">1. Scheduled Grail Drops & Purchase Limits</h2>
            <p className="text-zinc-400">
              To prevent bot scalping and ensure fair distribution among authentic hobbyists, specific high-demand drops (Super Treasure Hunts, RLC castings, sealed hobby wax) enforce strict purchase limits (typically 1 or 2 units per person/household). We reserve the right to cancel multiple orders placed using identical IP addresses, billing profiles, or shipping addresses.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
            <h2 className="text-sm font-bold text-white">2. Product Conditions & Factory Packaging</h2>
            <p className="text-zinc-400">
              All Hot Wheels castings are sold in Mint on Card (MOC) or explicitly stated card condition. Slight factory variations in cardboard die-cuts or blister bubble placement inherent to Mattel manufacturing are normal unless otherwise noted.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
            <h2 className="text-sm font-bold text-white">3. Payments & Taxes</h2>
            <p className="text-zinc-400">
              All prices shown on the store are in Indian Rupees (INR) and include applicable Goods and Services Tax (GST) at 18%. Cash on Delivery is disabled for orders exceeding ₹7,500 for transit security reasons.
            </p>
          </div>
        </div>
      </main>

      <StoreFooter />
      <StoreMobileNav />
    </div>
  )
}
