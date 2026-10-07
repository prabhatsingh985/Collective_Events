import { Series, SeriesCategory, Casting, CategoryMeta } from './types';
import { allHotwheelsSeries, allCategories } from './series';
import { hotwheelsCastings } from './castings';
import { hotwheelsYears, ALL_YEARS, CATALOG_YEAR_START, CATALOG_YEAR_END } from './years';

export * from './types';
export * from './series';
export * from './castings';
export * from './years';

/**
 * Verified historical narrative text for Hot Wheels catalog
 */
export const ABOUT_HOTWHEELS =
  'Hot Wheels is a collectible die-cast toy car line made by Mattel since 1968, with scale models of real makes and models. Its main rival Matchbox was long-time competition until Mattel bought Tyco in 1996.';

export function getSeriesById(id: string): Series | undefined {
  return allHotwheelsSeries.find((s) => s.id.toLowerCase() === id.toLowerCase());
}

export function getSeriesByCategory(category: SeriesCategory): Series[] {
  return allHotwheelsSeries.filter((s) => s.category === category);
}

export function getCategoryMeta(id: SeriesCategory): CategoryMeta | undefined {
  return allCategories.find((c) => c.id === id);
}

export function getCastingById(id: string): Casting | undefined {
  return hotwheelsCastings.find((c) => c.id.toLowerCase() === id.toLowerCase());
}

export function getCastingsBySeries(seriesId: string): Casting[] {
  return hotwheelsCastings.filter((c) => c.seriesId.toLowerCase() === seriesId.toLowerCase());
}

export function getCastingsByYear(year: number): Casting[] {
  return hotwheelsCastings.filter((c) => c.year === year);
}

export function getFeaturedSeries(): Series[] {
  // Highlight landmark lines across eras
  const featuredIds = [
    'flying-colors',
    'car-culture',
    'red-line-club',
    'acceleracers',
    'the-hot-ones',
    'boulevard',
    'super-chromes',
    'elite-64',
  ];
  return allHotwheelsSeries.filter((s) => featuredIds.includes(s.id));
}

export interface CatalogSearchResult {
  castings: Casting[];
  series: Series[];
}

export function searchCatalog(query: string): CatalogSearchResult {
  const clean = query.trim().toLowerCase();
  if (!clean) {
    return { castings: [], series: [] };
  }

  const matchedSeries = allHotwheelsSeries.filter(
    (s) =>
      s.name.toLowerCase().includes(clean) ||
      s.category.toLowerCase().includes(clean) ||
      (s.description && s.description.toLowerCase().includes(clean))
  );

  const matchedCastings = hotwheelsCastings.filter(
    (c) =>
      c.name.toLowerCase().includes(clean) ||
      c.year.toString().includes(clean) ||
      c.scale.toLowerCase().includes(clean) ||
      (c.notes && c.notes.toLowerCase().includes(clean))
  );

  return {
    castings: matchedCastings,
    series: matchedSeries,
  };
}
