import React, { useState } from 'react';
import { useCollection } from '../context/CollectionContext';
import { Send, Check, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActivePage, addToast } = useCollection();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    addToast('Subscribed to Collector Alerts! 📬', 'You will receive rare drop notifications.', 'success');
    setEmail('');
  };

  return (
    <footer className="w-full bg-[#004449] text-[#fffef0] pt-20 pb-24 md:pb-20 border-t border-[#000000]/20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mint Wash Newsletter Band */}
        <div className="rounded-[24px] bg-[#d7ffc2] text-[#004449] p-8 sm:p-12 mb-20 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="inline-block px-3 py-1 rounded-full bg-[#004449] text-[#d7ffc2] text-xs font-semibold uppercase tracking-wider mb-3">
                Editorial Drop Alerts
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#004449]">
                Get sun-bleached alerts for rare collectibles.
              </h3>
              <p className="text-[#004449]/80 text-sm mt-2 leading-relaxed">
                Join 38,000+ collectors receiving verified auction drops, Super Treasure Hunt alerts, and PSA 10 slabs.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="px-5 py-3.5 rounded-[16px] bg-[#fffef0] border border-[#004449]/20 text-[#004449] placeholder-[#004449]/50 focus:outline-none focus:border-[#483cff] w-full sm:w-80 text-sm font-medium"
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-full bg-[#483cff] text-[#fffef0] font-semibold text-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 shrink-0 shadow-sm"
              >
                {subscribed ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <>
                    <span>Join Free</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          
          {/* Brand Info */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#d7ffc2] flex items-center justify-center text-[#004449] font-bold text-sm">
                C™
              </div>
              <span className="font-bold text-2xl tracking-tight text-[#fffef0]">
                COLLECTR™
              </span>
            </div>
            <p className="text-sm text-[#fffef0]/80 leading-relaxed mb-6 max-w-sm">
              Sun-bleached travel companion for physical collectors. A warm paper catalog for Hot Wheels, graded trading cards, and personal vault curation.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#d7ffc2]">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified 2026 Auction Pricing</span>
            </div>
          </div>

          {/* Navigation Column 1 */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#d7ffc2] mb-4">
              Explore
            </h4>
            <ul className="space-y-3 text-sm text-[#fffef0]/90">
              <li>
                <button onClick={() => setActivePage('explore')} className="hover:text-[#d7ffc2] transition-colors">
                  All Collectibles
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('hot-wheels')} className="hover:text-[#d7ffc2] transition-colors">
                  Hot Wheels Hub
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('trading-cards')} className="hover:text-[#d7ffc2] transition-colors">
                  Trading Cards Hub
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('my-collection')} className="hover:text-[#d7ffc2] transition-colors">
                  My Collection Vault
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2 */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#d7ffc2] mb-4">
              Hot Wheels
            </h4>
            <ul className="space-y-3 text-sm text-[#fffef0]/90">
              <li>
                <button onClick={() => setActivePage('hot-wheels')} className="hover:text-[#d7ffc2] transition-colors">
                  Super Treasure Hunts
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('hot-wheels')} className="hover:text-[#d7ffc2] transition-colors">
                  Red Line Club (RLC)
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('hot-wheels')} className="hover:text-[#d7ffc2] transition-colors">
                  Original 1968 Sweet 16
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Column 3 */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#d7ffc2] mb-4">
              Trading Cards
            </h4>
            <ul className="space-y-3 text-sm text-[#fffef0]/90">
              <li>
                <button onClick={() => setActivePage('trading-cards')} className="hover:text-[#d7ffc2] transition-colors">
                  Pokémon 1st Edition
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('trading-cards')} className="hover:text-[#d7ffc2] transition-colors">
                  1986 Fleer Basketball
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('trading-cards')} className="hover:text-[#d7ffc2] transition-colors">
                  PSA 10 Gem Mint Slabs
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#fffef0]/60 gap-4">
          <div>
            &copy; 2026 COLLECTR™ Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Grading Standards</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
