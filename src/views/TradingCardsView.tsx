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

  const cardItems = collectibles.filter((c) => c.category === 'trading-cards');
  const featuredCards = cardItems.filter((c) => c.featured);
  const rareCards = cardItems.filter(
    (c) => c.rarity === 'Vintage Grail' || c.rarity === 'Gem Mint Rookie' || c.rarity === 'Secret Rare'
  );

  const displayedCards = cardItems.filter((item) => {
    if (activeSetFilter !== 'all' && !item.series.includes(activeSetFilter) && !item.brand.includes(activeSetFilter)) {
      return false;
    }
    return true;
  });

  const heroCard = cardItems.find((c) => c.id === 'tc-1') || cardItems[0];

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto space-y-16 text-[#004449]">
      
      {/* ========================================================
          1. HERO BANNER (Mint Wash Band with Slab Showcase)
          ======================================================== */}
      <section className="relative rounded-[24px] bg-[#d7ffc2] p-8 sm:p-12 lg:p-16 border border-[#000000]/10 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fffef0] text-[#004449] text-xs font-semibold uppercase tracking-wider mb-6 border border-[#004449]/15">
              <Sparkles className="w-3.5 h-3.5 text-[#483cff]" />
              <span>PSA & BGS Certified Graded Slabs</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold text-[#004449] tracking-tight leading-tight mb-4">
              Trading Cards{' '}
              <span className="text-[#483cff]">
                Discovery
              </span>
            </h1>

            <p className="text-[#004449]/80 text-base sm:text-lg max-w-xl leading-relaxed mb-8 font-medium">
              Explore the pinnacle of card collecting. Certified PSA 10 Gem Mint slabs, BGS 9.5 quad-subgrade grails, 1st Edition Shadowless Charizards, and 1986 Michael Jordan rookies.
            </p>

            {/* Grading Badges Strip */}
            <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-[#004449]/80 pt-6 border-t border-[#004449]/15">
              <div className="flex items-center gap-2">
                <Gem className="w-4 h-4 text-[#483cff]" />
                <span>PSA 10 Gem Mint</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#004449]" />
                <span>Beckett BGS Gold Labels</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#004449]" />
                <span>Cosmic Starfoil</span>
              </div>
            </div>
          </div>

          {/* Hero Spotlight Slab */}
          <div className="lg:col-span-5 flex justify-center">
            <div 
              onClick={() => setSelectedCollectible(heroCard)}
              className="w-full max-w-sm bg-[#fffef0] rounded-[24px] p-6 border border-[#004449]/15 shadow-[0px_4px_16px_rgba(0,68,73,0.06)] hover:-translate-y-1 transition-all cursor-pointer group"
            >
              {/* Slab Header */}
              <div className="bg-[#d7ffc2] px-3.5 py-2 rounded-[14px] border border-[#004449]/15 flex items-center justify-between text-xs font-mono text-[#004449] mb-4">
                <span className="font-bold flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-[#483cff] fill-[#483cff]" />
                  PSA 10 GEM MINT
                </span>
                <span className="font-bold font-mono opacity-80">CERT #48291044</span>
              </div>

              <div className="relative rounded-[16px] overflow-hidden aspect-[4/5] bg-[#f4f2de] mb-4">
                <img
                  src={heroCard.image}
                  alt={heroCard.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <div className="absolute bottom-2.5 left-2.5 bg-[#fffef0] px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-[#004449] border border-[#004449]/15 shadow-sm">
                  1st Edition Shadowless • 1999
                </div>
              </div>

              <h3 className="font-bold text-[#004449] text-lg group-hover:text-[#483cff] transition-colors">
                {heroCard.name}
              </h3>
              <p className="text-xs text-[#004449]/70 mt-0.5 font-medium">{heroCard.series}</p>

              <div className="mt-4 pt-3 border-t border-[#004449]/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#004449]/60">Market Value</span>
                  <div className="text-xl font-bold text-[#004449] font-mono">${heroCard.estimatedValue.toLocaleString()}</div>
                </div>
                <button className="px-4 py-2 rounded-full bg-[#483cff] hover:opacity-95 text-[#fffef0] font-semibold text-xs shadow-sm">
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
            <span className="text-xs font-mono uppercase tracking-wider text-[#004449]/70 font-bold">
              Grail Tier Collectibles
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#004449] tracking-tight mt-0.5">
              Featured Cards
            </h2>
          </div>
          <span className="text-xs text-[#004449]/60 font-mono">
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
      <section className="bg-[#fffef0] rounded-[24px] p-8 border border-[#004449]/15 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl font-bold text-[#004449] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#004449]" />
              <span>Browse By Popular Sets</span>
            </h3>
            <p className="text-xs text-[#004449]/70 mt-1 font-medium">
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
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  activeSetFilter === s.id
                    ? 'bg-[#483cff] text-[#fffef0] shadow-sm'
                    : 'bg-[#fffef0] text-[#004449] hover:bg-[#d7ffc2] border border-[#004449]/20'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtered Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedCards.map((item) => (
            <CollectibleCard key={item.id} collectible={item} />
          ))}
        </div>
      </section>

      {/* ========================================================
          4. RARE CARDS & AUCTION GRAILS
          ======================================================== */}
      <section className="py-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#004449]/70 font-bold flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-[#483cff]" />
              Six-Figure Potential
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#004449] tracking-tight mt-0.5">
              Vintage Grails & High-Grade Rookies
            </h2>
          </div>
          <button
            onClick={() => setActivePage('explore')}
            className="text-xs text-[#483cff] font-semibold hover:underline flex items-center gap-1"
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
