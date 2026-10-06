import React from 'react'
import { Metadata } from 'next'
import { Mail, Phone, MapPin, MessageSquare, Clock } from 'lucide-react'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'
import { StoreMobileNav } from '@/components/store/StoreMobileNav'

export const metadata: Metadata = {
  title: 'Contact & Collector Concierge | CrateMeet Store',
  description: 'Reach our collector support team for order inquiries, drop waitlists, or packaging support.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans selection:bg-hw-orange selection:text-white">
      <StoreNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full pb-20 space-y-8">
        <div className="space-y-3 pb-6 border-b border-zinc-800">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 inline-flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-hw-orange" />
            <span>Support & Concierge</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Contact Collector Support
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Have questions about an upcoming grail drop, packaging condition, or tracking a BlueDart consignment? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <Mail className="w-6 h-6 text-hw-orange" />
            <h3 className="font-bold text-sm text-white">Email Concierge</h3>
            <p className="text-zinc-400">support@cratemeet.com</p>
            <span className="text-[11px] text-zinc-500 block">Typical reply time: Under 2 hours</span>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <Phone className="w-6 h-6 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">WhatsApp & Helpline</h3>
            <p className="text-zinc-400">+91 98201 55902</p>
            <span className="text-[11px] text-zinc-500 block">Mon - Sat: 10:00 AM - 8:00 PM IST</span>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <MapPin className="w-6 h-6 text-blue-400" />
            <h3 className="font-bold text-sm text-white">Central Vault & Hub</h3>
            <p className="text-zinc-400">Carter Road, Bandra West, Mumbai 400050</p>
            <span className="text-[11px] text-zinc-500 block">Inspection & Dispatches</span>
          </div>
        </div>
      </main>

      <StoreFooter />
      <StoreMobileNav />
    </div>
  )
}
