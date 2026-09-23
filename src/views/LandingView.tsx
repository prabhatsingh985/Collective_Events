import React from 'react';
import { useCollection } from '../context/CollectionContext';
import { CollectibleCard } from '../components/CollectibleCard';
import { StatsBanner } from '../components/StatsBanner';
import { 
  Sparkles, 
  Car, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  Clock, 
  ChevronRight,
  Search
} from 'lucide-react';


export const LandingView: React.FC = () => {
  const { collectibles, setActivePage, setActiveCategoryFilter, setSelectedCollectible } = useCollection();

  const trendingItems = collectibles.filter((c) => c.trending).slice(0, 4);
  const recentlyAdded = collectibles.slice(4, 8);
  const heroCard1 = collectibles.find((c) => c.id === 'hw-1') || collectibles[0];
  const heroCard2 = collectibles.find((c) => c.id === 'tc-1') || collectibles[14];

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#fffef0] text-[#004449]">
      
      {/* ========================================================
          1. HERO SECTION (Parchment Canvas #fffef0)
          ======================================================== */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content Column (60% width) */}
          <div className="lg:col-span-7 text-left">
            
            {/* Social Proof Pill Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#d7ffc2] text-[#004449] text-xs font-semibold mb-6 shadow-sm border border-[#004449]/10">
              <div className="flex -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                  alt="Collector Avatar"
                  className="w-6 h-6 rounded-full border border-[#fffef0] object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
                  alt="Collector Avatar"
                  className="w-6 h-6 rounded-full border border-[#fffef0] object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"
                  alt="Collector Avatar"
                  className="w-6 h-6 rounded-full border border-[#fffef0] object-cover"
                />
              </div>
              <span>Loved by 38,000+ Collectors ★★★★★</span>
            </div>

            {/* Hero Headline Pair: Display font with 0.10em tracking */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[0.04em] text-[#004449] leading-[1.08] mb-6">
              Your Collection.{' '}
              <span className="block text-[#483cff]">
                Your Story.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-[#004449]/80 max-w-xl font-normal leading-relaxed mb-10">
              Discover, organize and showcase the collectibles you love. A sun-bleached journal tracking live market valuations, verified Redlines, and certified Gem Mint slabs.
            </p>

            {/* Primary Filled CTA + Outlined Secondary */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={() => setActivePage('explore')}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#483cff] hover:opacity-95 text-[#fffef0] font-semibold text-base flex items-center justify-center gap-3 transition-all shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]"
              >
                <Search className="w-5 h-5 text-[#fffef0]" />
                <span>Explore Collectibles</span>
                <ArrowRight className="w-4 h-4 text-[#fffef0]" />
              </button>

              <button
                onClick={() => setActivePage('my-collection')}
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-transparent hover:bg-[#004449]/5 text-[#004449] font-semibold text-base border-[1.5px] border-[#004449] flex items-center justify-center gap-3 transition-all"
              >
                <Layers className="w-5 h-5 text-[#004449]" />
                <span>View My Vault</span>
              </button>
            </div>

            {/* Press Logo Strip */}
            <div className="mt-14 pt-8 border-t border-[#004449]/15">
              <span className="block text-xs uppercase tracking-widest font-mono text-[#004449]/50 mb-3">
                Featured in collector journals & media
              </span>
              <div className="flex flex-wrap items-center gap-8 text-[#004449]/50 font-bold text-sm font-['Inter']">
                <span>CAR & DRIVER</span>
                <span>PSA JOURNAL</span>
                <span>HYPEBEAST</span>
                <span>CARD LADDER</span>
                <span>DIECAST DIGEST</span>
              </div>
            </div>

          </div>

          {/* Right Hero Visual: Phone Mockup Frame & Overlapping Collectible Cards */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
              
              {/* Soft circular mint wash backdrop */}
              <div className="absolute inset-0 bg-[#d7ffc2] rounded-full blur-xl opacity-60" />

              {/* Card 1: Hot Wheels Showcase */}
              <div 
                onClick={() => setSelectedCollectible(heroCard1)}
                className="absolute top-2 left-0 sm:left-2 w-64 sm:w-72 bg-[#fffef0] rounded-[24px] p-4 border border-[#004449]/15 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] -rotate-3 hover:rotate-0 transition-all duration-300 cursor-pointer z-10 hover:z-30 hover:scale-102 group"
              >
                <div className="relative rounded-[16px] overflow-hidden aspect-[4/3] bg-[#f4f2de]">
                  <img 
                    src={heroCard1.image} 
                    alt={heroCard1.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#d7ffc2] text-[#004449] font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full border border-[#004449]/15">
                    STH DIE-CAST
                  </div>
                </div>
                <div className="pt-3">
                  <div className="text-[11px] text-[#004449]/60 font-mono font-medium">1971 Datsun 510 Wagon</div>
                  <div className="text-sm font-bold text-[#004449] truncate">{heroCard1.name}</div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#004449]/10">
                    <span className="text-[11px] text-[#004449]/60 font-mono">Current Valuation</span>
                    <span className="text-base font-bold text-[#004449] font-mono">${heroCard1.estimatedValue}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Graded Slab Showcase */}
              <div 
                onClick={() => setSelectedCollectible(heroCard2)}
                className="absolute bottom-2 right-0 sm:right-2 w-64 sm:w-72 bg-[#fffef0] rounded-[24px] p-4 border border-[#004449]/15 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] rotate-3 hover:rotate-0 transition-all duration-300 cursor-pointer z-20 hover:z-30 hover:scale-102 group"
              >
                <div className="bg-[#d7ffc2] px-3 py-1.5 rounded-t-[14px] border-b border-[#004449]/15 flex items-center justify-between text-[11px] font-medium text-[#004449]">
                  <span className="font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#483cff]" /> PSA 10 GEM MINT
                  </span>
                  <span className="text-[#004449] font-bold font-mono">+18.2%</span>
                </div>
                <div className="relative rounded-b-[14px] overflow-hidden aspect-[4/3] bg-[#f4f2de]">
                  <img 
                    src={heroCard2.image} 
                    alt={heroCard2.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                <div className="pt-3">
                  <div className="text-[11px] text-[#004449]/60 font-mono font-medium">Base Set 1st Edition</div>
                  <div className="text-sm font-bold text-[#004449] truncate">{heroCard2.name}</div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#004449]/10">
                    <span className="text-[11px] text-[#004449]/60 font-mono">Grail Valuation</span>
                    <span className="text-base font-bold text-[#004449] font-mono">${heroCard2.estimatedValue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          2. FEATURED CATEGORIES (Mint Wash Band #d7ffc2)
          ======================================================== */}
      <section className="w-full bg-[#d7ffc2] py-20 border-y border-[#000000]/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#004449]/70 font-bold">
                Collector Pillars
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#004449] tracking-tight mt-1">
                Explore The Pillars
              </h2>
            </div>
            <p className="text-[#004449]/80 text-sm max-w-md leading-relaxed font-medium">
              Verified auction pricing, detailed casting variations, and rare holographic slab certifications organized on sun-bleached cards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Category 1: Hot Wheels */}
            <div 
              onClick={() => {
                setActiveCategoryFilter('hot-wheels');
                setActivePage('hot-wheels');
              }}
              className="group relative rounded-[24px] p-8 sm:p-10 bg-[#fffef0] border border-[#004449]/15 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[360px]"
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-[#d7ffc2] flex items-center justify-center mb-6 text-[#004449]">
                  <Car className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#004449]/60 font-bold">
                  Die-Cast Heritage
                </span>
                <h3 className="text-3xl font-bold text-[#004449] mt-1 mb-3">
                  Hot Wheels
                </h3>
                <p className="text-[#004449]/80 text-sm leading-relaxed max-w-sm font-medium">
                  Super Treasure Hunts, Redline Club exclusives, 1968 originals, and Car Culture real riders with live casting values.
                </p>
              </div>

              <div className="pt-6 border-t border-[#004449]/10 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs font-mono text-[#004449]/70">
                  <span>14+ Featured Castings</span>
                  <span>•</span>
                  <span className="font-bold text-[#004449]">$38,000+ Tracked</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#004449] text-[#fffef0] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ChevronRight className="w-5 h-5 font-bold" />
                </div>
              </div>
            </div>

            {/* Category 2: Trading Cards */}
            <div 
              onClick={() => {
                setActiveCategoryFilter('trading-cards');
                setActivePage('trading-cards');
              }}
              className="group relative rounded-[24px] p-8 sm:p-10 bg-[#fffef0] border border-[#004449]/15 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[360px]"
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-[#e8e6ff] flex items-center justify-center mb-6 text-[#483cff]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#483cff] font-bold">
                  Holographic & Graded Slabs
                </span>
                <h3 className="text-3xl font-bold text-[#004449] mt-1 mb-3">
                  Trading Cards
                </h3>
                <p className="text-[#004449]/80 text-sm leading-relaxed max-w-sm font-medium">
                  1st Edition Pokémon, iconic Jordan rookies, Black Lotus alphas, and certified PSA 10 / BGS 9.5 Gem Mint gems.
                </p>
              </div>

              <div className="pt-6 border-t border-[#004449]/10 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs font-mono text-[#004449]/70">
                  <span>14+ Verified Slabs</span>
                  <span>•</span>
                  <span className="font-bold text-[#004449]">$125,000+ Tracked</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#483cff] text-[#fffef0] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ChevronRight className="w-5 h-5 font-bold" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          3. TRENDING COLLECTIBLES (Parchment Canvas)
          ======================================================== */}
      <section className="py-20 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#004449]/70 font-bold mb-1">
              <TrendingUp className="w-4 h-4 text-[#483cff]" />
              <span>Market Movers & Watchlist Gainers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#004449] tracking-tight">
              Trending Collectibles
            </h2>
          </div>
          <button
            onClick={() => setActivePage('explore')}
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-[#483cff] hover:underline"
          >
            <span>View entire catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingItems.map((item) => (
            <CollectibleCard key={item.id} collectible={item} />
          ))}
        </div>
      </section>

      {/* ========================================================
          4. "BUILD YOUR COLLECTION" (Mint Wash Band #d7ffc2)
          ======================================================== */}
      <section className="w-full bg-[#d7ffc2] py-20 border-y border-[#000000]/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#004449] font-bold bg-[#fffef0] px-3.5 py-1 rounded-full border border-[#004449]/15">
              Collector Toolset
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#004449] tracking-tight mt-3 mb-4">
              Build Your Collection
            </h2>
            <p className="text-[#004449]/80 text-base sm:text-lg font-medium">
              Everything you need to manage rare physical assets with digital precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature Card 1 on Mint Band */}
            <div className="p-8 rounded-[24px] bg-[#fffef0] border border-[#004449]/15 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-full bg-[#d7ffc2] flex items-center justify-center mb-6 text-[#004449]">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#004449] mb-2">
                Live Portfolio Valuation
              </h3>
              <p className="text-[#004449]/70 text-sm leading-relaxed font-medium">
                Connect your castings and slabs to automated market pricing. Watch your portfolio equity update with every recorded auction sale.
              </p>
            </div>

            {/* Feature Card 2 on Mint Band */}
            <div className="p-8 rounded-[24px] bg-[#fffef0] border border-[#004449]/15 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-full bg-[#e8e6ff] flex items-center justify-center mb-6 text-[#483cff]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#004449] mb-2">
                Grade & Variant Verification
              </h3>
              <p className="text-[#004449]/70 text-sm leading-relaxed font-medium">
                From Super Treasure Hunt flame tampo markings to PSA 10 serial certifications, catalog exact card and casting conditions.
              </p>
            </div>

            {/* Feature Card 3 on Mint Band */}
            <div className="p-8 rounded-[24px] bg-[#fffef0] border border-[#004449]/15 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-full bg-[#d7ffc2] flex items-center justify-center mb-6 text-[#004449]">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#004449] mb-2">
                Showcase Virtual Vault
              </h3>
              <p className="text-[#004449]/70 text-sm leading-relaxed font-medium">
                Generate clean, sun-bleached showcase links to your collection vault. Flex your grails without exposing your physical location.
              </p>
            </div>

          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => setActivePage('my-collection')}
              className="px-8 py-3.5 rounded-full bg-[#004449] hover:bg-[#00363a] text-[#fffef0] font-semibold text-sm tracking-wide inline-flex items-center gap-2 shadow-sm transition-all"
            >
              <span>Open Your Vault Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================
          5. RECENTLY ADDED (Parchment Canvas)
          ======================================================== */}
      <section className="py-20 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#004449]/70 font-bold mb-1">
              <Clock className="w-4 h-4 text-[#004449]" />
              <span>Catalog Additions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#004449] tracking-tight">
              Recently Added
            </h2>
          </div>
          <button
            onClick={() => setActivePage('explore')}
            className="text-sm font-semibold text-[#004449] hover:underline"
          >
            See all ({collectibles.length}) &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentlyAdded.map((item) => (
            <CollectibleCard key={item.id} collectible={item} />
          ))}
        </div>
      </section>

      {/* ========================================================
          6. COLLECTOR STATISTICS (Mint Wash Band)
          ======================================================== */}
      <StatsBanner />

    </div>
  );
};
