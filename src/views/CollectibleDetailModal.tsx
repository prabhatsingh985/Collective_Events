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

  // Related collectibles (same category or similar series, excluding self)
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-5xl bg-[#0e121e] rounded-3xl border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-30 bg-[#0e121e]/90 backdrop-blur-md px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
              isCard
                ? 'bg-purple-950/80 text-purple-300 border-purple-500/30'
                : 'bg-amber-950/80 text-amber-300 border-amber-500/30'
            }`}>
              {isCard ? <Sparkles className="w-3 h-3 text-purple-400" /> : <Car className="w-3 h-3 text-amber-400" />}
              <span>{isCard ? 'Trading Card Slab' : 'Hot Wheels Die-Cast'}</span>
            </span>
            <RarityBadge rarity={item.rarity} size="sm" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedCollectible(null)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
              <div className={`relative rounded-3xl overflow-hidden bg-slate-950 border border-white/10 shadow-2xl flex items-center justify-center ${
                isCard ? 'aspect-[4/5] p-3' : 'aspect-[16/11]'
              } holo-card group`}>
                <img
                  src={activeImage}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Grade / Slab Overlay */}
                <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                  <span className="text-xs font-mono font-bold bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl text-amber-300 border border-amber-500/30">
                    {item.condition}
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 z-10">
                  <span className="text-[11px] font-mono text-slate-400 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
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
                      className={`w-20 h-16 rounded-xl overflow-hidden bg-slate-950 border-2 transition-all ${
                        activeImageIndex === idx
                          ? 'border-amber-400 scale-105 shadow-md'
                          : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Collector Authenticity Assurance */}
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 flex items-center gap-3 text-xs text-slate-400">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Verified Collector Item</span>
                  <span>Cross-checked against original production runs and auction records.</span>
                </div>
              </div>

            </div>

            {/* Right: Info & Actions Column */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Brand & Series */}
              <div>
                <div className="text-xs uppercase font-mono tracking-widest text-amber-400 font-bold mb-1">
                  {item.brand} • {item.year}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {item.name}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Series: <span className="text-slate-200 font-semibold">{item.series}</span>
                </p>
              </div>

              {/* Price & Market Stat Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/20 shadow-lg">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-xs uppercase font-mono text-slate-400 block">
                      Estimated Market Valuation
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                      ${item.estimatedValue.toLocaleString()}
                    </div>
                  </div>
                  {item.trendingChange && (
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                      <TrendingUp className="w-3.5 h-3.5" />
                      +{item.trendingChange}% (30d)
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Original MSRP</span>
                    <span className="font-mono text-slate-300 font-bold">
                      {item.originalPrice ? `$${item.originalPrice.toFixed(2)}` : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Last Sold</span>
                    <span className="font-mono text-slate-300 font-bold">
                      ${item.lastSoldPrice.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">Owners Tracked</span>
                    <span className="font-mono text-slate-300 font-bold">
                      {item.ownersCount} collectors
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    if (inCollection) {
                      removeFromCollection(item.id);
                    } else {
                      addToCollection(item.id);
                    }
                  }}
                  className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    inCollection
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/50'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/25'
                  }`}
                >
                  {inCollection ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>In Your Vault (Click to Remove)</span>
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
                  className={`py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border transition-all ${
                    inWishlist
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-white/10'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current text-rose-400' : ''}`} />
                  <span>{inWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-400 mb-2">
                  Collector Overview
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Technical Specifications Matrix */}
              <div className="bg-slate-900/40 rounded-2xl p-4 border border-white/5">
                <h4 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-400 mb-3">
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
                  <div>
                    <span className="text-slate-500">Casting / Card No:</span>
                    <span className="font-mono text-slate-200 ml-1.5 font-bold">
                      {item.itemNumber || 'Standard Release'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Scale / Dimension:</span>
                    <span className="font-mono text-slate-200 ml-1.5 font-bold">
                      {item.scaleOrSize}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Composition:</span>
                    <span className="text-slate-200 ml-1.5 font-bold truncate block">
                      {item.material}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Release Date:</span>
                    <span className="text-slate-200 ml-1.5 font-bold">
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
                    className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 border border-white/5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

            </div>

          </div>

          {/* Historical Price Trend */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">
              Valuation Trajectory & Auction History
            </h3>
            <ValuationChart data={item.priceHistory} height={160} strokeColor="#10b981" />
          </div>

          {/* Related / Similar Collectibles */}
          {relatedItems.length > 0 && (
            <div className="pt-6 border-t border-white/5">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Similar & Related Collectibles
                  </h3>
                  <p className="text-xs text-slate-400">
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
