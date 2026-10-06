import {
  Product,
  HotWheelsProduct,
  SealedCardProduct,
  SingleCardProduct,
  GradedCardProduct,
  SuppliesProduct,
  ProductCategory,
  ProductType,
} from '@/types/store'
import {
  ALL_PRODUCTS,
  MOCK_HOT_WHEELS_PRODUCTS,
  MOCK_TRADING_CARD_PRODUCTS,
  MOCK_SUPPLIES_PRODUCTS,
} from '@/lib/mock-store-data'

export interface ProductFilterParams {
  category?: ProductCategory
  productType?: ProductType
  series?: string
  sport?: string
  league?: string
  team?: string
  player?: string
  castingName?: string
  year?: number
  isRookie?: boolean
  isAutograph?: boolean
  isGraded?: boolean
  gradingCompany?: 'PSA' | 'BGS' | 'CGC'
  treasureHuntType?: 'Super $TH' | 'Regular TH' | 'None'
  inStockOnly?: boolean
  minPrice?: number
  maxPrice?: number
  search?: string
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating'
  limit?: number
  offset?: number
}

// Simulates network delay for production-grade async UX
const delay = (ms: number = 30) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getProducts(params?: ProductFilterParams): Promise<Product[]> {
  await delay()
  let filtered = [...ALL_PRODUCTS]

  if (!params) return filtered

  if (params.category) {
    filtered = filtered.filter((p) => p.category === params.category)
  }

  if (params.productType) {
    filtered = filtered.filter((p) => p.productType === params.productType)
  }

  if (params.inStockOnly) {
    filtered = filtered.filter((p) => p.stock > 0)
  }

  if (params.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= params.minPrice!)
  }

  if (params.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= params.maxPrice!)
  }

  if (params.search) {
    const q = params.search.toLowerCase().trim()
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.sku.toLowerCase().includes(q) ||
        (p.productType === 'hot-wheels' && (p as HotWheelsProduct).castingName.toLowerCase().includes(q)) ||
        (p.productType.startsWith('card-') && ((p as any).player?.toLowerCase().includes(q) || (p as any).team?.toLowerCase().includes(q)))
    )
  }

  // Hot Wheels specific filters
  if (params.series) {
    filtered = filtered.filter((p) => p.productType === 'hot-wheels' && (p as HotWheelsProduct).series === params.series)
  }
  if (params.treasureHuntType) {
    filtered = filtered.filter(
      (p) => p.productType === 'hot-wheels' && (p as HotWheelsProduct).treasureHuntType === params.treasureHuntType
    )
  }
  if (params.castingName) {
    filtered = filtered.filter(
      (p) =>
        p.productType === 'hot-wheels' &&
        (p as HotWheelsProduct).castingName.toLowerCase().includes(params.castingName!.toLowerCase())
    )
  }

  // Card specific filters
  if (params.sport) {
    filtered = filtered.filter(
      (p) => p.productType.startsWith('card-') && (p as any).sport?.toLowerCase().includes(params.sport!.toLowerCase())
    )
  }
  if (params.league) {
    filtered = filtered.filter(
      (p) => p.productType.startsWith('card-') && (p as any).league?.toLowerCase().includes(params.league!.toLowerCase())
    )
  }
  if (params.player) {
    filtered = filtered.filter(
      (p) => p.productType.startsWith('card-') && (p as any).player?.toLowerCase().includes(params.player!.toLowerCase())
    )
  }
  if (params.isRookie !== undefined) {
    filtered = filtered.filter((p) => (p as any).isRookie === params.isRookie)
  }
  if (params.isAutograph !== undefined) {
    filtered = filtered.filter((p) => (p as any).isAutograph === params.isAutograph)
  }
  if (params.isGraded) {
    filtered = filtered.filter((p) => p.productType === 'card-graded')
  }
  if (params.gradingCompany) {
    filtered = filtered.filter(
      (p) => p.productType === 'card-graded' && (p as GradedCardProduct).gradingCompany === params.gradingCompany
    )
  }

  // Sorting
  if (params.sortBy) {
    switch (params.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'featured':
      default:
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
        break
    }
  }

  if (params.offset !== undefined) {
    filtered = filtered.slice(params.offset)
  }
  if (params.limit !== undefined) {
    filtered = filtered.slice(0, params.limit)
  }

  return filtered
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await delay()
  return ALL_PRODUCTS.find((p) => p.slug === slug) || null
}

export async function getProductById(id: string): Promise<Product | null> {
  await delay()
  return ALL_PRODUCTS.find((p) => p.id === id) || null
}

export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  await delay()
  return ALL_PRODUCTS.filter((p) => p.isFeatured).slice(0, limit)
}

export async function getNewArrivals(limit: number = 8): Promise<Product[]> {
  await delay()
  return ALL_PRODUCTS.filter((p) => p.isNewArrival).slice(0, limit)
}

export async function getTreasureHunts(): Promise<HotWheelsProduct[]> {
  await delay()
  return MOCK_HOT_WHEELS_PRODUCTS.filter(
    (p) => p.treasureHuntType === 'Super $TH' || p.treasureHuntType === 'Regular TH' || p.isChase
  )
}

export async function getHotWheelsProducts(limit?: number): Promise<HotWheelsProduct[]> {
  await delay()
  return limit ? MOCK_HOT_WHEELS_PRODUCTS.slice(0, limit) : MOCK_HOT_WHEELS_PRODUCTS
}

export async function getTradingCardProducts(limit?: number): Promise<Product[]> {
  await delay()
  return limit ? MOCK_TRADING_CARD_PRODUCTS.slice(0, limit) : MOCK_TRADING_CARD_PRODUCTS
}

export async function getSealedCards(): Promise<SealedCardProduct[]> {
  await delay()
  return MOCK_TRADING_CARD_PRODUCTS.filter((p) => p.productType === 'card-sealed') as SealedCardProduct[]
}

export async function getSingleCards(): Promise<SingleCardProduct[]> {
  await delay()
  return MOCK_TRADING_CARD_PRODUCTS.filter((p) => p.productType === 'card-single') as SingleCardProduct[]
}

export async function getGradedCards(): Promise<GradedCardProduct[]> {
  await delay()
  return MOCK_TRADING_CARD_PRODUCTS.filter((p) => p.productType === 'card-graded') as GradedCardProduct[]
}

export async function getBackInStock(limit: number = 6): Promise<Product[]> {
  await delay()
  return ALL_PRODUCTS.filter((p) => p.isBackInStock).slice(0, limit)
}

export async function getSupplies(limit?: number): Promise<SuppliesProduct[]> {
  await delay()
  return limit ? MOCK_SUPPLIES_PRODUCTS.slice(0, limit) : MOCK_SUPPLIES_PRODUCTS
}

export async function getRelatedProducts(product: Product, limit: number = 4): Promise<Product[]> {
  await delay()
  return ALL_PRODUCTS.filter((p) => p.id !== product.id && (p.category === product.category || p.productType === product.productType)).slice(
    0,
    limit
  )
}

export async function searchStore(query: string): Promise<{
  products: Product[]
  suggestions: { label: string; type: 'Hot Wheels' | 'Trading Cards' | 'Player' | 'Series'; href: string }[]
}> {
  await delay()
  const q = query.toLowerCase().trim()
  if (!q) {
    return { products: [], suggestions: [] }
  }

  const products = ALL_PRODUCTS.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      (p.productType === 'hot-wheels' && (p as HotWheelsProduct).castingName.toLowerCase().includes(q)) ||
      (p.productType.startsWith('card-') &&
        ((p as any).player?.toLowerCase().includes(q) || (p as any).team?.toLowerCase().includes(q)))
  ).slice(0, 10)

  const suggestions: { label: string; type: 'Hot Wheels' | 'Trading Cards' | 'Player' | 'Series'; href: string }[] = []

  // Check players
  const players = ['Erling Haaland', 'Lionel Messi', 'Cristiano Ronaldo', 'Lamine Yamal', 'Bukayo Saka', 'Pedri', 'Kylian Mbappé']
  for (const pl of players) {
    if (pl.toLowerCase().includes(q)) {
      suggestions.push({ label: pl, type: 'Player', href: `/shop/cards?search=${encodeURIComponent(pl)}` })
    }
  }

  // Check series
  const seriesList = ['Super Treasure Hunt ($TH)', 'Red Line Club (RLC)', 'Car Culture Premium', 'Boulevard', 'Prizm', 'Topps Chrome']
  for (const s of seriesList) {
    if (s.toLowerCase().includes(q)) {
      suggestions.push({ label: s, type: 'Series', href: `/shop?search=${encodeURIComponent(s)}` })
    }
  }

  return { products, suggestions }
}
