import { Series, SeriesCategory, CategoryMeta } from './types';
import { earlyCollectionSeries } from './categories/early-collection';
import { earlySpecialSeries } from './categories/early-special';
import { modernSpecialSeries } from './categories/modern-special';
import { themedAssortmentSeries } from './categories/themed-assortment';
import { exclusiveSeries } from './categories/exclusive';
import { largerScaleSeries } from './categories/larger-scale';
import { miscellaneousSeries } from './categories/miscellaneous';

export const allCategories: CategoryMeta[] = [
  {
    id: 'early-collection',
    name: 'Early Collection',
    era: '1968 - 1989',
    shortDesc: 'Foundational Redline & Blackwall mainlines that launched the global hobby.',
    longDesc: 'The pioneering era of Hot Wheels featuring Spectraflame paint, Redline tires, The Heavyweights, Super Chromes, and the iconic Flying Colors.',
    accentColor: 'text-amber-500',
    badgeBg: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
  },
  {
    id: 'early-special',
    name: 'Early Special',
    era: '1970 - 1995',
    shortDesc: 'Innovative motorized lines, color changers, and interactive stunt series.',
    longDesc: 'Electric Sizzlers, spring-loaded Crack-Ups, Chopcycles, and color-morphing automagic series that redefined toy vehicle technology.',
    accentColor: 'text-cyan-500',
    badgeBg: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20 dark:text-cyan-400',
  },
  {
    id: 'modern-special',
    name: 'Modern Special',
    era: '1995 - Present',
    shortDesc: 'Premium collector lines, Car Culture, AcceleRacers, and pop entertainment.',
    longDesc: 'The pinnacle of adult die-cast collecting with Real Riders, all-metal castings, Boulevard legends, and licensed entertainment icons.',
    accentColor: 'text-indigo-500',
    badgeBg: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400',
  },
  {
    id: 'themed-assortment',
    name: 'Themed Assortment',
    era: 'Annual & Seasonal',
    shortDesc: 'Curated retail series celebrating automotive heritage, Batman, and holidays.',
    longDesc: 'Themed card art collections covering 50th Anniversary tributes, Neon Speeders, Batman cinematic runs, and holiday hot rods.',
    accentColor: 'text-rose-500',
    badgeBg: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400',
  },
  {
    id: 'exclusive',
    name: 'Exclusive & Club',
    era: 'Collector Direct',
    shortDesc: 'Limited edition Red Line Club, Elite 64, and numbered membership releases.',
    longDesc: 'High-tier collector offerings with opening components, mirrored acrylic cases, Spectraflame hand-polished finishes, and NFT garage redemptions.',
    accentColor: 'text-yellow-500',
    badgeBg: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400',
  },
  {
    id: 'larger-scale',
    name: 'Larger Scale',
    era: '1:43, 1:50 & 1:18',
    shortDesc: 'Museum precision models, oversized display pieces, and pull-back racers.',
    longDesc: 'Detailed multi-piece assemblies in larger collector ratios including Hot Wheels Elite, Premium 1:43, and Batman 1:50 scale editions.',
    accentColor: 'text-emerald-500',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
  },
  {
    id: 'miscellaneous',
    name: 'Miscellaneous',
    era: 'Archive & Multi-Packs',
    shortDesc: 'Consecutive collector numbers 1-1121, multipack exclusives, and HO scale.',
    longDesc: 'Historical catalog classifications, classic blue card numbering systems, multi-car gift sets, and specialized micro-scale issues.',
    accentColor: 'text-purple-500',
    badgeBg: 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400',
  },
];

export const allHotwheelsSeries: Series[] = [
  ...earlyCollectionSeries,
  ...earlySpecialSeries,
  ...modernSpecialSeries,
  ...themedAssortmentSeries,
  ...exclusiveSeries,
  ...largerScaleSeries,
  ...miscellaneousSeries,
];
