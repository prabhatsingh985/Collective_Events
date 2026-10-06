import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import {
  Flame,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Package,
  Layers,
  Zap,
  Star,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react'

import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'
import { StoreMobileNav } from '@/components/store/StoreMobileNav'
import { StoreSearchModal } from '@/components/store/StoreSearchModal'
import { ProductCard } from '@/components/store/ProductCard'
import { CountdownTimer } from '@/components/store/CountdownTimer'
import { PackOpeningTeaser } from '@/components/store/PackOpeningTeaser'
import {
  getFeaturedProducts,
  getNewArrivals,
  getTreasureHunts,
  getSealedCards,
  getSingleCards,
  getGradedCards,
  getBackInStock,
  getSupplies,
} from '@/lib/api/products'
import { getActiveDrop, getDrops } from '@/lib/api/drops'
import { RecentlyViewedShelf } from './RecentlyViewedShelf'

export const metadata: Metadata = {
  title: 'Collector Store | Hot Wheels Die-Cast & Trading Cards India',
  description:
    'India’s verified online store for authentic 1:64 die-cast toy cars (Hot Wheels Super Treasure Hunts, RLC, Car Culture) and sports trading cards (Panini Prizm, Topps Chrome, PSA slabs). Fast BlueDart Air express shipping.',
  openGraph: {
    title: 'CrateMeet Collector Store — Hot Wheels & Sports Cards Vault',
    description: 'Shop verified Super Treasure Hunts, factory-sealed hobby wax, and PSA/BGS slabs.',
    images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'],
  },
}

export default async function ShopHomePage() {
  const [
    featuredProducts,
    newArrivals,
    treasureHunts,
    sealedPacks,
    singleCards,
    gradedSlabs,
    backInStock,
    supplies,
    activeDrop,
    allDrops,
  ] = await Promise.all([
    getFeaturedProducts(8),
    getNewArrivals(8),
    getTreasureHunts(),
    getSealedCards(),
    getSingleCards(),
    getGradedCards(),
    getBackInStock(6),
    getSupplies(4),
    getActiveDrop(),
    getDrops(),
  ])

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans selection:bg-hw-orange selection:text-white">
      {/* Navigation & Overlays */}
      <StoreNavbar />
      <StoreSearchModal />

      {/* Main Content */}
      <main className="flex-1 pb-16 lg:pb-0">
        {/* ============================================================ */}
        {/* 1. HERO SECTION: DUAL-LANE ENTRY PATHS                       */}
        {/* ============================================================ */}
        <section className="relative overflow-hidden border-b border-zinc-800 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black">
          {/* Subtle Ambient Glows */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-hw-orange/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-10 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
            {/* Top Tagline Pill */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-zinc-300">India’s Premier Die-Cast & Sports Card Marketplace</span>
                <span className="text-zinc-600">|</span>
                <span className="text-hw-yellow font-mono">100% Collector Verified</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                CHASE THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-hw-orange via-hw-yellow to-amber-400">GRAIL</span>.{' '}
                <br className="hidden sm:inline" />
                RIP THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400">WAX</span>.
              </h1>
              <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Authentic factory-unpunched Hot Wheels Super $THs, numbered RLC castings, sealed Panini Prizm hobby boxes, and gem mint football rookie slabs. All with armored packaging and express BlueDart Air dispatch.
              </p>
            </div>

            {/* Split Dual-Lane Entry Cards & Interactive Pack Teaser */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Lane A: Hot Wheels Paddock (5 cols) */}
              <div className="lg:col-span-4 relative rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 to-black border-2 border-orange-500/30 hover:border-orange-500/80 transition-all duration-300 group shadow-2xl flex flex-col justify-between p-6">
                <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
                
                {/* Background Car Silhouette / Motif */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-hw-orange text-white shadow-lg flex items-center gap-1">
                      <Flame className="w-3 h-3 text-hw-yellow fill-hw-yellow" />
                      <span>DIE-CAST SPEEDWAY</span>
                    </span>
                    <span className="font-mono text-xs font-bold text-zinc-400">1:64 SCALE</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase group-hover:text-hw-orange transition-colors">
                    Hot Wheels & Die-Cast
                  </h2>

                  <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                    Super Treasure Hunts, Red Line Club Exclusives, Car Culture Real Riders, and factory-fresh case mainlines.
                  </p>

                  {/* Highlights tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-300">Super $TH</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-300">RLC Exclusives</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-300">Boulevard</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-300">Protector Clamshells</span>
                  </div>
                </div>

                <div className="relative z-10 mt-8 pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <Link
                    href="/shop/hot-wheels"
                    className="w-full py-2.5 px-4 rounded-xl bg-hw-orange hover:bg-orange-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-transform group-hover:scale-[1.02]"
                  >
                    <span>Enter Hot Wheels Paddock</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Center: Interactive Pack-Opening Teaser (4 cols) */}
              <div className="lg:col-span-4 flex items-center justify-center">
                <PackOpeningTeaser />
              </div>

              {/* Lane B: Sports Cards Stadium Vault (4 cols) */}
              <div className="lg:col-span-4 relative rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 to-black border-2 border-emerald-500/30 hover:border-emerald-500/80 transition-all duration-300 group shadow-2xl flex flex-col justify-between p-6">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-600/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-600 text-white shadow-lg flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-yellow-300" />
                      <span>THE CARDS VAULT</span>
                    </span>
                    <span className="font-mono text-xs font-bold text-zinc-400">PANINI & TOPPS</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase group-hover:text-emerald-400 transition-colors">
                    Sports Trading Cards
                  </h2>

                  <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                    Sealed hobby wax, Panini Prizm blasters, on-card certified autos, and PSA 10 / BGS 9.5 gem rookie slabs.
                  </p>

                  {/* Highlights tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-300">Prizm Wax</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-300">Topps Chrome UCL</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-300">PSA 10 Slabs</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-300">One-Touch Cases</span>
                  </div>
                </div>

                <div className="relative z-10 mt-8 pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <Link
                    href="/shop/cards"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-transform group-hover:scale-[1.02]"
                  >
                    <span>Enter Sports Cards Vault</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 2. LIVE NEXT DROP COUNTDOWN BANNER                           */}
        {/* ============================================================ */}
        {activeDrop && (
          <section className="bg-gradient-to-r from-red-950 via-zinc-900 to-red-950 border-y border-red-900/60 py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-hw-flame/20 border border-hw-flame/40 flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-hw-flame animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.2 rounded text-[10px] font-black uppercase tracking-wider bg-hw-flame text-white">
                      LIVE DROP
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">Limit {activeDrop.maxPerCustomer} Per Customer</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white mt-1">
                    {activeDrop.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-1 max-w-xl">
                    {activeDrop.tagline}
                  </p>
                </div>
              </div>

              {/* Stock Bar & Countdown */}
              <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
                <div className="flex flex-col gap-1 w-full sm:w-48">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-400">Remaining:</span>
                    <span className="font-bold text-hw-yellow">
                      {activeDrop.remainingStock} of {activeDrop.totalStock} left
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-hw-orange h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.round((activeDrop.remainingStock / activeDrop.totalStock) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <CountdownTimer
                  targetDate={activeDrop.endsAt}
                  label="Drop Closes In"
                />

                <Link
                  href="/shop/drops"
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 transition-transform hover:scale-105"
                >
                  <span>Shop Drop</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* 3. SHELF: TREASURE HUNT & SUPER $TH SHOWCASE                  */}
        {/* ============================================================ */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 text-hw-orange text-xs font-bold uppercase tracking-wider mb-1">
                <Flame className="w-4 h-4 fill-hw-orange" />
                <span>The Holy Grails</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Super Treasure Hunts & RLC Exclusives
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Real Riders rubber tires, Spectraflame automotive paint, and unpunched mint blister cards.
              </p>
            </div>

            <Link
              href="/shop/hot-wheels?series=Super+Treasure+Hunt+($TH)"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-hw-orange hover:text-orange-400 transition-colors"
            >
              <span>View All Treasure Hunts</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {treasureHunts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. SHELF: HOT FOOTBALL & SPORTS CARDS (SINGLES & SLABS)      */}
        {/* ============================================================ */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-850">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>On-Card Autos & Gem Slabs</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Hot Football Singles & Graded Rookies
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Authentic PSA 10 & BGS 9.5 slabs, Panini Downtown inserts, and numbered UEFA Champions League cards.
              </p>
            </div>

            <Link
              href="/shop/cards"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>View All Sports Cards</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...singleCards, ...gradedSlabs].slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. SHELF: SEALED BOXES & HOBBY PACKS                        */}
        {/* ============================================================ */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-850">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Package className="w-4 h-4 text-blue-400" />
                <span>Zero Reseals • Panini Hologram Intact</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Factory Sealed Wax & Blasters
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Panini Prizm, Donruss Optic, and Topps Chrome boxes ready for your next big personal box break.
              </p>
            </div>

            <Link
              href="/shop/sealed"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>Explore Sealed Wax</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {sealedPacks.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 6. SHELF: NEW ARRIVALS & RESTOCKS                           */}
        {/* ============================================================ */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-850">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>Fresh from the Vault</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                New Arrivals
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Newly cataloged castings, graded rookie cards, and restocked supplies.
              </p>
            </div>

            <Link
              href="/shop?sortBy=newest"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>Explore All New Arrivals</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 7. SHELF: PROTECTIVE COLLECTOR SUPPLIES                      */}
        {/* ============================================================ */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-850">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4 text-zinc-300" />
                <span>Armored Storage Solutions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Collector Supplies & Blister Cases
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Acid-free PET clamshell cases for Hot Wheels cards and 35pt magnetic one-touch card slabs.
              </p>
            </div>

            <Link
              href="/shop/supplies"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-300 hover:text-white transition-colors"
            >
              <span>Shop All Supplies</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {supplies.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 8. SHOP BY SERIES & LEAGUE TILES                            */}
        {/* ============================================================ */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-850">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Explore by Series & League
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Direct access to collector favorite castings and world football competitions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { title: 'Super $TH', href: '/shop/hot-wheels?series=Super+Treasure+Hunt+($TH)', badge: 'Die-Cast', count: 'Rare' },
              { title: 'RLC Club', href: '/shop/hot-wheels?series=Red+Line+Club+(RLC)', badge: 'Mattel', count: 'Exclusive' },
              { title: 'Car Culture', href: '/shop/hot-wheels?series=Car+Culture+Premium', badge: 'Real Riders', count: 'Premium' },
              { title: 'Premier League', href: '/shop/cards?league=Premier+League', badge: 'Soccer', count: 'Cards' },
              { title: 'Champions League', href: '/shop/cards?league=UEFA+Champions+League', badge: 'Topps', count: 'Cards' },
              { title: 'PSA 10 Slabs', href: '/shop/graded', badge: 'Gem Mint', count: 'Graded' },
            ].map((cat, i) => (
              <Link
                key={i}
                href={cat.href}
                className="group p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-center flex flex-col justify-between hover:bg-zinc-850 transition-all duration-200"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400 group-hover:text-hw-orange">
                    {cat.badge}
                  </span>
                  <h4 className="font-extrabold text-sm text-white mt-1 group-hover:text-white">
                    {cat.title}
                  </h4>
                </div>
                <span className="text-[11px] font-medium text-zinc-400 mt-3 group-hover:text-zinc-300">
                  Browse {cat.count} →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 9. RECENTLY VIEWED SHELF (HYDRATED FROM LOCAL STORAGE)       */}
        {/* ============================================================ */}
        <RecentlyViewedShelf />

        {/* ============================================================ */}
        {/* 10. DROP NOTIFICATION SIGNUP CTA                            */}
        {/* ============================================================ */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-950 via-zinc-900 to-indigo-950 border border-zinc-800 p-8 sm:p-12 text-center shadow-2xl">
            <div className="max-w-2xl mx-auto">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-hw-orange text-white inline-block mb-3 shadow">
                VIP Collector List
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Never Miss a High-Demand Drop
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Super Treasure Hunts and Panini Prizm hobby boxes sell out in under 3 minutes. Receive instant SMS & email priority notifications 15 minutes before public drop launch.
              </p>

              <form className="mt-6 flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your collector email"
                  className="flex-1 px-4 py-3 rounded-xl bg-zinc-950/80 border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-hw-orange"
                />
                <button
                  type="button"
                  className="px-6 py-3 rounded-xl bg-hw-orange hover:bg-orange-600 text-white font-extrabold text-sm transition-transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  Join Drop List
                </button>
              </form>

              <div className="mt-4 flex items-center justify-center gap-6 text-[11px] text-zinc-400">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  Zero Spam
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  Instant SMS Drop Link
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  Early Cart Access
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer & Mobile Navigation */}
      <StoreFooter />
      <StoreMobileNav />
    </div>
  )
}
