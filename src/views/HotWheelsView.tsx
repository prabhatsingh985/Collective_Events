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

  // Filter only Hot Wheels
  const hotWheelsItems = collectibles.filter((c) => c.category === 'hot-wheels');

  // Featured models
  const featuredModels = hotWheelsItems.filter((c) => c.featured);

  // Rare finds: Super Treasure Hunts, RLC, Vintage Redlines
  const rareFinds = hotWheelsItems.filter(
    (c) => c.rarity === 'Super Treasure Hunt' || c.rarity === 'RLC Exclusive' || c.rarity === 'Vintage Redline'
  );

  // Filtered by series pills
  const displayedItems = hotWheelsItems.filter((item) => {
    if (activeSeriesFilter !== 'all' && !item.series.includes(activeSeriesFilter)) {
      return false;
    }
    return true;
  });


  const heroItem = hotWheelsItems.find((c) => c.id === 'hw-1') || hotWheelsItems[0];

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* ========================================================
          1. HERO BANNER
          ======================================================== */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#18110b] via-[#121622] to-[#0d1017] border border-orange-500/20 p-8 sm:p-12 lg:p-16 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Flame className="w-4 h-4 fill-orange-400" />
              <span>Die-Cast Garage & Casting Index</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight mb-4">
              Hot Wheels{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300">
                Collection
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed mb-8">
              Explore authentic 1:64 scale metal marvels. From 1968 Sweet 16 original Redlines and coveted Super Treasure Hunts with Spectraflame paint to Red Line Club numbered limited editions.
            </p>

            {/* Hero Metrics Pill */}
            <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-slate-300 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-orange-400" />
                <span>Real Riders Rubber Tires</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Super Treasure Hunt Flame Tampo</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                <span>Numbered RLC Club Badges</span>
              </div>
            </div>
          </div>

          {/* Hero Spotlight Car Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div 
              onClick={() => setSelectedCollectible(heroItem)}
              className="w-full max-w-sm bg-[#151926] rounded-3xl p-5 border border-orange-500/30 shadow-[0_20px_60px_rgba(249,115,22,0.25)] hover:border-orange-400 hover:scale-[1.02] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs text-orange-400 font-mono font-bold mb-3">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 fill-orange-400" />
                  SPOTLIGHT CASTING
                </span>
                <span className="text-slate-400">{heroItem.year}</span>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-950 mb-4">
                <img
                  src={heroItem.image}
                  alt={heroItem.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-amber-300 border border-amber-500/30">
                  Spectraflame Teal • STH
                </div>
              </div>

              <h3 className="font-extrabold text-white text-lg group-hover:text-amber-300 transition-colors">
                {heroItem.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{heroItem.series}</p>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400">Current Valuation</span>
                  <div className="text-xl font-black text-amber-400 font-mono">${heroItem.estimatedValue}</div>
                </div>
                <button className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs">
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
            <span className="text-xs font-mono uppercase tracking-wider text-orange-400 font-bold">
              Flagship Castings
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
              Featured Models
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
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
          3. POPULAR SERIES QUICK SELECTOR
          ======================================================== */}
      <section className="bg-slate-900/40 rounded-3xl p-6 sm:p-8 border border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-orange-400" />
              <span>Browse By Popular Series</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeSeriesFilter === s.id
                    ? 'bg-orange-500 text-slate-950 font-bold shadow-md shadow-orange-500/20'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-white/5'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Series Filtered Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {displayedItems.map((item) => (
            <CollectibleCard key={item.id} collectible={item} />
          ))}
        </div>
      </section>

      {/* ========================================================
          4. RARE FINDS SPOTLIGHT (STH, RLC, REDLINES)
          ======================================================== */}
      <section className="py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              High-Valuation Grails
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
              Rare Finds & Holy Grails
            </h2>
          </div>
          <button
            onClick={() => setActivePage('explore')}
            className="text-xs text-orange-400 font-mono hover:underline flex items-center gap-1"
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
