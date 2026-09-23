import React from 'react';
import { DollarSign, ShieldCheck, Flame, Users } from 'lucide-react';

export const StatsBanner: React.FC = () => {
  const stats = [
    {
      label: 'Tracked Portfolio Value',
      value: '$4.8M+',
      subtext: 'Across all collector vaults',
      icon: <DollarSign className="w-5 h-5 text-emerald-400" />,
      color: 'from-emerald-500/20 to-emerald-500/5'
    },
    {
      label: 'Verified Castings & Slabs',
      value: '142,000+',
      subtext: 'Hot Wheels & PSA/BGS records',
      icon: <Flame className="w-5 h-5 text-amber-400" />,
      color: 'from-amber-500/20 to-amber-500/5'
    },
    {
      label: 'Authentication Index',
      value: '99.8%',
      subtext: 'Marketplace verified authenticity',
      icon: <ShieldCheck className="w-5 h-5 text-cyan-400" />,
      color: 'from-cyan-500/20 to-cyan-500/5'
    },
    {
      label: 'Active Collectors',
      value: '38,500+',
      subtext: 'In global collector community',
      icon: <Users className="w-5 h-5 text-purple-400" />,
      color: 'from-purple-500/20 to-purple-500/5'
    }
  ];

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl bg-gradient-to-b ${s.color} bg-slate-900/60 border border-white/5 backdrop-blur-md hover:border-white/15 transition-all group`}
            >
              <div className="p-3 rounded-xl bg-slate-950/80 w-fit mb-4 border border-white/5 group-hover:scale-110 transition-transform">
                {s.icon}
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {s.value}
              </div>
              <div className="font-bold text-sm text-slate-200 mt-1">{s.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.subtext}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
