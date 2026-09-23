import React, { useState } from 'react';
import { useCollection } from '../context/CollectionContext';
import { CollectibleCard } from '../components/CollectibleCard';
import { ValuationChart } from '../components/ValuationChart';
import { 
  Layers, 
  DollarSign, 
  Heart, 
  Clock, 
  Car, 
  Sparkles, 
  Plus, 
  Share2, 
  ArrowUpRight,
  ShieldCheck,
  PackageOpen
} from 'lucide-react';

export const MyCollectionView: React.FC = () => {
  const { 
    collectibles, 
    collectionIds, 
    wishlistIds, 
    collectionStats, 
    setActivePage,
    addToast 
  } = useCollection();

  const [activeTab, setActiveTab] = useState<'all' | 'hot-wheels' | 'trading-cards' | 'wishlist'>('all');

  const vaultItems = collectibles.filter((c) => collectionIds.includes(c.id));
  const wishlistItems = collectibles.filter((c) => wishlistIds.includes(c.id));

  const displayedItems = activeTab === 'wishlist'
    ? wishlistItems
    : vaultItems.filter((item) => {
        if (activeTab === 'hot-wheels') return item.category === 'hot-wheels';
        if (activeTab === 'trading-cards') return item.category === 'trading-cards';
        return true;
      });

  const totalCount = vaultItems.length || 1;
  const hwPercent = Math.round((collectionStats.hotWheelsCount / totalCount) * 100);
  const cardsPercent = Math.round((collectionStats.tradingCardsCount / totalCount) * 100);

  const portfolioHistory = [
    { month: 'Oct', value: Math.round(collectionStats.totalValue * 0.86) },
    { month: 'Nov', value: Math.round(collectionStats.totalValue * 0.90) },
    { month: 'Dec', value: Math.round(collectionStats.totalValue * 0.93) },
    { month: 'Jan', value: Math.round(collectionStats.totalValue * 0.95) },
    { month: 'Feb', value: Math.round(collectionStats.totalValue * 0.98) },
    { month: 'Mar', value: collectionStats.totalValue }
  ];

  const handleShareVault = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Vault Link Copied! 🔗', 'Public showcase link copied to your clipboard.', 'info');
  };

  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto space-y-12 text-[#004449]">
      
      {/* ========================================================
          1. HEADER WITH ACTIONS
          ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#004449]/10">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#004449]/70 font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-[#004449]" />
            <span>Authenticated Collector Vault</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-[#004449] tracking-tight">
            My Collection
          </h1>
          <p className="text-[#004449]/70 text-sm mt-1 font-medium">
            Personal vault equity, variant breakdown, and tracked wishlist items
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShareVault}
            className="px-5 py-2.5 rounded-full bg-[#fffef0] hover:bg-[#d7ffc2] border border-[#004449]/20 text-[#004449] text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <Share2 className="w-4 h-4 text-[#004449]" />
            <span>Share Vault</span>
          </button>
          
          <button
            onClick={() => setActivePage('explore')}
            className="px-6 py-2.5 rounded-full bg-[#483cff] hover:opacity-95 text-[#fffef0] text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-[#fffef0]" />
            <span>Add Items</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          2. KEY STATS CARDS
          ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stat 1: Total Items */}
        <div className="p-6 rounded-[24px] bg-[#fffef0] border border-[#004449]/15 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between text-[#004449]/60 mb-3">
            <span className="text-xs uppercase font-mono tracking-wider font-bold">Total Items</span>
            <div className="p-2 rounded-full bg-[#d7ffc2] text-[#004449]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#004449] font-mono">
            {collectionStats.totalItems}
          </div>
          <div className="text-xs text-[#004449]/70 mt-1 font-medium">
            {collectionStats.hotWheelsCount} Castings • {collectionStats.tradingCardsCount} Slabs
          </div>
        </div>

        {/* Stat 2: Collection Value */}
        <div className="p-6 rounded-[24px] bg-[#fffef0] border border-[#004449]/15 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between text-[#004449]/60 mb-3">
            <span className="text-xs uppercase font-mono tracking-wider font-bold">Vault Equity</span>
            <div className="p-2 rounded-full bg-[#d7ffc2] text-[#004449]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#004449] font-mono">
            ${collectionStats.totalValue.toLocaleString()}
          </div>
          <div className="text-xs text-[#004449] flex items-center gap-1 mt-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5 text-[#483cff]" />
            <span>+8.4% this quarter</span>
          </div>
        </div>

        {/* Stat 3: Wishlist Items */}
        <div className="p-6 rounded-[24px] bg-[#fffef0] border border-[#004449]/15 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between text-[#004449]/60 mb-3">
            <span className="text-xs uppercase font-mono tracking-wider font-bold">Saved Wishlist</span>
            <div className="p-2 rounded-full bg-[#e8e6ff] text-[#483cff]">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#004449] font-mono">
            {collectionStats.wishlistCount}
          </div>
          <div className="text-xs text-[#004449]/70 mt-1 font-medium">
            Tracked for price drops
          </div>
        </div>

        {/* Stat 4: Recently Added */}
        <div className="p-6 rounded-[24px] bg-[#fffef0] border border-[#004449]/15 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between text-[#004449]/60 mb-3">
            <span className="text-xs uppercase font-mono tracking-wider font-bold">Recently Added</span>
            <div className="p-2 rounded-full bg-[#d7ffc2] text-[#004449]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#004449] font-mono">
            {collectionStats.recentlyAddedCount}
          </div>
          <div className="text-xs text-[#004449]/70 mt-1 font-medium">
            Last 30 days activity
          </div>
        </div>

      </div>

      {/* ========================================================
          3. CATEGORY BREAKDOWN & VALUATION CHART
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Category Breakdown Card */}
        <div className="lg:col-span-5 bg-[#fffef0] rounded-[24px] p-8 border border-[#004449]/15 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#004449]">
              Category Breakdown
            </h3>
            <span className="text-xs font-mono text-[#004449]/60">
              {vaultItems.length} items total
            </span>
          </div>

          {/* Visual Proportion Bar */}
          <div className="w-full h-3 bg-[#f6f5e2] rounded-full overflow-hidden flex border border-[#004449]/10">
            <div 
              style={{ width: `${hwPercent}%` }} 
              className="h-full bg-[#004449] transition-all duration-500" 
              title={`Hot Wheels: ${hwPercent}%`}
            />
            <div 
              style={{ width: `${cardsPercent}%` }} 
              className="h-full bg-[#483cff] transition-all duration-500" 
              title={`Trading Cards: ${cardsPercent}%`}
            />
          </div>

          {/* Breakdown Items List */}
          <div className="space-y-4 pt-2">
            {/* Hot Wheels Breakdown */}
            <div className="flex items-center justify-between p-4 rounded-[16px] bg-[#f6f5e2]/60 border border-[#004449]/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-full bg-[#d7ffc2] text-[#004449]">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#004449]">Hot Wheels</div>
                  <div className="text-xs text-[#004449]/70 font-medium">
                    {collectionStats.hotWheelsCount} items ({hwPercent}%)
                  </div>
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-base font-bold text-[#004449]">
                  ${collectionStats.hotWheelsValue.toLocaleString()}
                </div>
                <div className="text-[10px] text-[#004449]/60">Estimated value</div>
              </div>
            </div>

            {/* Trading Cards Breakdown */}
            <div className="flex items-center justify-between p-4 rounded-[16px] bg-[#f6f5e2]/60 border border-[#004449]/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-full bg-[#e8e6ff] text-[#483cff]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#004449]">Trading Cards</div>
                  <div className="text-xs text-[#004449]/70 font-medium">
                    {collectionStats.tradingCardsCount} items ({cardsPercent}%)
                  </div>
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-base font-bold text-[#483cff]">
                  ${collectionStats.tradingCardsValue.toLocaleString()}
                </div>
                <div className="text-[10px] text-[#004449]/60">Estimated value</div>
              </div>
            </div>
          </div>

          {/* Vault Health Badge */}
          <div className="p-4 rounded-[16px] bg-[#d7ffc2] text-xs text-[#004449] flex items-center gap-3 font-medium border border-[#004449]/10">
            <ShieldCheck className="w-5 h-5 text-[#004449] shrink-0" />
            <span>All items in vault cross-referenced against 2026 auction transactions.</span>
          </div>
        </div>

        {/* Portfolio Valuation Trend */}
        <div className="lg:col-span-7 space-y-4">
          <ValuationChart data={portfolioHistory} height={220} strokeColor="#004449" />
        </div>

      </div>

      {/* ========================================================
          4. COLLECTION TABS & GRID
          ======================================================== */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          
          {/* Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#f6f5e2] border border-[#004449]/10 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-[#004449] text-[#fffef0] shadow-sm'
                  : 'text-[#004449]/70 hover:text-[#004449]'
              }`}
            >
              All Items ({vaultItems.length})
            </button>
            <button
              onClick={() => setActiveTab('hot-wheels')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'hot-wheels'
                  ? 'bg-[#d7ffc2] text-[#004449] font-bold border border-[#004449]/20'
                  : 'text-[#004449]/70 hover:text-[#004449]'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Hot Wheels ({collectionStats.hotWheelsCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('trading-cards')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'trading-cards'
                  ? 'bg-[#483cff] text-[#fffef0] shadow-sm'
                  : 'text-[#004449]/70 hover:text-[#004449]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cards ({collectionStats.tradingCardsCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'wishlist'
                  ? 'bg-[#d7ffc2] text-[#004449] font-bold border border-[#004449]/20'
                  : 'text-[#004449]/70 hover:text-[#004449]'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Wishlist ({wishlistItems.length})</span>
            </button>
          </div>

          <span className="text-xs font-mono text-[#004449]/60">
            Displaying {displayedItems.length} items
          </span>
        </div>

        {/* Collection Grid */}
        {displayedItems.length === 0 ? (
          <div className="p-16 rounded-[24px] bg-[#fffef0] border border-[#004449]/15 text-center flex flex-col items-center justify-center shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#d7ffc2] flex items-center justify-center text-[#004449] mb-4">
              <PackageOpen className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#004449] mb-2">
              {activeTab === 'wishlist' ? 'Your wishlist is empty' : 'No items in this category'}
            </h3>
            <p className="text-sm text-[#004449]/70 max-w-md mb-6 font-medium">
              {activeTab === 'wishlist'
                ? 'Save your favorite Hot Wheels and trading cards to track their values and drops.'
                : 'Explore our catalog and click "Collect" to add items to your personal vault.'}
            </p>
            <button
              onClick={() => setActivePage('explore')}
              className="px-6 py-2.5 rounded-full bg-[#004449] text-[#fffef0] font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2"
            >
              <span>Explore Marketplace</span>
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedItems.map((item) => (
              <CollectibleCard key={item.id} collectible={item} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
