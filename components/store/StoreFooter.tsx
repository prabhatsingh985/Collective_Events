'use client'

import React from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Package,
  Layers,
  Sparkles,
  Award,
  CheckCircle2,
} from 'lucide-react'

export function StoreFooter() {
  const trustPillars = [
    {
      icon: ShieldCheck,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      title: '100% Authenticity Verified',
      desc: 'Tamper-evident Panini & Topps hologram seals, Mattel factory unpunched cards, and certified PSA / BGS graded slabs.',
    },
    {
      icon: Layers,
      iconColor: 'text-amber-600 bg-amber-50 border-amber-200',
      title: 'Armored Collector Packaging',
      desc: 'Heavy clamshell blister protectors, rigid edge-guards, bubble armor, and double-walled cartons ensure zero transit damage.',
    },
    {
      icon: Truck,
      iconColor: 'text-blue-600 bg-blue-50 border-blue-200',
      title: 'BlueDart Express Air Delivery',
      desc: 'Same-day dispatches with end-to-end Air AWB tracking across Mumbai, Delhi, Bengaluru and all serviceable pin codes.',
    },
    {
      icon: RotateCcw,
      iconColor: 'text-purple-600 bg-purple-50 border-purple-200',
      title: '7-Day Easy Collector Returns',
      desc: 'Hassle-free reverse pickups for damaged blister bubbles, bent cards, or mismatched cert numbers with instant refunds.',
    },
  ]

  const quickLinks = [
    { label: 'Authenticity Guarantee', href: '/shop/authenticity' },
    { label: 'Armored Shipping Policy', href: '/shop/shipping' },
    { label: 'Returns & Replacement', href: '/shop/returns' },
    { label: 'Store FAQ', href: '/shop/faq' },
    { label: 'Contact Vault Support', href: '/shop/contact' },
    { label: 'Terms & Conditions', href: '/shop/terms' },
    { label: 'Privacy Policy', href: '/shop/privacy' },
  ]

  return (
    <section className="bg-pure-canvas border-t border-silver/40 py-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 4 Trust Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trustPillars.map((p, idx) => {
            const Icon = p.icon
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-pure-canvas border border-silver/60 shadow-[rgba(0,0,0,0.04)_0px_2px_8px_0px] flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${p.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-xs text-midnight-ink leading-tight">
                    {p.title}
                  </h4>
                </div>
                <p className="text-xs text-slate leading-relaxed">
                  {p.desc}
                </p>
              </div>
            )
          })}
        </div>

        {/* Store Trust & Policy Links Pill Strip */}
        <div className="pt-4 border-t border-silver/30 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate">
          <span className="text-midnight-ink font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-party-pink" />
            <span>Collector Store Trust:</span>
          </span>
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-midnight-ink hover:underline transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
