import React from 'react'
import { Metadata } from 'next'
import { HelpCircle, ChevronDown } from 'lucide-react'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'
import { StoreMobileNav } from '@/components/store/StoreMobileNav'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) | CrateMeet Store',
  description: 'Common questions about Hot Wheels castings, sealed sports cards, shipping, and authenticity.',
}

export default function FaqPage() {
  const faqs = [
    {
      q: 'Are your Hot Wheels cars genuine Mattel castings?',
      a: 'Yes, 100%. All castings are factory Mattel die-cast vehicles with BIS toy safety certification (IS 9873). We stock factory unpunched international cards, Super $THs with Real Riders rubber tires, and Red Line Club (RLC) exclusives in original clamshell boxes.',
    },
    {
      q: 'How do you protect cards from bent corners during shipping?',
      a: 'We pack every single carded car inside an acid-free 0.50mm crystal PET clamshell case, cushion the corners with high-density foam pads, and ship in 5-ply double-walled export cartons.',
    },
    {
      q: 'Are Panini and Topps boxes factory sealed?',
      a: 'Yes. Every hobby box, retail blaster, and mega box features intact manufacturer hologram shrink wrap. We do not sell loose packs from opened boxes.',
    },
    {
      q: 'How do limited grail drops work?',
      a: 'Limited drops launch at scheduled dates with a strict purchase limit (max 1 or 2 per collector). When an item is added to your cart during a drop, a 10-minute hold reservation timer protects your slot.',
    },
    {
      q: 'Which courier partner do you use in India?',
      a: 'We dispatch via BlueDart Air Priority Express for express metro deliveries (24-48 hours) and Delhivery Surface for ground shipments.',
    },
    {
      q: 'Can I pay via Cash on Delivery (COD)?',
      a: 'COD is available across India for orders up to ₹7,500. Orders above ₹7,500 require prepaid payment (UPI / Cards) to ensure insured armored courier handling.',
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans selection:bg-hw-orange selection:text-white">
      <StoreNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full pb-20 space-y-8">
        <div className="space-y-3 pb-6 border-b border-zinc-800">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 inline-flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-hw-orange" />
            <span>Help Center</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Everything you need to know about purchasing die-cast cars and trading card wax in India.
          </p>
        </div>

        <div className="space-y-4 text-xs">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span className="text-hw-orange font-mono">Q:</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-zinc-400 pl-4 leading-relaxed text-xs">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>

      <StoreFooter />
      <StoreMobileNav />
    </div>
  )
}
