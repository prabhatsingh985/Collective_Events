'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useApp } from '../../context/AppContext'
import { CollectionItem } from '../../types'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import {
  Sparkles,
  Plus,
  Search,
  ShieldCheck,
  TrendingUp,
  Tag,
  ArrowRight,
  Trash2,
  Lock,
  Flame,
} from 'lucide-react'

export default function CollectionDashboardPage() {
  const { collectionItems, currentUser, addCollectionItem, deleteCollectionItem } = useApp()

  const [activeTab, setActiveTab] = useState<'all' | 'owned' | 'wishlist' | 'trade'>('all')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'hot-wheels' | 'football-cards'>('all')
  const [addItemModalOpen, setAddItemModalOpen] = useState(false)

  // Add Item Form State
  const [newTitle, setNewTitle] = useState('')
  const [newSubtitle, setNewSubtitle] = useState('')
  const [newCategory, setNewCategory] = useState<'hot-wheels' | 'football-cards'>('hot-wheels')
  const [newYear, setNewYear] = useState(2024)
  const [newSeries, setNewSeries] = useState('')
  const [newCondition, setNewCondition] = useState<any>('Mint on Card (MOC)')
  const [newPackagingCondition, setNewPackagingCondition] = useState<any>('Mint on Card (MOC)')
  const [newWheelType, setNewWheelType] = useState('Real Riders Rubber Tires')
  const [newColorDeco, setNewColorDeco] = useState('')
  const [newGrading, setNewGrading] = useState<'PSA' | 'BGS' | 'None'>('None')
  const [newGradeScore, setNewGradeScore] = useState('10')
  const [newValue, setNewValue] = useState(2500)
  const [newTradeStatus, setNewTradeStatus] = useState<'available' | 'not-for-trade'>('available')
  const [newIsOwned, setNewIsOwned] = useState(true)
  const [newPhoto, setNewPhoto] = useState('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80')

  // Filtered Items
  const filteredItems = useMemo(() => {
    return collectionItems.filter((item) => {
      // Tab filter
      if (activeTab === 'owned' && !item.isOwned) return false
      if (activeTab === 'wishlist' && item.isOwned) return false
      if (activeTab === 'trade' && item.tradeStatus !== 'available') return false

      // Category
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false

      // Search
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchesTitle = item.title.toLowerCase().includes(q)
        const matchesSeries = item.seriesOrSet.toLowerCase().includes(q)
        const matchesOwner = item.ownerName.toLowerCase().includes(q)
        if (!matchesTitle && !matchesSeries && !matchesOwner) return false
      }

      return true
    })
  }, [collectionItems, activeTab, categoryFilter, search])

  // Portfolio Metrics
  const ownedItems = collectionItems.filter((i) => i.isOwned && i.ownerId === currentUser.id)
  const totalPortfolioValue = ownedItems.reduce((acc, curr) => acc + curr.estimatedValue, 0)
  const wishlistCount = collectionItems.filter((i) => !i.isOwned && i.ownerId === currentUser.id).length
  const tradeAvailableCount = collectionItems.filter((i) => i.tradeStatus === 'available' && i.ownerId === currentUser.id).length

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const isHW = newCategory === 'hot-wheels'

    addCollectionItem({
      title: newTitle,
      subtitle: newSubtitle || (isHW ? newPackagingCondition : newCondition),
      category: newCategory,
      year: Number(newYear),
      seriesOrSet: newSeries || (isHW ? 'Hot Wheels Mainline' : 'Panini Prizm'),
      condition: isHW ? newPackagingCondition : newCondition,
      castingName: isHW ? newTitle : undefined,
      toySeries: isHW ? (newSeries || 'Hot Wheels Mainline') : undefined,
      wheelType: isHW ? newWheelType : undefined,
      colorDeco: isHW ? newColorDeco : undefined,
      packagingCondition: isHW ? newPackagingCondition : undefined,
      gradingCompany: newGrading === 'None' ? undefined : newGrading,
      gradeScore: newGrading === 'None' ? undefined : newGradeScore,
      estimatedValue: Number(newValue),
      tradeStatus: newTradeStatus,
      isOwned: newIsOwned,
      photos: [newPhoto],
      description: isHW
        ? `1:64 scale die-cast toy casting: ${newTitle}. Series: ${newSeries || 'Mainline'}. Wheels: ${newWheelType}. Packaging: ${newPackagingCondition}.`
        : 'Added to vault via CrateMeet manager.',
      rarityBadge: newGrading !== 'None' ? `${newGrading} ${newGradeScore}` : (isHW ? 'Collector Die-Cast' : 'Collector Mint'),
    })

    setAddItemModalOpen(false)
    setNewTitle('')
    setNewSubtitle('')
    setNewSeries('')
    setNewColorDeco('')
  }

  return (
    <div className="min-h-screen bg-pure-canvas pb-20 select-none">
      {/* Header section with subtle periwinkle wash */}
      <div className="bg-sky-periwinkle border-b border-silver/80 pt-10 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="soft-pink" size="sm">
                  Personal Vault
                </Badge>
                <span className="text-xs font-semibold text-slate">
                  @{currentUser.username}&apos;s Showcase
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-midnight-ink">
                Die-Cast & Card Vault
              </h1>
              <p className="text-sm text-slate mt-1 font-normal max-w-xl">
                Track your rarest 1:64 die-cast toy castings and football rookie cards, manage authentication grades, and curate items ready for meet trades.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="md"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setAddItemModalOpen(true)}
              >
                Add Collectible
              </Button>
            </div>
          </div>

          {/* Explicit Toy Scope Disclaimer Banner */}
          <div className="p-3.5 bg-pure-canvas border border-silver/80 rounded-2xl shadow-sm flex items-start gap-3 text-xs text-graphite">
            <span className="text-lg shrink-0">🧸</span>
            <div className="space-y-0.5">
              <span className="font-bold text-midnight-ink block">Collector Scope on Hot Wheels & Die-Cast:</span>
              <p className="text-slate leading-relaxed">
                Hot Wheels in your vault represent <strong>1:64 scale die-cast toy collectibles</strong> (blister cards, Super Treasure Hunts ($TH), Red Line Club (RLC) pieces, casting models, and custom 1:64 wheel modding) — not full-size automobiles.
              </p>
            </div>
          </div>

          {/* Portfolio Metrics Cards in Partiful 16px geometry */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="bg-pure-canvas border border-silver rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate">
                  Vault Valuation
                </span>
                <Sparkles className="w-4 h-4 text-party-pink" />
              </div>
              <p className="text-2xl sm:text-3xl font-display font-bold text-midnight-ink">
                ₹{totalPortfolioValue.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-slate font-normal">Real-time fair market estimate</p>
            </div>

            <div className="bg-pure-canvas border border-silver rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate">
                  Cataloged Items
                </span>
                <span className="text-xs">🏆</span>
              </div>
              <p className="text-2xl sm:text-3xl font-display font-bold text-midnight-ink">
                {ownedItems.length} Grails
              </p>
              <p className="text-[11px] text-slate font-normal">Verified in personal collection</p>
            </div>

            <div className="bg-pure-canvas border border-silver rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate">
                  Open for Trade
                </span>
                <span className="text-xs">🤝</span>
              </div>
              <p className="text-2xl sm:text-3xl font-display font-bold text-midnight-ink">
                {tradeAvailableCount} Items
              </p>
              <p className="text-[11px] text-slate font-normal">Ready for meetup exchange</p>
            </div>

            <div className="bg-pure-canvas border border-silver rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate">
                  Wanted Wishlist
                </span>
                <span className="text-xs">✨</span>
              </div>
              <p className="text-2xl sm:text-3xl font-display font-bold text-midnight-ink">
                {wishlistCount} Wanted
              </p>
              <p className="text-[11px] text-slate font-normal">Tracked for future conventions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Controls & Filter Tabs */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Partiful Pill Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto bg-fog/70 border border-silver p-1 rounded-full">
            {[
              { id: 'all', label: `All Items (${collectionItems.length})` },
              { id: 'owned', label: `Owned (${collectionItems.filter((i) => i.isOwned).length})` },
              { id: 'trade', label: `Trade Available (${collectionItems.filter((i) => i.tradeStatus === 'available').length})` },
              { id: 'wishlist', label: `Wishlist (${collectionItems.filter((i) => !i.isOwned).length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-midnight-ink text-pure-canvas shadow-sm'
                    : 'text-slate hover:text-midnight-ink hover:bg-pure-canvas'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Category Filter */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search grails, series, cast..."
                className="pl-9 pr-4 py-2 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-midnight-ink/20 focus:border-midnight-ink w-56 sm:w-64"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="px-3.5 py-2 bg-pure-canvas border border-silver rounded-lg text-xs font-semibold text-midnight-ink cursor-pointer focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
            >
              <option value="all">All Categories</option>
              <option value="hot-wheels">🏎️ Hot Wheels</option>
              <option value="football-cards">⚽ Football Cards</option>
            </select>
          </div>
        </div>

        {/* Collection Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const isHW = item.category === 'hot-wheels'
              const isOwner = item.ownerId === currentUser.id

              return (
                <div
                  key={item.id}
                  className="group relative bg-pure-canvas border border-silver rounded-xl shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all flex flex-col justify-between overflow-hidden"
                >
                  {/* Photo & Badges */}
                  <div className="relative h-56 w-full bg-fog overflow-hidden">
                    <img
                      src={item.photos[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Rarity & Condition Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-1 pointer-events-none">
                      <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-pure-canvas/90 backdrop-blur-md text-midnight-ink border border-silver/60 shadow-sm">
                        {item.year} · {isHW ? '1:64' : 'Card'}
                      </span>

                      {item.rarityBadge && (
                        <span className="px-2.5 py-0.5 rounded-full bg-party-pink/90 backdrop-blur-md text-midnight-ink text-[10px] font-bold border border-party-pink shadow-sm">
                          {item.rarityBadge}
                        </span>
                      )}
                    </div>

                    {/* Trade Status Pill */}
                    <div className="absolute bottom-2.5 left-2.5">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full shadow-sm backdrop-blur-md ${
                          item.tradeStatus === 'available'
                            ? 'bg-midnight-ink text-pure-canvas'
                            : 'bg-pure-canvas/90 text-slate border border-silver/80'
                        }`}
                      >
                        {item.tradeStatus === 'available' ? '🤝 Available to Trade' : '🔒 Vault Locked'}
                      </span>
                    </div>
                  </div>

                  {/* Info Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-1 text-[11px] font-semibold text-slate uppercase tracking-wider">
                        <span className="truncate">{item.toySeries || item.seriesOrSet}</span>
                        {isHW && (
                          <span className="text-[10px] text-amber-700 font-bold shrink-0">1:64 TOY</span>
                        )}
                      </div>
                      <Link href={`/collection/${item.id}`}>
                        <h3 className="font-semibold text-base text-midnight-ink group-hover:text-graphite transition-colors line-clamp-1 leading-snug">
                          {item.title}
                        </h3>
                      </Link>
                      {isHW ? (
                        <div className="text-[11px] text-slate space-y-0.5 pt-0.5">
                          {(item.packagingCondition || item.condition) && (
                            <p className="truncate font-medium text-midnight-ink/80">📦 {item.packagingCondition || item.condition}</p>
                          )}
                          {item.wheelType && (
                            <p className="truncate text-slate">🛞 {item.wheelType}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-slate line-clamp-1 font-normal">
                          {item.subtitle || item.condition}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-silver/60 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-medium text-slate uppercase tracking-wider block">
                          Fair Value
                        </span>
                        <span className="text-base font-bold text-midnight-ink font-display">
                          ₹{item.estimatedValue.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isOwner && (
                          <button
                            onClick={() => deleteCollectionItem(item.id)}
                            className="p-1.5 rounded-lg border border-silver text-slate hover:text-midnight-ink hover:bg-fog transition-colors"
                            title="Delete from Vault"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <Link
                          href={`/collection/${item.id}`}
                          className="px-3 py-1.5 bg-midnight-ink text-pure-canvas rounded-lg text-xs font-bold hover:bg-graphite transition-colors flex items-center gap-1"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-pure-canvas border border-silver rounded-2xl p-12 text-center shadow-card space-y-4">
            <div className="w-16 h-16 bg-sky-periwinkle rounded-full mx-auto flex items-center justify-center text-3xl">
              💎
            </div>
            <h3 className="text-2xl font-display font-bold text-midnight-ink">
              No collectibles found
            </h3>
            <p className="text-sm text-slate max-w-sm mx-auto font-normal">
              Add your rare die-cast cars or sports cards to start tracking their value and receiving trade offers.
            </p>
            <Button variant="primary" size="md" onClick={() => setAddItemModalOpen(true)}>
              + Add First Collectible
            </Button>
          </div>
        )}
      </div>

      {/* ADD ITEM MODAL */}
      <Modal
        isOpen={addItemModalOpen}
        onClose={() => setAddItemModalOpen(false)}
        title="Add Collectible to Vault"
        subtitle="Catalog rare die-cast cars or sports cards with realistic market valuation."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateItem} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-midnight-ink block mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-semibold text-midnight-ink cursor-pointer focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
              >
                <option value="hot-wheels">🏎️ Hot Wheels / 1:64 Die-Cast</option>
                <option value="football-cards">⚽ Football Card</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-midnight-ink block mb-1">
                Release Year
              </label>
              <input
                type="number"
                value={newYear}
                onChange={(e) => setNewYear(Number(e.target.value))}
                className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
              />
            </div>
          </div>

          {newCategory === 'hot-wheels' && (
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[11px] text-amber-950 font-medium">
              <span className="font-bold text-amber-900">Toy Collectible:</span> Enter 1:64 scale toy casting name, Mattel series, blister status, and wheel type.
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-midnight-ink block mb-1">
              {newCategory === 'hot-wheels' ? 'Casting Model Name *' : 'Card Title & Player Name *'}
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={newCategory === 'hot-wheels' ? "e.g. 1971 Datsun 240Z Super Treasure Hunt or Twin Mill" : "e.g. 2021 Panini Prizm Kylian Mbappé Silver Prizm"}
              className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20 focus:border-midnight-ink"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-midnight-ink block mb-1">
                {newCategory === 'hot-wheels' ? 'Toy Series / Line' : 'Card Set / Product'}
              </label>
              <input
                type="text"
                value={newSeries}
                onChange={(e) => setNewSeries(e.target.value)}
                placeholder={newCategory === 'hot-wheels' ? "e.g. Super Treasure Hunt ($TH) or RLC" : "e.g. Topps Chrome UEFA"}
                className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-midnight-ink block mb-1">
                Estimated Collector Value (₹)
              </label>
              <input
                type="number"
                value={newValue}
                onChange={(e) => setNewValue(Number(e.target.value))}
                className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
              />
            </div>
          </div>

          {newCategory === 'hot-wheels' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-midnight-ink block mb-1">
                  Packaging / Blister Status
                </label>
                <select
                  value={newPackagingCondition}
                  onChange={(e) => setNewPackagingCondition(e.target.value)}
                  className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink cursor-pointer focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                >
                  <option value="Mint on Card (MOC)">Mint on Card (MOC)</option>
                  <option value="Short Card MOC">Short Card MOC</option>
                  <option value="Card Creased / Soft Corners">Card Creased / Soft Corners</option>
                  <option value="Loose Mint">Loose Mint (Unplayed)</option>
                  <option value="Custom Modified 1:64">Custom Modified 1:64</option>
                  <option value="Sealed Factory Case">Sealed Factory Case</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-midnight-ink block mb-1">
                  Wheel / Tire Type
                </label>
                <input
                  type="text"
                  value={newWheelType}
                  onChange={(e) => setNewWheelType(e.target.value)}
                  placeholder="e.g. Real Riders Rubber Tires, Redlines"
                  className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-midnight-ink block mb-1">
                  Grading Service
                </label>
                <select
                  value={newGrading}
                  onChange={(e) => setNewGrading(e.target.value as any)}
                  className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-semibold text-midnight-ink cursor-pointer focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                >
                  <option value="None">None (Raw / Ungraded)</option>
                  <option value="PSA">PSA Certified</option>
                  <option value="BGS">Beckett (BGS)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-midnight-ink block mb-1">
                  Grade Score (if graded)
                </label>
                <input
                  type="text"
                  disabled={newGrading === 'None'}
                  value={newGradeScore}
                  onChange={(e) => setNewGradeScore(e.target.value)}
                  placeholder="10 / 9.5"
                  className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-midnight-ink block mb-1">
              Photo URL
            </label>
            <input
              type="url"
              value={newPhoto}
              onChange={(e) => setNewPhoto(e.target.value)}
              className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-fog/60 border border-silver rounded-lg">
            <div>
              <span className="text-xs font-semibold text-midnight-ink block">
                Open for Trade Offers
              </span>
              <span className="text-[11px] text-slate">
                Allow other collectors to propose trade exchanges for this item.
              </span>
            </div>
            <input
              type="checkbox"
              checked={newTradeStatus === 'available'}
              onChange={(e) => setNewTradeStatus(e.target.checked ? 'available' : 'not-for-trade')}
              className="w-4 h-4 accent-midnight-ink cursor-pointer"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="md" type="button" onClick={() => setAddItemModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Save to Vault
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
