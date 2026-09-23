import React, { useState } from 'react';
import { useCollection } from '../context/CollectionContext';
import { Flame, Sparkles, Car, Shield, Send, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActivePage, addToast } = useCollection();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    addToast('Subscribed to Drop Alerts! 📬', 'You will receive notifications for rare Hot Wheels and Card drops.', 'success');
    setEmail('');
  };

  return (
    <footer className="w-full bg-[#080a0f] border-t border-white/5 pt-16 pb-24 md:pb-16 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter Grid */}
        <div className="rounded-3xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 p-8 sm:p-10 border border-white/10 mb-16 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Never Miss A Super Treasure Hunt Or Grail Slab
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Get real-time market drop alerts.
              </h3>
              <p className="text-slate-400 text-sm mt-2">
                Join 38,000+ passionate collectors tracking RLC drops, Pokemon 1st editions, and vintage Hot Wheels.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your collector email..."
                className="px-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-full sm:w-80 text-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm hover:from-amber-400 hover:to-orange-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 shrink-0"
              >
                {subscribed ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <>
                    <span>Join Alerts</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                <Flame className="w-5 h-5 text-slate-950" />
              </div>
              <span className="font-black text-xl tracking-tight text-white font-['Outfit']">
                COLLECTR
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-sm">
              The premier digital platform engineered for physical collectors. Track market values, catalog rare variants, and showcase your collection to the world.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Verified Slabs & Castings
              </span>
              <span>•</span>
              <span>100% Collector Powered</span>
            </div>
          </div>

          {/* Navigation Column 1 */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-4 font-mono">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => setActivePage('explore')} className="hover:text-amber-300 transition-colors">
                  All Collectibles
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('hot-wheels')} className="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-amber-400" />
                  Hot Wheels Hub
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('trading-cards')} className="hover:text-purple-300 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  Trading Cards Hub
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('my-collection')} className="hover:text-emerald-300 transition-colors">
                  My Collection Vault
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2 */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-4 font-mono">
              Hot Wheels
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => setActivePage('hot-wheels')} className="hover:text-amber-300 transition-colors">
                  Super Treasure Hunts
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('hot-wheels')} className="hover:text-amber-300 transition-colors">
                  Red Line Club (RLC)
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('hot-wheels')} className="hover:text-amber-300 transition-colors">
                  Car Culture Series
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('hot-wheels')} className="hover:text-amber-300 transition-colors">
                  Original 1968 Redlines
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Column 3 */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-4 font-mono">
              Trading Cards
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => setActivePage('trading-cards')} className="hover:text-purple-300 transition-colors">
                  Pokémon Base 1st Edition
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('trading-cards')} className="hover:text-purple-300 transition-colors">
                  Vintage Basketball Rookies
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('trading-cards')} className="hover:text-purple-300 transition-colors">
                  Magic: The Gathering Alpha
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('trading-cards')} className="hover:text-purple-300 transition-colors">
                  PSA & BGS 10 Slabs
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; 2026 COLLECTR Technologies Inc. Frontend UI Prototype Demo.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Grading Standards</span>
            <span className="hover:text-slate-400 cursor-pointer">API Prototype</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
