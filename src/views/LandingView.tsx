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
  Flame,
  Search,
  CheckCircle2
} from 'lucide-react';

export const LandingView: React.FC = () => {
  const { collectibles, setActivePage, setActiveCategoryFilter, setSelectedCollectible } = useCollection();

  const trendingItems = collectibles.filter((c) => c.trending).slice(0, 4);
  const recentlyAdded = collectibles.slice(4, 8);
  const heroCard1 = collectibles.find((c) => c.id === 'hw-1') || collectibles[0];
  const heroCard2 = collectibles.find((c) => c.id === 'tc-1') || collectibles[14];

  return (
    <div className="flex flex-col w-full min-h-screen">
      
      {/* ========================================================
          1. HERO SECTION
          ======================================================== */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-grid-pattern">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-amber-500/15 via-purple-600/15 to-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-6 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/80" />
                <span>Next-Gen Vault For Physical Collectors</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300 font-normal">Hot Wheels & Trading Cards</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
                Your Collection.{' '}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-purple-400">
                  Your Story.
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed mb-8">
                Discover, organize and showcase the collectibles you love. Track real-time market valuations, verify rare Redlines and Gem Mint slabs, and share your personal vault.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => setActivePage('explore')}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-base tracking-wide flex items-center justify-center gap-3 shadow-[0_10px_35px_rgba(245,158,11,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Search className="w-5 h-5 text-slate-950" />
                  <span>Explore Collectibles</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>

                <button
                  onClick={() => setActivePage('my-collection')}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-base border border-white/10 hover:border-white/25 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  <Layers className="w-5 h-5 text-emerald-400" />
                  <span>View My Collection</span>
                </button>
              </div>

              {/* Micro Proof Points */}
              <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Live Market Pricing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>PSA & BGS Slab Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Zero Fees For Cataloging</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual: Dual 3D Floating Collectible Cards */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-md sm:max-w-lg aspect-square flex items-center justify-center">
                
                {/* Background Rotating Ring Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-purple-600/20 to-transparent rounded-full blur-2xl animate-pulse" />

                {/* Card 1: Hot Wheels 3D Tilted Card */}
                <div 
                  onClick={() => setSelectedCollectible(heroCard1)}
                  className="absolute top-4 left-0 sm:left-4 w-60 sm:w-72 bg-[#121622] rounded-3xl p-3 border border-amber-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] -rotate-6 hover:rotate-0 transition-all duration-500 cursor-pointer z-10 hover:z-30 hover:scale-105 holo-card group"
                >
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-950">
                    <img 
                      src={heroCard1.image} 
                      alt={heroCard1.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute top-2 left-2 bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-full shadow">
                      STH DIE-CAST
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="text-[10px] text-amber-400 font-mono font-bold">1971 Datsun 510 Wagon</div>
                    <div className="text-sm font-bold text-white truncate">{heroCard1.name}</div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                      <span className="text-[10px] text-slate-400">Current Value</span>
                      <span className="text-base font-extrabold text-amber-400 font-mono">${heroCard1.estimatedValue}</span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Graded Slab Card */}
                <div 
                  onClick={() => setSelectedCollectible(heroCard2)}
                  className="absolute bottom-4 right-0 sm:right-4 w-60 sm:w-72 bg-[#141224] rounded-3xl p-3 border border-purple-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.9)] rotate-6 hover:rotate-0 transition-all duration-500 cursor-pointer z-20 hover:z-30 hover:scale-105 holo-card group"
                >
                  <div className="bg-slate-900 px-3 py-1.5 rounded-t-xl border-b border-purple-500/30 flex items-center justify-between text-[10px] font-mono text-purple-300">
                    <span className="font-bold flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-purple-400" /> PSA 10 GEM MINT
                    </span>
                    <span className="text-emerald-400 font-bold">+18.2%</span>
                  </div>
                  <div className="relative rounded-b-xl overflow-hidden aspect-[4/3] bg-slate-950 mt-1">
                    <img 
                      src={heroCard2.image} 
                      alt={heroCard2.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <div className="p-3">
                    <div className="text-[10px] text-purple-400 font-mono font-bold">Base Set 1st Edition</div>
                    <div className="text-sm font-bold text-white truncate">{heroCard2.name}</div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                      <span className="text-[10px] text-slate-400">Grail Valuation</span>
                      <span className="text-base font-extrabold text-emerald-400 font-mono">${heroCard2.estimatedValue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          2. FEATURED CATEGORIES
          ======================================================== */}
      <section className="py-16 bg-[#0a0c12] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                Collector Categories
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                Explore The Pillars
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-md">
              Discover verified pricing, detailed casting variations, and rare holographic slab certifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Category 1: Hot Wheels */}
            <div 
              onClick={() => {
                setActiveCategoryFilter('hot-wheels');
                setActivePage('hot-wheels');
              }}
              className="group relative rounded-3xl overflow-hidden p-8 sm:p-10 bg-gradient-to-br from-[#1a1310] via-[#121622] to-[#0c0f18] border border-orange-500/20 hover:border-orange-500/50 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-[0_20px_50px_rgba(249,115,22,0.15)] flex flex-col justify-between min-h-[380px]"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-500/20 transition-all" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Car className="w-6 h-6 text-orange-400" />
                </div>
                <span className="text-xs font-mono uppercase tracking-widest text-orange-400 font-bold">
                  Die-Cast Heritage
                </span>
                <h3 className="text-3xl font-black text-white mt-1 mb-3">
                  Hot Wheels
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
                  Super Treasure Hunts, Redline Club exclusives, 1968 originals, and Car Culture real riders with live casting values.
                </p>
              </div>

              <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                  <span>14+ Featured Castings</span>
                  <span>•</span>
                  <span className="text-orange-400 font-bold">$38,000+ Tracked</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-500 text-slate-950 flex items-center justify-center group-hover:translate-x-2 transition-transform">
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
              className="group relative rounded-3xl overflow-hidden p-8 sm:p-10 bg-gradient-to-br from-[#181126] via-[#141829] to-[#0c0f18] border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.15)] flex flex-col justify-between min-h-[380px]"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/20 transition-all" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">
                  Holographic & Graded Slabs
                </span>
                <h3 className="text-3xl font-black text-white mt-1 mb-3">
                  Trading Cards
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
                  1st Edition Pokémon, iconic Jordan rookies, Black Lotus alphas, and certified PSA 10 / BGS 9.5 Gem Mint gems.
                </p>
              </div>

              <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                  <span>14+ Verified Slabs</span>
                  <span>•</span>
                  <span className="text-purple-400 font-bold">$125,000+ Tracked</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center group-hover:translate-x-2 transition-transform">
                  <ChevronRight className="w-5 h-5 font-bold" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          3. TRENDING COLLECTIBLES
          ======================================================== */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Market Movers & Watchlist Gainers</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Trending Collectibles
              </h2>
            </div>
            <button
              onClick={() => setActivePage('explore')}
              className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>View all catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingItems.map((item) => (
              <CollectibleCard key={item.id} collectible={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. "BUILD YOUR COLLECTION" VALUE PROPOSITION
          ======================================================== */}
      <section className="py-20 bg-gradient-to-b from-[#0f1320] to-[#0a0d14] border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Collector Toolset
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-3 mb-4">
              Build Your Collection
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Everything you need to manage rare physical assets with digital precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/5 hover:border-amber-500/40 transition-all group backdrop-blur-md">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-amber-400">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Live Portfolio Valuation
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Connect your castings and slabs to automated market pricing. Watch your portfolio equity update with every recorded auction sale.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/5 hover:border-purple-500/40 transition-all group backdrop-blur-md">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-purple-400">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Grade & Variant Verification
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                From Super Treasure Hunt flame tampo markings to PSA 10 serial certifications, catalog exact card and casting conditions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/5 hover:border-emerald-500/40 transition-all group backdrop-blur-md">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-emerald-400">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Showcase Virtual Vault
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Generate clean, shareable showcase links to your collection vault. Flex your grails without exposing your physical location.
              </p>
            </div>

          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => setActivePage('my-collection')}
              className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm tracking-wide inline-flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              <span>Open Your Vault Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================
          5. RECENTLY ADDED
          ======================================================== */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Catalog Additions</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Recently Added
              </h2>
            </div>
            <button
              onClick={() => setActivePage('explore')}
              className="text-sm font-bold text-slate-300 hover:text-white transition-colors"
            >
              See all ({collectibles.length}) &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyAdded.map((item) => (
              <CollectibleCard key={item.id} collectible={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          6. COLLECTOR STATISTICS
          ======================================================== */}
      <StatsBanner />

    </div>
  );
};
