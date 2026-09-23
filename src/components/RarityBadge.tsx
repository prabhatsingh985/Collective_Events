import React from 'react';
import type { RarityTier } from '../types/collectible';

import { Flame, Sparkles, Crown, ShieldAlert, Award, Star, Gem } from 'lucide-react';

interface RarityBadgeProps {
  rarity: RarityTier;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RarityBadge: React.FC<RarityBadgeProps> = ({ rarity, size = 'sm', className = '' }) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2'
  }[size];

  switch (rarity) {
    case 'Super Treasure Hunt':
      return (
        <span
          className={`inline-flex items-center font-bold tracking-wider uppercase rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/25 to-amber-600/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)] ${sizeClasses} ${className}`}
        >
          <Flame className="w-3 h-3 text-amber-400 fill-amber-400/80 animate-pulse" />
          <span>STH • Super Treasure</span>
        </span>
      );

    case 'RLC Exclusive':
      return (
        <span
          className={`inline-flex items-center font-bold tracking-wider uppercase rounded-full bg-gradient-to-r from-blue-600/20 via-cyan-500/25 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)] ${sizeClasses} ${className}`}
        >
          <Award className="w-3 h-3 text-cyan-400" />
          <span>RLC Club Exclusive</span>
        </span>
      );

    case 'Vintage Redline':
      return (
        <span
          className={`inline-flex items-center font-bold tracking-wider uppercase rounded-full bg-red-950/40 text-red-300 border border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.2)] ${sizeClasses} ${className}`}
        >
          <ShieldAlert className="w-3 h-3 text-red-400" />
          <span>Redline 1968</span>
        </span>
      );

    case 'Vintage Grail':
      return (
        <span
          className={`inline-flex items-center font-bold tracking-wider uppercase rounded-full bg-gradient-to-r from-yellow-500/20 via-amber-400/30 to-amber-600/20 text-amber-200 border border-amber-300/50 shadow-[0_0_15px_rgba(251,191,36,0.3)] ${sizeClasses} ${className}`}
        >
          <Crown className="w-3 h-3 text-amber-300 fill-amber-300/60" />
          <span>Holy Grail Tier</span>
        </span>
      );

    case 'Gem Mint Rookie':
      return (
        <span
          className={`inline-flex items-center font-bold tracking-wider uppercase rounded-full bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)] ${sizeClasses} ${className}`}
        >
          <Gem className="w-3 h-3 text-emerald-400" />
          <span>PSA 10 / BGS 9.5 RC</span>
        </span>
      );

    case 'Secret Rare':
    case 'Special Illustration':
      return (
        <span
          className={`inline-flex items-center font-bold tracking-wider uppercase rounded-full bg-gradient-to-r from-purple-500/25 via-pink-500/25 to-indigo-500/25 text-purple-200 border border-purple-400/40 shadow-[0_0_14px_rgba(168,85,247,0.25)] ${sizeClasses} ${className}`}
        >
          <Sparkles className="w-3 h-3 text-purple-300 animate-spin-slow" />
          <span>{rarity}</span>
        </span>
      );

    case 'Chase Edition':
      return (
        <span
          className={`inline-flex items-center font-bold tracking-wider uppercase rounded-full bg-neutral-900 text-neutral-300 border border-neutral-600 shadow-[0_0_10px_rgba(255,255,255,0.1)] ${sizeClasses} ${className}`}
        >
          <Star className="w-3 h-3 text-neutral-300 fill-neutral-300" />
          <span>Chase 0/5</span>
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center font-medium tracking-wide rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60 ${sizeClasses} ${className}`}
        >
          <span>{rarity}</span>
        </span>
      );
  }
};
