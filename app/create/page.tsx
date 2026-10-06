'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import { useApp } from '../../context/AppContext'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { EventItem, TicketTier } from '../../types'
import {
  Check,
  Calendar,
  MapPin,
  Image as ImageIcon,
  Ticket,
  Sliders,
  Eye,
  Rocket,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Flame,
} from 'lucide-react'

const STOCK_COVERS = [
  { label: 'Hot Wheels Track & Drag', url: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Sports Cards & Slabs', url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Vintage Scale Models', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Stadium Football Memorabilia', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80' },
  { label: '1:64 Die-Cast Collector Table', url: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Modern Chrome Pack Break', url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80' },
]

export default function CreateEventWizardPage() {
  const router = useRouter()
  const { createEvent } = useApp()

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdEventResult, setCreatedEventResult] = useState<EventItem | null>(null)

  // Step 1: Basic Info
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<'hot-wheels' | 'football-cards' | 'die-cast'>('hot-wheels')
  const [eventType, setEventType] = useState<'meet' | 'trading' | 'auction' | 'exhibition' | 'tournament' | 'swap-meet' | 'grading-day' | 'custom-showcase'>('swap-meet')
  const [tagline, setTagline] = useState('')
  const [description, setDescription] = useState('')

  // Step 2: Date & Time
  const [date, setDate] = useState('2026-11-15')
  const [startTime, setStartTime] = useState('11:00 AM')
  const [endTime, setEndTime] = useState('06:00 PM')
  const [isRecurring, setIsRecurring] = useState(false)

  // Step 3: Location
  const [venue, setVenue] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('Mumbai')
  const [isOnline, setIsOnline] = useState(false)

  // Step 4: Media
  const [coverImage, setCoverImage] = useState(STOCK_COVERS[0].url)
  const [customCoverUrl, setCustomCoverUrl] = useState('')

  // Step 5: Tickets
  const [isFreeEvent, setIsFreeEvent] = useState(false)
  const [ticketTiers, setTicketTiers] = useState<TicketTier[]>([
    {
      id: 't-init-1',
      name: 'General Admission',
      price: 199,
      quantity: 150,
      available: 150,
      description: 'Entry pass with access to open trade zone.',
      perks: ['Open floor trade access', 'Show booklet'],
    },
  ])

  // Step 6: Category Specifics
  const [brandsPresent, setBrandsPresent] = useState('Hot Wheels, Kaido House, MiniGT, Matchbox')
  const [customsAllowed, setCustomsAllowed] = useState(true)
  const [treasureHuntAllowed, setTreasureHuntAllowed] = useState(true)
  const [rlcExclusivesAllowed, setRlcExclusivesAllowed] = useState(true)
  const [auctionScheduled, setAuctionScheduled] = useState(true)
  const [tradingZonesCount, setTradingZonesCount] = useState(10)

  const [cardBrands, setCardBrands] = useState('Panini, Topps, Futera')
  const [gradingServices, setGradingServices] = useState('PSA, BGS')
  const [tournamentFormat, setTournamentFormat] = useState('Match Attax Swiss Knockout')

  // Autosave Draft
  useEffect(() => {
    try {
      const draft = localStorage.getItem('cratemeet_event_draft')
      if (draft) {
        const parsed = JSON.parse(draft)
        if (parsed.title) setTitle(parsed.title)
        if (parsed.tagline) setTagline(parsed.tagline)
        if (parsed.description) setDescription(parsed.description)
        if (parsed.venue) setVenue(parsed.venue)
        if (parsed.city) setCity(parsed.city)
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(
        'cratemeet_event_draft',
        JSON.stringify({ title, tagline, description, venue, city, category, eventType })
      )
    } catch {}
  }, [title, tagline, description, venue, city, category, eventType])

  // Step Validation
  const isStepValid = () => {
    if (currentStep === 1) return title.trim().length >= 5 && description.trim().length >= 10
    if (currentStep === 2) return Boolean(date && startTime && endTime)
    if (currentStep === 3) return Boolean(venue.trim() && city.trim())
    if (currentStep === 4) return Boolean(coverImage || customCoverUrl)
    if (currentStep === 5) return ticketTiers.length > 0
    return true
  }

  const handleAddTier = () => {
    setTicketTiers([
      ...ticketTiers,
      {
        id: `tier-${Date.now()}`,
        name: 'VIP Collector Pass',
        price: 499,
        quantity: 50,
        available: 50,
        description: 'Priority early entrance and exclusive swag.',
        perks: ['Early entrance', 'Custom badge'],
      },
    ])
  }

  const handleRemoveTier = (idx: number) => {
    if (ticketTiers.length <= 1) return
    setTicketTiers(ticketTiers.filter((_, i) => i !== idx))
  }

  const handlePublish = async () => {
    setIsSubmitting(true)
    const finalCover = customCoverUrl.trim() || coverImage

    const newEvent = await createEvent({
      title,
      category,
      eventType,
      tagline: tagline || 'Community collector event.',
      description,
      date,
      startTime,
      endTime,
      venue,
      address: address || `${venue}, ${city}`,
      city,
      isOnline,
      coverImage: finalCover,
      ticketTiers: isFreeEvent
        ? [
            {
              id: 'free-tier',
              name: 'Free Collector RSVP',
              price: 0,
              quantity: 200,
              available: 200,
              description: 'Free entry pass for the collector community.',
              perks: ['Open floor access'],
            },
          ]
        : ticketTiers,
      hotWheelsDetails:
        category === 'hot-wheels' || category === 'die-cast'
          ? {
              brandsPresent: brandsPresent.split(',').map((s) => s.trim()),
              diecastBrands: brandsPresent.split(',').map((s) => s.trim()),
              castingsExpected: [
                {
                  name: '1971 Datsun 240Z Super Treasure Hunt',
                  castingName: '1971 Datsun 240Z Super Treasure Hunt',
                  series: 'Super Treasure Hunt ($TH)',
                  wheelType: 'Real Riders Rubber Tires',
                  packaging: 'Mint on Card (MOC)',
                  rarity: 'Super TH',
                  image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80',
                },
              ],
              carsExpected: [
                {
                  name: '1971 Datsun 240Z Super Treasure Hunt',
                  castingName: '1971 Datsun 240Z Super Treasure Hunt',
                  series: 'Super Treasure Hunt ($TH)',
                  wheelType: 'Real Riders Rubber Tires',
                  packaging: 'Mint on Card (MOC)',
                  rarity: 'Super TH',
                  image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80',
                },
              ],
              customBuildsAllowed: customsAllowed,
              customToyShowcaseAllowed: customsAllowed,
              treasureHuntAllowed,
              rlcExclusivesAllowed,
              auctionToyLotsScheduled: auctionScheduled,
              auctionScheduled,
              auctionStartTime: '04:30 PM',
              tradingZonesCount,
              vendorSlotsTotal: 15,
              vendorSlotsFilled: 12,
              highlightCastings: ['Twin Mill', 'Datsun 510 Wagon $TH', 'Custom 69 Chevy C10'],
              highlightModels: ['Twin Mill', 'Datsun 510 Wagon $TH', 'Custom 69 Chevy C10'],
            }
          : undefined,
      footballCardDetails:
        category === 'football-cards'
          ? {
              cardBrands: cardBrands.split(',').map((s) => s.trim()),
              featuredSets: ['Panini Prizm', 'Topps Chrome'],
              gradingCompanies: ['PSA', 'BGS'],
              tradingTablesCount: 16,
              tournamentFormat,
              auctionScheduled,
              topCardsShowcased: [],
            }
          : undefined,
    })

    setIsSubmitting(false)
    setCreatedEventResult(newEvent)
    setCurrentStep(8)

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f8c4ff', '#96c4ff', '#000000', '#20c997'],
      })
    } catch {}
  }

  const steps = [
    { num: 1, label: 'Identity' },
    { num: 2, label: 'Schedule' },
    { num: 3, label: 'Location' },
    { num: 4, label: 'Media' },
    { num: 5, label: 'Tickets' },
    { num: 6, label: 'Format' },
    { num: 7, label: 'Preview' },
  ]

  return (
    <div className="min-h-screen bg-pure-canvas pb-20 select-none">
      {/* Header with Sky Periwinkle Wash */}
      <div className="bg-sky-periwinkle border-b border-silver/80 pt-10 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div>
            <Badge variant="soft-pink" size="sm">
              Event Studio
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-midnight-ink tracking-tight mt-1">
              Host a Collector Meet
            </h1>
            <p className="text-sm text-slate mt-0.5 font-normal">
              Publish a die-cast exhibition, swap meet, or card trade summit.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate">
            Autosaved Draft 💾
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Progress Stepper */}
        {currentStep <= 7 && (
          <div className="bg-fog/70 border border-silver p-3 rounded-2xl overflow-x-auto">
            <div className="flex items-center justify-between min-w-[550px] gap-2">
              {steps.map((s) => {
                const isPast = currentStep > s.num
                const isCurrent = currentStep === s.num
                return (
                  <div key={s.num} className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isPast
                          ? 'bg-spearmint text-pure-canvas'
                          : isCurrent
                          ? 'bg-midnight-ink text-pure-canvas shadow-sm'
                          : 'bg-pure-canvas text-slate border border-silver'
                      }`}
                    >
                      {isPast ? <Check className="w-3.5 h-3.5" /> : s.num}
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        isCurrent ? 'text-midnight-ink' : 'text-slate'
                      }`}
                    >
                      {s.label}
                    </span>
                    {s.num < 7 && <span className="text-silver font-bold">→</span>}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* STEP CONTAINER */}
        <div className="bg-pure-canvas border border-silver rounded-2xl p-6 md:p-8 shadow-card space-y-6">
          {/* STEP 1: BASIC INFO */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="border-b border-silver/60 pb-3">
                <h2 className="text-xl font-display font-bold text-midnight-ink">
                  Step 1: Event Identity & Overview
                </h2>
                <p className="text-xs text-slate font-normal">
                  Give your event an exciting name and select your collector culture niche.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-midnight-ink block mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mumbai Redline Die-Cast Swap Meet & Drag Night"
                  className="w-full p-3 bg-pure-canvas border border-silver rounded-lg text-sm font-semibold text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20 focus:border-midnight-ink"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-midnight-ink block mb-1">
                    Collector Discipline *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-3 bg-pure-canvas border border-silver rounded-lg text-xs font-semibold text-midnight-ink cursor-pointer focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                  >
                    <option value="hot-wheels">🏎️ Hot Wheels (1:64 Die-Cast Toys)</option>
                    <option value="football-cards">⚽ Football & Sports Cards</option>
                    <option value="die-cast">🚗 Precision 1:64 Die-Cast Models</option>
                  </select>
                  <p className="text-[10px] text-amber-900 font-medium bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 mt-1.5 leading-tight">
                    💡 Hot Wheels = die-cast toy collecting (1:64 scale), not real cars.
                  </p>
                </div>


                <div>
                  <label className="text-xs font-semibold text-midnight-ink block mb-1">
                    Event Format *
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full p-3 bg-pure-canvas border border-silver rounded-lg text-xs font-semibold text-midnight-ink cursor-pointer focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                  >
                    <option value="swap-meet">Open Swap Meet</option>
                    <option value="trading">Trading Floor & Summit</option>
                    <option value="auction">Live Collector Auction</option>
                    <option value="grading-day">PSA / BGS Grading Day</option>
                    <option value="tournament">Competitive Tournament</option>
                    <option value="custom-showcase">Custom Builders Showcase</option>
                    <option value="exhibition">Exhibition</option>
                    <option value="meet">Casual Meetup</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-midnight-ink block mb-1">
                  One-Line Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Western India’s biggest gathering of 1:64 scale custom modders."
                  className="w-full p-3 bg-pure-canvas border border-silver rounded-lg text-xs font-normal text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-midnight-ink block mb-1">
                  Detailed Description & Trade Floor Rules *
                </label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline what collectors should bring, trade case limits, tables available, parking info, and featured lots..."
                  className="w-full p-3 bg-pure-canvas border border-silver rounded-lg text-xs font-normal text-midnight-ink leading-relaxed focus:outline-none focus:ring-2 focus:ring-midnight-ink/20 focus:border-midnight-ink"
                />
              </div>
            </div>
          )}

          {/* STEP 2: DATE & TIME */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="border-b border-silver/60 pb-3">
                <h2 className="text-xl font-display font-bold text-midnight-ink">
                  Step 2: Date & Operational Timing
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-midnight-ink block mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-midnight-ink block mb-1">
                    Start Time *
                  </label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="11:00 AM"
                    className="w-full p-3 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-midnight-ink block mb-1">
                    End Time *
                  </label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="06:00 PM"
                    className="w-full p-3 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                  />
                </div>
              </div>

              <div className="p-4 bg-fog/60 border border-silver rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-semibold text-xs text-midnight-ink">
                    Recurring Monthly Meet
                  </p>
                  <p className="text-[11px] text-slate">
                    Automatically cycle and announce dates every month.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="w-4 h-4 accent-midnight-ink cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* STEP 3: LOCATION */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="border-b border-silver/60 pb-3">
                <h2 className="text-xl font-display font-bold text-midnight-ink">
                  Step 3: Venue & Physical Location
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-midnight-ink block mb-1">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. Bandra Exhibition Pavilion"
                    className="w-full p-3 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-midnight-ink block mb-1">
                    Host City *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-3 bg-pure-canvas border border-silver rounded-lg text-xs font-semibold text-midnight-ink cursor-pointer focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                  >
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
              </div>

              <div>
                <label className="text-xs font-semibold text-midnight-ink block mb-1">
                  Full Street Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Hill Road, Near Mehboob Studios, Bandra West, Mumbai 400050"
                  className="w-full p-3 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                />
              </div>
            </div>
          )}

          {/* STEP 4: MEDIA */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="border-b border-silver/60 pb-3">
                <h2 className="text-xl font-display font-bold text-midnight-ink">
                  Step 4: Cover & Promotional Artwork
                </h2>
                <p className="text-xs text-slate font-normal">
                  Choose from curated high-res collector photography or supply your own cover image URL.
                </p>
              </div>

              {/* Curated Stock Photo Gallery */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-midnight-ink block">
                  Select Curated Photo:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {STOCK_COVERS.map((stock) => (
                    <div
                      key={stock.url}
                      onClick={() => {
                        setCoverImage(stock.url)
                        setCustomCoverUrl('')
                      }}
                      className={`relative h-24 sm:h-28 rounded-xl border-2 cursor-pointer overflow-hidden transition-all ${
                        coverImage === stock.url && !customCoverUrl
                          ? 'border-midnight-ink shadow-md scale-102'
                          : 'border-silver hover:border-graphite'
                      }`}
                    >
                      <img src={stock.url} alt={stock.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 right-1 bg-pure-canvas/90 backdrop-blur-md text-midnight-ink text-[10px] font-semibold p-1 rounded truncate">
                        {stock.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom URL Input */}
              <div>
                <label className="text-xs font-semibold text-midnight-ink block mb-1">
                  Or Paste Custom Image URL:
                </label>
                <input
                  type="url"
                  value={customCoverUrl}
                  onChange={(e) => setCustomCoverUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-3 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                />
              </div>
            </div>
          )}

          {/* STEP 5: TICKETS */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div className="border-b border-silver/60 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-display font-bold text-midnight-ink">
                    Step 5: Ticketing & Passes
                  </h2>
                  <p className="text-xs text-slate font-normal">
                    Set up free community RSVPs or tiered table & VIP passes.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate">
                    Free Event?
                  </span>
                  <input
                    type="checkbox"
                    checked={isFreeEvent}
                    onChange={(e) => setIsFreeEvent(e.target.checked)}
                    className="w-4 h-4 accent-midnight-ink cursor-pointer"
                  />
                </div>
              </div>

              {!isFreeEvent ? (
                <div className="space-y-4">
                  {ticketTiers.map((tier, idx) => (
                    <div
                      key={tier.id}
                      className="p-4 bg-fog/50 border border-silver rounded-xl space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-midnight-ink uppercase tracking-wider">
                          Tier #{idx + 1}
                        </span>
                        {ticketTiers.length > 1 && (
                          <button
                            onClick={() => handleRemoveTier(idx)}
                            className="text-slate hover:text-midnight-ink text-xs font-bold"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[10px] font-semibold text-slate">
                            Tier Name
                          </label>
                          <input
                            type="text"
                            value={tier.name}
                            onChange={(e) => {
                              const updated = [...ticketTiers]
                              updated[idx].name = e.target.value
                              setTicketTiers(updated)
                            }}
                            className="w-full p-2 bg-pure-canvas border border-silver rounded-lg text-xs font-semibold text-midnight-ink"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-slate">
                            Price (₹)
                          </label>
                          <input
                            type="number"
                            value={tier.price}
                            onChange={(e) => {
                              const updated = [...ticketTiers]
                              updated[idx].price = Number(e.target.value)
                              setTicketTiers(updated)
                            }}
                            className="w-full p-2 bg-pure-canvas border border-silver rounded-lg text-xs font-semibold text-midnight-ink font-display"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-slate">
                            Quantity Available
                          </label>
                          <input
                            type="number"
                            value={tier.quantity}
                            onChange={(e) => {
                              const updated = [...ticketTiers]
                              updated[idx].quantity = Number(e.target.value)
                              updated[idx].available = Number(e.target.value)
                              setTicketTiers(updated)
                            }}
                            className="w-full p-2 bg-pure-canvas border border-silver rounded-lg text-xs font-semibold text-midnight-ink"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleAddTier}
                    className="px-4 py-2 bg-pure-canvas border border-silver rounded-lg text-xs font-bold text-midnight-ink flex items-center gap-1.5 hover:bg-fog transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Another Ticket Tier</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-fog/70 border border-silver rounded-xl text-xs font-semibold text-midnight-ink">
                  ✓ Free Community RSVP Mode Enabled: Up to 200 free attendee slots will be issued.
                </div>
              )}
            </div>
          )}

          {/* STEP 6: CATEGORY SPECIFICS */}
          {currentStep === 6 && (
            <div className="space-y-5">
              <div className="border-b border-silver/60 pb-3">
                <h2 className="text-xl font-display font-bold text-midnight-ink">
                  Step 6: {category === 'football-cards' ? 'Card Trading Pit Config' : 'Die-Cast Paddock Config'}
                </h2>
              </div>

              {category === 'football-cards' ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-midnight-ink block mb-1">
                      Featured Card Brands & Sets
                    </label>
                    <input
                      type="text"
                      value={cardBrands}
                      onChange={(e) => setCardBrands(e.target.value)}
                      className="w-full p-3 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-midnight-ink block mb-1">
                      Grading Services on Site
                    </label>
                    <input
                      type="text"
                      value={gradingServices}
                      onChange={(e) => setGradingServices(e.target.value)}
                      className="w-full p-3 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-midnight-ink block mb-1">
                      Tournament Format (Optional)
                    </label>
                    <input
                      type="text"
                      value={tournamentFormat}
                      onChange={(e) => setTournamentFormat(e.target.value)}
                      className="w-full p-3 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Toy Disclaimer Banner */}
                  <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-950 font-medium">
                    <strong className="block text-amber-800 uppercase tracking-wider text-[11px] mb-0.5">Die-Cast Toy Gathering Guidelines:</strong>
                    CrateMeet Hot Wheels events are exclusively for 1:64 scale die-cast toy car collecting (blister packaging, $TH hunts, RLC numbered exclusives, and 1:64 custom wheel swaps) — not real automotive sales or track days.
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-midnight-ink block mb-1">
                      Die-Cast Toy Brands & Makers Present
                    </label>
                    <input
                      type="text"
                      value={brandsPresent}
                      onChange={(e) => setBrandsPresent(e.target.value)}
                      placeholder="e.g. Mattel Hot Wheels, Matchbox, Kaido House, MiniGT, Tomica"
                      className="w-full p-3 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3.5 bg-fog/60 border border-silver rounded-xl">
                      <span className="text-xs font-semibold text-midnight-ink">
                        Treasure Hunt ($TH) Hunting Allowed
                      </span>
                      <input
                        type="checkbox"
                        checked={treasureHuntAllowed}
                        onChange={(e) => setTreasureHuntAllowed(e.target.checked)}
                        className="w-4 h-4 accent-midnight-ink cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-fog/60 border border-silver rounded-xl">
                      <span className="text-xs font-semibold text-midnight-ink">
                        1:64 Custom Toy Modding / Wheel Swaps
                      </span>
                      <input
                        type="checkbox"
                        checked={customsAllowed}
                        onChange={(e) => setCustomsAllowed(e.target.checked)}
                        className="w-4 h-4 accent-midnight-ink cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-fog/60 border border-silver rounded-xl">
                      <span className="text-xs font-semibold text-midnight-ink">
                        RLC Numbered Grails Trading Zone
                      </span>
                      <input
                        type="checkbox"
                        checked={rlcExclusivesAllowed}
                        onChange={(e) => setRlcExclusivesAllowed(e.target.checked)}
                        className="w-4 h-4 accent-midnight-ink cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-fog/60 border border-silver rounded-xl">
                      <span className="text-xs font-semibold text-midnight-ink">
                        Live Toy Lot Auction Scheduled
                      </span>
                      <input
                        type="checkbox"
                        checked={auctionScheduled}
                        onChange={(e) => setAuctionScheduled(e.target.checked)}
                        className="w-4 h-4 accent-midnight-ink cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-midnight-ink block mb-1">
                      Tabletop Trading Zones Count
                    </label>
                    <input
                      type="number"
                      value={tradingZonesCount}
                      onChange={(e) => setTradingZonesCount(Number(e.target.value))}
                      className="w-full p-3 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 7: LIVE PREVIEW */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div className="border-b border-silver/60 pb-3">
                <h2 className="text-xl font-display font-bold text-midnight-ink">
                  Step 7: Final Event Card Preview
                </h2>
                <p className="text-xs text-slate font-normal">
                  Review your event card and details before publishing live to collectors.
                </p>
              </div>

              {/* Event Card Preview */}
              <div className="max-w-md mx-auto">
                <div className="bg-pure-canvas border border-silver rounded-xl shadow-card overflow-hidden">
                  <div className="relative h-48 w-full bg-fog">
                    <img
                      src={customCoverUrl || coverImage}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <Badge variant={category === 'hot-wheels' ? 'soft-pink' : 'soft-mint'} size="sm">
                        {category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-medium text-slate">
                      <span>{date}</span>
                      <span>{city}</span>
                    </div>
                    <h3 className="font-semibold text-base text-midnight-ink leading-tight">
                      {title}
                    </h3>
                    <p className="text-xs text-slate line-clamp-2">{tagline || description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: SUCCESS CONFIRMATION */}
          {currentStep === 8 && createdEventResult && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-party-pink/40 text-midnight-ink border border-silver mx-auto flex items-center justify-center shadow-card">
                <Rocket className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="font-display font-bold text-3xl text-midnight-ink">
                  Your Event is Live! 🏁
                </h2>
                <p className="text-xs sm:text-sm text-slate font-normal max-w-sm mx-auto">
                  &quot;{createdEventResult.title}&quot; is published on CrateMeet and discoverable by collectors in {createdEventResult.city}.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                <Link
                  href={`/events/${createdEventResult.id}`}
                  className="px-6 py-3 bg-midnight-ink text-pure-canvas font-bold text-xs rounded-lg hover:bg-graphite transition-colors shadow-sm"
                >
                  View Live Event Page →
                </Link>
                <Link
                  href="/dashboard"
                  className="px-6 py-3 bg-pure-canvas border border-silver text-midnight-ink font-bold text-xs rounded-lg hover:bg-fog transition-colors shadow-sm"
                >
                  Organizer Dashboard
                </Link>
              </div>
            </div>
          )}

          {/* WIZARD NAVIGATION FOOTER */}
          {currentStep <= 7 && (
            <div className="flex items-center justify-between pt-6 border-t border-silver/60">
              {currentStep > 1 ? (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  ← Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 7 ? (
                <Button
                  variant="primary"
                  size="md"
                  disabled={!isStepValid()}
                  onClick={() => setCurrentStep(currentStep + 1)}
                >
                  Next Step →
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  onClick={handlePublish}
                >
                  Publish Event Now 🚀
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
