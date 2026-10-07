import { Casting } from './types';

/**
 * Hot Wheels Reference Castings
 *
 * NOTE ON DATA VERIFICATION:
 * - Only "Deora" is verified for historical existence (1968 debut).
 * - All other items are clearly flagged as unverified placeholders (verified: false).
 * - No specs, designers, or colors are hallucinated or presented as fact.
 */
export const hotwheelsCastings: Casting[] = [
  // 1. VERIFIED: Deora (Seed existence only, all specs left undefined)
  {
    id: 'deora',
    name: 'Deora',
    year: 1968,
    seriesId: 'classics',
    scale: '1:64',
    verified: true,
  },

  // 2-10: Clearly-marked Unverified Placeholders
  {
    id: 'placeholder-custom-mustang',
    name: 'Custom Mustang (Placeholder)',
    year: 1968,
    seriesId: 'flying-colors',
    scale: '1:64',
    verified: false,
    notes: 'Placeholder casting record awaiting primary archive verification.',
  },
  {
    id: 'placeholder-twin-mill',
    name: 'Twin Mill (Placeholder)',
    year: 1969,
    seriesId: 'super-chromes',
    scale: '1:64',
    verified: false,
    notes: 'Placeholder casting record awaiting primary archive verification.',
  },
  {
    id: 'placeholder-sizzlers-corvette',
    name: 'Sizzlers Corvette (Placeholder)',
    year: 1970,
    seriesId: 'sizzlers',
    scale: '1:64',
    verified: false,
    notes: 'Placeholder casting record awaiting primary archive verification.',
  },
  {
    id: 'placeholder-rodger-dodger',
    name: 'Rodger Dodger (Placeholder)',
    year: 1974,
    seriesId: 'the-hot-ones',
    scale: '1:64',
    verified: false,
    notes: 'Placeholder casting record awaiting primary archive verification.',
  },
  {
    id: 'placeholder-baja-breaker',
    name: 'Baja Breaker (Placeholder)',
    year: 1978,
    seriesId: 'trailbusters',
    scale: '1:64',
    verified: false,
    notes: 'Placeholder casting record awaiting primary archive verification.',
  },
  {
    id: 'placeholder-purple-passion',
    name: 'Purple Passion (Placeholder)',
    year: 1990,
    seriesId: 'collector-numbers-1-1121',
    scale: '1:64',
    verified: false,
    notes: 'Placeholder casting record awaiting primary archive verification.',
  },
  {
    id: 'placeholder-bone-shaker',
    name: 'Bone Shaker (Placeholder)',
    year: 2006,
    seriesId: 'car-culture',
    scale: '1:64',
    verified: false,
    notes: 'Placeholder casting record awaiting primary archive verification.',
  },
  {
    id: 'placeholder-batmobile-screen',
    name: 'Batmobile 1989 (Placeholder)',
    year: 2015,
    seriesId: 'batman',
    scale: '1:64',
    verified: false,
    notes: 'Placeholder casting record awaiting primary archive verification.',
  },
  {
    id: 'placeholder-mazda-miata-2026',
    name: 'Mazda MX-5 Miata (Placeholder 2026)',
    year: 2026,
    seriesId: 'car-culture',
    scale: '1:64',
    verified: false,
    notes: 'Placeholder record referenced in 2026 mainline previews.',
  },
];
