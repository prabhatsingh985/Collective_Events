export type CollectibleCategory = 'hot-wheels' | 'trading-cards';

export type RarityTier = 
  | 'Super Treasure Hunt' 
  | 'RLC Exclusive' 
  | 'Vintage Redline' 
  | 'Chase Edition' 
  | 'Mainline Premium' 
  | 'Vintage Grail' 
  | 'Secret Rare' 
  | 'Gem Mint Rookie' 
  | 'Holo Rare' 
  | 'Special Illustration';

export interface PricePoint {
  month: string;
  value: number;
}

export interface Collectible {
  id: string;
  name: string;
  category: CollectibleCategory;
  brand: string;
  series: string;
  year: number;
  rarity: RarityTier;
  condition: string;
  estimatedValue: number;
  originalPrice?: number;
  image: string;
  gallery: string[];
  description: string;
  itemNumber?: string;
  scaleOrSize: string;
  material: string;
  releaseDate: string;
  featured?: boolean;
  trending?: boolean;
  trendingChange?: number; // e.g. +18.4%
  ownersCount: number;
  lastSoldPrice: number;
  priceHistory: PricePoint[];
  tags: string[];
}

export type ActivePage = 'landing' | 'explore' | 'hot-wheels' | 'trading-cards' | 'my-collection';

export interface FilterState {
  searchQuery: string;
  category: 'all' | CollectibleCategory;
  brand: string;
  series: string;
  rarity: string;
  condition: string;
  minPrice: number;
  maxPrice: number;
  year: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'year-desc' | 'value-desc';
}

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'info' | 'remove';
}
