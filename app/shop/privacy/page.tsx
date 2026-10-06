import React from 'react'
import { Metadata } from 'next'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'
import { StoreMobileNav } from '@/components/store/StoreMobileNav'

export const metadata: Metadata = {
  title: 'Privacy Policy | CrateMeet Store',
  description: 'How we protect your collector personal information and shipping details.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans selection:bg-hw-orange selection:text-white">
      <StoreNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full pb-20 space-y-6 text-xs text-zinc-300 leading-relaxed">
        <h1 className="text-3xl font-black text-white tracking-tight pb-4 border-b border-zinc-800">
          Privacy Policy
        </h1>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
            <h2 className="text-sm font-bold text-white">1. Data Collection & Shipping Information</h2>
            <p className="text-zinc-400">
              We collect your full name, mobile number, delivery address, and pincode exclusively for shipping fulfillment via BlueDart Air and Delhivery. We never sell, rent, or trade your personal collector details with third parties.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
            <h2 className="text-sm font-bold text-white">2. Local Storage Persistence</h2>
            <p className="text-zinc-400">
              Your cart items, saved wishlist, and recent search history are stored directly within your browser's localStorage for maximum speed and privacy.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
            <h2 className="text-sm font-bold text-white">3. Payment Security</h2>
            <p className="text-zinc-400">
              Payment credentials (UPI IDs, card numbers) are processed through 256-bit SSL encrypted payment gateway interfaces. CrateMeet does not store raw credit card numbers or CVV codes.
            </p>
          </div>
        </div>
      </main>

      <StoreFooter />
      <StoreMobileNav />
    </div>
  )
}
