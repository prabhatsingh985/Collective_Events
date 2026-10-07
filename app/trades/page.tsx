'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import { useApp } from '../../context/AppContext'
import { TradeRequest } from '../../types'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import {
  ArrowLeftRight,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  Sparkles,
} from 'lucide-react'

export default function TradesHubPage() {
  const { trades, collectionItems, currentUser, users, respondToTrade, proposeTrade, addToast } = useApp()

  const [activeTab, setActiveTab] = useState<'pending' | 'accepted' | 'declined' | 'completed'>('pending')
  const [pendingSubTab, setPendingSubTab] = useState<'incoming' | 'outgoing'>('incoming')
  const [newTradeModalOpen, setNewTradeModalOpen] = useState(false)

  // New Trade Wizard State
  const [selectedRecipientId, setSelectedRecipientId] = useState(users[1]?.id || '')
  const [selectedOfferIds, setSelectedOfferIds] = useState<string[]>([])
  const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>([])
  const [cashTopUp, setCashTopUp] = useState(0)
  const [tradeMessage, setTradeMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filtered Trades
  const filteredTrades = trades.filter((trade) => {
    if (activeTab === 'pending') {
      if (trade.status !== 'pending') return false
      if (pendingSubTab === 'incoming') return trade.recipientId === currentUser.id
      if (pendingSubTab === 'outgoing') return trade.proposerId === currentUser.id
    }
    return trade.status === activeTab
  })

  // Items for Trade Wizard
  const myVaultItems = collectionItems.filter((i) => i.ownerId === currentUser.id)
  const recipientVaultItems = collectionItems.filter((i) => i.ownerId === selectedRecipientId)

  const handleSendTrade = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedOfferIds.length === 0 || selectedRequestIds.length === 0) return

    setIsSubmitting(true)
    await proposeTrade({
      recipientId: selectedRecipientId,
      offeredItemIds: selectedOfferIds,
      requestedItemIds: selectedRequestIds,
      cashTopUpINR: Number(cashTopUp),
      note: tradeMessage || 'Trade proposed on CollectorEvents.',
    })

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f8c4ff', '#96c4ff', '#000000', '#20c997'],
    })

    setIsSubmitting(false)
    setNewTradeModalOpen(false)
    setSelectedOfferIds([])
    setSelectedRequestIds([])
  }

  const handleAcceptTrade = (tradeId: string) => {
    respondToTrade(tradeId, 'accept')
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#20c997', '#f8c4ff', '#96c4ff', '#000000'],
    })
  }

  return (
    <div className="min-h-screen bg-pure-canvas pb-20 select-none">
      {/* Header section with Periwinkle wash */}
      <div className="bg-sky-periwinkle border-b border-silver/80 pt-10 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="soft-pink" size="sm">
                  Peer-to-Peer Trades
                </Badge>
                <span className="text-xs font-semibold text-slate">
                  Zero commission exchange
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-midnight-ink">
                Collector Trade Hub
              </h1>
              <p className="text-sm text-slate mt-1 font-normal max-w-xl">
                Bilateral collector trades for rare die-cast castings and sports cards. Arrange in-person physical inspections at local community meetups.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              icon={<ArrowLeftRight className="w-4 h-4" />}
              onClick={() => setNewTradeModalOpen(true)}
            >
              Propose Trade
            </Button>
          </div>

          {/* Trade Escrow Banner */}
          <div className="bg-pure-canvas border border-silver rounded-2xl p-4 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <span className="flex items-center gap-2 text-midnight-ink font-medium">
              <Sparkles className="w-4 h-4 text-party-pink shrink-0" />
              <span>
                <strong>Verified In-Person Handshakes:</strong> Inspect blister cards and slab certification seals at any registered CollectorEvents event before final handover.
              </span>
            </span>
            <Link
              href="/events"
              className="text-xs font-bold text-midnight-ink hover:underline shrink-0 flex items-center gap-1"
            >
              <span>Explore Meetups</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto bg-black/[0.05] border border-silver/40 p-1 rounded-full w-fit">
            {(['pending', 'accepted', 'declined', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all capitalize whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-pure-canvas text-midnight-ink shadow-[rgba(0,0,0,0.1)_0px_0px_6px_0px]'
                    : 'text-slate hover:text-midnight-ink hover:bg-black/[0.03]'
                }`}
              >
                {tab === 'pending'
                  ? `Pending (${trades.filter((t) => t.status === 'pending').length})`
                  : tab === 'accepted'
                  ? `Accepted (${trades.filter((t) => t.status === 'accepted').length})`
                  : tab === 'declined'
                  ? `Declined (${trades.filter((t) => t.status === 'declined').length})`
                  : 'Completed'}
              </button>
            ))}
          </div>

          {/* Sub-tabs for Pending */}
          {activeTab === 'pending' && (
            <div className="flex items-center gap-2 pl-1">
              <button
                onClick={() => setPendingSubTab('incoming')}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all border ${
                  pendingSubTab === 'incoming'
                    ? 'bg-midnight-ink text-pure-canvas border-midnight-ink'
                    : 'bg-pure-canvas text-slate border-silver hover:border-graphite'
                }`}
              >
                Incoming Offers ({trades.filter((t) => t.status === 'pending' && t.recipientId === currentUser.id).length})
              </button>
              <button
                onClick={() => setPendingSubTab('outgoing')}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all border ${
                  pendingSubTab === 'outgoing'
                    ? 'bg-midnight-ink text-pure-canvas border-midnight-ink'
                    : 'bg-pure-canvas text-slate border-silver hover:border-graphite'
                }`}
              >
                Outgoing Sent ({trades.filter((t) => t.status === 'pending' && t.proposerId === currentUser.id).length})
              </button>
            </div>
          )}
        </div>

        {/* Trade Cards Listing */}
        {filteredTrades.length > 0 ? (
          <div className="space-y-6">
            {filteredTrades.map((trade) => {
              const isIncoming = trade.recipientId === currentUser.id
              const otherUser = isIncoming
                ? { name: trade.proposerName, username: trade.proposerUsername, avatar: trade.proposerAvatar }
                : { name: trade.recipientName, username: trade.recipientUsername, avatar: trade.recipientAvatar }

              return (
                <div
                  key={trade.id}
                  className="bg-pure-canvas border border-silver rounded-2xl shadow-card hover:shadow-card-hover transition-all p-5 sm:p-6 space-y-6"
                >
                  {/* Header Bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-silver/60 pb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={otherUser.avatar}
                        alt={otherUser.name}
                        className="w-10 h-10 rounded-full object-cover border border-silver"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-medium text-slate">
                            {isIncoming ? 'Received from' : 'Sent to'}
                          </span>
                          <Link
                            href={`/profile/${otherUser.username}`}
                            className="font-bold text-xs text-midnight-ink hover:text-graphite transition-colors"
                          >
                            @{otherUser.username}
                          </Link>
                        </div>
                        <span className="text-[11px] text-slate font-normal">
                          {new Date(trade.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <Badge
                      variant={
                        trade.status === 'pending'
                          ? 'soft-periwinkle'
                          : trade.status === 'accepted'
                          ? 'soft-mint'
                          : 'default'
                      }
                      size="sm"
                    >
                      {trade.status === 'pending' ? '⏳ Awaiting Review' : trade.status === 'accepted' ? '✓ Accepted' : trade.status}
                    </Badge>
                  </div>

                  {/* Items Comparison Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left: What they offered */}
                    <div className="p-4 bg-black/[0.02] border border-silver/50 rounded-xl space-y-3">
                      <span className="text-xs font-bold text-midnight-ink uppercase tracking-wider block">
                        Items Offered
                      </span>
                      <div className="space-y-2">
                        {trade.offeredItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 bg-pure-canvas p-2.5 rounded-lg border border-silver/60">
                            <img src={item.photos[0]} alt={item.title} className="w-12 h-12 rounded-lg object-cover border border-silver/40" />
                            <div className="min-w-0">
                              <p className="font-semibold text-xs text-midnight-ink truncate">{item.title}</p>
                              <p className="text-[11px] text-slate">{item.condition}</p>
                              <p className="text-[11px] font-bold text-midnight-ink font-display">₹{item.estimatedValue.toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: What is requested */}
                    <div className="p-4 bg-black/[0.02] border border-silver/50 rounded-xl space-y-3">
                      <span className="text-xs font-bold text-midnight-ink uppercase tracking-wider block">
                        Items Requested
                      </span>
                      <div className="space-y-2">
                        {trade.requestedItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 bg-pure-canvas p-2.5 rounded-lg border border-silver/60">
                            <img src={item.photos[0]} alt={item.title} className="w-12 h-12 rounded-lg object-cover border border-silver/40" />
                            <div className="min-w-0">
                              <p className="font-semibold text-xs text-midnight-ink truncate">{item.title}</p>
                              <p className="text-[11px] text-slate">{item.condition}</p>
                              <p className="text-[11px] font-bold text-midnight-ink font-display">₹{item.estimatedValue.toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Cash Top-Up & Note */}
                  <div className="p-3.5 bg-black/[0.02] border border-silver/50 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-slate uppercase tracking-wider text-[10px] font-semibold block">Cash Differential:</span>
                      <p className="text-midnight-ink font-bold">
                        {trade.cashTopUpINR > 0
                          ? `+ ₹${trade.cashTopUpINR.toLocaleString('en-IN')} added by Proposer`
                          : trade.cashTopUpINR < 0
                          ? `+ ₹${Math.abs(trade.cashTopUpINR).toLocaleString('en-IN')} requested by Proposer`
                          : 'Straight Item-for-Item Exchange (No Cash)'}
                      </p>
                    </div>
                    {trade.note && (
                      <div className="max-w-md bg-pure-canvas p-2.5 rounded-lg border border-silver text-slate text-xs italic">
                        &ldquo;{trade.note}&rdquo;
                      </div>
                    )}
                  </div>

                  {/* Actions for Incoming Pending Trades */}
                  {isIncoming && trade.status === 'pending' && (
                    <div className="pt-2 flex items-center justify-end gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => respondToTrade(trade.id, 'decline')}
                      >
                        Decline
                      </Button>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => handleAcceptTrade(trade.id)}
                      >
                        Accept Trade Offer 🤝
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-pure-canvas border border-silver rounded-2xl p-12 text-center shadow-card space-y-4">
            <div className="w-16 h-16 bg-sky-periwinkle rounded-full mx-auto flex items-center justify-center text-3xl">
              🤝
            </div>
            <h3 className="text-2xl font-display font-bold text-midnight-ink">
              No active trades here
            </h3>
            <p className="text-sm text-slate max-w-sm mx-auto font-normal">
              Propose a trade from any collector&apos;s vault or browse available trade cards in the community.
            </p>
            <Button variant="primary" size="md" onClick={() => setNewTradeModalOpen(true)}>
              Propose New Trade
            </Button>
          </div>
        )}
      </div>

      {/* PROPOSE NEW TRADE MODAL */}
      <Modal
        isOpen={newTradeModalOpen}
        onClose={() => setNewTradeModalOpen(false)}
        title="Propose Collector Trade"
        subtitle="Select partner, offered item from your vault, and requested item."
        maxWidth="lg"
      >
        <form onSubmit={handleSendTrade} className="space-y-4">
          {/* Partner Selector */}
          <div>
            <label className="text-xs font-semibold text-midnight-ink block mb-1">
              Select Collector to Trade With *
            </label>
            <select
              value={selectedRecipientId}
              onChange={(e) => setSelectedRecipientId(e.target.value)}
              className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-semibold text-midnight-ink cursor-pointer focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
            >
              {users
                .filter((u) => u.id !== currentUser.id)
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    @{u.username} — {u.name} ({u.location})
                  </option>
                ))}
            </select>
          </div>

          {/* Item You Offer */}
          <div>
            <label className="text-xs font-semibold text-midnight-ink block mb-1">
              Select Item You Offer (From Your Vault) *
            </label>
            <select
              value={selectedOfferIds[0] || ''}
              onChange={(e) => setSelectedOfferIds([e.target.value])}
              className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink cursor-pointer focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
            >
              <option value="">-- Choose item to offer --</option>
              {myVaultItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title} (₹{item.estimatedValue.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          {/* Item You Request */}
          <div>
            <label className="text-xs font-semibold text-midnight-ink block mb-1">
              Select Item You Want (From Partner&apos;s Vault) *
            </label>
            <select
              value={selectedRequestIds[0] || ''}
              onChange={(e) => setSelectedRequestIds([e.target.value])}
              className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink cursor-pointer focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
            >
              <option value="">-- Choose item you want --</option>
              {recipientVaultItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title} (₹{item.estimatedValue.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          {/* Cash Differential */}
          <div>
            <label className="text-xs font-semibold text-midnight-ink block mb-1">
              Cash Differential (₹, Optional)
            </label>
            <input
              type="number"
              value={cashTopUp}
              onChange={(e) => setCashTopUp(Number(e.target.value))}
              placeholder="e.g. 5000"
              className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
            />
          </div>

          {/* Message */}
          <div>
            <label className="text-xs font-semibold text-midnight-ink block mb-1">
              Trade Note / Meetup Preference
            </label>
            <textarea
              rows={3}
              value={tradeMessage}
              onChange={(e) => setTradeMessage(e.target.value)}
              placeholder="Can bring to the weekend swap meet for inspection!"
              className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="md" type="button" onClick={() => setNewTradeModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={selectedOfferIds.length === 0 || selectedRequestIds.length === 0}
              isLoading={isSubmitting}
            >
              Send Trade Proposal 🚀
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
