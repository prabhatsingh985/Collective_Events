'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Flame,
  Mail,
  CheckCircle2,
  Lock,
  Layers,
  Award,
} from 'lucide-react'

export function StoreFooter() {
  const [emailInput, setEmailInput] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput.trim()) return
    setSubscribed(true)
    setEmailInput('')
    setTimeout(() => setSubscribed(false), 5000)
  }

  return (
    <footer className="bg-zinc-950 text-white border-t border-zinc-800 select-none">
      {/* Trust Strip */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-100">100% Authenticity Verified</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Tamper-evident Panini/Topps shrink wrap and BIS-certified Mattel Hot Wheels castings.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-100">Armored Packaging</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Heavy clamshell blister protectors, rigid foam corners, and double-walled cartons.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-100">Express BlueDart Air</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Fast 24-48h dispatch across Mumbai, Delhi, Bengaluru, and 19,000+ Indian pincodes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-100">7-Day Collector Inspection</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Zero-hassle replacement or refund if any blister arrives creased or seal damaged.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Newsletter Column (Spans 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-hw-orange to-red-600 flex items-center justify-center font-black text-white text-sm shadow">
                ⚡
              </div>
              <span className="font-black text-lg tracking-tight text-white">
                CRATE<span className="text-hw-orange">STORE</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              India’s dedicated collector marketplace for authentic 1:64 die-cast toy cars (Mattel Hot Wheels, RLC, Super Treasure Hunts) and sports trading card wax (Panini Prizm, Topps Chrome, Beckett/PSA graded slabs).
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <h5 className="font-bold text-xs text-zinc-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-hw-orange" />
                <span>Get Drop Alerts 15 Mins Before Public Launch</span>
              </h5>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-3.5 py-2 text-xs rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-hw-orange"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-hw-orange hover:bg-orange-600 text-white font-bold text-xs transition-colors shrink-0"
                >
                  Notify Me
                </button>
              </form>
              {subscribed && (
                <p className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>You are on the VIP Collector Priority list!</span>
                </p>
              )}
            </div>
          </div>

          {/* Hot Wheels Column */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-hw-orange" />
              <span>Hot Wheels Castings</span>
            </h5>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/shop/hot-wheels?series=Super+Treasure+Hunt+($TH)" className="hover:text-white transition-colors">
                  Super Treasure Hunts ($TH)
                </Link>
              </li>
              <li>
                <Link href="/shop/hot-wheels?series=Red+Line+Club+(RLC)" className="hover:text-white transition-colors">
                  Red Line Club (RLC) Exclusives
                </Link>
              </li>
              <li>
                <Link href="/shop/hot-wheels?series=Car+Culture+Premium" className="hover:text-white transition-colors">
                  Car Culture Premium (Real Riders)
                </Link>
              </li>
              <li>
                <Link href="/shop/hot-wheels?series=Boulevard" className="hover:text-white transition-colors">
                  Boulevard Series
                </Link>
              </li>
              <li>
                <Link href="/shop/hot-wheels?series=Mainline" className="hover:text-white transition-colors">
                  Factory Fresh Mainlines
                </Link>
              </li>
              <li>
                <Link href="/shop/supplies" className="hover:text-white transition-colors">
                  PET Blister Clamshell Cases
                </Link>
              </li>
            </ul>
          </div>

          {/* Sports Cards Column */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Trading Cards</span>
            </h5>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/shop/sealed" className="hover:text-white transition-colors">
                  Factory Sealed Hobby & Blaster Boxes
                </Link>
              </li>
              <li>
                <Link href="/shop/cards?isRookie=true" className="hover:text-white transition-colors">
                  Rookie Shield Singles (RC)
                </Link>
              </li>
              <li>
                <Link href="/shop/cards?isAutograph=true" className="hover:text-white transition-colors">
                  Certified On-Card Autographs
                </Link>
              </li>
              <li>
                <Link href="/shop/graded" className="hover:text-white transition-colors">
                  PSA 10 Gem Mint & BGS Slabs
                </Link>
              </li>
              <li>
                <Link href="/shop/cards?parallel=Prizm" className="hover:text-white transition-colors">
                  Panini Prizm & Topps Chrome
                </Link>
              </li>
              <li>
                <Link href="/shop/supplies" className="hover:text-white transition-colors">
                  35pt Magnetic One-Touch Cases
                </Link>
              </li>
            </ul>
          </div>

          {/* Collector Services & Seller Portal */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-blue-400" />
              <span>Collector Services</span>
            </h5>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/shop/drops" className="hover:text-white transition-colors">
                  Upcoming Grail Drops
                </Link>
              </li>
              <li>
                <Link href="/shop/account" className="hover:text-white transition-colors">
                  Track My Order & AWB Status
                </Link>
              </li>
              <li>
                <Link href="/shop/account?tab=returns" className="hover:text-white transition-colors">
                  File Replacement / Return
                </Link>
              </li>
              <li>
                <Link href="/shop/authenticity" className="hover:text-white transition-colors">
                  Authenticity Verification Policy
                </Link>
              </li>
              <li>
                <Link href="/shop/shipping" className="hover:text-white transition-colors">
                  Packaging & Shipping Promise
                </Link>
              </li>
              <li>
                <Link href="/shop/admin" className="text-amber-400 font-bold hover:text-amber-300 transition-colors flex items-center gap-1">
                  <span>Seller / Admin Store Hub</span>
                  <span>⚡</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-12 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div>
            © {new Date().getFullYear()} CrateMeet Collector Store. All toy trademarks belong to Mattel, Panini & Topps respectively.
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <Link href="/shop/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/shop/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link href="/shop/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/events" className="hover:text-hw-orange transition-colors font-semibold">Events Platform</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
