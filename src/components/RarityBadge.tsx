import React from 'react';
import type { RarityTier } from '../types/collectible';
import { Flame, Sparkles, Crown, Award, Star, Gem } from 'lucide-react';

interface RarityBadgeProps {
  rarity: RarityTier;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RarityBadge: React.FC<RarityBadgeProps> = ({ rarity, size = 'sm', className = '' }) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1',
    md: 'text-xs px-3 py-1 gap-1.5',
    lg: 'text-sm px-4 py-1.5 gap-2'
  }[size];

  switch (rarity) {
    case 'Super Treasure Hunt':
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-full bg-[#d7ffc2] text-[#004449] border border-[#004449]/20 shadow-sm ${sizeClasses} ${className}`}
        >
          <Flame className="w-3 h-3 text-[#004449] fill-[#004449]" />
          <span>STH • Super Treasure</span>
        </span>
      );

    case 'RLC Exclusive':
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-full bg-[#fffef0] text-[#004449] border border-[#004449]/30 shadow-sm ${sizeClasses} ${className}`}
        >
          <Award className="w-3 h-3 text-[#483cff]" />
          <span>RLC Club</span>
        </span>
      );

    case 'Vintage Redline':
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-full bg-[#d7ffc2] text-[#004449] border border-[#004449]/20 ${sizeClasses} ${className}`}
        >
          <span>Redline 1968</span>
        </span>
      );

    case 'Vintage Grail':
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-full bg-[#483cff] text-[#fffef0] shadow-sm ${sizeClasses} ${className}`}
        >
          <Crown className="w-3 h-3 text-[#d7ffc2]" />
          <span>Holy Grail</span>
        </span>
      );

    case 'Gem Mint Rookie':
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-full bg-[#d7ffc2] text-[#004449] border border-[#004449]/20 ${sizeClasses} ${className}`}
        >
          <Gem className="w-3 h-3 text-[#004449]" />
          <span>PSA 10 Gem Mint</span>
        </span>
      );

    case 'Secret Rare':
    case 'Special Illustration':
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-full bg-[#e8e6ff] text-[#483cff] border border-[#483cff]/30 ${sizeClasses} ${className}`}
        >
          <Sparkles className="w-3 h-3 text-[#483cff]" />
          <span>{rarity}</span>
        </span>
      );

    case 'Chase Edition':
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-full bg-[#004449] text-[#fffef0] ${sizeClasses} ${className}`}
        >
          <Star className="w-3 h-3 text-[#0bff80] fill-[#0bff80]" />
          <span>Chase 0/5</span>
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-[#fffef0] text-[#004449] border border-[#004449]/20 ${sizeClasses} ${className}`}
        >
          <span>{rarity}</span>
        </span>
      );
  }
};
