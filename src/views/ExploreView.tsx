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
      if (activeCategoryFilter !== 'all' && item.category !== activeCategoryFilter) {
        return false;
      }
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
      if (selectedBrand !== 'all' && item.brand !== selectedBrand) {
        return false;
      }
      if (selectedRarity !== 'all' && item.rarity !== selectedRarity) {
        return false;
      }
      if (selectedCondition !== 'all') {
        if (selectedCondition === 'gem-mint' && !item.condition.includes('Gem Mint')) return false;
        if (selectedCondition === 'carded' && !item.condition.includes('Carded')) return false;
        if (selectedCondition === 'loose' && !item.condition.includes('Loose')) return false;
      }
      if (selectedSeries !== 'all' && item.series !== selectedSeries) {
        return false;
      }
      if (selectedYear !== 'all' && item.year.toString() !== selectedYear) {
        return false;
      }
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
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto text-[#004449]">
      
      {/* ========================================================
          1. HEADER & SEARCH
          ======================================================== */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#004449]/70 font-bold">
              Marketplace Catalog
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#004449] tracking-tight mt-1">
              Explore Collectibles
            </h1>
            <p className="text-[#004449]/70 text-sm mt-1 font-medium">
              Showing {filteredCollectibles.length} verified listings across Hot Wheels & Graded Slabs
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-4 py-2.5 rounded-full bg-[#d7ffc2] text-[#004449] text-sm font-semibold flex items-center gap-2 border border-[#004449]/15"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#004449]" />
              <span>Filters ({activeFiltersCount})</span>
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 rounded-full text-xs font-medium text-[#004449]/70 hover:text-[#483cff] flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset all</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar & Category Tabs */}
        <div className="flex flex-col lg:flex-row items-stretch gap-4 bg-[#fffef0] p-3 rounded-[24px] border border-[#004449]/15 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
          
          {/* Main Search Bar */}
          <div className="relative flex-1 flex items-center">
            <Search className="w-5 h-5 text-[#004449]/50 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model, player, pokemon, year, series, or casting..."
              className="w-full bg-[#f6f5e2]/50 rounded-[16px] pl-12 pr-10 py-3.5 text-sm text-[#004449] placeholder-[#004449]/50 border border-[#004449]/15 focus:outline-none focus:border-[#483cff] font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 rounded-full text-[#004449]/50 hover:text-[#004449]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Tabs: All / Hot Wheels / Trading Cards */}
          <div className="flex items-center gap-1.5 bg-[#f6f5e2]/60 p-1.5 rounded-full border border-[#004449]/10 shrink-0">
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeCategoryFilter === 'all'
                  ? 'bg-[#004449] text-[#fffef0] shadow-sm'
                  : 'text-[#004449]/70 hover:text-[#004449]'
              }`}
            >
              All ({collectibles.length})
            </button>
            <button
              onClick={() => setActiveCategoryFilter('hot-wheels')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeCategoryFilter === 'hot-wheels'
                  ? 'bg-[#d7ffc2] text-[#004449] border border-[#004449]/20 font-bold'
                  : 'text-[#004449]/70 hover:text-[#004449]'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Hot Wheels</span>
            </button>
            <button
              onClick={() => setActiveCategoryFilter('trading-cards')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeCategoryFilter === 'trading-cards'
                  ? 'bg-[#483cff] text-[#fffef0] shadow-sm'
                  : 'text-[#004449]/70 hover:text-[#004449]'
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
        
        {/* Left Filter Sidebar */}
        <aside
          className={`lg:col-span-3 bg-[#fffef0] rounded-[24px] p-6 border border-[#004449]/15 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] space-y-6 ${
            mobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#004449]/10">
            <h3 className="font-bold text-sm text-[#004449] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#004449]" />
              <span>Filters</span>
            </h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#483cff] font-semibold hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort By Filter */}
          <div>
            <label className="text-xs uppercase font-mono font-bold text-[#004449]/70 block mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#fffef0] border border-[#004449]/20 rounded-[16px] px-3.5 py-2.5 text-xs text-[#004449] focus:outline-none focus:border-[#483cff] font-medium"
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
            <label className="text-xs uppercase font-mono font-bold text-[#004449]/70 block mb-2">
              Rarity Tier
            </label>
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="w-full bg-[#fffef0] border border-[#004449]/20 rounded-[16px] px-3.5 py-2.5 text-xs text-[#004449] focus:outline-none focus:border-[#483cff] font-medium"
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
            <label className="text-xs uppercase font-mono font-bold text-[#004449]/70 block mb-2">
              Brand / Manufacturer
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-[#fffef0] border border-[#004449]/20 rounded-[16px] px-3.5 py-2.5 text-xs text-[#004449] focus:outline-none focus:border-[#483cff] font-medium"
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
            <label className="text-xs uppercase font-mono font-bold text-[#004449]/70 block mb-2">
              Series / Set
            </label>
            <select
              value={selectedSeries}
              onChange={(e) => setSelectedSeries(e.target.value)}
              className="w-full bg-[#fffef0] border border-[#004449]/20 rounded-[16px] px-3.5 py-2.5 text-xs text-[#004449] focus:outline-none focus:border-[#483cff] font-medium"
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
            <label className="text-xs uppercase font-mono font-bold text-[#004449]/70 block mb-2">
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
                  className={`w-full text-left px-3.5 py-2 rounded-full text-xs font-medium transition-all ${
                    selectedCondition === c.id
                      ? 'bg-[#d7ffc2] text-[#004449] font-bold border border-[#004449]/20'
                      : 'text-[#004449]/70 hover:text-[#004449] hover:bg-[#f6f5e2]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Year */}
          <div>
            <label className="text-xs uppercase font-mono font-bold text-[#004449]/70 block mb-2">
              Production Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-[#fffef0] border border-[#004449]/20 rounded-[16px] px-3.5 py-2.5 text-xs text-[#004449] focus:outline-none focus:border-[#483cff] font-mono"
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
              <label className="text-xs uppercase font-mono font-bold text-[#004449]/70">
                Max Price
              </label>
              <span className="text-xs font-mono font-bold text-[#004449]">
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
              className="w-full accent-[#004449] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#004449]/60 font-mono mt-1">
              <span>$50</span>
              <span>$10,000</span>
              <span>$40,000+</span>
            </div>
          </div>

        </aside>

        {/* Right Product Grid */}
        <div className="lg:col-span-9">
          
          {filteredCollectibles.length === 0 ? (
            <div className="p-16 rounded-[24px] bg-[#fffef0] border border-[#004449]/15 text-center flex flex-col items-center justify-center shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[#d7ffc2] flex items-center justify-center text-[#004449] mb-4">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#004449] mb-2">
                No matching collectibles found
              </h3>
              <p className="text-sm text-[#004449]/70 max-w-md mb-6 font-medium">
                Try clearing your search terms or broadening the rarity, year, and price range filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-full bg-[#004449] text-[#fffef0] font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-all"
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
