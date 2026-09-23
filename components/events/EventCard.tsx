'use client'

import React from 'react'
import Link from 'next/link'
import { EventItem } from '@/types'
import { useApp } from '@/context/AppContext'
import { Badge } from '@/components/ui/Badge'
import { ImageWithFallback } from '@/components/ui/ImageWithFallback'
import { Calendar, MapPin, Bookmark, Users, ShieldCheck, Flame, ArrowUpRight } from 'lucide-react'

interface EventCardProps {
  event: EventItem
  viewMode?: 'grid' | 'list'
  showPackReveal?: boolean
}

export function EventCard({ event, viewMode = 'grid', showPackReveal = false }: EventCardProps) {
  const { isEventSaved, toggleSaveEvent } = useApp()
  const saved = isEventSaved(event.id)

  const isHotWheels = event.category === 'hot-wheels' || event.category === 'die-cast'
  const isFree = event.priceMin === 0

  if (viewMode === 'list') {
    return (
      <div className="group relative bg-pure-canvas rounded-xl border border-silver/50 p-4 shadow-[rgba(0,0,0,0.08)_0px_2px_8px_0px] hover:shadow-[rgba(0,0,0,0.12)_0px_8px_24px_0px] hover:-translate-y-0.5 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left Side: Thumbnail & Core info */}
        <div className="flex items-start sm:items-center gap-4 flex-1">
          <Link href={`/events/${event.id}`} className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl overflow-hidden bg-silver/20 border border-silver/40">
            <ImageWithFallback
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={isHotWheels ? 'category-hw' : 'category-cards'} size="sm">
                {event.category.replace('-', ' ')}
              </Badge>
              <span className="text-xs font-semibold text-slate tracking-tight capitalize">
                {event.eventType.replace('-', ' ')}
              </span>
            </div>

            <Link href={`/events/${event.id}`}>
              <h3 className="font-bold text-base sm:text-lg text-midnight-ink group-hover:text-midnight-blue transition-colors line-clamp-1">
                {event.title}
              </h3>
            </Link>

            <div className="flex flex-wrap items-center gap-3 text-xs text-graphite font-medium">
              <span className="flex items-center gap-1.5 text-slate">
                <Calendar className="w-3.5 h-3.5 text-midnight-ink" />
                {event.date} · {event.startTime}
              </span>
              <span className="flex items-center gap-1.5 text-slate">
                <MapPin className="w-3.5 h-3.5 text-midnight-ink" />
                {event.city} ({event.venue})
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Price & Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-silver/30">
          <div className="text-left sm:text-right">
            <p className="text-[11px] font-semibold text-ash">Admission</p>
            <p className="text-sm font-bold text-midnight-ink">
              {isFree ? (
                <span className="text-rsvp-going">Free RSVP</span>
              ) : (
                `₹${event.priceMin}${event.priceMax > event.priceMin ? ` - ₹${event.priceMax}` : ''}`
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveEvent(event.id)}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                saved
                  ? 'bg-midnight-ink text-pure-canvas border-midnight-ink'
                  : 'bg-pure-canvas text-graphite border-silver/70 hover:border-midnight-ink'
              }`}
              title={saved ? 'Remove from Saved' : 'Save Event'}
            >
              <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
            </button>

            <Link
              href={`/events/${event.id}`}
              className="px-4 py-2 bg-midnight-ink text-pure-canvas text-xs font-bold rounded-[8px] hover:opacity-85 transition-opacity flex items-center gap-1"
            >
              <span>View</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`group relative bg-pure-canvas rounded-xl border border-silver/50 shadow-[rgba(0,0,0,0.06)_0px_2px_12px_0px] hover:shadow-[rgba(0,0,0,0.12)_0px_12px_28px_0px] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden ${
        showPackReveal ? 'animate-pack-reveal' : ''
      }`}
    >
      {/* Top Banner Image with Partiful Soft Radius */}
      <div className="relative h-48 sm:h-52 w-full bg-silver/20 overflow-hidden">
        <ImageWithFallback
          src={event.coverImage}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges & Save Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
          <Badge
            variant={isHotWheels ? 'category-diecast' : 'category-cards'}
            size="sm"
            icon={isHotWheels ? <Flame className="w-3 h-3 text-orange-600" /> : undefined}
          >
            {isHotWheels ? 'Die-Cast' : 'Trading Cards'}
          </Badge>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {event.isFeatured && (
              <span className="px-2.5 py-0.5 bg-pure-canvas text-midnight-ink text-[11px] font-bold rounded-full shadow-sm border border-silver/60">
                ✨ Featured
              </span>
            )}
            <button
              onClick={() => toggleSaveEvent(event.id)}
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                saved
                  ? 'bg-midnight-ink text-pure-canvas shadow-md'
                  : 'bg-pure-canvas/90 text-midnight-ink hover:bg-pure-canvas shadow-sm'
              }`}
              title={saved ? 'Saved' : 'Save Event'}
            >
              <Bookmark className="w-3.5 h-3.5" fill={saved ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Admission Pill in bottom corner */}
        <div className="absolute bottom-2.5 left-3">
          <span className="px-3 py-1 bg-midnight-ink/90 text-pure-canvas text-xs font-bold rounded-full backdrop-blur-md shadow-sm">
            {isFree ? 'Free RSVP' : `From ₹${event.priceMin}`}
          </span>
        </div>
      </div>

      {/* Card Content with Editorial Hierarchy */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Date & Location Line */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate">
            <span className="flex items-center gap-1.5 text-midnight-ink">
              <Calendar className="w-3.5 h-3.5 text-slate" />
              {event.date}
            </span>
            <span className="flex items-center gap-1 text-slate">
              <MapPin className="w-3.5 h-3.5 text-slate" />
              {event.city}
            </span>
          </div>

          {/* Event Title */}
          <Link href={`/events/${event.id}`}>
            <h3 className="font-bold text-lg text-midnight-ink group-hover:text-midnight-blue transition-colors line-clamp-2 leading-snug tracking-tight">
              {event.title}
            </h3>
          </Link>

          {/* Tagline / Subtitle */}
          <p className="text-xs text-slate line-clamp-2 leading-relaxed font-normal">
            {event.tagline}
          </p>
        </div>

        {/* Footer: Organizer + Overlapping Guest Avatars with +N pill */}
        <div className="pt-3 border-t border-silver/40 flex items-center justify-between gap-2">
          <Link
            href={`/profile/${event.organizer.username}`}
            className="flex items-center gap-2 group/org min-w-0"
          >
            <img
              src={event.organizer.avatar}
              alt={event.organizer.name}
              className="w-7 h-7 rounded-full object-cover border border-silver/60 flex-shrink-0"
            />
            <span className="text-xs font-bold text-graphite truncate group-hover/org:text-midnight-ink flex items-center gap-1">
              {event.organizer.name}
              {event.organizer.verified && (
                <ShieldCheck className="w-3.5 h-3.5 text-rsvp-going flex-shrink-0" />
              )}
            </span>
          </Link>

          {/* Partiful Overlapping Guest Avatar Pile */}
          <div className="flex items-center -space-x-1.5 flex-shrink-0">
            <img
              src="/avatars/shreyash.jpg"
              alt="Attendee"
              className="w-5 h-5 rounded-full border border-pure-canvas object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
              alt="Attendee"
              className="w-5 h-5 rounded-full border border-pure-canvas object-cover"
            />
            <div className="px-1.5 py-0.5 rounded-full bg-black/[0.08] text-[10px] font-bold text-midnight-ink border border-pure-canvas">
              +{event.attendeesCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
