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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#004449]/40 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-[#fffef0] rounded-[24px] border border-[#004449]/20 shadow-[0px_8px_30px_rgba(0,68,73,0.12)] overflow-hidden flex flex-col text-[#004449]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#004449]/15 bg-[#fffef0]">
          <Search className="w-5 h-5 text-[#004449] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Hot Wheels, Pokémon slabs, Jordan rookies..."
            className="w-full bg-transparent text-[#004449] placeholder-[#004449]/50 focus:outline-none text-base font-medium"
          />
          <button
            onClick={() => setQuickSearchOpen(false)}
            className="p-1 rounded-full text-[#004449]/50 hover:text-[#004449] hover:bg-[#d7ffc2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#004449]/60 px-3 py-1 flex items-center justify-between">
            <span>{query.trim() === '' ? 'Featured & Coveted Castings' : `Results (${results.length})`}</span>
            <span className="text-[#004449]/40">ESC to close</span>
          </div>

          {results.length === 0 ? (
            <div className="p-8 text-center text-[#004449]/70">
              <p className="text-sm">No collectibles found matching &ldquo;{query}&rdquo;</p>
              <button
                onClick={() => {
                  setQuickSearchOpen(false);
                  setActivePage('explore');
                }}
                className="mt-3 text-xs text-[#483cff] font-semibold hover:underline"
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
                  className="flex items-center gap-4 p-3 rounded-[16px] hover:bg-[#d7ffc2]/60 border border-transparent hover:border-[#004449]/15 transition-all cursor-pointer group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-[12px] object-cover shrink-0 bg-[#f4f2de]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isCard ? 'bg-[#483cff] text-[#fffef0]' : 'bg-[#d7ffc2] text-[#004449]'
                      }`}>
                        {isCard ? <Sparkles className="w-2.5 h-2.5" /> : <Car className="w-2.5 h-2.5" />}
                        {isCard ? 'Card' : 'Diecast'}
                      </span>
                      <RarityBadge rarity={item.rarity} size="sm" />
                    </div>
                    <h4 className="text-sm font-bold text-[#004449] group-hover:text-[#483cff] truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[#004449]/70 truncate">
                      {item.series} • {item.year}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-mono font-bold text-[#004449]">
                      ${item.estimatedValue.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#004449]/50 flex items-center justify-end gap-1 mt-0.5">
                      <span>Inspect</span>
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
