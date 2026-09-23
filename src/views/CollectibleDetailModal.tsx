import React, { useState } from 'react';
import { useCollection } from '../context/CollectionContext';
import { RarityBadge } from '../components/RarityBadge';
import { ValuationChart } from '../components/ValuationChart';
import { CollectibleCard } from '../components/CollectibleCard';
import { 
  X, 
  Heart, 
  Plus, 
  Check, 
  Share2, 
  ShieldCheck, 
  Car, 
  Sparkles, 
  TrendingUp
} from 'lucide-react';

export const CollectibleDetailModal: React.FC = () => {
  const { 
    selectedCollectible, 
    setSelectedCollectible, 
    collectibles, 
    isInCollection, 
    isInWishlist, 
    addToCollection, 
    removeFromCollection, 
    toggleWishlist,
    addToast 
  } = useCollection();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!selectedCollectible) return null;

  const item = selectedCollectible;
  const inCollection = isInCollection(item.id);
  const inWishlist = isInWishlist(item.id);
  const isCard = item.category === 'trading-cards';

  const relatedItems = collectibles
    .filter((c) => c.id !== item.id && (c.category === item.category || c.brand === item.brand))
    .slice(0, 3);

  const images = item.gallery && item.gallery.length > 0 ? item.gallery : [item.image];
  const activeImage = images[activeImageIndex] || item.image;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Link Copied! 🔗', `${item.name} link copied to your clipboard.`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#004449]/40 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-5xl bg-[#fffef0] rounded-[24px] border border-[#004449]/20 shadow-[0px_8px_32px_rgba(0,68,73,0.12)] overflow-hidden my-auto max-h-[92vh] flex flex-col text-[#004449]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-30 bg-[#fffef0] px-6 py-4 border-b border-[#004449]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
              isCard
                ? 'bg-[#483cff] text-[#fffef0]'
                : 'bg-[#d7ffc2] text-[#004449] border border-[#004449]/20'
            }`}>
              {isCard ? <Sparkles className="w-3 h-3" /> : <Car className="w-3 h-3" />}
              <span>{isCard ? 'Trading Card Slab' : 'Hot Wheels Die-Cast'}</span>
            </span>
            <RarityBadge rarity={item.rarity} size="sm" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-full text-[#004449]/60 hover:text-[#004449] hover:bg-[#d7ffc2] transition-colors"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedCollectible(null)}
              className="p-2 rounded-full text-[#004449]/60 hover:text-[#004449] hover:bg-[#d7ffc2] transition-colors"
              title="Close (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-10">
          
          {/* Main Grid: Gallery + Core Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Gallery Column */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Main Image View */}
              <div className={`relative rounded-[24px] overflow-hidden bg-[#f4f2de] border border-[#004449]/15 shadow-sm flex items-center justify-center ${
                isCard ? 'aspect-[4/5] p-3' : 'aspect-[16/11]'
              } group`}>
                <img
                  src={activeImage}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                />

                {/* Grade / Slab Overlay */}
                <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                  <span className="text-xs font-mono font-bold bg-[#fffef0]/95 px-3 py-1 rounded-full text-[#004449] border border-[#004449]/20 shadow-sm">
                    {item.condition}
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 z-10">
                  <span className="text-[11px] font-mono text-[#004449]/70 bg-[#fffef0]/95 px-2.5 py-1 rounded-full border border-[#004449]/15 shadow-sm">
                    {item.scaleOrSize}
                  </span>
                </div>
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="flex items-center gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-20 h-16 rounded-[12px] overflow-hidden bg-[#f4f2de] border-2 transition-all ${
                        activeImageIndex === idx
                          ? 'border-[#483cff] scale-105 shadow-sm'
                          : 'border-[#004449]/15 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Authenticity Assurance */}
              <div className="p-4 rounded-[16px] bg-[#d7ffc2] border border-[#004449]/15 flex items-center gap-3 text-xs text-[#004449]">
                <ShieldCheck className="w-5 h-5 text-[#004449] shrink-0" />
                <div>
                  <span className="font-bold block">Verified Collector Item</span>
                  <span className="opacity-80">Cross-referenced against original production runs and auction records.</span>
                </div>
              </div>

            </div>

            {/* Right: Info & Actions Column */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Brand & Series */}
              <div>
                <div className="text-xs uppercase font-mono tracking-widest text-[#004449]/60 font-bold mb-1">
                  {item.brand} • {item.year}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#004449] tracking-tight">
                  {item.name}
                </h2>
                <p className="text-sm text-[#004449]/70 mt-1 font-medium">
                  Series: <span className="text-[#004449] font-bold">{item.series}</span>
                </p>
              </div>

              {/* Price & Market Stat Card */}
              <div className="p-6 rounded-[20px] bg-[#f6f5e2]/60 border border-[#004449]/15 shadow-sm">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-xs uppercase font-mono text-[#004449]/60 block font-bold">
                      Estimated Market Valuation
                    </span>
                    <div className="text-3xl sm:text-4xl font-bold text-[#004449] font-mono tracking-tight">
                      ${item.estimatedValue.toLocaleString()}
                    </div>
                  </div>
                  {item.trendingChange && (
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-[#004449] bg-[#d7ffc2] border border-[#004449]/20 px-3 py-1 rounded-full">
                      <TrendingUp className="w-3.5 h-3.5 text-[#004449]" />
                      +{item.trendingChange}% (30d)
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#004449]/10 text-xs">
                  <div>
                    <span className="text-[#004449]/60 block text-[10px] uppercase font-mono">Original MSRP</span>
                    <span className="font-mono text-[#004449] font-bold">
                      {item.originalPrice ? `$${item.originalPrice.toFixed(2)}` : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#004449]/60 block text-[10px] uppercase font-mono">Last Sold</span>
                    <span className="font-mono text-[#004449] font-bold">
                      ${item.lastSoldPrice.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#004449]/60 block text-[10px] uppercase font-mono">Owners</span>
                    <span className="font-mono text-[#004449] font-bold">
                      {item.ownersCount} collectors
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: 900px pills */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    if (inCollection) {
                      removeFromCollection(item.id);
                    } else {
                      addToCollection(item.id);
                    }
                  }}
                  className={`flex-1 py-3.5 px-6 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                    inCollection
                      ? 'bg-[#d7ffc2] text-[#004449] border border-[#004449]/30 hover:bg-rose-100 hover:text-rose-700 hover:border-rose-300'
                      : 'bg-[#483cff] hover:opacity-95 text-[#fffef0] shadow-sm'
                  }`}
                >
                  {inCollection ? (
                    <>
                      <Check className="w-4 h-4 text-[#004449]" />
                      <span>In Vault (Click to Remove)</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add to My Collection</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(item.id)}
                  className={`py-3.5 px-6 rounded-full font-semibold text-sm flex items-center justify-center gap-2 border-[1.5px] transition-all ${
                    inWishlist
                      ? 'bg-[#d7ffc2] text-[#004449] border-[#004449]/30'
                      : 'bg-[#fffef0] text-[#004449] border-[#004449]/30 hover:bg-[#f6f5e2]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current text-[#483cff]' : ''}`} />
                  <span>{inWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-[#004449]/60 mb-2">
                  Collector Overview
                </h4>
                <p className="text-sm text-[#004449]/80 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>

              {/* Technical Specifications Matrix */}
              <div className="bg-[#f6f5e2]/60 rounded-[16px] p-5 border border-[#004449]/10">
                <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-[#004449]/60 mb-3">
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs font-medium">
                  <div>
                    <span className="text-[#004449]/60">Casting / Card No:</span>
                    <span className="font-mono text-[#004449] ml-1.5 font-bold">
                      {item.itemNumber || 'Standard Release'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#004449]/60">Scale / Dimension:</span>
                    <span className="font-mono text-[#004449] ml-1.5 font-bold">
                      {item.scaleOrSize}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#004449]/60">Composition:</span>
                    <span className="text-[#004449] ml-1.5 font-bold truncate block">
                      {item.material}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#004449]/60">Release Date:</span>
                    <span className="text-[#004449] ml-1.5 font-bold">
                      {item.releaseDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono px-3 py-1 rounded-full bg-[#f6f5e2] text-[#004449]/70 border border-[#004449]/10"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

            </div>

          </div>

          {/* Historical Price Trend */}
          <div>
            <h3 className="text-lg font-bold text-[#004449] mb-3">
              Valuation Trajectory & Auction History
            </h3>
            <ValuationChart data={item.priceHistory} height={160} strokeColor="#004449" />
          </div>

          {/* Related / Similar Collectibles */}
          {relatedItems.length > 0 && (
            <div className="pt-6 border-t border-[#004449]/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#004449]">
                    Similar & Related Collectibles
                  </h3>
                  <p className="text-xs text-[#004449]/60 font-medium">
                    Other coveted items in this series
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedItems.map((rel) => (
                  <CollectibleCard key={rel.id} collectible={rel} />
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
