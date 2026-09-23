import React, { useState, useMemo } from 'react';
import { useCollection } from '../context/CollectionContext';
import { CollectibleCard } from '../components/CollectibleCard';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  Car, 
  Sparkles
} from 'lucide-react';

export const ExploreView: React.FC = () => {
  const { 
    collectibles, 
    activeCategoryFilter, 
    setActiveCategoryFilter, 
    searchQuery, 
    setSearchQuery 
  } = useCollection();

  // Local filter states
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedSeries, setSelectedSeries] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(40000);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Derive unique filter lists
  const brands = useMemo(() => {
    const set = new Set<string>();
    collectibles.forEach((c) => set.add(c.brand));
    return Array.from(set).sort();
  }, [collectibles]);

  const rarities = useMemo(() => {
    const set = new Set<string>();
    collectibles.forEach((c) => set.add(c.rarity));
    return Array.from(set).sort();
  }, [collectibles]);

  const seriesList = useMemo(() => {
    const set = new Set<string>();
    collectibles.forEach((c) => set.add(c.series));
    return Array.from(set).sort();
  }, [collectibles]);

  const years = useMemo(() => {
    const set = new Set<number>();
    collectibles.forEach((c) => set.add(c.year));
    return Array.from(set).sort((a, b) => b - a);
  }, [collectibles]);

  // Filter logic
  const filteredCollectibles = useMemo(() => {
    return collectibles.filter((item) => {
      // Category filter
      if (activeCategoryFilter !== 'all' && item.category !== activeCategoryFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesSeries = item.series.toLowerCase().includes(q);
        const matchesBrand = item.brand.toLowerCase().includes(q);
        const matchesRarity = item.rarity.toLowerCase().includes(q);
        const matchesTag = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesSeries && !matchesBrand && !matchesRarity && !matchesTag) {
          return false;
        }
      }
      // Brand
      if (selectedBrand !== 'all' && item.brand !== selectedBrand) {
        return false;
      }
      // Rarity
      if (selectedRarity !== 'all' && item.rarity !== selectedRarity) {
        return false;
      }
      // Condition
      if (selectedCondition !== 'all') {
        if (selectedCondition === 'gem-mint' && !item.condition.includes('Gem Mint')) return false;
        if (selectedCondition === 'carded' && !item.condition.includes('Carded')) return false;
        if (selectedCondition === 'loose' && !item.condition.includes('Loose')) return false;
      }
      // Series
      if (selectedSeries !== 'all' && item.series !== selectedSeries) {
        return false;
      }
      // Year
      if (selectedYear !== 'all' && item.year.toString() !== selectedYear) {
        return false;
      }
      // Price
      if (item.estimatedValue > maxPrice) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.estimatedValue - b.estimatedValue;
      if (sortBy === 'price-desc') return b.estimatedValue - a.estimatedValue;
      if (sortBy === 'year-desc') return b.year - a.year;
      if (sortBy === 'trending') return (b.trendingChange || 0) - (a.trendingChange || 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [
    collectibles,
    activeCategoryFilter,
    searchQuery,
    selectedBrand,
    selectedRarity,
    selectedCondition,
    selectedSeries,
    selectedYear,
    maxPrice,
    sortBy
  ]);

  const resetFilters = () => {
    setActiveCategoryFilter('all');
    setSearchQuery('');
    setSelectedBrand('all');
    setSelectedRarity('all');
    setSelectedCondition('all');
    setSelectedSeries('all');
    setSelectedYear('all');
    setMaxPrice(40000);
    setSortBy('featured');
  };

  const activeFiltersCount = 
    (activeCategoryFilter !== 'all' ? 1 : 0) +
    (searchQuery !== '' ? 1 : 0) +
    (selectedBrand !== 'all' ? 1 : 0) +
    (selectedRarity !== 'all' ? 1 : 0) +
    (selectedCondition !== 'all' ? 1 : 0) +
    (selectedSeries !== 'all' ? 1 : 0) +
    (selectedYear !== 'all' ? 1 : 0) +
    (maxPrice < 40000 ? 1 : 0);

  return (
    <div className="w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* ========================================================
          1. HEADER & SEARCH
          ======================================================== */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              Marketplace Catalog
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-1">
              Explore Collectibles
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Showing {filteredCollectibles.length} verified listings across Hot Wheels & Graded Slabs
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-200 text-sm font-semibold flex items-center gap-2 hover:bg-slate-800"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>Filters ({activeFiltersCount})</span>
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset all</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar & Category Tabs */}
        <div className="flex flex-col lg:flex-row items-stretch gap-4 bg-slate-900/70 p-2.5 rounded-2xl border border-white/5 backdrop-blur-md">
          
          {/* Main Search Bar */}
          <div className="relative flex-1 flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model, player, pokemon, year, series, or casting..."
              className="w-full bg-slate-950/80 rounded-xl pl-12 pr-10 py-3.5 text-sm text-white placeholder-slate-500 border border-white/5 focus:outline-none focus:border-amber-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Tabs: All / Hot Wheels / Trading Cards */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-white/5 shrink-0">
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeCategoryFilter === 'all'
                  ? 'bg-white text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({collectibles.length})
            </button>
            <button
              onClick={() => setActiveCategoryFilter('hot-wheels')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeCategoryFilter === 'hot-wheels'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Hot Wheels</span>
            </button>
            <button
              onClick={() => setActiveCategoryFilter('trading-cards')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeCategoryFilter === 'trading-cards'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-purple-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trading Cards</span>
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================
          2. MAIN CONTENT: FILTERS SIDEBAR + PRODUCT GRID
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Filter Sidebar (Desktop) */}
        <aside
          className={`lg:col-span-3 bg-slate-900/50 rounded-2xl p-6 border border-white/5 space-y-6 ${
            mobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>Filters</span>
            </h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-amber-400 hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort By Filter */}
          <div>
            <label className="text-xs uppercase font-mono font-bold text-slate-400 block mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="featured">Featured First</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="year-desc">Year: Newest</option>
              <option value="trending">Top Market Gainers</option>
            </select>
          </div>

          {/* Rarity Tier */}
          <div>
            <label className="text-xs uppercase font-mono font-bold text-slate-400 block mb-2">
              Rarity Tier
            </label>
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Rarities</option>
              {rarities.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div>
            <label className="text-xs uppercase font-mono font-bold text-slate-400 block mb-2">
              Brand / Manufacturer
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Series / Set */}
          <div>
            <label className="text-xs uppercase font-mono font-bold text-slate-400 block mb-2">
              Series / Set
            </label>
            <select
              value={selectedSeries}
              onChange={(e) => setSelectedSeries(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Series & Sets</option>
              {seriesList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="text-xs uppercase font-mono font-bold text-slate-400 block mb-2">
              Condition & Grade
            </label>
            <div className="space-y-1.5">
              {[
                { id: 'all', label: 'All Conditions' },
                { id: 'gem-mint', label: 'Gem Mint (PSA 10 / BGS 9.5)' },
                { id: 'carded', label: 'Carded / Mint in Blister' },
                { id: 'loose', label: 'Loose Display Mint' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCondition(c.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                    selectedCondition === c.id
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Year */}
          <div>
            <label className="text-xs uppercase font-mono font-bold text-slate-400 block mb-2">
              Production Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
            >
              <option value="all">All Release Years</option>
              {years.map((y) => (
                <option key={y} value={y.toString()}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Max Price Range Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase font-mono font-bold text-slate-400">
                Max Price
              </label>
              <span className="text-xs font-mono font-bold text-emerald-400">
                ${maxPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="40000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>$50</span>
              <span>$10,000</span>
              <span>$40,000+</span>
            </div>
          </div>

        </aside>

        {/* Right Product Grid */}
        <div className="lg:col-span-9">
          
          {filteredCollectibles.length === 0 ? (
            <div className="p-16 rounded-3xl bg-slate-900/40 border border-white/5 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                No matching collectibles found
              </h3>
              <p className="text-sm text-slate-400 max-w-md mb-6">
                Try clearing your search terms or broadening the rarity, year, and price range filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCollectibles.map((item) => (
                <CollectibleCard key={item.id} collectible={item} />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
