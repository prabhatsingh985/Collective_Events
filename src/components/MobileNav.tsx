import React from 'react';
import { useCollection } from '../context/CollectionContext';
import type { ActivePage } from '../types/collectible';

import { Home, Compass, Car, Sparkles, Layers } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activePage, setActivePage, collectionStats } = useCollection();

  const items: { id: ActivePage; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'landing', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'explore', label: 'Explore', icon: <Compass className="w-5 h-5" /> },
    { id: 'hot-wheels', label: 'Hot Wheels', icon: <Car className="w-5 h-5" /> },
    { id: 'trading-cards', label: 'Cards', icon: <Sparkles className="w-5 h-5" /> },
    { 
      id: 'my-collection', 
      label: 'Vault', 
      icon: <Layers className="w-5 h-5" />, 
      badge: collectionStats.totalItems 
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0c101a]/95 backdrop-blur-2xl border-t border-white/10 px-3 py-2">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`relative flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all duration-200 ${
                isActive ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-amber-500 text-slate-950 text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-semibold tracking-wide ${isActive ? 'text-amber-300 font-bold' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 -mt-0.5 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
