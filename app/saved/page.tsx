'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useApp } from '../../context/AppContext'
import { EventCard } from '../../components/events/EventCard'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Bookmark, Compass, RotateCcw } from 'lucide-react'

export default function SavedEventsPage() {
  const { events, savedEventIds } = useApp()

  const [categoryFilter, setCategoryFilter] = useState<'all' | 'hot-wheels' | 'football-cards'>('all')

  const savedEvents = useMemo(() => {
    return events.filter((e) => {
      if (!savedEventIds.includes(e.id)) return false
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false
      return true
    })
  }, [events, savedEventIds, categoryFilter])

  return (
    <div className="min-h-screen bg-pure-canvas pb-20 select-none">
      {/* Header with Sky Periwinkle Wash */}
      <div className="bg-sky-periwinkle border-b border-silver/80 pt-10 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="soft-pink" size="sm">
              Saved Meets
            </Badge>
            <span className="text-xs font-semibold text-slate">
              {savedEvents.length} Bookmarked
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-midnight-ink">
            Saved Meets & Watchlist
          </h1>
          <p className="text-sm text-slate mt-1 font-normal max-w-xl">
            Quickly access the die-cast meets and card expos you plan to attend or monitor for lot drops.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Filter Options */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
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

          <Link
            href="/events"
            className="text-xs font-bold text-midnight-ink hover:underline"
          >
            Browse All Community Events →
          </Link>
        </div>

        {/* Saved Events Grid */}
        {savedEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        ) : (
          <div className="bg-pure-canvas border border-silver rounded-2xl p-12 text-center shadow-card space-y-4">
            <div className="w-16 h-16 bg-sky-periwinkle rounded-full mx-auto flex items-center justify-center text-3xl">
              🔖
            </div>
            <h3 className="text-2xl font-display font-bold text-midnight-ink">
              No saved meets yet
            </h3>
            <p className="text-sm text-slate max-w-sm mx-auto font-normal">
              Click the bookmark icon on any meetup card across the platform to save it to your personal itinerary.
            </p>
            <Link href="/events">
              <Button variant="primary" size="md">
                Explore Collector Meets
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
