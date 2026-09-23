import React, { useState } from 'react';
import { useCollection } from '../context/CollectionContext';
import type { ActivePage } from '../types/collectible';
import { 
  Search, 
  Heart, 
  Menu,
  X,
  Compass,
  Car,
  Sparkles,
  Layers
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
    { id: 'explore', label: 'EXPLORE', icon: <Compass className="w-3.5 h-3.5 text-[#d7ffc2]" /> },
    { id: 'hot-wheels', label: 'HOT WHEELS', icon: <Car className="w-3.5 h-3.5 text-[#0bff80]" /> },
    { id: 'trading-cards', label: 'TRADING CARDS', icon: <Sparkles className="w-3.5 h-3.5 text-[#d7ffc2]" /> },
    { 
      id: 'my-collection', 
      label: 'MY VAULT', 
      icon: <Layers className="w-3.5 h-3.5 text-[#0bff80]" />,
      badge: collectionStats.totalItems 
    },
  ];

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#004449] border-b border-[#000000]/20 transition-all text-[#fffef0]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo - Going™ Style */}
        <div 
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-full bg-[#d7ffc2] flex items-center justify-center text-[#004449] font-bold text-lg shadow-sm">
            C™
          </div>
          <div>
            <span className="font-bold text-2xl tracking-tight text-[#fffef0] flex items-center gap-1.5 font-['Inter']">
              COLLECTR™
            </span>
          </div>
        </div>

        {/* Center: Uppercase Text Links in 475 weight */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3.5 py-2 rounded-full text-[13px] font-medium tracking-[0.06em] transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[#004449] bg-[#d7ffc2] font-semibold'
                    : 'text-[#fffef0] hover:text-[#d7ffc2] hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
                {link.badge !== undefined && link.badge > 0 && (
                  <span
                    className={`text-[11px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-[#004449] text-[#d7ffc2]' : 'bg-white/20 text-[#fffef0]'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Side: Outlined + Filled Electric Iris Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Search Trigger */}
          <button
            onClick={() => setQuickSearchOpen(true)}
            className="p-2.5 rounded-full text-[#fffef0] hover:text-[#d7ffc2] hover:bg-white/10 transition-all border border-white/20"
            title="Search catalog"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Wishlist Pill */}
          <button
            onClick={() => handleNavClick('my-collection')}
            className="relative p-2.5 rounded-full text-[#fffef0] hover:text-[#d7ffc2] hover:bg-white/10 transition-all border border-white/20"
            title="Saved wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistIds.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#483cff] text-[#fffef0] text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistIds.length}
              </span>
            )}
          </button>

          {/* Outlined Action Pill */}
          <button
            onClick={() => handleNavClick('my-collection')}
            className="hidden sm:inline-flex items-center px-4 py-2 border-[1.5px] border-[#fffef0] text-[#fffef0] rounded-full text-xs font-medium tracking-wide hover:bg-white/10 transition-all"
          >
            <span>Vault (${collectionStats.totalValue.toLocaleString()})</span>
          </button>

          {/* Filled Electric Iris Action Pill (Single filled action in viewport) */}
          <button
            onClick={() => handleNavClick('explore')}
            className="px-5 py-2.5 bg-[#483cff] text-[#fffef0] rounded-full text-xs font-semibold hover:opacity-90 transition-all shadow-sm"
          >
            <span>Join for Free</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-[#fffef0] border border-white/20"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#00363a] border-b border-[#000000]/20 px-6 py-6 space-y-3">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-sm font-medium tracking-wider transition-all ${
                  isActive
                    ? 'bg-[#d7ffc2] text-[#004449] font-bold'
                    : 'text-[#fffef0] hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#004449] text-[#d7ffc2]">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
