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
  title: 'Collector Store | Hot Wheels Die-Cast & Trading Cards India | CrateMeet',
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
    <div className="min-h-screen bg-pure-canvas text-midnight-ink flex flex-col font-sans selection:bg-party-pink selection:text-midnight-ink">
      {/* Store Category & Status Sub-Nav Ribbon */}
      <StoreNavbar />

      {/* Main Content */}
      <main className="flex-1 pb-16">
        {/* ============================================================ */}
        {/* 1. HERO SECTION: DUAL-LANE ENTRY PATHS                       */}
        {/* ============================================================ */}
        <section className="relative overflow-hidden border-b border-silver/40 bg-gradient-to-b from-white via-fog/10 to-pure-canvas py-10 lg:py-16">
          {/* Subtle Ambient Glows */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-party-pink/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-10 right-1/4 w-96 h-96 bg-sky-periwinkle/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            {/* Top Tagline Pill */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pure-canvas border border-silver/60 text-xs font-semibold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-midnight-ink font-bold">India’s Premier Die-Cast & Sports Card Marketplace</span>
                <span className="text-silver">|</span>
                <span className="text-slate">Tamper-Proof Panini Seals & Mattel MOC Guarantee</span>
              </div>
            </div>

            {/* Headline & Description */}
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-midnight-ink tracking-tight font-display leading-[1.1]">
                Scattered invites. Real tables.{' '}
                <span className="underline decoration-party-pink decoration-wavy decoration-2">
                  Unboxed grails.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate leading-relaxed">
                From mint unpunched 1971 Datsun Super Treasure Hunts to Gem Mint Bellingham rookies in PSA 10 slabs.
                Verified vault inventory dispatched nationwide with armored clamshell packaging.
              </p>
            </div>

            {/* DUAL-LANE HERO CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {/* Lane 1: Hot Wheels Die-Cast (1:64 Scale) */}
              <Link
                href="/shop/hot-wheels"
                className="group relative overflow-hidden rounded-3xl bg-pure-canvas border border-silver/70 p-6 sm:p-8 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-44 h-44 bg-orange-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-orange-600 text-pure-canvas shadow-sm flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 fill-pure-canvas" />
                      <span>1:64 Scale Die-Cast</span>
                    </span>
                    <span className="text-xs font-bold text-slate flex items-center gap-1 group-hover:text-midnight-ink transition-colors">
                      <span>Explore 12 Castings</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-midnight-ink tracking-tight leading-tight mb-2">
                    Hot Wheels & Die-Cast Speedway
                  </h3>
                  <p className="text-xs sm:text-sm text-slate mb-6 leading-relaxed">
                    Super Treasure Hunts ($TH), Red Line Club (RLC) Chrome grails, Car Culture Real Riders with rubber tires, and factory unpunched blister cards.
                  </p>
                </div>

                {/* Visual Thumbnail Strip */}
                <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-silver/40">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-fog/20 border border-silver/50">
                    <Image
                      src="https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=400&q=80"
                      alt="1971 Datsun 240Z Super $TH"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded text-[9px] font-black bg-black/80 text-white">
                      Super $TH
                    </span>
                  </div>
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-fog/20 border border-silver/50">
                    <Image
                      src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=400&q=80"
                      alt="Nissan Skyline GT-R RLC"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded text-[9px] font-black bg-black/80 text-white">
                      RLC Chrome
                    </span>
                  </div>
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-fog/20 border border-silver/50">
                    <Image
                      src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80"
                      alt="Porsche 911 GT3 RS"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded text-[9px] font-black bg-black/80 text-white">
                      Real Riders
                    </span>
                  </div>
                </div>
              </Link>

              {/* Lane 2: Sports Trading Cards */}
              <Link
                href="/shop/cards"
                className="group relative overflow-hidden rounded-3xl bg-pure-canvas border border-silver/70 p-6 sm:p-8 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-44 h-44 bg-sky-periwinkle/20 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-midnight-ink text-pure-canvas shadow-sm flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-party-pink" />
                      <span>Sports Cards Vault</span>
                    </span>
                    <span className="text-xs font-bold text-slate flex items-center gap-1 group-hover:text-midnight-ink transition-colors">
                      <span>Explore 9 Grails</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-midnight-ink tracking-tight leading-tight mb-2">
                    Trading Cards, Wax & Graded Slabs
                  </h3>
                  <p className="text-xs sm:text-sm text-slate mb-6 leading-relaxed">
                    Factory-sealed Panini Prizm hobby boxes, Topps Chrome UCL blasters, PSA 10 Gem Mint slabs, serial-numbered rookies & authentic on-card autographs.
                  </p>
                </div>

                {/* Visual Thumbnail Strip */}
                <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-silver/40">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-fog/20 border border-silver/50">
                    <Image
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80"
                      alt="Jude Bellingham Prizm BGS 9.5"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded text-[9px] font-black bg-black/80 text-white">
                      BGS 9.5
                    </span>
                  </div>
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-fog/20 border border-silver/50">
                    <Image
                      src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=400&q=80"
                      alt="Panini Prizm Premier League Hobby Box"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded text-[9px] font-black bg-black/80 text-white">
                      Sealed Wax
                    </span>
                  </div>
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-fog/20 border border-silver/50">
                    <Image
                      src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80"
                      alt="Erling Haaland Downtown"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded text-[9px] font-black bg-black/80 text-white">
                      Downtown SP
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 2. LIVE DROP COUNTDOWN & STOCK ALLOCATION BAR                */}
        {/* ============================================================ */}
        {activeDrop && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <div className="rounded-3xl bg-gradient-to-r from-fog/30 via-party-pink/20 to-sky-periwinkle/20 border border-silver/70 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-party-pink text-midnight-ink border border-party-pink/80">
                    Next Vault Drop
                  </span>
                  <span className="text-xs font-mono font-bold text-slate">
                    Scheduled: {new Date(activeDrop.startsAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-midnight-ink tracking-tight">
                  {activeDrop.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate max-w-xl">
                  {activeDrop.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5 shrink-0">
                <div className="bg-pure-canvas border border-silver/60 rounded-2xl p-3 px-5 shadow-sm">
                  <CountdownTimer targetDate={activeDrop.startsAt} />
                </div>
                <Link
                  href={`/shop/drops/${activeDrop.slug}`}
                  className="px-6 py-3 rounded-[8px] bg-midnight-ink text-pure-canvas hover:opacity-90 active:scale-[0.98] transition-all text-xs font-bold flex items-center gap-2 shadow-sm"
                >
                  <span>View Allocation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* 3. SHELF: SUPER TREASURE HUNTS ($TH) & RLC DIE-CAST          */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
          <div className="flex items-end justify-between mb-6 pb-4 border-b border-silver/40">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-600 text-pure-canvas flex items-center gap-1 shadow-sm">
                  <Flame className="w-3 h-3 fill-pure-canvas" />
                  <span>1:64 Scale Toy Castings</span>
                </span>
                <span className="text-xs font-mono font-bold text-slate">
                  Spectraflame Paint & Real Riders
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-midnight-ink tracking-tight font-display">
                Super Treasure Hunts ($TH) & RLC Exclusives
              </h2>
            </div>
            <Link
              href="/shop/hot-wheels?treasureHuntType=Super+$TH"
              className="text-xs font-bold text-midnight-ink hover:underline flex items-center gap-1"
            >
              <span>View All Die-Cast</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {treasureHunts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. INTERACTIVE PACK OPENING TEASER & COMMUNITY BREAK BANNER   */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="rounded-3xl bg-gradient-to-br from-fog/20 via-sky-periwinkle/15 to-party-pink/20 border border-silver/70 p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-midnight-ink text-pure-canvas inline-flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-party-pink" />
                <span>Micro-Collector Experience</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-midnight-ink tracking-tight font-display leading-tight">
                Simulate Ripping Panini Packs or Popping Hot Wheels Blisters
              </h2>
              <p className="text-xs sm:text-sm text-slate leading-relaxed">
                Test your pull luck before you buy! Tap below to unwrap authentic digital hobby pack teasers with genuine foil Sheen or carded blister unboxings. Pull a Downtown or a Super $TH and instantly claim it into your cart.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-midnight-ink">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Real product pool items</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Immediate 10-minute hold reservation</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <PackOpeningTeaser />
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. SHELF: SEALED CARD BOXES & BLASTERS                        */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="flex items-end justify-between mb-6 pb-4 border-b border-silver/40">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-cards-stadium text-pure-canvas flex items-center gap-1 shadow-sm">
                  <Package className="w-3 h-3 text-yellow-300" />
                  <span>Factory Sealed Wax</span>
                </span>
                <span className="text-xs font-mono font-bold text-slate">
                  Panini & Topps Hologram Shrink Wrap
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-midnight-ink tracking-tight font-display">
                Sealed Hobby Boxes, Blasters & Multipacks
              </h2>
            </div>
            <Link
              href="/shop/sealed"
              className="text-xs font-bold text-midnight-ink hover:underline flex items-center gap-1"
            >
              <span>View All Wax</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {sealedPacks.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 6. SHELF: GRADED SLABS (PSA 10 & BGS 9.5)                    */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="flex items-end justify-between mb-6 pb-4 border-b border-silver/40">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-midnight-ink text-pure-canvas flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3 text-party-pink" />
                  <span>Certified Slabs</span>
                </span>
                <span className="text-xs font-mono font-bold text-slate">
                  PSA 10 Gem Mint & BGS 9.5 True Gem
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-midnight-ink tracking-tight font-display">
                PSA & BGS Graded Cards (Slabs)
              </h2>
            </div>
            <Link
              href="/shop/graded"
              className="text-xs font-bold text-midnight-ink hover:underline flex items-center gap-1"
            >
              <span>View All Slabs</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {gradedSlabs.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 7. SHELF: PROTECTIVE SUPPLIES & ACCESSORIES                  */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="flex items-end justify-between mb-6 pb-4 border-b border-silver/40">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-600 text-pure-canvas flex items-center gap-1 shadow-sm">
                  <Layers className="w-3 h-3 text-pure-canvas" />
                  <span>Armored Protection</span>
                </span>
                <span className="text-xs font-mono font-bold text-slate">
                  UV Blocking & Acid Free
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-midnight-ink tracking-tight font-display">
                Clamshell Protectors & Magnetic One-Touch Cases
              </h2>
            </div>
            <Link
              href="/shop/supplies"
              className="text-xs font-bold text-midnight-ink hover:underline flex items-center gap-1"
            >
              <span>View All Supplies</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {supplies.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 8. RECENTLY VIEWED SHELF (Client-Side Zustand)                */}
        {/* ============================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <RecentlyViewedShelf />
        </section>
      </main>

      {/* Trust & Guarantee Strip */}
      <StoreFooter />
    </div>
  )
}
