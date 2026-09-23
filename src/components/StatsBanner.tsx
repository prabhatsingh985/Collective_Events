import React from 'react';
import { DollarSign, ShieldCheck, Flame, Users } from 'lucide-react';

export const StatsBanner: React.FC = () => {
  const stats = [
    {
      label: 'Tracked Portfolio Value',
      value: '$4.8M+',
      subtext: 'Across all verified collector vaults',
      icon: <DollarSign className="w-5 h-5 text-[#004449]" />
    },
    {
      label: 'Verified Castings & Slabs',
      value: '142,000+',
      subtext: 'Hot Wheels & PSA/BGS records',
      icon: <Flame className="w-5 h-5 text-[#483cff]" />
    },
    {
      label: 'Authentication Index',
      value: '99.8%',
      subtext: 'Marketplace verified authenticity',
      icon: <ShieldCheck className="w-5 h-5 text-[#004449]" />
    },
    {
      label: 'Active Collectors',
      value: '38,500+',
      subtext: 'In global vault community',
      icon: <Users className="w-5 h-5 text-[#483cff]" />
    }
  ];

  return (
    <section className="w-full bg-[#d7ffc2] py-20 px-4 sm:px-6 lg:px-8 border-y border-[#000000]/10">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Section Opener */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-mono tracking-widest font-bold text-[#004449]/70">
            Collector Statistics
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#004449] mt-2">
            Verified scale & market credibility
          </h2>
        </div>

        {/* 4 Equal Parchment Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="p-8 rounded-[24px] bg-[#fffef0] border border-[#004449]/15 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-[#d7ffc2] flex items-center justify-center mb-6 text-[#004449]">
                {s.icon}
              </div>
              <div className="font-mono text-3xl font-bold text-[#004449] tracking-tight">
                {s.value}
              </div>
              <div className="font-bold text-sm text-[#004449] mt-1.5">{s.label}</div>
              <div className="text-xs text-[#004449]/70 mt-1 leading-relaxed">{s.subtext}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
