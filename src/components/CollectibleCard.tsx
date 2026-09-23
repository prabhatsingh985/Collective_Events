import React, { useState } from 'react';
import type { Collectible } from '../types/collectible';
import { RarityBadge } from './RarityBadge';
import { useCollection } from '../context/CollectionContext';
import { Heart, Plus, Check, TrendingUp, Sparkles, Car } from 'lucide-react';

interface CollectibleCardProps {
  collectible: Collectible;
  onOpenDetail?: (collectible: Collectible) => void;
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

  const fallbackSvg = isCard
    ? 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="560" viewBox="0 0 400 560"><rect width="400" height="560" fill="%23fffef0"/><rect x="20" y="20" width="360" height="520" rx="20" fill="%23d7ffc2" stroke="%23004449" stroke-width="1.5"/><text x="200" y="270" fill="%23004449" font-size="18" font-family="sans-serif" text-anchor="middle">GRADED SLAB</text><text x="200" y="300" fill="%23004449" opacity="0.6" font-size="14" font-family="sans-serif" text-anchor="middle">PSA / BGS GEM MINT</text></svg>'
    : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23fffef0"/><text x="200" y="150" fill="%23004449" font-size="18" font-family="sans-serif" text-anchor="middle">DIE-CAST HOT WHEELS</text><text x="200" y="180" fill="%23004449" opacity="0.6" font-size="13" font-family="sans-serif" text-anchor="middle">REAL RIDERS &bull; 1:64</text></svg>';

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col rounded-[24px] cursor-pointer transition-all duration-200 select-none overflow-hidden bg-[#fffef0] border border-[#004449]/15 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0px_6px_16px_0px_rgba(0,0,0,0.06)]"
    >
      {/* Top Header Bar for Graded Slab Style */}
      {isCard && (
        <div className="bg-[#d7ffc2] px-4 py-2 border-b border-[#004449]/15 flex items-center justify-between text-xs font-medium text-[#004449]">
          <span className="flex items-center gap-1 font-semibold tracking-wide">
            <Sparkles className="w-3 h-3 text-[#483cff]" />
            PSA / BGS CERTIFIED
          </span>
          <span className="font-mono text-xs opacity-75">{collectible.year}</span>
        </div>
      )}

      {/* Image Container with Consistent Aspect Ratio */}
      <div className={`relative w-full overflow-hidden bg-[#f4f2de] ${isCard ? 'aspect-[4/5]' : 'aspect-[16/11]'}`}>
        <img
          src={imgError ? fallbackSvg : collectible.image}
          alt={collectible.name}
          onError={() => setImgError(true)}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-103"
        />

        {/* Top Badges (Category & Year) */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm ${
              isCard
                ? 'bg-[#483cff] text-[#fffef0]'
                : 'bg-[#d7ffc2] text-[#004449] border border-[#004449]/20'
            }`}
          >
            {isCard ? <Sparkles className="w-3 h-3" /> : <Car className="w-3 h-3" />}
            {isCard ? 'Trading Card' : 'Hot Wheels'}
          </span>
          {!isCard && (
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#fffef0]/90 text-[#004449] border border-[#004449]/20 shadow-sm">
              {collectible.year}
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistClick}
          aria-label="Wishlist"
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 ${
            inWishlist
              ? 'bg-[#483cff] text-[#fffef0] shadow-sm scale-105'
              : 'bg-[#fffef0]/90 text-[#004449] hover:bg-[#fffef0] hover:text-[#483cff] border border-[#004449]/20'
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Condition Badge on Bottom Image */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <span className="text-[11px] font-medium text-[#004449] bg-[#fffef0]/95 px-2.5 py-0.5 rounded-full border border-[#004449]/15 truncate max-w-[70%] shadow-sm">
            {collectible.condition}
          </span>
          {collectible.trending && collectible.trendingChange && (
            <span className="inline-flex items-center text-[10px] font-bold text-[#004449] bg-[#d7ffc2] border border-[#004449]/20 px-2 py-0.5 rounded-full shadow-sm">
              <TrendingUp className="w-3 h-3 mr-0.5 text-[#004449]" />
              +{collectible.trendingChange}%
            </span>
          )}
        </div>
      </div>

      {/* Card Content & Details (32px padding equivalent) */}
      <div className="flex flex-col flex-1 p-6 gap-3">
        {/* Rarity & Series */}
        <div className="flex items-center justify-between gap-1">
          <RarityBadge rarity={collectible.rarity} size="sm" />
          <span className="text-xs text-[#004449]/60 font-mono truncate text-right max-w-[120px]">
            {collectible.itemNumber || collectible.series}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-bold text-[#004449] text-base leading-snug line-clamp-2 group-hover:text-[#483cff] transition-colors">
          {collectible.name}
        </h3>

        {/* Series Subtitle */}
        <p className="text-xs text-[#004449]/70 line-clamp-1 font-medium">
          {collectible.series}
        </p>

        {/* Price & Action Row */}
        <div className="mt-auto pt-3 border-t border-[#004449]/10 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-[#004449]/60">
              Est. Value
            </div>
            <div className="text-lg font-bold text-[#004449] font-mono tracking-tight">
              ${collectible.estimatedValue.toLocaleString()}
            </div>
          </div>

          <button
            onClick={handleCollectionClick}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
              inCollection
                ? 'bg-[#d7ffc2] text-[#004449] border border-[#004449]/30'
                : 'bg-transparent hover:bg-[#004449] hover:text-[#fffef0] text-[#004449] border-[1.5px] border-[#004449]'
            }`}
          >
            {inCollection ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#004449]" />
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
