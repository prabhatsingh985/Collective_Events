export type SeriesCategory =
  | 'early-collection'
  | 'early-special'
  | 'modern-special'
  | 'themed-assortment'
  | 'exclusive'
  | 'larger-scale'
  | 'miscellaneous';

export interface Series {
  id: string;
  name: string;
  category: SeriesCategory;
  yearStart?: number;
  yearEnd?: number;
  description?: string;
  isExclusive?: boolean;
  scale?: string;
}

export interface Casting {
  id: string;
  name: string;
  year: number;
  seriesId: string;
  collectorNumber?: string;
  scale: string;
  color?: string;
  designer?: string;
  notes?: string;
  imageUrl?: string;
  verified: boolean;
}

export interface Year {
  year: number;
  castingIds: string[];
}

export interface CategoryMeta {
  id: SeriesCategory;
  name: string;
  shortDesc: string;
  longDesc: string;
  era: string;
  accentColor: string;
  badgeBg: string;
}
