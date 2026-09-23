import React, { useState } from 'react';
import { useCollection } from '../context/CollectionContext';
import { CollectibleCard } from '../components/CollectibleCard';
import { 
  Flame, 
  Car, 
  Award, 
  Trophy, 
  Gauge, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const HotWheelsView: React.FC = () => {
  const { collectibles, setSelectedCollectible, setActivePage } = useCollection();

  const [activeSeriesFilter, setActiveSeriesFilter] = useState<string>('all');

  const hotWheelsItems = collectibles.filter((c) => c.category === 'hot-wheels');
  const featuredModels = hotWheelsItems.filter((c) => c.featured);
  const rareFinds = hotWheelsItems.filter(
    (c) => c.rarity === 'Super Treasure Hunt' || c.rarity === 'RLC Exclusive' || c.rarity === 'Vintage Redline'
  );

  const displayedItems = hotWheelsItems.filter((item) => {
    if (activeSeriesFilter !== 'all' && !item.series.includes(activeSeriesFilter)) {
      return false;
    }
    return true;
  });

  const heroItem = hotWheelsItems.find((c) => c.id === 'hw-1') || hotWheelsItems[0];

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto space-y-16 text-[#004449]">
      
      {/* ========================================================
          1. HERO BANNER (Mint Wash Band with Parchment Card)
          ======================================================== */}
      <section className="relative rounded-[24px] bg-[#d7ffc2] p-8 sm:p-12 lg:p-16 border border-[#000000]/10 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fffef0] text-[#004449] text-xs font-semibold uppercase tracking-wider mb-6 border border-[#004449]/15">
              <Flame className="w-3.5 h-3.5 text-[#004449] fill-[#004449]" />
              <span>Die-Cast Heritage & Casting Index</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold text-[#004449] tracking-tight leading-tight mb-4">
              Hot Wheels{' '}
              <span className="text-[#483cff]">
                Collection
              </span>
            </h1>

            <p className="text-[#004449]/80 text-base sm:text-lg max-w-xl leading-relaxed mb-8 font-medium">
              Explore authentic 1:64 scale metal heritage. From 1968 Sweet 16 original Redlines and coveted Super Treasure Hunts to Red Line Club numbered limited editions.
            </p>

            {/* Hero Metrics Pill */}
            <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-[#004449]/80 pt-6 border-t border-[#004449]/15">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-[#004449]" />
                <span>Real Riders Rubber</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#483cff]" />
                <span>Flame Tampo STH</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#004449]" />
                <span>RLC Limited Slabs</span>
              </div>
            </div>
          </div>

          {/* Hero Spotlight Car Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div 
              onClick={() => setSelectedCollectible(heroItem)}
              className="w-full max-w-sm bg-[#fffef0] rounded-[24px] p-6 border border-[#004449]/15 shadow-[0px_4px_16px_rgba(0,68,73,0.06)] hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs text-[#004449] font-mono font-bold mb-3">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 fill-[#004449]" />
                  SPOTLIGHT CASTING
                </span>
                <span className="opacity-75">{heroItem.year}</span>
              </div>

              <div className="relative rounded-[16px] overflow-hidden aspect-[16/10] bg-[#f4f2de] mb-4">
                <img
                  src={heroItem.image}
                  alt={heroItem.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <div className="absolute bottom-2.5 left-2.5 bg-[#d7ffc2] px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-[#004449] border border-[#004449]/15">
                  Spectraflame Teal • STH
                </div>
              </div>

              <h3 className="font-bold text-[#004449] text-lg group-hover:text-[#483cff] transition-colors">
                {heroItem.name}
              </h3>
              <p className="text-xs text-[#004449]/70 mt-0.5 font-medium">{heroItem.series}</p>

              <div className="mt-4 pt-3 border-t border-[#004449]/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#004449]/60">Current Valuation</span>
                  <div className="text-xl font-bold text-[#004449] font-mono">${heroItem.estimatedValue}</div>
                </div>
                <button className="px-4 py-2 rounded-full bg-[#004449] text-[#fffef0] font-semibold text-xs hover:bg-[#00363a] transition-all">
                  Inspect Spec
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. FEATURED MODELS
          ======================================================== */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#004449]/70 font-bold">
              Flagship Castings
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#004449] tracking-tight mt-0.5">
              Featured Models
            </h2>
          </div>
          <span className="text-xs text-[#004449]/60 font-mono">
            {featuredModels.length} Tier-1 castings
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredModels.map((item) => (
            <CollectibleCard key={item.id} collectible={item} />
          ))}
        </div>
      </section>

      {/* ========================================================
          3. POPULAR SERIES SELECTOR
          ======================================================== */}
      <section className="bg-[#fffef0] rounded-[24px] p-8 border border-[#004449]/15 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl font-bold text-[#004449] flex items-center gap-2">
              <Car className="w-5 h-5 text-[#004449]" />
              <span>Browse By Popular Series</span>
            </h3>
            <p className="text-xs text-[#004449]/70 mt-1 font-medium">
              Select a series to filter castings instantly
            </p>
          </div>

          {/* Series Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Series' },
              { id: 'Super Treasure Hunt', label: 'Super Treasure Hunts' },
              { id: 'Red Line Club', label: 'Red Line Club (RLC)' },
              { id: 'Car Culture', label: 'Car Culture' },
              { id: 'Vintage Redline', label: 'Vintage 1968' },
              { id: 'Fast & Furious', label: 'Fast & Furious' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSeriesFilter(s.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  activeSeriesFilter === s.id
                    ? 'bg-[#004449] text-[#fffef0] shadow-sm'
                    : 'bg-[#fffef0] text-[#004449] hover:bg-[#d7ffc2] border border-[#004449]/20'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Series Filtered Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedItems.map((item) => (
            <CollectibleCard key={item.id} collectible={item} />
          ))}
        </div>
      </section>

      {/* ========================================================
          4. RARE FINDS SPOTLIGHT
          ======================================================== */}
      <section className="py-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#004449]/70 font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#483cff]" />
              High-Valuation Grails
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#004449] tracking-tight mt-0.5">
              Rare Finds & Sweet 16 Originals
            </h2>
          </div>
          <button
            onClick={() => setActivePage('explore')}
            className="text-xs text-[#483cff] font-semibold hover:underline flex items-center gap-1"
          >
            <span>View Full Market Index</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rareFinds.slice(0, 6).map((item) => (
            <CollectibleCard key={item.id} collectible={item} />
          ))}
        </div>
      </section>

    </div>
  );
};
