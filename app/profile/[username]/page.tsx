'use client'

import React, { useState, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '../../../context/AppContext'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import { EventCard } from '../../../components/events/EventCard'
import {
  ShieldCheck,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  Edit3,
  Check,
  X,
  Ticket,
  ArrowRight,
  Flame,
  Award,
} from 'lucide-react'

function UserProfileContent() {
  const { username } = useParams()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') || 'overview'

  const { users, currentUser, events, collectionItems, registeredTickets, communityPosts, toggleFollowUser, updateCurrentUser, addToast } = useApp()

  const isOwnProfile = username === currentUser.username || username === 'shreyash'
  const user = isOwnProfile ? currentUser : users.find((u) => u.username === username) || users[1]

  const [activeTab, setActiveTab] = useState(initialTab)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(user.name)
  const [editBio, setEditBio] = useState(user.bio)
  const [editLocation, setEditLocation] = useState(user.location)

  // User collection highlights
  const userCollection = collectionItems.filter((i) => i.ownerUsername === user.username)
  const userPosts = communityPosts.filter((p) => p.authorUsername === user.username)
  const userHostedEvents = events.filter((e) => e.organizer.username === user.username)
  const attendedEvents = events.slice(0, user.stats.eventsAttended > 0 ? 3 : 0)

  const handleSaveProfile = () => {
    updateCurrentUser({
      name: editName,
      bio: editBio,
      location: editLocation,
    })
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-pure-canvas space-y-8 select-none pb-20">
      {/* 1. COVER BANNER with Party Pink Gradient Wash */}
      <div className="relative h-56 sm:h-72 w-full bg-silver/20 overflow-hidden border-b border-silver/50">
        <img
          src={user.coverImage}
          alt={user.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-party-pink/40 via-party-pink/20 to-black/40" />
        <div className="absolute top-4 right-4 bg-pure-canvas/95 backdrop-blur-md text-midnight-ink px-3.5 py-1 text-xs font-bold rounded-full border border-silver/70 shadow-sm flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-midnight-ink" />
          <span>Collector Since {user.collectorSince}</span>
        </div>
      </div>

      {/* 2. PROFILE HEADER & METRICS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 relative z-10 space-y-6">
        <div className="bg-pure-canvas border border-silver/50 rounded-2xl p-6 md:p-8 shadow-[rgba(0,0,0,0.06)_0px_2px_12px_0px] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Avatar & Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-pure-canvas shadow-md bg-silver/20 flex-shrink-0"
              />
              {user.verified && (
                <div className="absolute -bottom-1 -right-1 bg-pure-canvas text-rsvp-going p-1.5 rounded-full border border-silver/60 shadow-sm z-10">
                  <ShieldCheck className="w-4 h-4 text-rsvp-going" />
                </div>
              )}
            </div>

            <div className="space-y-2 flex-1">
              {!isEditing ? (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-midnight-ink tracking-tight">
                      {user.name}
                    </h1>
                    <span className="text-xs font-semibold text-slate bg-black/[0.04] px-2.5 py-0.5 rounded-full">
                      @{user.username}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate font-normal max-w-xl leading-relaxed">
                    {user.bio}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-semibold text-midnight-ink">
                    <MapPin className="w-3.5 h-3.5 text-slate" />
                    <span>{user.location}</span>
                  </div>
                </>
              ) : (
                <div className="space-y-2 w-full max-w-md">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-semibold text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                  />
                  <textarea
                    rows={2}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-normal text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                  />
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-semibold text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
                  />
                </div>
              )}

              {/* Interest Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {user.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-black/[0.04] border border-silver/50 text-[11px] font-bold text-midnight-ink rounded-full tracking-tight"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0">
            {isOwnProfile ? (
              !isEditing ? (
                <Button
                  variant="secondary"
                  size="md"
                  icon={<Edit3 className="w-4 h-4" />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleSaveProfile}>
                    Save Changes
                  </Button>
                </div>
              )
            ) : (
              <Button
                variant={user.isFollowing ? 'secondary' : 'primary'}
                size="md"
                onClick={() => toggleFollowUser(user.username)}
              >
                {user.isFollowing ? 'Following' : '+ Follow Collector'}
              </Button>
            )}
          </div>
        </div>

        {/* 3. STATS STRIP */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-center bg-pure-canvas border border-silver/50 rounded-2xl p-5 shadow-[rgba(0,0,0,0.04)_0px_2px_8px_0px]">
          <div className="space-y-0.5">
            <span className="text-[10px] font-semibold uppercase text-slate block tracking-wider">Vault Items</span>
            <span className="text-xl sm:text-2xl font-bold font-display text-midnight-ink tracking-tight">{user.stats.itemsCount}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-semibold uppercase text-slate block tracking-wider">Portfolio</span>
            <span className="text-xl sm:text-2xl font-bold font-display text-midnight-ink tracking-tight">
              ₹{(user.stats.portfolioValue / 1000).toFixed(0)}k
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-semibold uppercase text-slate block tracking-wider">Attended</span>
            <span className="text-xl sm:text-2xl font-bold font-display text-midnight-ink tracking-tight">{user.stats.eventsAttended}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-semibold uppercase text-slate block tracking-wider">Meets Hosted</span>
            <span className="text-xl sm:text-2xl font-bold font-display text-midnight-ink tracking-tight">{user.stats.eventsHosted}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-semibold uppercase text-slate block tracking-wider">Followers</span>
            <span className="text-xl sm:text-2xl font-bold font-display text-midnight-ink tracking-tight">{user.stats.followers}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-semibold uppercase text-slate block tracking-wider">Trades</span>
            <span className="text-xl sm:text-2xl font-bold font-display text-midnight-ink tracking-tight">{user.stats.tradesCompleted}</span>
          </div>
        </div>

        {/* 4. BADGE SHELF / ACHIEVEMENTS */}
        {user.badges && user.badges.length > 0 && (
          <div className="bg-pure-canvas border border-silver/50 rounded-2xl p-5 shadow-[rgba(0,0,0,0.04)_0px_2px_8px_0px] space-y-3">
            <span className="text-xs font-bold text-slate uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-midnight-ink" /> Collector Achievement Badges
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {user.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-3.5 bg-black/[0.02] border border-silver/50 rounded-xl flex items-center gap-3 hover:border-silver transition-colors"
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <h5 className="font-bold text-xs text-midnight-ink leading-tight">
                      {badge.title}
                    </h5>
                    <p className="text-[10px] text-slate leading-tight mt-0.5">
                      {badge.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. TABS BAR - Partiful Feature Tab Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-black/[0.05] border border-silver/40 p-1 rounded-full w-fit">
          {[
            { id: 'overview', label: 'Vault Highlights' },
            { id: 'attended', label: `Attended (${user.stats.eventsAttended})` },
            { id: 'hosted', label: `Hosted Meets (${userHostedEvents.length})` },
            { id: 'posts', label: `Discussions (${userPosts.length})` },
            ...(isOwnProfile ? [{ id: 'tickets', label: `My Tickets (${registeredTickets.length})` }] : []),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-pure-canvas text-midnight-ink shadow-[rgba(0,0,0,0.1)_0px_0px_6px_0px]'
                  : 'text-slate hover:text-midnight-ink hover:bg-black/[0.03]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 6. TAB CONTENT */}
        {/* TAB: VAULT HIGHLIGHTS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {userCollection.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userCollection.map((item) => (
                  <div
                    key={item.id}
                    className="bg-pure-canvas border border-silver/50 rounded-xl shadow-[rgba(0,0,0,0.06)_0px_2px_12px_0px] hover:shadow-[rgba(0,0,0,0.1)_0px_8px_24px_0px] hover:-translate-y-1 transition-all p-4 space-y-3"
                  >
                    <div className="relative h-48 w-full bg-silver/20 rounded-lg border border-silver/40 overflow-hidden">
                      <img src={item.photos[0]} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate block tracking-wider">
                        {item.seriesOrSet}
                      </span>
                      <Link href={`/collection/${item.id}`}>
                        <h4 className="font-bold text-base text-midnight-ink hover:text-midnight-blue transition-colors truncate tracking-tight">
                          {item.title}
                        </h4>
                      </Link>
                      <p className="text-xs text-slate">{item.condition}</p>
                    </div>
                    <div className="pt-2 border-t border-silver/40 flex items-center justify-between">
                      <span className="text-base font-bold font-display text-midnight-ink">
                        ₹{item.estimatedValue.toLocaleString('en-IN')}
                      </span>
                      <Link
                        href={`/collection/${item.id}`}
                        className="px-3.5 py-1.5 bg-midnight-ink text-pure-canvas text-xs font-bold rounded-lg hover:opacity-85 transition-opacity"
                      >
                        Inspect
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-pure-canvas border border-silver/50 rounded-2xl text-center text-xs font-medium text-slate">
                No items visible in this showcase.
              </div>
            )}
          </div>
        )}

        {/* TAB: TICKETS (Only for own profile) */}
        {activeTab === 'tickets' && isOwnProfile && (
          <div className="space-y-4">
            {registeredTickets.length > 0 ? (
              <div className="space-y-3">
                {registeredTickets.map((tkt) => (
                  <div
                    key={tkt.id}
                    className="bg-pure-canvas border border-silver/50 rounded-2xl p-5 shadow-[rgba(0,0,0,0.06)_0px_2px_12px_0px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img src={tkt.coverImage} alt={tkt.eventTitle} className="w-16 h-16 rounded-xl object-cover border border-silver/50" />
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate block tracking-wider">
                          Confirmed Event Voucher
                        </span>
                        <h4 className="font-display font-bold text-base sm:text-lg text-midnight-ink">
                          {tkt.eventTitle}
                        </h4>
                        <p className="text-xs text-slate mt-0.5">
                          {tkt.eventDate} · {tkt.venue}, {tkt.city}
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-silver/40 w-full sm:w-auto">
                      <span className="px-3 py-1 bg-black/[0.04] border border-silver/50 rounded-lg text-xs font-mono font-bold text-midnight-ink block sm:inline-block">
                        {tkt.ticketCode}
                      </span>
                      <p className="text-xs font-semibold text-slate mt-1.5">
                        {tkt.quantity}x {tkt.tierName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-pure-canvas border border-silver/50 rounded-2xl text-center text-xs font-medium text-slate">
                You have not registered for any events yet.
              </div>
            )}
          </div>
        )}

        {/* TAB: HOSTED MEETS */}
        {activeTab === 'hosted' && (
          <div className="space-y-6">
            {userHostedEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userHostedEvents.map((evt) => (
                  <EventCard key={evt.id} event={evt} />
                ))}
              </div>
            ) : (
              <div className="p-8 bg-pure-canvas border border-silver rounded-2xl text-center text-xs font-medium text-slate">
                No events hosted by this collector yet.
              </div>
            )}
          </div>
        )}

        {/* TAB: ATTENDED */}
        {activeTab === 'attended' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {attendedEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        )}

        {/* TAB: POSTS */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <div key={post.id} className="p-4 bg-pure-canvas border border-silver rounded-xl shadow-card space-y-2">
                  <Link href={`/community/${post.id}`}>
                    <h4 className="font-semibold text-base text-midnight-ink hover:text-graphite transition-colors">
                      {post.title}
                    </h4>
                  </Link>
                  <p className="text-xs text-slate line-clamp-2">{post.content}</p>
                </div>
              ))
            ) : (
              <div className="p-8 bg-pure-canvas border border-silver rounded-2xl text-center text-xs font-medium text-slate">
                No community discussions created yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function UserProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-pure-canvas pt-28 pb-16 flex items-center justify-center">
          <div className="text-xs font-bold text-slate animate-pulse uppercase tracking-wider">
            Loading Collector Profile...
          </div>
        </div>
      }
    >
      <UserProfileContent />
    </Suspense>
  )
}
