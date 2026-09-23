import React, { useState } from 'react';
import type { Collectible } from '../types/collectible';
import { RarityBadge } from './RarityBadge';
import { useCollection } from '../context/CollectionContext';
import { Heart, Plus, Check, TrendingUp, Sparkles, Car } from 'lucide-react';

interface CollectibleCardProps {
  collectible: Collectible;
  onOpenDetail?: (collectible: Collectible) => void;
  variant?: 'standard' | 'compact' | 'slab';
}

export const CollectibleCard: React.FC<CollectibleCardProps> = ({
  collectible,
  onOpenDetail
}) => {

  const { isInWishlist, isInCollection, toggleWishlist, addToCollection, removeFromCollection, setSelectedCollectible } = useCollection();
  const [imgError, setImgError] = useState(false);

  const inWishlist = isInWishlist(collectible.id);
  const inCollection = isInCollection(collectible.id);

  const handleCardClick = () => {
    if (onOpenDetail) {
      onOpenDetail(collectible);
    } else {
      setSelectedCollectible(collectible);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(collectible.id);
  };

  const handleCollectionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inCollection) {
      removeFromCollection(collectible.id);
    } else {
      addToCollection(collectible.id);
    }
  };

  const isCard = collectible.category === 'trading-cards';

  // Fallback high-tech placeholder if CDN image fails
  const fallbackSvg = isCard
    ? 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="560" viewBox="0 0 400 560"><rect width="400" height="560" fill="%23131722"/><rect x="20" y="20" width="360" height="520" rx="16" fill="%231a2030" stroke="%238b5cf6" stroke-width="2"/><text x="200" y="270" fill="%23a78bfa" font-size="18" font-family="sans-serif" text-anchor="middle">HOLOGRAPHIC SLAB</text><text x="200" y="300" fill="%2364748b" font-size="14" font-family="sans-serif" text-anchor="middle">PSA / BGS GEM MINT</text></svg>'
    : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23131722"/><text x="200" y="150" fill="%23f59e0b" font-size="18" font-family="sans-serif" text-anchor="middle">DIE-CAST HOT WHEELS</text><text x="200" y="180" fill="%2364748b" font-size="13" font-family="sans-serif" text-anchor="middle">REAL RIDERS &bull; 1:64</text></svg>';

  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex flex-col rounded-2xl cursor-pointer transition-all duration-300 select-none overflow-hidden ${
        isCard
          ? 'bg-[#121624] border border-purple-500/20 hover:border-purple-500/50 hover:shadow-[0_16px_36px_rgba(139,92,246,0.18)]'
          : 'bg-[#131620] border border-amber-500/20 hover:border-amber-500/50 hover:shadow-[0_16px_36px_rgba(245,158,11,0.18)]'
      } hover:-translate-y-1.5 holo-card`}
    >
      {/* Top Header Bar for Graded Slab Style */}
      {isCard && (
        <div className="bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 px-3 py-1.5 border-b border-purple-500/20 flex items-center justify-between text-[11px] font-mono text-purple-300">
          <span className="flex items-center gap-1 font-semibold tracking-wider">
            <Sparkles className="w-3 h-3 text-purple-400" />
            PSA / BGS SLAB
          </span>
          <span className="text-slate-400">{collectible.year}</span>
        </div>
      )}

      {/* Image Container with Consistent Aspect Ratio */}
      <div className={`relative w-full overflow-hidden bg-slate-950/80 ${isCard ? 'aspect-[4/5]' : 'aspect-[16/11]'}`}>
        <img
          src={imgError ? fallbackSvg : collectible.image}
          alt={collectible.name}
          onError={() => setImgError(true)}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1019] via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges (Category & Year) */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md border ${
              isCard
                ? 'bg-purple-900/60 text-purple-200 border-purple-400/30'
                : 'bg-amber-950/70 text-amber-200 border-amber-500/40'
            }`}
          >
            {isCard ? <Sparkles className="w-2.5 h-2.5 text-purple-400" /> : <Car className="w-2.5 h-2.5 text-amber-400" />}
            {isCard ? 'Trading Card' : 'Hot Wheels'}
          </span>
          {!isCard && (
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-black/60 text-slate-300 border border-white/10 backdrop-blur-md">
              {collectible.year}
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistClick}
          aria-label="Wishlist"
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            inWishlist
              ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)] scale-105'
              : 'bg-black/50 text-slate-300 hover:text-rose-400 hover:bg-black/70 border border-white/10'
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Condition / Slab Badge on Bottom Image Overlay */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <span className="text-[11px] font-medium text-slate-300 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 truncate max-w-[70%]">
            {collectible.condition}
          </span>
          {collectible.trending && collectible.trendingChange && (
            <span className="inline-flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.5 rounded backdrop-blur-md">
              <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
              +{collectible.trendingChange}%
            </span>
          )}
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        {/* Rarity & Series */}
        <div className="flex items-center justify-between gap-1">
          <RarityBadge rarity={collectible.rarity} size="sm" />
          <span className="text-[11px] text-slate-400 font-mono truncate text-right max-w-[110px]">
            {collectible.itemNumber || collectible.series}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-bold text-slate-100 text-base leading-snug line-clamp-2 group-hover:text-amber-300 transition-colors">
          {collectible.name}
        </h3>

        {/* Series Subtitle */}
        <p className="text-xs text-slate-400 line-clamp-1">
          {collectible.series}
        </p>

        {/* Price & Action Row */}
        <div className="mt-auto pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
              Est. Value
            </div>
            <div className="text-lg font-black text-slate-100 font-mono tracking-tight group-hover:text-emerald-400 transition-colors">
              ${collectible.estimatedValue.toLocaleString()}
            </div>
          </div>

          <button
            onClick={handleCollectionClick}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              inCollection
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40'
                : 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-slate-700/80 shadow-sm'
            }`}
          >
            {inCollection ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>In Vault</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Collect</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
