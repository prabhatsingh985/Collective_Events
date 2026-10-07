import React from 'react'
import { Metadata } from 'next'
import { Mail, Phone, MapPin, MessageSquare, Clock } from 'lucide-react'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'

export const metadata: Metadata = {
  title: 'Contact & Collector Concierge | CollectorEvents Store',
  description: 'Reach our collector support team for order inquiries, drop waitlists, or packaging support.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-pure-canvas text-midnight-ink flex flex-col font-sans selection:bg-party-pink selection:text-midnight-ink">
      <StoreNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full pb-20 space-y-8">
        <div className="space-y-3 pb-6 border-b border-silver/50">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-fog border border-silver/60 text-midnight-ink inline-flex items-center gap-1.5 font-bold">
            <MessageSquare className="w-3.5 h-3.5 text-midnight-ink" />
            <span>Support & Concierge</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-midnight-ink tracking-tight font-display">
            Contact Collector Support
          </h1>
          <p className="text-xs sm:text-sm text-slate">
            Have questions about an upcoming grail drop, packaging condition, or tracking a BlueDart consignment? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-6 rounded-3xl bg-pure-canvas border border-silver/60 space-y-3 shadow-sm">
            <Mail className="w-6 h-6 text-orange-600" />
            <h3 className="font-bold text-sm text-midnight-ink font-display">Email Concierge</h3>
            <p className="text-slate">support@collectorevents.com</p>
            <span className="text-[11px] text-slate font-mono block">Typical reply: Under 2 hours</span>
          </div>

          <div className="p-6 rounded-3xl bg-pure-canvas border border-silver/60 space-y-3 shadow-sm">
            <Phone className="w-6 h-6 text-emerald-600" />
            <h3 className="font-bold text-sm text-midnight-ink font-display">WhatsApp & Helpline</h3>
            <p className="text-slate">+91 98201 55902</p>
            <span className="text-[11px] text-slate font-mono block">Mon - Sat: 10:00 AM - 8:00 PM IST</span>
          </div>

          <div className="p-6 rounded-3xl bg-pure-canvas border border-silver/60 space-y-3 shadow-sm">
            <MapPin className="w-6 h-6 text-blue-600" />
            <h3 className="font-bold text-sm text-midnight-ink font-display">Central Vault & Hub</h3>
            <p className="text-slate">Carter Road, Bandra West, Mumbai 400050</p>
            <span className="text-[11px] text-slate font-mono block">Inspection & Dispatches</span>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  )
}
