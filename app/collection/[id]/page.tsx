'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '../../../context/AppContext'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { Modal } from '../../../components/ui/Modal'
import { ImageWithFallback } from '../../../components/ui/ImageWithFallback'
import {
  ArrowLeft,
  Share2,
  TrendingUp,
  ShieldCheck,
  Tag,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
} from 'lucide-react'

export default function CollectionItemDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { collectionItems, currentUser, proposeTrade, toggleFollowUser, addToast } = useApp()

  const item = collectionItems.find((i) => i.id === id) || collectionItems[0]
  const isOwner = item.ownerId === currentUser.id
  const isHW = item.category === 'hot-wheels'

  // Trade Modal State
  const [tradeModalOpen, setTradeModalOpen] = useState(false)
  const [selectedOfferItemId, setSelectedOfferItemId] = useState(
    collectionItems.find((i) => i.ownerId === currentUser.id && i.id !== item.id)?.id || ''
  )
  const [cashTopUp, setCashTopUp] = useState(0)
  const [tradeNote, setTradeNote] = useState('')
  const [isSubmittingTrade, setIsSubmittingTrade] = useState(false)

  // My items available to offer
  const myItems = collectionItems.filter((i) => i.ownerId === currentUser.id && i.id !== item.id)

  const handleProposeTrade = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOfferItemId) {
      addToast({
        type: 'error',
        title: 'Select Item to Offer',
        message: 'Please choose an item from your vault to offer.',
      })
      return
    }

    setIsSubmittingTrade(true)
    await proposeTrade({
      recipientId: item.ownerId,
      offeredItemIds: [selectedOfferItemId],
      requestedItemIds: [item.id],
      cashTopUpINR: Number(cashTopUp),
      note: tradeNote || `Hi @${item.ownerUsername}, proposing a trade for your ${item.title}.`,
    })
    setIsSubmittingTrade(false)
    setTradeModalOpen(false)
    router.push('/trades')
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href)
    addToast({
      type: 'success',
      title: 'Link Copied! 📋',
      message: 'Item link copied to your clipboard.',
    })
  }

  // Sparkline Chart Calculations
  const history = item.history || [
    { date: '2023-01', value: Math.round(item.estimatedValue * 0.75) },
    { date: '2024-01', value: Math.round(item.estimatedValue * 0.9) },
    { date: '2025-01', value: item.estimatedValue },
  ]

  const values = history.map((h) => h.value)
  const minVal = Math.min(...values)
  const maxVal = Math.max(...values)
  const range = maxVal - minVal || 1

  const points = history
    .map((h, idx) => {
      const x = (idx / (history.length - 1)) * 360 + 20
      const y = 140 - ((h.value - minVal) / range) * 100
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="min-h-screen bg-pure-canvas py-10 select-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between border-b border-silver/80 pb-4">
          <Link
            href="/collection"
            className="text-xs font-semibold text-slate hover:text-midnight-ink flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Vault</span>
          </Link>

          <button
            onClick={handleShare}
            className="px-3.5 py-1.5 bg-pure-canvas border border-silver rounded-lg text-xs font-semibold text-midnight-ink flex items-center gap-1.5 hover:bg-fog transition-colors shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-slate" />
            <span>Share Collectible</span>
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left: Photo & Grading Case Treatment */}
          <div className="space-y-4">
            <div className="relative bg-pure-canvas border border-silver rounded-2xl shadow-card overflow-hidden">
              {/* Slab Header Label if Graded */}
              {item.gradingCompany && item.gradeScore && (
                <div className="bg-midnight-ink text-pure-canvas p-3.5 flex items-center justify-between border-b border-silver">
                  <div>
                    <span className="font-bold text-xs uppercase tracking-widest block">
                      {item.gradingCompany} GEM MINT
                    </span>
                    <span className="text-[10px] font-mono text-ash">
                      CERT #89201948 · POP 480
                    </span>
                  </div>
                  <span className="text-xl font-bold font-display bg-pure-canvas text-midnight-ink px-2.5 py-0.5 rounded-lg shadow-sm">
                    {item.gradeScore}
                  </span>
                </div>
              )}

              <div className="relative h-[380px] sm:h-[460px] w-full bg-fog">
                <ImageWithFallback
                  src={item.photos[0]}
                  alt={item.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-medium text-slate px-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-spearmint" />
                Physical Inspection Verified
              </span>
              <span className="text-slate">Tamper-Evident Slab Protected</span>
            </div>
          </div>

          {/* Right: Specifications & Trade Proposal Box */}
          <div className="space-y-6">
            <div className="space-y-2 border-b border-silver/80 pb-4">
              <div className="flex items-center gap-2">
                <Badge variant="soft-pink" size="sm">
                  {isHW ? 'Die-Cast 1:64' : 'Trading Card'}
                </Badge>
                {item.rarityBadge && (
                  <Badge variant="soft-periwinkle" size="sm">
                    {item.rarityBadge}
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-display font-bold text-midnight-ink tracking-tight leading-tight">
                {item.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate font-normal">
                {item.subtitle || item.seriesOrSet}
              </p>
            </div>

            {/* Value Card */}
            <div className="p-4 bg-pure-canvas border border-silver rounded-xl shadow-card flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate uppercase tracking-wider block">
                  Fair Market Valuation
                </span>
                <span className="text-2xl sm:text-3xl font-bold font-display text-midnight-ink">
                  ₹{item.estimatedValue.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-semibold text-slate uppercase tracking-wider block">
                  Trade Availability
                </span>
                <span className={`text-xs font-bold ${item.tradeStatus === 'available' ? 'text-midnight-ink' : 'text-slate'}`}>
                  {item.tradeStatus === 'available' ? '🤝 Open for Offers' : '🔒 Vault Locked'}
                </span>
              </div>
            </div>

            {/* Price Trend Sparkline */}
            <div className="bg-pure-canvas border border-silver rounded-xl p-4 shadow-card space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate">
                  <TrendingUp className="w-4 h-4 text-midnight-ink" /> Valuation Trend
                </span>
                <span className="text-midnight-ink font-bold">+24.5% Past 12 Mo.</span>
              </div>

              <div className="h-32 w-full relative pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 160">
                  <line x1="20" y1="40" x2="380" y2="40" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="4" />
                  <line x1="20" y1="90" x2="380" y2="90" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="4" />
                  <line x1="20" y1="140" x2="380" y2="140" stroke="#f0f0f0" strokeWidth="1" />

                  <polyline
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2.5"
                    points={points}
                  />

                  {history.map((h, idx) => {
                    const x = (idx / (history.length - 1)) * 360 + 20
                    const y = 140 - ((h.value - minVal) / range) * 100
                    return (
                      <g key={idx}>
                        <circle cx={x} cy={y} r="4" fill="#000000" stroke="#ffffff" strokeWidth="2" />
                        <text
                          x={x}
                          y={y - 8}
                          fontSize="10"
                          fontWeight="600"
                          textAnchor="middle"
                          fill="#495057"
                        >
                          ₹{(h.value / 1000).toFixed(0)}k
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>
            </div>

            {/* Details Table */}
            <div className="bg-pure-canvas border border-silver rounded-xl p-4 space-y-2.5 text-xs">
              {isHW && (
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[11px] text-amber-950 font-medium mb-3">
                  <span className="font-bold text-amber-900">1:64 Die-Cast Toy:</span> Authentic Mattel / scale manufacturer toy collectible casting.
                </div>
              )}
              {isHW && item.castingName && (
                <div className="flex justify-between border-b border-silver/60 pb-2">
                  <span className="text-slate font-medium">Casting Model:</span>
                  <span className="text-midnight-ink font-semibold">{item.castingName}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-silver/60 pb-2">
                <span className="text-slate font-medium">{isHW ? 'Toy Series:' : 'Series / Set:'}</span>
                <span className="text-midnight-ink font-semibold truncate max-w-[200px]">{item.toySeries || item.seriesOrSet}</span>
              </div>
              <div className="flex justify-between border-b border-silver/60 pb-2">
                <span className="text-slate font-medium">Release Year:</span>
                <span className="text-midnight-ink font-semibold">{item.year}</span>
              </div>
              {isHW && item.wheelType && (
                <div className="flex justify-between border-b border-silver/60 pb-2">
                  <span className="text-slate font-medium">Wheel / Tire Type:</span>
                  <span className="text-midnight-ink font-semibold">{item.wheelType}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-silver/60 pb-2">
                <span className="text-slate font-medium">{isHW ? 'Packaging / Blister:' : 'Condition Tier:'}</span>
                <span className="text-midnight-ink font-semibold">{item.packagingCondition || item.condition}</span>
              </div>
              {isHW && item.cardBlisterCondition && (
                <div className="flex justify-between border-b border-silver/60 pb-2">
                  <span className="text-slate font-medium">Card/Bubble Status:</span>
                  <span className="text-midnight-ink font-semibold truncate max-w-[200px]">{item.cardBlisterCondition}</span>
                </div>
              )}
              {item.gradingCompany && (
                <div className="flex justify-between border-b border-silver/60 pb-2">
                  <span className="text-slate font-medium">Authentication:</span>
                  <span className="text-midnight-ink font-bold">
                    {item.gradingCompany} {item.gradeScore}
                  </span>
                </div>
              )}
            </div>

            {/* Propose Trade Action or Own Item Info */}
            {!isOwner ? (
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={item.tradeStatus !== 'available'}
                  onClick={() => setTradeModalOpen(true)}
                >
                  {item.tradeStatus === 'available' ? 'Propose Trade Exchange 🤝' : 'Vault Locked by Owner'}
                </Button>

                {/* Owner Mini Card */}
                <div className="p-3.5 bg-fog/60 border border-silver rounded-xl flex items-center justify-between">
                  <Link
                    href={`/profile/${item.ownerUsername}`}
                    className="flex items-center gap-2.5 group"
                  >
                    <img
                      src={item.ownerAvatar}
                      alt={item.ownerName}
                      className="w-10 h-10 rounded-full object-cover border border-silver"
                    />
                    <div>
                      <span className="text-xs font-bold text-midnight-ink group-hover:text-graphite flex items-center gap-1">
                        {item.ownerName}
                        <ShieldCheck className="w-3.5 h-3.5 text-spearmint" />
                      </span>
                      <span className="text-[11px] text-slate font-medium block">
                        @{item.ownerUsername}
                      </span>
                    </div>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFollowUser(item.ownerUsername)}
                  >
                    Follow
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-fog/70 border border-silver rounded-xl text-xs font-semibold text-midnight-ink text-center">
                ✓ This collectible is cataloged in your personal vault.
              </div>
            )}
          </div>
        </div>

        {/* PROPOSE TRADE MODAL */}
        <Modal
          isOpen={tradeModalOpen}
          onClose={() => setTradeModalOpen(false)}
          title="Propose Trade Exchange"
          subtitle={`Offering to @${item.ownerUsername} for "${item.title}"`}
          maxWidth="md"
        >
          <form onSubmit={handleProposeTrade} className="space-y-4">
            {/* Target Wanted Item Preview */}
            <div className="p-3 bg-fog/60 border border-silver rounded-lg space-y-1">
              <span className="text-[10px] font-semibold text-slate uppercase tracking-wider">
                Target Wanted Item
              </span>
              <div className="flex items-center gap-3">
                <img src={item.photos[0]} alt={item.title} className="w-12 h-12 rounded-lg object-cover border border-silver" />
                <div>
                  <p className="font-semibold text-xs text-midnight-ink line-clamp-1">{item.title}</p>
                  <p className="text-[11px] text-slate">Est. ₹{item.estimatedValue.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>

            {/* Select Item to Offer */}
            <div>
              <label className="text-xs font-semibold text-midnight-ink block mb-1">
                Select Item to Offer from Your Vault *
              </label>
              {myItems.length > 0 ? (
                <select
                  value={selectedOfferItemId}
                  onChange={(e) => setSelectedOfferItemId(e.target.value)}
                  className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-semibold text-midnight-ink cursor-pointer focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                >
                  {myItems.map((mi) => (
                    <option key={mi.id} value={mi.id}>
                      {mi.title} (₹{mi.estimatedValue.toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-xs text-slate font-medium">
                  You don&apos;t have any other items in your vault yet. Add one in the Vault page first!
                </p>
              )}
            </div>

            {/* Cash Top-Up Balance */}
            <div>
              <label className="text-xs font-semibold text-midnight-ink block mb-1">
                Cash Top-Up Balance (₹, Optional)
              </label>
              <input
                type="number"
                value={cashTopUp}
                onChange={(e) => setCashTopUp(Number(e.target.value))}
                placeholder="e.g. 5000 (positive to add cash, negative to request cash)"
                className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
              />
            </div>

            {/* Note */}
            <div>
              <label className="text-xs font-semibold text-midnight-ink block mb-1">
                Message to Collector
              </label>
              <textarea
                rows={3}
                value={tradeNote}
                onChange={(e) => setTradeNote(e.target.value)}
                placeholder="Can meet at the Mumbai meet next weekend to verify cards/castings in person!"
                className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" size="md" type="button" onClick={() => setTradeModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" isLoading={isSubmittingTrade}>
                Send Trade Offer →
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  )
}
