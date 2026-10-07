'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import { useApp } from '../../context/AppContext'
import { UserProfile } from '../../types'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { ImageWithFallback } from '../../components/ui/ImageWithFallback'
import {
  Sparkles,
  MapPin,
  Check,
  ChevronRight,
  ChevronLeft,
  Flame,
  Layers,
  ArrowRight,
  ShieldCheck,
  Car,
  Trophy,
  SlidersHorizontal,
} from 'lucide-react'

const PASSION_OPTIONS = [
  {
    id: 'Hot Wheels',
    title: 'Hot Wheels & 1:64 Die-Cast',
    desc: 'Mainlines, Super Treasure Hunts ($TH), Red Line Club (RLC), and premium car cultures.',
    icon: Car,
    category: 'hot-wheels',
    badge: 'Popular',
    badgeColor: 'magenta' as const,
  },
  {
    id: 'Football Cards',
    title: 'Football & Sports Trading Cards',
    desc: 'Panini Prizm, Topps Chrome, hobby box breaks, numbered refractors, and on-card autographs.',
    icon: Trophy,
    category: 'football-cards',
    badge: 'High Demand',
    badgeColor: 'category-cards' as const,
  },
  {
    id: 'Vintage Redlines',
    title: 'Vintage Redlines & Retro Eras',
    desc: 'Original 1968 Sweet 16 castings, spectraflame patinas, and vintage carded rarities.',
    icon: Flame,
    category: 'hot-wheels',
    badge: 'Grail Hunter',
    badgeColor: 'orange' as const,
  },
  {
    id: 'Graded Slabs',
    title: 'Graded Slabs & Authentication',
    desc: 'PSA 10 Gem Mint, BGS 9.5 True Gem, CGC pristine slabs, and expert verification.',
    icon: ShieldCheck,
    category: 'football-cards',
    badge: 'Investment',
    badgeColor: 'psa' as const,
  },
  {
    id: 'Custom Builds',
    title: 'Custom Die-Cast Modifications',
    desc: 'Hand-swapped real riders, resin widebody kits, airbrushed liveries, and 1/1 builds.',
    icon: SlidersHorizontal,
    category: 'hot-wheels',
    badge: 'Artisan',
    badgeColor: 'violet' as const,
  },
  {
    id: 'Trading & Swaps',
    title: 'In-Person Trading & Box Breaks',
    desc: 'Weekend swap meets, live pack rips, binder trades, and bilateral item-for-item trades.',
    icon: Layers,
    category: 'both',
    badge: 'Community',
    badgeColor: 'success' as const,
  },
]

const CITIES = [
  { name: 'Mumbai', state: 'Maharashtra', eventsCount: 12, collectors: '1,450+', active: true },
  { name: 'Delhi NCR', state: 'National Capital Region', eventsCount: 9, collectors: '1,120+', active: true },
  { name: 'Bengaluru', state: 'Karnataka', eventsCount: 8, collectors: '980+', active: true },
  { name: 'Pune', state: 'Maharashtra', eventsCount: 6, collectors: '620+', active: true },
  { name: 'Hyderabad', state: 'Telangana', eventsCount: 5, collectors: '540+', active: true },
  { name: 'Chennai', state: 'Tamil Nadu', eventsCount: 4, collectors: '410+', active: true },
  { name: 'Kolkata', state: 'West Bengal', eventsCount: 4, collectors: '380+', active: true },
  { name: 'Jaipur', state: 'Rajasthan', eventsCount: 3, collectors: '290+', active: true },
]

export default function OnboardingPage() {
  const router = useRouter()
  const {
    onboarding,
    updateOnboarding,
    updateCurrentUser,
    currentUser,
    users,
    toggleFollowUser,
    addToast,
  } = useApp()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    onboarding.interests.length > 0 ? onboarding.interests : ['Hot Wheels', 'Football Cards']
  )
  const [selectedCity, setSelectedCity] = useState<string>(
    onboarding.homeCity || 'Mumbai'
  )
  const [followedUsernames, setFollowedUsernames] = useState<string[]>(
    onboarding.followedCollectors.length > 0
      ? onboarding.followedCollectors
      : ['kabir_diecast', 'ananya_cards']
  )
  const [isFinishing, setIsFinishing] = useState(false)

  // Toggle interest
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      if (selectedInterests.length === 1) {
        addToast({
          type: 'info',
          title: 'Select at least one passion',
          message: 'Pick at least one collectible category to tailor your drops.',
        })
        return
      }
      setSelectedInterests(selectedInterests.filter((i) => i !== interest))
    } else {
      setSelectedInterests([...selectedInterests, interest])
    }
  }

  // Toggle follow
  const handleFollowToggle = (username: string) => {
    toggleFollowUser(username)
    if (followedUsernames.includes(username)) {
      setFollowedUsernames(followedUsernames.filter((u) => u !== username))
    } else {
      setFollowedUsernames([...followedUsernames, username])
    }
  }

  // Complete onboarding
  const handleComplete = () => {
    setIsFinishing(true)

    // Trigger confetti
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#31c431', '#f8c4ff', '#96c4ff', '#d9c58b', '#000000'],
      })
    } catch {
      // ignore
    }

    // Save preferences
    updateOnboarding({
      completed: true,
      interests: selectedInterests,
      homeCity: selectedCity,
      followedCollectors: followedUsernames,
    })

    // Update current user
    updateCurrentUser({
      location: `${selectedCity}, India`,
      interests: selectedInterests,
    })

    addToast({
      type: 'success',
      title: 'Welcome to CollectorEvents! ✨',
      message: `Your hub is calibrated for ${selectedCity} collectors.`,
    })

    setTimeout(() => {
      router.push('/')
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-pure-canvas pt-20 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Partiful Header Card */}
        <div className="bg-pure-canvas border border-silver/50 rounded-2xl p-6 sm:p-10 mb-8 shadow-[rgba(0,0,0,0.06)_0px_2px_12px_0px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-silver/40">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-party-pink/40 text-midnight-ink text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-midnight-blue" />
                <span>Collector Calibration</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-midnight-ink">
                Build Your Personal Hub
              </h1>
              <p className="text-slate text-sm mt-1 font-normal">
                Customize your drops, city alerts, and swap connections in under 60 seconds.
              </p>
            </div>

            {/* Step Counter */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="text-xs font-semibold text-slate uppercase">Step</span>
              <span className="text-sm font-bold text-midnight-ink bg-black/[0.05] rounded-full px-3 py-1">
                0{step} / 03
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-black/[0.06] h-1.5 mt-6 rounded-full overflow-hidden">
            <div
              className="bg-midnight-ink h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {/* Step Breadcrumbs */}
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <button
              onClick={() => setStep(1)}
              className={`text-xs font-semibold transition-colors ${
                step === 1 ? 'text-midnight-ink font-bold' : 'text-ash hover:text-midnight-ink'
              }`}
            >
              1. Passions
            </button>
            <button
              onClick={() => setStep(2)}
              className={`text-xs font-semibold transition-colors ${
                step === 2 ? 'text-midnight-ink font-bold' : 'text-ash hover:text-midnight-ink'
              }`}
            >
              2. Home City
            </button>
            <button
              onClick={() => setStep(3)}
              className={`text-xs font-semibold transition-colors ${
                step === 3 ? 'text-midnight-ink font-bold' : 'text-ash hover:text-midnight-ink'
              }`}
            >
              3. Top Curators
            </button>
          </div>
        </div>

        {/* STEP 1: Passions */}
        {step === 1 && (
          <div className="bg-pure-canvas border border-silver/50 rounded-2xl p-6 sm:p-8 shadow-[rgba(0,0,0,0.06)_0px_2px_12px_0px] space-y-6">
            <div className="border-b border-silver/40 pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-midnight-ink">
                1. What are your collector passions?
              </h2>
              <p className="text-slate text-xs sm:text-sm mt-1">
                Select everything you collect, trade, or build. We will tailor your feed and event alerts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PASSION_OPTIONS.map((item) => {
                const isSelected = selectedInterests.includes(item.id)
                const IconComponent = item.icon
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleInterest(item.id)}
                    className={`cursor-pointer rounded-xl border p-5 transition-all duration-150 relative ${
                      isSelected
                        ? 'border-midnight-ink bg-black/[0.02] shadow-sm'
                        : 'border-silver/60 bg-pure-canvas hover:border-silver'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isSelected ? 'bg-midnight-ink text-pure-canvas' : 'bg-black/[0.05] text-midnight-ink'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm sm:text-base text-midnight-ink leading-tight">
                            {item.title}
                          </h3>
                          <Badge variant={item.badgeColor} size="sm" className="mt-1">
                            {item.badge}
                          </Badge>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                          isSelected ? 'bg-midnight-ink text-pure-canvas border-midnight-ink' : 'border-silver bg-pure-canvas'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <p className="text-slate text-xs mt-3 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-silver/40">
              <span className="text-xs font-semibold text-slate">
                {selectedInterests.length} passions selected
              </span>
              <Button
                variant="primary"
                onClick={() => setStep(2)}
                className="gap-2"
              >
                <span>Continue to City</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Home City */}
        {step === 2 && (
          <div className="bg-pure-canvas border border-silver/50 rounded-2xl p-6 sm:p-8 shadow-[rgba(0,0,0,0.06)_0px_2px_12px_0px] space-y-6">
            <div className="border-b border-silver/40 pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-midnight-ink">
                2. Where is your hunting ground?
              </h2>
              <p className="text-slate text-xs sm:text-sm mt-1">
                Choose your primary region to unlock local swap meets, venue maps, and nearby collectors.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {CITIES.map((city) => {
                const isSelected = selectedCity === city.name
                return (
                  <div
                    key={city.name}
                    onClick={() => setSelectedCity(city.name)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all duration-150 flex flex-col justify-between ${
                      isSelected
                        ? 'border-midnight-ink bg-black/[0.02] shadow-sm'
                        : 'border-silver/60 bg-pure-canvas hover:border-silver'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-base text-midnight-ink">{city.name}</span>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                            isSelected ? 'bg-midnight-ink text-pure-canvas border-midnight-ink' : 'border-silver bg-pure-canvas'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                      <p className="text-xs text-slate">{city.state}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-silver/30 flex items-center justify-between text-xs">
                      <span className="text-midnight-ink font-bold">{city.eventsCount} Events</span>
                      <span className="text-ash">{city.collectors}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-silver/40">
              <Button
                variant="secondary"
                onClick={() => setStep(1)}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <Button
                variant="primary"
                onClick={() => setStep(3)}
                className="gap-2"
              >
                <span>Continue to Curators</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Top Curators */}
        {step === 3 && (
          <div className="bg-pure-canvas border border-silver/50 rounded-2xl p-6 sm:p-8 shadow-[rgba(0,0,0,0.06)_0px_2px_12px_0px] space-y-6">
            <div className="border-b border-silver/40 pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-midnight-ink">
                3. Follow Pillar Collectors & Organizers
              </h2>
              <p className="text-slate text-xs sm:text-sm mt-1">
                Stay updated when these collectors drop rare castings, submit grading slabs, or host swaps.
              </p>
            </div>

            <div className="space-y-3">
              {users
                .filter((u: UserProfile) => u.username !== 'shreyash' && u.username !== currentUser.username)
                .map((collector: UserProfile) => {
                  const isFollowing = followedUsernames.includes(collector.username)
                  return (
                    <div
                      key={collector.username}
                      className="border border-silver/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-pure-canvas hover:bg-black/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-12 h-12 rounded-full shrink-0 overflow-hidden bg-silver/20 border border-silver/50">
                          <ImageWithFallback
                            src={collector.avatar}
                            alt={collector.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm sm:text-base text-midnight-ink">
                              {collector.name}
                            </span>
                            {collector.verified && (
                              <Badge variant="success" size="sm">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-slate text-xs">
                            @{collector.username} · {collector.location}
                          </p>
                          <p className="text-graphite text-xs mt-1 line-clamp-1 max-w-md">
                            {collector.bio}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="text-xs text-ash hidden sm:inline">
                          {collector.stats.followers} followers
                        </span>
                        <Button
                          variant={isFollowing ? 'secondary' : 'primary'}
                          size="sm"
                          onClick={() => handleFollowToggle(collector.username)}
                        >
                          {isFollowing ? 'Following ✓' : '+ Follow'}
                        </Button>
                      </div>
                    </div>
                  )
                })}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-silver/40">
              <Button
                variant="secondary"
                onClick={() => setStep(2)}
                className="gap-2"
                disabled={isFinishing}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <Button
                variant="primary"
                onClick={handleComplete}
                className="gap-2"
                disabled={isFinishing}
              >
                {isFinishing ? (
                  <span>Entering CollectorEvents...</span>
                ) : (
                  <>
                    <span>Enter CollectorEvents</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Skip button footer */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-slate hover:text-midnight-ink font-medium underline underline-offset-4"
          >
            Skip for now & browse all events →
          </Link>
        </div>
      </div>
    </div>
  )
}
