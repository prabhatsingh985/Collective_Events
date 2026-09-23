'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Instagram, Twitter, Youtube, Check, Sparkles } from 'lucide-react'

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  return (
    <footer className="bg-pure-canvas border-t border-silver/50 pt-16 pb-24 md:pb-16 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-silver/40">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[8px] bg-midnight-ink text-pure-canvas flex items-center justify-center font-bold text-sm shadow-sm">
                ✨
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-midnight-ink">
                Crate<span className="text-slate">Meet</span>
              </span>
            </Link>

            <p className="text-sm text-slate max-w-sm leading-relaxed font-normal">
              Where Die-Cast Legends & Graded Grails Meet Their Next Keeper. The aesthetic event discovery and collector hub for Hot Wheels hunters, sports card hobbyists, and scale modders.
            </p>

            <div className="pt-2">
              <p className="text-xs font-bold text-midnight-ink mb-2">
                Join the Drop Dispatch
              </p>
              <form onSubmit={handleSubscribe} className="flex max-w-sm gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="collector@email.com"
                  className="w-full bg-pure-canvas text-midnight-ink px-4 py-2.5 text-xs rounded-[8px] border border-silver focus:outline-none focus:border-midnight-ink placeholder:text-ash"
                />
                <button
                  type="submit"
                  className="bg-midnight-ink hover:opacity-85 text-pure-canvas px-4 rounded-[8px] text-xs font-bold transition-all flex items-center justify-center shrink-0"
                >
                  {subscribed ? <Check className="w-4 h-4 text-rsvp-going" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
              {subscribed && (
                <p className="text-[11px] text-[#28a728] font-bold mt-1.5 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>You are on the collector VIP list!</span>
                </p>
              )}
            </div>
          </div>

          {/* Discover Col */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-fog mb-4">
              Event Types
            </h4>
            <ul className="space-y-2.5 text-sm font-normal text-graphite">
              <li>
                <Link href="/events?category=hot-wheels" className="hover:text-midnight-ink transition-colors">
                  Hot Wheels & Die-Cast
                </Link>
              </li>
              <li>
                <Link href="/events?category=football-cards" className="hover:text-midnight-ink transition-colors">
                  Football & Sports Cards
                </Link>
              </li>
              <li>
                <Link href="/events?type=swap-meet" className="hover:text-midnight-ink transition-colors">
                  Open Swap Meets
                </Link>
              </li>
              <li>
                <Link href="/events?type=grading-day" className="hover:text-midnight-ink transition-colors">
                  PSA / BGS Grading Days
                </Link>
              </li>
              <li>
                <Link href="/events?type=auction" className="hover:text-midnight-ink transition-colors">
                  Collector Auctions
                </Link>
              </li>
              <li>
                <Link href="/events?type=tournament" className="hover:text-midnight-ink transition-colors">
                  Card Battles & Breaks
                </Link>
              </li>
            </ul>
          </div>

          {/* Collector Hub Col */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-fog mb-4">
              Collector Hub
            </h4>
            <ul className="space-y-2.5 text-sm font-normal text-graphite">
              <li>
                <Link href="/collection" className="hover:text-midnight-ink transition-colors">
                  My Vault
                </Link>
              </li>
              <li>
                <Link href="/trades" className="hover:text-midnight-ink transition-colors">
                  Trade Center
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-midnight-ink transition-colors">
                  Community Feed
                </Link>
              </li>
              <li>
                <Link href="/profile/shreyash" className="hover:text-midnight-ink transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-midnight-ink transition-colors">
                  Organizer Studio
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-midnight-ink transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Cities & Connect Col */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-fog mb-4">
              Hotspots
            </h4>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Jaipur'].map((city) => (
                <Link
                  key={city}
                  href={`/events?city=${city}`}
                  className="px-2.5 py-1 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-xs font-medium text-graphite hover:text-midnight-ink transition-colors"
                >
                  {city}
                </Link>
              ))}
            </div>

            <h5 className="font-bold text-xs uppercase tracking-wider text-fog mb-2">
              Connect
            </h5>
            <div className="flex items-center gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-silver/70 flex items-center justify-center text-graphite hover:text-midnight-ink hover:border-midnight-ink transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-silver/70 flex items-center justify-center text-graphite hover:text-midnight-ink hover:border-midnight-ink transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-silver/70 flex items-center justify-center text-graphite hover:text-midnight-ink hover:border-midnight-ink transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate font-normal">
          <p>© 2026 CrateMeet Inc. Built with celebration energy for collector communities.</p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-midnight-ink transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-midnight-ink transition-colors">
              Join CrateMeet
            </Link>
            <Link href="/onboarding" className="hover:text-midnight-ink transition-colors">
              Collector Calibration
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
