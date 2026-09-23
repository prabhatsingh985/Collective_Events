'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'
import { useApp } from '@/context/AppContext'
import { EventCard } from '@/components/events/EventCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  Search,
  MapPin,
  Calendar,
  Flame,
  Layers,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  SlidersHorizontal,
  PartyPopper,
  Users,
} from 'lucide-react'

export default function HomePage() {
  const { events, users, onboarding, addToast } = useApp()
  const router = useRouter()

  const [heroSearch, setHeroSearch] = useState('')
  const [heroCity, setHeroCity] = useState('All Cities')
  const [heroCategory, setHeroCategory] = useState('all')
  const [rsvpState, setRsvpState] = useState<'none' | 'going' | 'maybe' | 'cant'>('going')

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (heroSearch) params.set('q', heroSearch)
    if (heroCity !== 'All Cities') params.set('city', heroCity)
    if (heroCategory !== 'all') params.set('category', heroCategory)
    router.push(`/events?${params.toString()}`)
  }

  const triggerRsvpConfetti = (type: 'going' | 'maybe' | 'cant') => {
    setRsvpState(type)
    if (type === 'going') {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#31c431', '#f8c4ff', '#96c4ff', '#d9c58b', '#000000'],
        })
      } catch {
        // ignore
      }
      addToast({
        type: 'success',
        title: 'You are on the VIP Guestlist! 🎉',
        message: 'RSVP confirmed for Mumbai Grand Prix Die-Cast Meet.',
      })
    }
  }

  // Filtered views
  const featuredEvents = events.filter((e) => e.isFeatured)
  const trendingEvents = events.filter((e) => e.isTrending)

  // Contextual personalization based on onboarding choice
  const preferredCategory = onboarding.interests.includes('Football Cards')
    ? 'football-cards'
    : 'hot-wheels'

  const personalizedEvents = events.filter((e) => e.category === preferredCategory).slice(0, 3)

  // Cities data
  const cities = [
    { name: 'Mumbai', count: events.filter((e) => e.city === 'Mumbai').length, image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=500&q=80' },
    { name: 'Bengaluru', count: events.filter((e) => e.city === 'Bengaluru').length, image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=500&q=80' },
    { name: 'Delhi', count: events.filter((e) => e.city === 'Delhi').length, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=500&q=80' },
    { name: 'Pune', count: events.filter((e) => e.city === 'Pune').length, image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=500&q=80' },
    { name: 'Hyderabad', count: events.filter((e) => e.city === 'Hyderabad').length, image: 'https://images.unsplash.com/photo-1605007493699-ce65834f8a00?auto=format&fit=crop&w=500&q=80' },
    { name: 'Chennai', count: events.filter((e) => e.city === 'Chennai').length, image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=500&q=80' },
  ]

  // Category Tiles
  const categoryTiles = [
    { id: 'hot-wheels', name: 'Hot Wheels 1:64 Die-Cast', desc: 'Mattel Toy Blister Packs, $TH Hunts, RLC Grails & 1:64 Modding', count: events.filter((e) => e.category === 'hot-wheels').length },
    { id: 'football-cards', name: 'Football & Sports Cards', desc: 'Panini Prizm, Topps Chrome & Match Attax', count: events.filter((e) => e.category === 'football-cards').length },
    { id: 'die-cast', name: '1:64 & Precision Die-Cast', desc: 'Tomica Vintage, MiniGT, Kaido House & Tabletop Dioramas', count: events.filter((e) => e.category === 'die-cast').length },
    { id: 'swap-meet', name: 'Open Trade & Swap Meets', desc: 'No-fee peer-to-peer collector trading floors', count: events.filter((e) => e.eventType === 'swap-meet').length },
    { id: 'grading-day', name: 'PSA & BGS Grading Days', desc: 'Card authentication desks & loupe clinics', count: events.filter((e) => e.eventType === 'grading-day').length },
    { id: 'auction', name: 'Collector Live Auctions', desc: 'Hammer drops on vintage Redlines & rookie slabs', count: events.filter((e) => e.eventType === 'auction').length },
  ]

  return (
    <div className="space-y-16 md:space-y-24 bg-pure-canvas pb-20">
      {/* 1. PARTIFUL HERO SECTION: Full-bleed photography washed in Party Pink gradient */}
      <section className="relative min-h-[500px] lg:min-h-[560px] w-full flex items-center overflow-hidden">
        {/* Full-bleed Editorial Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=2000&q=85"
            alt="Collector Meet Celebration"
            className="w-full h-full object-cover"
          />
          {/* Party Pink & Mauve Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-tr from-party-pink/35 via-transparent to-sky-periwinkle/25 mix-blend-screen pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Statement Headline & Search Bar */}
          <div className="lg:col-span-7 space-y-6 text-pure-canvas">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pure-canvas/15 backdrop-blur-md border border-pure-canvas/20 text-xs font-semibold text-pure-canvas">
              <Sparkles className="w-3.5 h-3.5 text-party-pink" />
              <span>Celebrating Die-Cast & Sports Card Drops in 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-pure-canvas leading-[1.05]">
              The page stays quiet.
              <br />
              <span className="text-party-pink">The meet explodes with color.</span>
            </h1>

            <p className="text-base sm:text-lg text-pure-canvas/80 max-w-xl font-normal leading-relaxed">
              India&apos;s curated discovery platform for downhill Hot Wheels drag meets, live hobby box breaks, PSA grading summits, and collector swap meets.
            </p>

            {/* Partiful Unified Search Bar */}
            <form
              onSubmit={handleHeroSearch}
              className="bg-pure-canvas p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-stretch gap-2 max-w-2xl border border-silver/40"
            >
              <div className="flex-1 flex items-center px-3 py-2 bg-black/[0.03] rounded-xl">
                <Search className="w-4 h-4 text-slate mr-2.5 shrink-0" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Search drops, castings, card sets, cities..."
                  className="w-full bg-transparent text-midnight-ink text-sm font-medium focus:outline-none placeholder:text-ash"
                />
              </div>

              <div className="flex items-center px-3 py-2 bg-black/[0.03] rounded-xl sm:w-44">
                <MapPin className="w-4 h-4 text-slate mr-2 shrink-0" />
                <select
                  value={heroCity}
                  onChange={(e) => setHeroCity(e.target.value)}
                  className="w-full bg-transparent text-midnight-ink text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="All Cities">All Cities</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Pune">Pune</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Jaipur">Jaipur</option>
                </select>
              </div>

              {/* Partiful Primary Button: Black filled, 8px radius */}
              <button
                type="submit"
                className="px-6 py-2.5 bg-midnight-ink text-pure-canvas font-bold text-sm rounded-[8px] hover:opacity-85 active:scale-[0.98] transition-all shrink-0"
              >
                Find Meets
              </button>
            </form>

            {/* Quick Filter Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-pure-canvas/60 font-medium">Trending:</span>
              {[
                { label: '🔥 Super Treasure Hunt', href: '/events?q=Super+Treasure+Hunt' },
                { label: '⚽ Panini Prizm Breaks', href: '/events?q=Panini+Prizm' },
                { label: '💎 PSA 10 Grading Day', href: '/events?type=grading-day' },
                { label: '🏎️ Bandra Swap Floor', href: '/events?city=Mumbai' },
              ].map((tag) => (
                <Link
                  key={tag.label}
                  href={tag.href}
                  className="px-3 py-1 rounded-full bg-pure-canvas/15 hover:bg-pure-canvas/25 text-pure-canvas text-xs font-medium backdrop-blur-sm transition-all border border-pure-canvas/20"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Partiful Floating RSVP Event Card Preview Widget */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm bg-pure-canvas rounded-2xl p-6 shadow-2xl border border-silver/50 space-y-5 animate-pack-reveal">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-party-pink/40 text-midnight-ink font-bold text-[11px]">
                  ✨ Drop Tonight
                </span>
                <span className="text-slate font-medium">Sep 28 · 6:00 PM</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-midnight-ink tracking-tight leading-snug">
                  Mumbai Super Treasure Hunt & Prizm Night
                </h3>
                <p className="text-xs text-slate mt-1">
                  Bandra Collector Lounge · 42 RSVPs confirmed
                </p>
              </div>

              {/* Guest Avatar Row */}
              <div className="flex items-center justify-between pt-2 border-t border-silver/30">
                <div className="flex items-center -space-x-2">
                  <img
                    src="/avatars/shreyash.jpg"
                    alt="Attendee"
                    className="w-7 h-7 rounded-full border-2 border-pure-canvas object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                    alt="Attendee"
                    className="w-7 h-7 rounded-full border-2 border-pure-canvas object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                    alt="Attendee"
                    className="w-7 h-7 rounded-full border-2 border-pure-canvas object-cover"
                  />
                  <div className="px-2 py-0.5 rounded-full bg-black/[0.08] text-[11px] font-bold text-midnight-ink border-2 border-pure-canvas">
                    +39
                  </div>
                </div>
                <span className="text-xs font-semibold text-rsvp-going">Going with friends</span>
              </div>

              {/* Partiful Circular RSVP Response Options */}
              <div className="pt-2 border-t border-silver/30 space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ash text-center">
                  Will you be there?
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => triggerRsvpConfetti('going')}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                      rsvpState === 'going'
                        ? 'border-[#31c431] bg-[#31c431]/10 text-midnight-ink shadow-sm'
                        : 'border-silver/60 hover:border-silver bg-pure-canvas text-slate'
                    }`}
                  >
                    <span className="w-10 h-10 rounded-full bg-pure-canvas shadow-sm flex items-center justify-center text-lg border border-silver/50">
                      🎉
                    </span>
                    <span className="text-xs font-bold">Going</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerRsvpConfetti('maybe')}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                      rsvpState === 'maybe'
                        ? 'border-[#ffae00] bg-[#ffae00]/10 text-midnight-ink shadow-sm'
                        : 'border-silver/60 hover:border-silver bg-pure-canvas text-slate'
                    }`}
                  >
                    <span className="w-10 h-10 rounded-full bg-pure-canvas shadow-sm flex items-center justify-center text-lg border border-silver/50">
                      🤔
                    </span>
                    <span className="text-xs font-bold">Maybe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerRsvpConfetti('cant')}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                      rsvpState === 'cant'
                        ? 'border-[#ff0000] bg-[#ff0000]/10 text-midnight-ink shadow-sm'
                        : 'border-silver/60 hover:border-silver bg-pure-canvas text-slate'
                    }`}
                  >
                    <span className="w-10 h-10 rounded-full bg-pure-canvas shadow-sm flex items-center justify-center text-lg border border-silver/50">
                      😢
                    </span>
                    <span className="text-xs font-bold">Can&apos;t go</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PARTIFUL SIGNATURE SECTION: Tilted Card Pile Stack Showcase with Sky Periwinkle Wash */}
      <section className="bg-sky-periwinkle py-16 md:py-20 border-y border-silver/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Feature text */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate">
              Physical Party Energy
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-midnight-ink leading-tight">
              Scattered invites. Real tables. Unboxed grails.
            </h2>
            <p className="text-sm sm:text-base text-slate font-normal leading-relaxed">
              CrateMeet turns collector events into physical celebrations. From mint 1971 Datsun Super Treasure Hunts to Gem Mint Bellingham rookies, see what is walking through the door before you arrive.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/create"
                className="px-6 py-2.5 bg-midnight-ink text-pure-canvas text-sm font-bold rounded-[8px] hover:opacity-85 transition-opacity"
              >
                Create Invitation Card
              </Link>
              <Link
                href="/events"
                className="px-5 py-2.5 text-midnight-ink text-sm font-semibold hover:underline"
              >
                Browse All Tables →
              </Link>
            </div>
          </div>

          {/* Right Column: Partiful 3-card tilted stack (-10deg, 0deg, +12deg) */}
          <div className="lg:col-span-7 flex items-center justify-center py-6">
            <div className="relative w-full max-w-lg h-72 sm:h-80 flex items-center justify-center">
              {/* Tilted Card 1 (Left: -10 deg) */}
              <div className="absolute left-4 sm:left-8 w-52 sm:w-60 bg-pure-canvas rounded-xl p-3.5 shadow-2xl border border-silver/50 tilted-stack-left cursor-pointer">
                <div className="relative h-28 w-full rounded-lg overflow-hidden bg-silver/20 mb-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80"
                    alt="Hot Wheels Datsun"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-party-pink/90 text-midnight-ink text-[10px] font-bold">
                    Super Treasure Hunt
                  </span>
                </div>
                <h4 className="text-xs font-bold text-midnight-ink line-clamp-1">1971 Datsun 240Z $TH</h4>
                <p className="text-[11px] text-slate mt-0.5">Bandra Swap Meet · Verified Table</p>
              </div>

              {/* Tilted Card 2 (Center: 0 deg) */}
              <div className="relative z-10 w-56 sm:w-64 bg-pure-canvas rounded-xl p-4 shadow-2xl border border-silver/50 tilted-stack-center cursor-pointer">
                <div className="relative h-32 w-full rounded-lg overflow-hidden bg-silver/20 mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=400&q=80"
                    alt="Haaland PSA 10"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-pure-canvas text-midnight-ink text-[10px] font-bold shadow-sm">
                    PSA 10 Gem Mint
                  </span>
                </div>
                <h4 className="text-sm font-bold text-midnight-ink line-clamp-1">Erling Haaland 2019 Chrome</h4>
                <p className="text-xs text-slate mt-0.5">Bengaluru Summit · Pop 480</p>
                <div className="mt-2.5 pt-2 border-t border-silver/30 flex items-center justify-between text-[11px]">
                  <span className="text-rsvp-going font-bold">Open for Trade</span>
                  <span className="text-midnight-ink font-bold">₹1,25,000</span>
                </div>
              </div>

              {/* Tilted Card 3 (Right: +12 deg) */}
              <div className="absolute right-4 sm:right-8 w-52 sm:w-60 bg-pure-canvas rounded-xl p-3.5 shadow-2xl border border-silver/50 tilted-stack-right cursor-pointer">
                <div className="relative h-28 w-full rounded-lg overflow-hidden bg-silver/20 mb-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=400&q=80"
                    alt="Custom Camaro Redline"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-warm-sand/50 text-midnight-ink text-[10px] font-bold">
                    Sweet 16 Redline
                  </span>
                </div>
                <h4 className="text-xs font-bold text-midnight-ink line-clamp-1">1968 Custom Camaro</h4>
                <p className="text-[11px] text-slate mt-0.5">Delhi Downhill Nationals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CONTEXTUAL PERSONALIZED FEED ("Because you collect...") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-pure-canvas rounded-2xl border border-silver/50 p-6 md:p-8 shadow-[rgba(0,0,0,0.06)_0px_2px_12px_0px] space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-silver/40 pb-4">
            <div>
              <span className="text-xs font-bold text-midnight-blue flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-party-pink" />
                <span>Calibrated for @{onboarding.homeCity} collectors</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-midnight-ink tracking-tight mt-1">
                Because you collect {preferredCategory === 'hot-wheels' ? 'Hot Wheels & Die-Cast' : 'Football Cards'}
              </h2>
            </div>
            <Link
              href={`/events?category=${preferredCategory}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-midnight-ink hover:underline"
            >
              <span>View All {preferredCategory === 'hot-wheels' ? 'Die-Cast' : 'Card'} Drops</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalizedEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} showPackReveal />
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED EVENTS (Clean Partiful Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-silver/40 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate">
              Curated Highlights
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-midnight-ink tracking-tight mt-1">
              Featured Collector Meets & Summits
            </h2>
          </div>
          <Link
            href="/events?featured=true"
            className="px-5 py-2 rounded-[8px] border border-midnight-ink text-midnight-ink hover:bg-black/[0.04] text-xs font-bold transition-colors"
          >
            Browse All Featured →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredEvents.slice(0, 6).map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      </section>

      {/* 5. TRENDING HORIZONTAL SNAP CAROUSEL */}
      <section className="bg-sky-periwinkle py-12 md:py-16 border-y border-silver/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-midnight-ink text-pure-canvas flex items-center justify-center shadow-sm">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-midnight-ink tracking-tight">
                  Trending Across Cities
                </h2>
                <p className="text-xs text-slate font-medium">
                  Fastest filling registrations this week
                </p>
              </div>
            </div>
            <Link
              href="/events?sort=popularity"
              className="text-xs font-bold text-midnight-ink hover:underline flex items-center gap-1"
            >
              <span>Explore Top 20</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Snap Carousel */}
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory pt-2">
            {trendingEvents.map((evt) => (
              <div key={evt.id} className="w-[300px] sm:w-[350px] flex-shrink-0 snap-start">
                <EventCard event={evt} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CATEGORY EXPLORER TILES (12px Rounded Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate">
            Collector Passions
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-midnight-ink tracking-tight">
            Explore by Collector Discipline
          </h2>
          <p className="text-xs sm:text-sm text-slate font-normal">
            Find the exact crowd, tables, and trade rules that match your collection focus.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryTiles.map((cat) => (
            <Link
              key={cat.name}
              href={`/events?category=${cat.id}`}
              className="group bg-pure-canvas rounded-xl border border-silver/50 p-6 shadow-[rgba(0,0,0,0.06)_0px_2px_8px_0px] hover:shadow-[rgba(0,0,0,0.1)_0px_8px_20px_0px] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate">
                    {cat.count} Active Events
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate group-hover:text-midnight-ink group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-bold text-lg text-midnight-ink group-hover:text-midnight-blue transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate font-normal leading-relaxed">
                  {cat.desc}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-silver/30 flex items-center justify-between text-xs font-bold text-midnight-ink">
                <span>Browse Schedule</span>
                <span className="text-slate group-hover:text-midnight-ink">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. POPULAR CITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-silver/40 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate">
              Regional Communities
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-midnight-ink tracking-tight mt-1">
              Active Collector Hotspots
            </h2>
          </div>
          <p className="text-xs text-slate font-medium">
            Select any city to discover local swap meets
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cities.map((city) => (
            <Link
              key={city.name}
              href={`/events?city=${city.name}`}
              className="group relative h-40 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-end p-3"
            >
              <img
                src={city.image}
                alt={city.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight-ink/80 via-midnight-ink/30 to-transparent" />
              <div className="relative z-10">
                <span className="px-2 py-0.5 rounded-full bg-pure-canvas/90 text-midnight-ink text-[10px] font-bold backdrop-blur-sm shadow-sm">
                  {city.count} Events
                </span>
                <h3 className="text-base font-bold text-pure-canvas tracking-tight mt-1">
                  {city.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 8. COMMUNITY PULSE & LIVE TICKER */}
      <section className="bg-pure-canvas border-t border-silver/40 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-silver/40">
            <div className="p-4 space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-midnight-ink">
                2,400+
              </p>
              <p className="text-xs font-semibold text-slate uppercase tracking-wider">
                Active Collectors
              </p>
            </div>
            <div className="p-4 space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-midnight-ink">
                28
              </p>
              <p className="text-xs font-semibold text-slate uppercase tracking-wider">
                Events This Quarter
              </p>
            </div>
            <div className="p-4 space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-midnight-ink">
                ₹18.4L+
              </p>
              <p className="text-xs font-semibold text-slate uppercase tracking-wider">
                Vault Value Tracked
              </p>
            </div>
            <div className="p-4 space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-midnight-ink">
                520+
              </p>
              <p className="text-xs font-semibold text-slate uppercase tracking-wider">
                Completed Trades
              </p>
            </div>
          </div>

          {/* Top Curators Bar */}
          <div className="pt-6 border-t border-silver/40 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs font-bold text-midnight-ink">
                Top Pillar Collectors in India:
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {users.slice(1, 5).map((u) => (
                <Link
                  key={u.id}
                  href={`/profile/${u.username}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.03] hover:bg-black/[0.06] border border-silver/50 transition-colors group"
                >
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs font-bold text-midnight-ink flex items-center gap-1">
                    {u.name}
                    <ShieldCheck className="w-3.5 h-3.5 text-rsvp-going" />
                  </span>
                </Link>
              ))}
            </div>
            <Link
              href="/community"
              className="text-xs font-bold text-midnight-ink hover:underline flex-shrink-0"
            >
              Join Discussion Feed →
            </Link>
          </div>
        </div>
      </section>

      {/* 9. PULL-QUOTE CELEBRATION BANNER */}
      <section className="bg-sky-periwinkle py-16 md:py-20 border-t border-silver/30 text-center select-none">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-slate">
            The Collector Creed
          </span>
          <blockquote className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-midnight-ink leading-snug">
            &ldquo;A mint blister isn&apos;t just packaging. A PSA 10 isn&apos;t just cardboard. They are timestamped artifacts of human excitement.&rdquo;
          </blockquote>
          <p className="text-xs sm:text-sm font-semibold text-slate">
            — Kabir Mehta, Founder of Bandra Die-Cast Syndicate
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link
              href="/create"
              className="px-6 py-3 bg-midnight-ink text-pure-canvas font-bold text-sm rounded-[8px] hover:opacity-85 transition-opacity shadow-sm"
            >
              Host a Meetup in Your City
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
