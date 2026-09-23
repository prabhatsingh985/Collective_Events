import React, { useState } from 'react';
import { useCollection } from '../context/CollectionContext';
import type { ActivePage } from '../types/collectible';
import { 
  Flame, 
  Search, 
  Heart, 
  Layers, 
  Sparkles, 
  Car, 
  Menu,
  X
} from 'lucide-react';


export const Navbar: React.FC = () => {
  const { 
    activePage, 
    setActivePage, 
    collectionStats, 
    wishlistIds, 
    setQuickSearchOpen 
  } = useCollection();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: ActivePage; label: string; icon?: React.ReactNode; badge?: number }[] = [
    { id: 'explore', label: 'Explore' },
    { id: 'hot-wheels', label: 'Hot Wheels', icon: <Car className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'trading-cards', label: 'Trading Cards', icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" /> },
    { 
      id: 'my-collection', 
      label: 'My Collection', 
      icon: <Layers className="w-3.5 h-3.5 text-emerald-400" />,
      badge: collectionStats.totalItems 
    },
  ];

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0b0d13]/85 border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-purple-600 p-[1.5px] shadow-[0_0_20px_rgba(245,158,11,0.3)] group-hover:shadow-[0_0_28px_rgba(245,158,11,0.5)] transition-all">
            <div className="w-full h-full bg-[#0b0d13] rounded-[10px] flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400/80 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1 font-['Outfit']">
              COLLECTR
              <span className="text-[10px] font-bold tracking-widest text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 font-mono">
                PRO
              </span>
            </span>
            <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono -mt-0.5">
              Vault & Discovery
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-2xl border border-white/5">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'text-white bg-white/10 shadow-sm border border-white/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
                {link.badge !== undefined && link.badge > 0 && (
                  <span
                    className={`text-[11px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Search Trigger */}
          <button
            onClick={() => setQuickSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-400 bg-slate-900/80 hover:bg-slate-850 hover:text-slate-200 border border-white/5 transition-all"
            title="Search collectibles (Hot Wheels, Cards, Sets...)"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span className="hidden lg:inline font-medium">Search vault...</span>
            <kbd className="hidden lg:inline-flex text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-white/5 font-mono">
              /
            </kbd>
          </button>

          {/* Wishlist Quick Button */}
          <button
            onClick={() => handleNavClick('my-collection')}
            className="relative p-2.5 rounded-xl text-slate-400 hover:text-rose-400 bg-slate-900/80 hover:bg-slate-850 border border-white/5 transition-all"
            title="View Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistIds.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-pulse">
                {wishlistIds.length}
              </span>
            )}
          </button>

          {/* Live Portfolio Valuation Pill */}
          <button
            onClick={() => handleNavClick('my-collection')}
            className="hidden sm:flex items-center gap-2 pl-3 pr-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900/90 border border-emerald-500/30 hover:border-emerald-500/60 transition-all text-left group"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">
                Vault Value
              </div>
              <div className="text-xs font-bold text-emerald-300 font-mono group-hover:text-emerald-200">
                ${collectionStats.totalValue.toLocaleString()}
              </div>
            </div>
          </button>

          {/* Profile Avatar */}
          <div 
            onClick={() => handleNavClick('my-collection')}
            className="flex items-center gap-2 cursor-pointer p-1 rounded-full bg-slate-900 border border-white/10 hover:border-amber-400/50 transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Collector Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-500/30"
            />
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-white/5"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0e121c] border-b border-white/10 px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
          
          <div className="pt-3 mt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Portfolio Valuation</span>
            <span className="text-emerald-400 font-bold text-sm">
              ${collectionStats.totalValue.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
