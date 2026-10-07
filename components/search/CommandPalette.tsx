'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '../../context/AppContext'
import { Search, Calendar, User, ShieldCheck, MapPin, Tag, ArrowRight, X } from 'lucide-react'

export function CommandPalette() {
  const { isSearchOpen, setIsSearchOpen, events, users, collectionItems } = useApp()
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'events' | 'collectors' | 'items' | 'cities'>('all')
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Super Treasure Hunt',
    'Panini Prizm',
    'Mumbai',
    'Haaland Rookie',
  ])
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(!isSearchOpen)
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSearchOpen, setIsSearchOpen])

  const filteredResults = useMemo(() => {
    if (!query.trim()) return { events: [], users: [], items: [], cities: [] }

    const q = query.toLowerCase()

    const matchedEvents = events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q)) ||
        e.category.toLowerCase().includes(q)
    )

    const matchedUsers = users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.bio.toLowerCase().includes(q) ||
        u.interests.some((i) => i.toLowerCase().includes(q))
    )

    const matchedItems = collectionItems.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.seriesOrSet.toLowerCase().includes(q) ||
        i.condition.toLowerCase().includes(q) ||
        (i.rarityBadge && i.rarityBadge.toLowerCase().includes(q))
    )

    const popularCities = ['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Jaipur']
    const matchedCities = popularCities.filter((c) => c.toLowerCase().includes(q))

    return {
      events: matchedEvents,
      users: matchedUsers,
      items: matchedItems,
      cities: matchedCities,
    }
  }, [query, events, users, collectionItems])

  const handleSelect = (url: string, term?: string) => {
    if (term && !recentSearches.includes(term)) {
      setRecentSearches([term, ...recentSearches.slice(0, 4)])
    }
    setIsSearchOpen(false)
    setQuery('')
    router.push(url)
  }

  if (!isSearchOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-midnight-ink/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Palette Container */}
      <div className="relative z-10 w-full max-w-2xl bg-pure-canvas border border-silver rounded-2xl shadow-modal overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-silver/60 bg-pure-canvas">
          <Search className="w-5 h-5 text-slate mr-3 flex-shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, cities, collectors, cars, PSA cards... (Esc to close)"
            className="w-full bg-transparent text-midnight-ink font-semibold placeholder:text-slate text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate hover:text-midnight-ink p-1 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold bg-fog border border-silver rounded text-slate">
            ESC
          </kbd>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-fog/50 border-b border-silver/60 overflow-x-auto text-xs">
          {(['all', 'events', 'collectors', 'items', 'cities'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full transition-all text-xs font-semibold capitalize whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-midnight-ink text-pure-canvas shadow-sm'
                  : 'text-slate hover:text-midnight-ink hover:bg-pure-canvas'
              }`}
            >
              {tab === 'all'
                ? 'All Results'
                : tab === 'events'
                ? `Events (${filteredResults.events.length})`
                : tab === 'collectors'
                ? `Collectors (${filteredResults.users.length})`
                : tab === 'items'
                ? `Vault (${filteredResults.items.length})`
                : 'Cities'}
            </button>
          ))}
        </div>

        {/* Body / Results */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {!query.trim() ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase text-slate tracking-wider mb-2">
                  Recent & Trending Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1 bg-fog/70 border border-silver rounded-full text-xs font-medium text-midnight-ink hover:bg-midnight-ink hover:text-pure-canvas transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate tracking-wider mb-2">
                  Browse by City
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Hyderabad', 'Chennai'].map((city) => (
                    <button
                      key={city}
                      onClick={() => handleSelect(`/events?city=${city}`, city)}
                      className="p-2.5 border border-silver rounded-xl bg-pure-canvas hover:bg-fog text-left font-semibold text-xs transition-colors flex items-center justify-between group"
                    >
                      <span className="text-midnight-ink">{city}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate group-hover:text-midnight-ink" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* No results notice */}
              {filteredResults.events.length === 0 &&
                filteredResults.users.length === 0 &&
                filteredResults.items.length === 0 &&
                filteredResults.cities.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-midnight-ink font-semibold text-sm">No matches found for &quot;{query}&quot;</p>
                    <p className="text-slate text-xs mt-1">Try searching for &quot;Hot Wheels&quot;, &quot;Panini&quot;, &quot;Mumbai&quot;, or &quot;Haaland&quot;.</p>
                  </div>
                )}

              {/* Events Section */}
              {(activeTab === 'all' || activeTab === 'events') &&
                filteredResults.events.length > 0 && (
                  <div>
                    <h5 className="text-xs font-semibold uppercase text-slate tracking-wider mb-2 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Events ({filteredResults.events.length})
                    </h5>
                    <div className="space-y-1.5">
                      {filteredResults.events.slice(0, 4).map((evt) => (
                        <div
                          key={evt.id}
                          onClick={() => handleSelect(`/events/${evt.id}`, evt.title)}
                          className="p-2.5 rounded-xl border border-silver hover:border-midnight-ink bg-pure-canvas hover:bg-fog/50 cursor-pointer transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-1.5 h-7 rounded-full ${
                                evt.category === 'hot-wheels'
                                  ? 'bg-party-pink'
                                  : 'bg-sky-periwinkle'
                              }`}
                            />
                            <div>
                              <p className="font-semibold text-xs text-midnight-ink group-hover:text-graphite transition-colors line-clamp-1">
                                {evt.title}
                              </p>
                              <p className="text-[11px] text-slate">
                                {evt.city} · {evt.date} · {evt.priceMin === 0 ? 'Free' : `₹${evt.priceMin}`}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate group-hover:text-midnight-ink transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Collectors Section */}
              {(activeTab === 'all' || activeTab === 'collectors') &&
                filteredResults.users.length > 0 && (
                  <div>
                    <h5 className="text-xs font-semibold uppercase text-slate tracking-wider mb-2 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Collectors & Organizers ({filteredResults.users.length})
                    </h5>
                    <div className="space-y-1.5">
                      {filteredResults.users.slice(0, 3).map((u) => (
                        <div
                          key={u.id}
                          onClick={() => handleSelect(`/profile/${u.username}`, u.name)}
                          className="p-2.5 rounded-xl border border-silver hover:border-midnight-ink bg-pure-canvas hover:bg-fog/50 cursor-pointer transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-8 h-8 rounded-full border border-silver object-cover"
                            />
                            <div>
                              <p className="font-semibold text-xs text-midnight-ink group-hover:text-graphite transition-colors flex items-center gap-1.5">
                                {u.name}
                                {u.verified && <ShieldCheck className="w-3.5 h-3.5 text-spearmint" />}
                              </p>
                              <p className="text-[11px] text-slate">
                                @{u.username} · {u.location} · {u.stats.itemsCount} vault items
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate group-hover:text-midnight-ink transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Vault Items Section */}
              {(activeTab === 'all' || activeTab === 'items') &&
                filteredResults.items.length > 0 && (
                  <div>
                    <h5 className="text-xs font-semibold uppercase text-slate tracking-wider mb-2 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" /> Collection Items ({filteredResults.items.length})
                    </h5>
                    <div className="space-y-1.5">
                      {filteredResults.items.slice(0, 4).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelect(`/collection/${item.id}`, item.title)}
                          className="p-2.5 rounded-xl border border-silver hover:border-midnight-ink bg-pure-canvas hover:bg-fog/50 cursor-pointer transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.photos[0]}
                              alt={item.title}
                              className="w-9 h-9 rounded-lg object-cover border border-silver"
                            />
                            <div>
                              <p className="font-semibold text-xs text-midnight-ink group-hover:text-graphite transition-colors line-clamp-1">
                                {item.title}
                              </p>
                              <p className="text-[11px] text-slate">
                                {item.condition} · ₹{item.estimatedValue.toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate group-hover:text-midnight-ink transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Cities Section */}
              {(activeTab === 'all' || activeTab === 'cities') &&
                filteredResults.cities.length > 0 && (
                  <div>
                    <h5 className="text-xs font-semibold uppercase text-slate tracking-wider mb-2 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Cities ({filteredResults.cities.length})
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {filteredResults.cities.map((city) => (
                        <button
                          key={city}
                          onClick={() => handleSelect(`/events?city=${city}`, city)}
                          className="px-3 py-1.5 border border-silver rounded-full bg-pure-canvas hover:bg-midnight-ink hover:text-pure-canvas font-semibold text-xs transition-colors"
                        >
                          {city} Events →
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-fog/50 border-t border-silver/60 flex items-center justify-between text-[11px] text-slate">
          <span>Navigate with mouse or arrow keys</span>
          <span>CollectorEvents Discovery Network</span>
        </div>
      </div>
    </div>
  )
}
