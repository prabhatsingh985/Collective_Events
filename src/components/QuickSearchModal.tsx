import React, { useEffect, useRef, useState } from 'react';
import { useCollection } from '../context/CollectionContext';
import { Search, X, Sparkles, Car, ArrowRight } from 'lucide-react';
import { RarityBadge } from './RarityBadge';

export const QuickSearchModal: React.FC = () => {
  const { 
    collectibles, 
    quickSearchOpen, 
    setQuickSearchOpen, 
    setSelectedCollectible,
    setActivePage 
  } = useCollection();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (quickSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [quickSearchOpen]);

  // Keyboard shortcut listener (/ or Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setQuickSearchOpen(true);
      } else if (e.key === 'Escape' && quickSearchOpen) {
        setQuickSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quickSearchOpen, setQuickSearchOpen]);

  if (!quickSearchOpen) return null;

  const results = query.trim() === ''
    ? collectibles.filter((c) => c.featured).slice(0, 6)
    : collectibles.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.series.toLowerCase().includes(query.toLowerCase()) ||
        c.brand.toLowerCase().includes(query.toLowerCase()) ||
        c.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-[#0f1422] rounded-3xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-slate-900/60">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Hot Wheels, Pokémon slabs, Jordan rookies..."
            className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-base"
          />
          <button
            onClick={() => setQuickSearchOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-3 py-1 flex items-center justify-between">
            <span>{query.trim() === '' ? 'Featured & Trending Castings' : `Results (${results.length})`}</span>
            <span className="text-slate-500">ESC to close</span>
          </div>

          {results.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <p className="text-sm">No collectibles found matching &ldquo;{query}&rdquo;</p>
              <button
                onClick={() => {
                  setQuickSearchOpen(false);
                  setActivePage('explore');
                }}
                className="mt-3 text-xs text-amber-400 hover:underline"
              >
                Browse all in catalog &rarr;
              </button>
            </div>
          ) : (
            results.map((item) => {
              const isCard = item.category === 'trading-cards';
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedCollectible(item);
                    setQuickSearchOpen(false);
                  }}
                  className="flex items-center gap-4 p-3 rounded-2xl bg-slate-900/40 hover:bg-slate-800/80 border border-transparent hover:border-white/10 transition-all cursor-pointer group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 bg-slate-950"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                        isCard ? 'bg-purple-950 text-purple-300 border-purple-500/30' : 'bg-amber-950 text-amber-300 border-amber-500/30'
                      }`}>
                        {isCard ? <Sparkles className="w-2.5 h-2.5" /> : <Car className="w-2.5 h-2.5" />}
                        {isCard ? 'Card' : 'Diecast'}
                      </span>
                      <RarityBadge rarity={item.rarity} size="sm" />
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">
                      {item.series} • {item.year}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-mono font-bold text-emerald-400">
                      ${item.estimatedValue.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center justify-end gap-1 mt-0.5">
                      <span>View</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
