import { Year } from './types';
import { hotwheelsCastings } from './castings';

export const CATALOG_YEAR_START = 1968;
export const CATALOG_YEAR_END = 2026;

// All years from 1968 to 2026 in descending or ascending order
export const ALL_YEARS: number[] = Array.from(
  { length: CATALOG_YEAR_END - CATALOG_YEAR_START + 1 },
  (_, i) => CATALOG_YEAR_START + i
);

export const hotwheelsYears: Year[] = ALL_YEARS.map((yr) => ({
  year: yr,
  castingIds: hotwheelsCastings
    .filter((c) => c.year === yr)
    .map((c) => c.id),
}));
