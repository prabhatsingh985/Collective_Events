export type ProductType = 
  | 'hot-wheels'
  | 'card-sealed'
  | 'card-single'
  | 'card-graded'
  | 'supplies'

export type ProductCategory = 'hot-wheels' | 'trading-cards' | 'supplies'

export interface BaseProduct {
  id: string
  slug: string
  title: string
  productType: ProductType
  category: ProductCategory
  mrp: number
  price: number
  discountPercent: number
  stock: number
  rating: number
  reviewsCount: number
  images: string[]
  description: string
  features: string[]
  isFeatured: boolean
  isNewArrival: boolean
  isBackInStock: boolean
  isDropExclusive: boolean
  dropId?: string
  badge?: string
  tags: string[]
  createdAt: string
  sku: string
}

export interface HotWheelsProduct extends BaseProduct {
  productType: 'hot-wheels'
  category: 'hot-wheels'
  castingName: string
  series: 
    | 'Mainline' 
    | 'Car Culture Premium' 
    | 'Red Line Club (RLC)' 
    | 'Super Treasure Hunt ($TH)' 
    | 'Treasure Hunt (TH)' 
    | 'Boulevard' 
    | 'Team Transport' 
    | 'Pop Culture'
  scale: '1:64'
  year: number
  color: string
  wheelType: string
  packagingCondition: 
    | 'Mint on Card (MOC)' 
    | 'Short Card MOC' 
    | 'Card Creased / Soft Corners' 
    | 'Sealed RLC Clamshell' 
    | 'Loose Mint'
  treasureHuntType: 'Super $TH' | 'Regular TH' | 'None'
  isChase: boolean
  caseCode?: string
  bisRegistrationNo: string
}

export interface SealedCardProduct extends BaseProduct {
  productType: 'card-sealed'
  category: 'trading-cards'
  sport: 'Football / Soccer' | 'Basketball' | 'Formula 1' | 'Cricket' | 'Multi-Sport'
  league: 'UEFA Champions League' | 'Premier League' | 'FIFA World Cup' | 'La Liga' | 'F1'
  brand: 'Panini' | 'Topps' | 'Futera'
  set: 'Panini Prizm' | 'Topps Chrome' | 'Match Attax' | 'National Treasures' | 'Select' | 'Merlin Heritage'
  year: number
  packType: 'Blaster Box' | 'Hobby Box' | 'Mega Box' | 'Hobby Pack' | 'Fat Pack' | 'Display Tin'
  cardsPerPack: number
  packsPerBox: number
  guaranteedHits: string[]
  isSealed: true
}

export interface SingleCardProduct extends BaseProduct {
  productType: 'card-single'
  category: 'trading-cards'
  sport: 'Football / Soccer' | 'Basketball' | 'Formula 1' | 'Cricket'
  league: string
  brand: 'Panini' | 'Topps' | 'Futera'
  set: string
  year: number
  player: string
  team: string
  cardNumber: string
  parallel: string
  isRookie: boolean
  isAutograph: boolean
  isPatchRelic: boolean
  printRun?: number
  serialNumber?: string
  cardCondition: 'Raw Gem Mint' | 'Raw Near Mint-Mint' | 'Raw Near Mint'
  isUniqueItem: true
}

export interface GradedCardProduct extends BaseProduct {
  productType: 'card-graded'
  category: 'trading-cards'
  sport: 'Football / Soccer' | 'Basketball' | 'Formula 1' | 'Cricket'
  league: string
  brand: 'Panini' | 'Topps' | 'Futera'
  set: string
  year: number
  player: string
  team: string
  cardNumber: string
  parallel: string
  isRookie: boolean
  isAutograph: boolean
  isPatchRelic: boolean
  printRun?: number
  serialNumber?: string
  gradingCompany: 'PSA' | 'BGS' | 'SGC' | 'CGC'
  grade: '10 Gem Mint' | '9.5 True Gem' | '9 Mint' | '8.5 NM-MT+'
  subgrades?: { centering: number; corners: number; edges: number; surface: number }
  certNumber: string
  popReport?: { popHigher: number; popTotal: number }
  slabCondition: 'Clean Scratch-Free' | 'Minor Scuff' | 'Sleeve Protected'
  isUniqueItem: true
}

export interface SuppliesProduct extends BaseProduct {
  productType: 'supplies'
  category: 'supplies'
  supplyType: 
    | 'One-Touch Magnetic Cases' 
    | 'Top Loaders' 
    | 'Penny Sleeves' 
    | 'Blister Clamshell Protector' 
    | 'Storage Vault Cases'
  packSize: number
  compatibility: string
}

export type Product = 
  | HotWheelsProduct 
  | SealedCardProduct 
  | SingleCardProduct 
  | GradedCardProduct 
  | SuppliesProduct

export interface Drop {
  id: string
  slug: string
  title: string
  tagline: string
  description: string
  category: 'hot-wheels' | 'trading-cards' | 'mixed'
  bannerImage: string
  status: 'live' | 'upcoming' | 'ended'
  startsAt: string
  endsAt: string
  itemIds: string[]
  maxPerCustomer: number
  totalStock: number
  remainingStock: number
  waitlistCount: number
}

export interface CartItem {
  product: Product
  quantity: number
  addedAt: string
  holdExpiresAt?: string
}

export interface Address {
  id: string
  fullName: string
  phone: string
  addressLine: string
  city: string
  state: string
  pincode: string
  landmark?: string
  isDefault: boolean
}

export type OrderStatus = 
  | 'PACKED' 
  | 'LABEL_GENERATED' 
  | 'PICKED_UP' 
  | 'IN_TRANSIT' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'CANCELLED' 
  | 'RETURN_REQUESTED'

export interface OrderTimelineStep {
  status: OrderStatus
  title: string
  description: string
  timestamp?: string
  location?: string
  completed: boolean
}

export interface Order {
  id: string
  items: {
    product: Product
    quantity: number
    priceAtPurchase: number
  }[]
  subtotal: number
  gst: number
  shippingFee: number
  discount: number
  total: number
  status: OrderStatus
  timeline: OrderTimelineStep[]
  shippingAddress: Address
  paymentMethod: 'UPI' | 'Card' | 'Netbanking' | 'Cash on Delivery'
  paymentStatus: 'PAID' | 'PENDING'
  trackingAwb?: string
  courier?: string
  createdAt: string
  deliveredAt?: string
  invoiceNumber: string
}

export interface Coupon {
  code: string
  type: 'percent' | 'flat'
  value: number
  minOrderValue: number
  description: string
  expiresAt: string
}

export interface StoreReview {
  id: string
  productId: string
  authorName: string
  authorLocation: string
  rating: number
  title: string
  comment: string
  verifiedPurchase: boolean
  createdAt: string
}
