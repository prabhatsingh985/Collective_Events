import React, { useState } from 'react';
import { useCollection } from '../context/CollectionContext';
import { CollectibleCard } from '../components/CollectibleCard';
import { 
  Sparkles, 
  Gem, 
  ShieldCheck, 
  Award, 
  Trophy, 
  Layers, 
  ArrowRight,
  Star
} from 'lucide-react';


export const TradingCardsView: React.FC = () => {
  const { collectibles, setSelectedCollectible, setActivePage } = useCollection();

  const [activeSetFilter, setActiveSetFilter] = useState<string>('all');

  // Filter only Trading Cards
  const cardItems = collectibles.filter((c) => c.category === 'trading-cards');

  // Featured cards
  const featuredCards = cardItems.filter((c) => c.featured);

  // Rare cards (Grail, Gem Mint Rookie, Secret Rare)
  const rareCards = cardItems.filter(
    (c) => c.rarity === 'Vintage Grail' || c.rarity === 'Gem Mint Rookie' || c.rarity === 'Secret Rare'
  );

  // Filtered by set pills
  const displayedCards = cardItems.filter((item) => {
    if (activeSetFilter !== 'all' && !item.series.includes(activeSetFilter) && !item.brand.includes(activeSetFilter)) {
      return false;
    }
    return true;
  });

  const heroCard = cardItems.find((c) => c.id === 'tc-1') || cardItems[0];

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* ========================================================
          1. HERO BANNER
          ======================================================== */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#170e28] via-[#121626] to-[#0d1017] border border-purple-500/30 p-8 sm:p-12 lg:p-16 shadow-2xl">
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span>PSA & BGS Certified Graded Slab Vault</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight mb-4">
              Trading Cards{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300">
                Discovery
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed mb-8">
              Explore the pinnacle of card collecting. Certified PSA 10 Gem Mint slabs, BGS 9.5 quad-subgrade grails, 1st Edition Shadowless Charizards, and 1986 Michael Jordan rookies.
            </p>

            {/* Grading Badges Strip */}
            <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-slate-300 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Gem className="w-4 h-4 text-purple-400" />
                <span>PSA 10 Gem Mint Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Beckett BGS Gold Labels</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-pink-400" />
                <span>Cosmic Holographic Starfoil</span>
              </div>
            </div>
          </div>

          {/* Hero Spotlight Slab */}
          <div className="lg:col-span-5 flex justify-center">
            <div 
              onClick={() => setSelectedCollectible(heroCard)}
              className="w-full max-w-sm bg-[#151326] rounded-3xl p-5 border border-purple-500/40 shadow-[0_20px_60px_rgba(139,92,246,0.3)] hover:border-purple-400 hover:scale-[1.02] transition-all cursor-pointer group holo-card"
            >
              {/* Slab Top Bar */}
              <div className="bg-slate-900 px-3.5 py-2 rounded-xl border border-purple-500/30 flex items-center justify-between text-xs font-mono text-purple-300 mb-3">
                <span className="font-bold flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
                  PSA 10 GEM MINT
                </span>
                <span className="text-emerald-400 font-bold font-mono">CERT #48291044</span>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-950 mb-4">
                <img
                  src={heroCard.image}
                  alt={heroCard.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-2 left-2 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-purple-300 border border-purple-500/30">
                  1st Edition Shadowless • 1999
                </div>
              </div>

              <h3 className="font-extrabold text-white text-lg group-hover:text-purple-300 transition-colors">
                {heroCard.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{heroCard.series}</p>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400">Market Value</span>
                  <div className="text-xl font-black text-emerald-400 font-mono">${heroCard.estimatedValue.toLocaleString()}</div>
                </div>
                <button className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30">
                  Inspect Slab
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. FEATURED CARDS
          ======================================================== */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
              Grail Tier Collectibles
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
              Featured Cards
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {featuredCards.length} Premier graded listings
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCards.map((item) => (
            <CollectibleCard key={item.id} collectible={item} />
          ))}
        </div>
      </section>

      {/* ========================================================
          3. POPULAR SETS QUICK FILTER
          ======================================================== */}
      <section className="bg-slate-900/40 rounded-3xl p-6 sm:p-8 border border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <span>Browse By Popular Sets</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Filter by legendary card sets across Pokémon, Basketball, Football, and MTG
            </p>
          </div>

          {/* Set Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Sets' },
              { id: 'Base Set', label: 'Base Set (1999)' },
              { id: 'Fleer', label: '1986 Fleer' },
              { id: 'Alpha', label: 'Magic Alpha' },
              { id: 'Evolving Skies', label: 'Evolving Skies' },
              { id: 'Topps Chrome', label: 'Topps Chrome' },
              { id: 'Prizm', label: 'Panini Prizm' },
              { id: '151', label: 'Pokémon 151' }
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSetFilter(s.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeSetFilter === s.id
                    ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-white/5'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtered Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {displayedCards.map((item) => (
            <CollectibleCard key={item.id} collectible={item} />
          ))}
        </div>
      </section>

      {/* ========================================================
          4. RARE CARDS & AUCTION GRAILS
          ======================================================== */}
      <section className="py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-pink-400 font-bold flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-pink-400" />
              Six-Figure Potential
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
              Vintage Grails & High-Grade Rookies
            </h2>
          </div>
          <button
            onClick={() => setActivePage('explore')}
            className="text-xs text-purple-400 font-mono hover:underline flex items-center gap-1"
          >
            <span>Explore All Slabs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rareCards.slice(0, 6).map((item) => (
            <CollectibleCard key={item.id} collectible={item} />
          ))}
        </div>
      </section>

    </div>
  );
};
