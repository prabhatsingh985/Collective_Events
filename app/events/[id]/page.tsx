'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import { useApp } from '@/context/AppContext'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { EventCard } from '@/components/events/EventCard'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import {
  Calendar,
  Clock,
  MapPin,
  Share2,
  Bookmark,
  Users,
  ShieldCheck,
  Flame,
  CheckCircle2,
  CreditCard,
  ChevronDown,
  HelpCircle,
  Copy,
  Trophy,
  ExternalLink,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react'

export default function EventDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { events, isEventSaved, toggleSaveEvent, registerTicket, toggleFollowUser, addToast } = useApp()

  const event = events.find((e) => e.id === id) || events[0]
  const saved = isEventSaved(event.id)

  const isHotWheels = event.category === 'hot-wheels' || event.category === 'die-cast'

  // Lightbox State
  const [activeGalleryImage, setActiveGalleryImage] = useState<string | null>(null)

  // Registration Modal State
  const [registerModalOpen, setRegisterModalOpen] = useState(false)
  const [selectedTierId, setSelectedTierId] = useState(event.ticketTiers[0]?.id || '')
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [checkoutStep, setCheckoutStep] = useState<'tier' | 'payment' | 'success'>('tier')
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9821')
  const [cardName, setCardName] = useState('Shreyash Srivastava')
  const [registeredTicketData, setRegisteredTicketData] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  // Similar Events
  const similarEvents = events
    .filter((e) => e.id !== event.id && (e.category === event.category || e.city === event.city))
    .slice(0, 3)

  const selectedTier = event.ticketTiers.find((t) => t.id === selectedTierId) || event.ticketTiers[0]
  const totalPrice = (selectedTier?.price || 0) * ticketQuantity

  // Partiful Confetti trigger
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#31c431', '#f8c4ff', '#96c4ff', '#d9c58b', '#000000'],
      })
    } catch {}
  }

  const handleOpenRegister = () => {
    setCheckoutStep('tier')
    setRegisterModalOpen(true)
  }

  const handleProceedToPayment = () => {
    if (selectedTier.price === 0) {
      handleFinalCheckout()
    } else {
      setCheckoutStep('payment')
    }
  }

  const handleFinalCheckout = async () => {
    setIsProcessing(true)
    const result = await registerTicket({
      eventId: event.id,
      tierId: selectedTier.id,
      quantity: ticketQuantity,
    })

    setIsProcessing(false)
    if (result.success && result.ticket) {
      setRegisteredTicketData(result.ticket)
      setCheckoutStep('success')
      triggerConfetti()
    }
  }

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href)
      addToast({
        type: 'info',
        title: 'Invitation Link Copied! 📋',
        message: 'Share this link with your collector friends.',
      })
    }
  }

  return (
    <div className="min-h-screen bg-pure-canvas pb-24 space-y-12">
      {/* 1. HERO HEADER & GALLERY SECTION */}
      <section className="bg-pure-canvas border-b border-silver/40 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Breadcrumb & Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate">
            <div className="flex items-center gap-2">
              <Link href="/events" className="hover:text-midnight-ink">
                Events
              </Link>
              <span>/</span>
              <span className="text-midnight-ink">{event.city}</span>
              <span>/</span>
              <Badge variant={isHotWheels ? 'category-diecast' : 'category-cards'} size="sm">
                {event.category.replace('-', ' ')}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="px-3.5 py-1.5 bg-pure-canvas border border-silver/70 rounded-full font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:border-midnight-ink text-midnight-ink transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
              <button
                onClick={() => toggleSaveEvent(event.id)}
                className={`px-3.5 py-1.5 border rounded-full font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors ${
                  saved
                    ? 'bg-midnight-ink text-pure-canvas border-midnight-ink'
                    : 'bg-pure-canvas text-midnight-ink border-silver/70 hover:border-midnight-ink'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" fill={saved ? 'currentColor' : 'none'} />
                <span>{saved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>

          {/* Event Title & Subtitle */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-midnight-ink leading-[1.05]">
              {event.title}
            </h1>
            <p className="text-base sm:text-lg text-slate font-normal max-w-4xl">
              {event.tagline}
            </p>
          </div>

          {/* Main Cover & Thumbnail Lightbox Strip */}
          <div className="space-y-3">
            <div className="relative h-[340px] sm:h-[480px] w-full bg-silver/20 rounded-2xl overflow-hidden border border-silver/50 shadow-xl">
              <ImageWithFallback
                src={event.coverImage}
                alt={event.title}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-midnight-ink/80 text-pure-canvas font-semibold text-xs backdrop-blur-md shadow-sm">
                  📍 {event.venue}, {event.city}
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-pure-canvas/90 text-midnight-ink font-semibold text-xs backdrop-blur-md shadow-sm border border-silver/40">
                  🗓️ {event.date} · {event.startTime}
                </span>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {event.galleryImages.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[event.coverImage, ...event.galleryImages].map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveGalleryImage(img)}
                    className="relative w-20 h-16 sm:w-28 sm:h-20 flex-shrink-0 rounded-xl border border-silver/60 hover:border-midnight-ink overflow-hidden shadow-sm transition-colors"
                  >
                    <ImageWithFallback src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. MAIN DETAILS & STICKY REGISTRATION SIDEBAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* LEFT 2 COLS: Narrative & Category Deep-Dive */}
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-pure-canvas border border-silver/50 rounded-2xl p-5 shadow-[rgba(0,0,0,0.06)_0px_2px_12px_0px] text-xs">
              <div>
                <span className="text-slate block text-[11px]">Date</span>
                <span className="text-midnight-ink font-bold text-sm">{event.date}</span>
              </div>
              <div>
                <span className="text-slate block text-[11px]">Time</span>
                <span className="text-midnight-ink font-bold text-sm">{event.startTime}</span>
              </div>
              <div>
                <span className="text-slate block text-[11px]">Location</span>
                <span className="text-midnight-ink font-bold text-sm truncate block">{event.city}</span>
              </div>
              <div>
                <span className="text-slate block text-[11px]">Attending</span>
                <span className="text-midnight-ink font-bold text-sm">{event.attendeesCount} RSVP&apos;d</span>
              </div>
            </div>

            {/* About / Description */}
            <div className="bg-pure-canvas border border-silver/50 rounded-2xl p-6 md:p-8 shadow-[rgba(0,0,0,0.06)_0px_2px_12px_0px] space-y-4">
              <h2 className="text-2xl font-bold text-midnight-ink tracking-tight border-b border-silver/30 pb-3">
                About This Gathering
              </h2>
              <div className="text-sm text-graphite leading-relaxed font-normal space-y-4 whitespace-pre-line">
                {event.description}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-silver/30">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-black/[0.04] border border-silver/50 text-xs font-semibold text-midnight-ink rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CATEGORY SPECIFIC BREAKDOWNS */}
            {isHotWheels && event.hotWheelsDetails && (
              <div className="bg-pure-canvas border border-silver/50 rounded-2xl p-6 md:p-8 shadow-[rgba(0,0,0,0.06)_0px_2px_12px_0px] space-y-6">
                <div className="border-b border-silver/30 pb-4 flex items-center justify-between">
                  <div>
                    <Badge variant="category-diecast" size="sm">
                      1:64 Die-Cast Toy & Castings Zone
                    </Badge>
                    <h3 className="text-2xl font-bold text-midnight-ink tracking-tight mt-1">
                      Die-Cast Floor & Tabletop Trading Breakdown
                    </h3>
                  </div>
                  <Flame className="w-6 h-6 text-orange-600" />
                </div>

                {/* Explicit Toy Scope Disclaimer Pill */}
                <div className="flex items-start gap-2.5 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-950 font-medium">
                  <span className="font-bold shrink-0 uppercase tracking-wider text-[11px] text-amber-800">Collector Scope:</span>
                  <span>This meet focuses exclusively on <strong>1:64 scale die-cast toy collectibles</strong> (Mattel Hot Wheels, Matchbox, RLC, $TH, blister card packaging, and custom 1:64 wheel modding) — not full-scale automobile sales.</span>
                </div>

                {/* Key Floor Highlights & Permissions */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="p-3 bg-black/[0.02] border border-silver/40 rounded-xl text-xs">
                    <span className="text-slate block text-[10px] font-semibold uppercase tracking-wider">Treasure Hunts</span>
                    <span className="font-bold text-midnight-ink">
                      {event.hotWheelsDetails.treasureHuntAllowed !== false ? '✓ Hunting Allowed' : 'Strict Table Only'}
                    </span>
                  </div>
                  <div className="p-3 bg-black/[0.02] border border-silver/40 rounded-xl text-xs">
                    <span className="text-slate block text-[10px] font-semibold uppercase tracking-wider">1:64 Modding</span>
                    <span className="font-bold text-midnight-ink">
                      {event.hotWheelsDetails.customToyShowcaseAllowed !== false ? '✓ Custom Showcase' : 'Factory Sealed'}
                    </span>
                  </div>
                  <div className="p-3 bg-black/[0.02] border border-silver/40 rounded-xl text-xs">
                    <span className="text-slate block text-[10px] font-semibold uppercase tracking-wider">RLC Exclusives</span>
                    <span className="font-bold text-midnight-ink">
                      {event.hotWheelsDetails.rlcExclusivesAllowed ? '✓ Numbered Grails' : 'Mainline Focus'}
                    </span>
                  </div>
                  <div className="p-3 bg-black/[0.02] border border-silver/40 rounded-xl text-xs">
                    <span className="text-slate block text-[10px] font-semibold uppercase tracking-wider">Trading Zones</span>
                    <span className="font-bold text-midnight-ink">{event.hotWheelsDetails.tradingZonesCount} Open Tables</span>
                  </div>
                  <div className="p-3 bg-black/[0.02] border border-silver/40 rounded-xl text-xs">
                    <span className="text-slate block text-[10px] font-semibold uppercase tracking-wider">Toy Vendor Slots</span>
                    <span className="font-bold text-midnight-ink">{event.hotWheelsDetails.vendorSlotsFilled}/{event.hotWheelsDetails.vendorSlotsTotal} Booths</span>
                  </div>
                  <div className="p-3 bg-black/[0.02] border border-silver/40 rounded-xl text-xs">
                    <span className="text-slate block text-[10px] font-semibold uppercase tracking-wider">Toy Lot Auction</span>
                    <span className="font-bold text-midnight-ink">
                      {event.hotWheelsDetails.auctionToyLotsScheduled || event.hotWheelsDetails.auctionScheduled ? (event.hotWheelsDetails.auctionStartTime || 'Scheduled') : 'No Auction'}
                    </span>
                  </div>
                </div>

                {/* Brands Present */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate">
                    Die-Cast Toy Brands & Makers On-Site:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {event.hotWheelsDetails.brandsPresent.map((b) => (
                      <span
                        key={b}
                        className="px-3 py-1 bg-pure-canvas text-midnight-ink text-xs font-semibold rounded-full border border-silver"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Featured Catalog Series */}
                {((event.featuredSeries && event.featuredSeries.length > 0) || (event.hotWheelsDetails?.featuredSeries && event.hotWheelsDetails.featuredSeries.length > 0)) && (
                  <div className="space-y-2 pt-2 border-t border-silver/30">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate flex items-center justify-between">
                      <span>Featured Hot Wheels Catalog Series:</span>
                      <Link href="/catalog" className="text-amber-700 dark:text-amber-400 font-semibold normal-case text-xs hover:underline">
                        Explore Catalog →
                      </Link>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(event.featuredSeries || event.hotWheelsDetails?.featuredSeries || []).map((sId) => (
                        <Link
                          key={sId}
                          href={`/catalog/series/${sId}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500/10 text-amber-900 dark:text-amber-300 text-xs font-bold rounded-full border border-amber-500/30 hover:bg-amber-500/20 transition-all shadow-xs capitalize"
                        >
                          <span>🏎️ {sId.replace(/-/g, ' ')}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rare Castings Expected Grid */}
                {((event.hotWheelsDetails.castingsExpected && event.hotWheelsDetails.castingsExpected.length > 0) || (event.hotWheelsDetails.carsExpected && event.hotWheelsDetails.carsExpected.length > 0)) && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate">
                      Castings & Series Confirmed on Floor:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(event.hotWheelsDetails.castingsExpected || event.hotWheelsDetails.carsExpected || []).map((casting, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-black/[0.02] border border-silver/40 rounded-xl"
                        >
                          <img
                            src={casting.image}
                            alt={casting.castingName || casting.name}
                            className="w-16 h-16 object-cover rounded-lg border border-silver/40 shrink-0"
                          />
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-2 py-0.5 bg-party-pink/40 text-midnight-ink text-[10px] font-bold rounded-full">
                                {casting.rarity}
                              </span>
                              {casting.series && (
                                <span className="text-[10px] text-slate font-medium truncate">
                                  {casting.series}
                                </span>
                              )}
                            </div>
                            <p className="font-bold text-xs text-midnight-ink truncate">
                              {casting.castingName || casting.name}
                            </p>
                            <div className="text-[11px] text-slate flex flex-col gap-0.5">
                              {casting.wheelType && (
                                <span className="truncate">🛞 {casting.wheelType}</span>
                              )}
                              {casting.packaging && (
                                <span className="truncate">📦 {casting.packaging}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!isHotWheels && event.footballCardDetails && (
              <div className="bg-pure-canvas border border-silver/50 rounded-2xl p-6 md:p-8 shadow-[rgba(0,0,0,0.06)_0px_2px_12px_0px] space-y-6">
                <div className="border-b border-silver/30 pb-4 flex items-center justify-between">
                  <div>
                    <Badge variant="category-cards" size="sm">
                      Sports Card & Slab Zone
                    </Badge>
                    <h3 className="text-2xl font-bold text-midnight-ink tracking-tight mt-1">
                      Card Trading Pit & Grading Desk
                    </h3>
                  </div>
                  <Trophy className="w-6 h-6 text-midnight-blue" />
                </div>

                {/* Card Brands */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate">
                    Card Brands & Sets Present:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {event.footballCardDetails.cardBrands.map((b) => (
                      <span
                        key={b}
                        className="px-3 py-1 bg-pure-canvas text-midnight-ink text-xs font-semibold rounded-full border border-silver"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Top Cards Showcased */}
                {event.footballCardDetails.topCardsShowcased.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate">
                      Verified Slabs & Grails on Floor:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {event.footballCardDetails.topCardsShowcased.map((c, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 bg-black/[0.02] border border-silver/40 rounded-xl"
                        >
                          <img
                            src={c.image}
                            alt={c.card}
                            className="w-14 h-16 object-cover rounded-lg border border-silver/40"
                          />
                          <div className="space-y-0.5 min-w-0">
                            <span className="px-2 py-0.5 bg-sky-periwinkle/40 text-midnight-ink text-[10px] font-bold rounded-full">
                              {c.grade}
                            </span>
                            <p className="font-bold text-xs text-midnight-ink truncate">
                              {c.card}
                            </p>
                            <p className="text-[11px] text-slate font-medium">
                              Est. ₹{c.estimatedValue.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Event Schedule Agenda */}
            {event.schedule.length > 0 && (
              <div className="bg-pure-canvas border border-silver/50 rounded-2xl p-6 md:p-8 shadow-[rgba(0,0,0,0.06)_0px_2px_12px_0px] space-y-6">
                <h3 className="text-2xl font-bold text-midnight-ink tracking-tight border-b border-silver/30 pb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-midnight-blue" /> Day Agenda Timeline
                </h3>
                <div className="space-y-3">
                  {event.schedule.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-4 rounded-xl bg-black/[0.02] border border-silver/40"
                    >
                      <span className="px-3 py-1 bg-midnight-ink text-pure-canvas text-xs font-bold rounded-full shrink-0">
                        {item.time}
                      </span>
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-sm text-midnight-ink">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate font-normal leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs Accordion */}
            {event.faqs.length > 0 && (
              <div className="bg-pure-canvas border border-silver/50 rounded-2xl p-6 md:p-8 shadow-[rgba(0,0,0,0.06)_0px_2px_12px_0px] space-y-4">
                <h3 className="text-2xl font-bold text-midnight-ink tracking-tight border-b border-silver/30 pb-3 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-midnight-blue" /> Frequently Asked Questions
                </h3>
                <div className="space-y-2">
                  {event.faqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx
                    return (
                      <div
                        key={idx}
                        className="rounded-xl border border-silver/50 overflow-hidden"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full p-4 text-left font-bold text-sm text-midnight-ink flex items-center justify-between hover:bg-black/[0.02]"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 text-xs text-slate leading-relaxed border-t border-silver/30 pt-3">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COL: Sticky Ticket Registration Card */}
          <div className="lg:col-span-1 space-y-6 sticky top-24">
            <div className="bg-pure-canvas border border-silver/50 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-silver/30 pb-3">
                <h3 className="font-bold text-base text-midnight-ink">Select Passes</h3>
                <span className="text-xs font-semibold text-rsvp-going">Live Registration</span>
              </div>

              {/* Ticket Tiers Radio Group */}
              <div className="space-y-2.5">
                {event.ticketTiers.map((tier) => (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedTierId === tier.id
                        ? 'border-midnight-ink bg-black/[0.02] shadow-sm'
                        : 'border-silver/60 bg-pure-canvas hover:border-silver'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-midnight-ink">
                        {tier.name}
                      </h4>
                      <span className="font-bold text-xs text-midnight-ink">
                        {tier.price === 0 ? 'Free' : `₹${tier.price}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate mt-1 leading-snug">
                      {tier.description}
                    </p>
                    <span className="text-[10px] font-semibold text-slate block mt-1.5">
                      {tier.available} passes remaining
                    </span>
                  </div>
                ))}
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center justify-between pt-2 border-t border-silver/30">
                <span className="text-xs font-bold text-midnight-ink">
                  Quantity
                </span>
                <div className="flex items-center border border-silver rounded-lg overflow-hidden bg-pure-canvas">
                  <button
                    onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                    className="p-1.5 hover:bg-black/5"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 py-1 font-bold text-xs">
                    {ticketQuantity}
                  </span>
                  <button
                    onClick={() => setTicketQuantity(Math.min(10, ticketQuantity + 1))}
                    className="p-1.5 hover:bg-black/5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="p-3 bg-black/[0.02] rounded-xl border border-silver/40 flex items-center justify-between text-xs font-bold">
                <span className="text-slate">Total Amount:</span>
                <span className="text-midnight-ink text-base">
                  {totalPrice === 0 ? 'FREE' : `₹${totalPrice.toLocaleString('en-IN')}`}
                </span>
              </div>

              {/* Register CTA: Partiful Primary Black Button */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleOpenRegister}
              >
                {selectedTier?.price === 0 ? 'Claim Free RSVP' : 'Book Passes Now'}
              </Button>

              <p className="text-[11px] text-center text-slate">
                Instant confirmation badge with QR code · Stored in your vault
              </p>
            </div>

            {/* Organizer Profile Card */}
            <div className="bg-pure-canvas border border-silver/50 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-silver/30 pb-3">
                <span className="text-xs font-bold text-slate uppercase">Verified Host</span>
                <span className="text-xs font-bold text-midnight-ink">★ {event.organizer.rating} Rating</span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={event.organizer.avatar}
                  alt={event.organizer.name}
                  className="w-12 h-12 rounded-full object-cover border border-silver"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/profile/${event.organizer.username}`}
                    className="font-bold text-sm text-midnight-ink hover:underline flex items-center gap-1 truncate"
                  >
                    {event.organizer.name}
                    {event.organizer.verified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-rsvp-going" />
                    )}
                  </Link>
                  <p className="text-xs text-slate">
                    @{event.organizer.username} · {event.organizer.eventsHostedCount} Meets Hosted
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={() => toggleFollowUser(event.organizer.username)}
                >
                  Follow Host
                </Button>
                <Link
                  href={`/profile/${event.organizer.username}`}
                  className="px-4 py-1.5 border border-silver rounded-[8px] text-xs font-bold text-midnight-ink hover:border-midnight-ink"
                >
                  Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SIMILAR EVENTS CAROUSEL */}
      {similarEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-silver/40 pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate">Keep Exploring</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-midnight-ink tracking-tight mt-0.5">
                Similar Collector Events
              </h2>
            </div>
            <Link href="/events" className="text-xs font-bold text-midnight-ink hover:underline">
              Browse All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        </section>
      )}

      {/* REGISTRATION & CHECKOUT FLOW MODAL */}
      <Modal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        title={
          checkoutStep === 'success'
            ? 'Registration Confirmed! 🎉'
            : checkoutStep === 'payment'
            ? 'Complete Checkout'
            : 'Ticket Selection'
        }
        subtitle={
          checkoutStep === 'success'
            ? 'You are officially registered. Your pass code is saved to your profile.'
            : `${event.title} · ${event.date}`
        }
        maxWidth="md"
      >
        {checkoutStep === 'tier' && (
          <div className="space-y-6">
            <div className="p-4 bg-black/[0.02] border border-silver/50 rounded-xl space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate tracking-wider">
                Selected Tier
              </span>
              <h4 className="font-bold text-lg text-midnight-ink">
                {selectedTier.name}
              </h4>
              <p className="text-xs text-slate">{selectedTier.description}</p>
              <div className="pt-2 flex items-center justify-between border-t border-silver/30 text-xs font-bold">
                <span>Per ticket:</span>
                <span>{selectedTier.price === 0 ? 'FREE' : `₹${selectedTier.price}`}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold">
              <span>Total ({ticketQuantity} passes):</span>
              <span className="text-midnight-ink text-base">
                {totalPrice === 0 ? 'FREE' : `₹${totalPrice.toLocaleString('en-IN')}`}
              </span>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleProceedToPayment}
            >
              {selectedTier.price === 0 ? 'Confirm Free Registration' : 'Proceed to Payment →'}
            </Button>
          </div>
        )}

        {checkoutStep === 'payment' && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-midnight-blue text-pure-canvas space-y-4 shadow-md">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[10px] uppercase opacity-80">Test Payment Vault</span>
                <CreditCard className="w-4 h-4 text-warm-sand" />
              </div>
              <div className="font-mono text-base tracking-widest">{cardNumber}</div>
              <div className="flex justify-between text-xs opacity-90">
                <span>{cardName}</span>
                <span>12/28</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate">Cardholder Name</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-silver text-xs bg-pure-canvas text-midnight-ink"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-silver text-xs bg-pure-canvas text-midnight-ink font-mono"
                />
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isProcessing}
              onClick={handleFinalCheckout}
            >
              Pay ₹{totalPrice.toLocaleString('en-IN')} & Confirm RSVP
            </Button>
          </div>
        )}

        {checkoutStep === 'success' && registeredTicketData && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-rsvp-going/10 text-rsvp-going flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-xl text-midnight-ink">You are all set!</h3>
              <p className="text-xs text-slate">Ticket Code: <strong className="font-mono text-midnight-ink">{registeredTicketData.ticketCode}</strong></p>
            </div>

            <div className="pt-2 flex gap-3">
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => setRegisterModalOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => {
                  setRegisterModalOpen(false)
                  router.push('/profile/shreyash?tab=tickets')
                }}
              >
                View My Pass
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
