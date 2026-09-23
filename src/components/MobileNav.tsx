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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#004449] border-t border-[#000000]/20 px-3 py-2 text-[#fffef0]">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`relative flex flex-col items-center gap-1 py-1.5 px-3 rounded-full transition-all duration-200 ${
                isActive ? 'text-[#004449] bg-[#d7ffc2]' : 'text-[#fffef0]/80 hover:text-[#fffef0]'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`absolute -top-1.5 -right-2 w-4 h-4 text-[9px] font-bold rounded-full flex items-center justify-center font-mono ${
                    isActive ? 'bg-[#004449] text-[#d7ffc2]' : 'bg-[#483cff] text-[#fffef0]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold tracking-wide">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
