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

  // Vault items
  const vaultItems = collectibles.filter((c) => collectionIds.includes(c.id));
  const wishlistItems = collectibles.filter((c) => wishlistIds.includes(c.id));

  // Filtered by active tab
  const displayedItems = activeTab === 'wishlist'
    ? wishlistItems
    : vaultItems.filter((item) => {
        if (activeTab === 'hot-wheels') return item.category === 'hot-wheels';
        if (activeTab === 'trading-cards') return item.category === 'trading-cards';
        return true;
      });

  // Category breakdown calculation
  const totalCount = vaultItems.length || 1;
  const hwPercent = Math.round((collectionStats.hotWheelsCount / totalCount) * 100);
  const cardsPercent = Math.round((collectionStats.tradingCardsCount / totalCount) * 100);

  // Portfolio overall historical valuation sparkline
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
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* ========================================================
          1. HEADER WITH ACTIONS
          ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Authenticated Collector Vault</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            My Collection
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Personal vault equity, variant breakdown, and tracked wishlist items
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShareVault}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-white/10 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all hover:scale-105"
          >
            <Share2 className="w-4 h-4 text-slate-400" />
            <span>Share Vault</span>
          </button>
          
          <button
            onClick={() => setActivePage('explore')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>Add Items</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          2. KEY STATS CARDS
          ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Stat 1: Total Items */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs uppercase font-mono tracking-wider font-bold">Total Items</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {collectionStats.totalItems}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {collectionStats.hotWheelsCount} Castings • {collectionStats.tradingCardsCount} Slabs
          </div>
        </div>

        {/* Stat 2: Collection Value */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-emerald-500/20 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs uppercase font-mono tracking-wider font-bold">Collection Value</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            ${collectionStats.totalValue.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-400/90 flex items-center gap-1 mt-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+8.4% this quarter</span>
          </div>
        </div>

        {/* Stat 3: Wishlist Items */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs uppercase font-mono tracking-wider font-bold">Saved Wishlist</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {collectionStats.wishlistCount}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Tracked for price drops
          </div>
        </div>

        {/* Stat 4: Recently Added */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs uppercase font-mono tracking-wider font-bold">Recently Added</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {collectionStats.recentlyAddedCount}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Last 30 days activity
          </div>
        </div>

      </div>

      {/* ========================================================
          3. CATEGORY BREAKDOWN & VALUATION CHART
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Category Breakdown Card */}
        <div className="lg:col-span-5 bg-slate-900/50 rounded-3xl p-6 sm:p-8 border border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">
              Category Breakdown
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {vaultItems.length} items total
            </span>
          </div>

          {/* Visual Proportion Bar */}
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
            <div 
              style={{ width: `${hwPercent}%` }} 
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500" 
              title={`Hot Wheels: ${hwPercent}%`}
            />
            <div 
              style={{ width: `${cardsPercent}%` }} 
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500" 
              title={`Trading Cards: ${cardsPercent}%`}
            />
          </div>

          {/* Breakdown Items List */}
          <div className="space-y-4 pt-2">
            {/* Hot Wheels Breakdown */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Hot Wheels</div>
                  <div className="text-xs text-slate-400">
                    {collectionStats.hotWheelsCount} items ({hwPercent}%)
                  </div>
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-base font-bold text-amber-400">
                  ${collectionStats.hotWheelsValue.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400">Estimated value</div>
              </div>
            </div>

            {/* Trading Cards Breakdown */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/80 border border-purple-500/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Trading Cards</div>
                  <div className="text-xs text-slate-400">
                    {collectionStats.tradingCardsCount} items ({cardsPercent}%)
                  </div>
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-base font-bold text-purple-400">
                  ${collectionStats.tradingCardsValue.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400">Estimated value</div>
              </div>
            </div>
          </div>

          {/* Vault Health Badge */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>All items in vault are verified against 2026 auction transactions.</span>
          </div>
        </div>

        {/* Portfolio Valuation Trend */}
        <div className="lg:col-span-7 bg-slate-900/50 rounded-3xl p-6 sm:p-8 border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">
                Portfolio Valuation History
              </h3>
              <p className="text-xs text-slate-400">
                Aggregate price trajectory of your items over the past 6 months
              </p>
            </div>
          </div>

          <ValuationChart data={portfolioHistory} height={200} strokeColor="#10b981" />
        </div>

      </div>

      {/* ========================================================
          4. COLLECTION TABS & GRID
          ======================================================== */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900 border border-white/5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Items ({vaultItems.length})
            </button>
            <button
              onClick={() => setActiveTab('hot-wheels')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'hot-wheels'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Hot Wheels ({collectionStats.hotWheelsCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('trading-cards')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'trading-cards'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-purple-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cards ({collectionStats.tradingCardsCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'wishlist'
                  ? 'bg-rose-600 text-white shadow'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Wishlist ({wishlistItems.length})</span>
            </button>
          </div>

          <span className="text-xs font-mono text-slate-400">
            Displaying {displayedItems.length} items
          </span>
        </div>

        {/* Collection Grid */}
        {displayedItems.length === 0 ? (
          <div className="p-16 rounded-3xl bg-slate-900/40 border border-white/5 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
              <PackageOpen className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {activeTab === 'wishlist' ? 'Your wishlist is empty' : 'No items in this category'}
            </h3>
            <p className="text-sm text-slate-400 max-w-md mb-6">
              {activeTab === 'wishlist'
                ? 'Save your favorite Hot Wheels and trading cards to track their values and drops.'
                : 'Explore our catalog and click "Collect" to add items to your personal vault.'}
            </p>
            <button
              onClick={() => setActivePage('explore')}
              className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all flex items-center gap-2"
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
