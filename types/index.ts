export type EventCategory = 'hot-wheels' | 'football-cards' | 'die-cast' | 'memorabilia'

export type EventType = 
  | 'meet'
  | 'trading'
  | 'auction'
  | 'exhibition'
  | 'tournament'
  | 'swap-meet'
  | 'grading-day'
  | 'custom-showcase'

export interface TicketTier {
  id: string
  name: string
  price: number // in INR
  quantity: number
  available: number
  description: string
  perks: string[]
}

export interface HotWheelsCastingExpected {
  name: string
  castingName?: string
  series?: string
  wheelType?: string
  packaging?: string
  rarity: 'Common' | 'Rare' | 'Treasure Hunt' | 'Super TH' | 'Redline' | 'RLC Exclusive' | 'Grail' | 'Custom Build' | 'Error / Variation'
  image: string
}

export interface HotWheelsDetails {
  brandsPresent: string[]
  diecastBrands?: string[]
  castingsExpected: HotWheelsCastingExpected[]
  carsExpected?: HotWheelsCastingExpected[] // Compatibility alias
  customBuildsAllowed: boolean // Custom 1:64 modifications (wheel swaps, hand airbrushing)
  customToyShowcaseAllowed?: boolean
  treasureHuntAllowed?: boolean
  rlcExclusivesAllowed?: boolean
  auctionToyLotsScheduled?: boolean
  auctionScheduled: boolean
  auctionStartTime?: string
  tradingZonesCount: number
  vendorSlotsTotal: number
  vendorSlotsFilled: number
  highlightCastings?: string[]
  highlightModels: string[]
}

export interface FootballCardDetails {
  cardBrands: string[] // Panini, Topps, Futera, Leaf
  featuredSets: string[] // Prizm, Match Attax, National Treasures, Chrome
  gradingCompanies: ('PSA' | 'BGS' | 'SGC' | 'CGC')[]
  tradingTablesCount: number
  tournamentFormat?: string // e.g. "Match Attax Champions Cup 2026"
  auctionScheduled: boolean
  auctionStartTime?: string
  topCardsShowcased: {
    card: string
    player: string
    grade: string
    estimatedValue: number
    image: string
  }[]
}

export interface EventScheduleItem {
  time: string
  title: string
  description: string
  speakerOrHost?: string
}

export interface EventItem {
  id: string
  title: string
  slug: string
  category: EventCategory
  eventType: EventType
  tagline: string
  description: string
  date: string // ISO string or YYYY-MM-DD
  endDate?: string
  startTime: string
  endTime: string
  city: string
  venue: string
  address: string
  isOnline: boolean
  isFeatured: boolean
  isTrending: boolean
  status: 'draft' | 'published' | 'past' | 'cancelled'
  coverImage: string
  galleryImages: string[]
  organizer: {
    id: string
    name: string
    username: string
    avatar: string
    verified: boolean
    eventsHostedCount: number
    rating: number
    followersCount: number
    bio: string
  }
  ticketTiers: TicketTier[]
  attendeesCount: number
  attendeeAvatars: string[]
  savedCount: number
  viewsCount: number
  schedule: EventScheduleItem[]
  hotWheelsDetails?: HotWheelsDetails
  footballCardDetails?: FootballCardDetails
  faqs: { question: string; answer: string }[]
  tags: string[]
  priceMin: number
  priceMax: number
}

export type ItemCondition = 
  | 'Mint on Card (MOC)'
  | 'Carded / Mint in Blister'
  | 'Short Card MOC'
  | 'Card Creased / Soft Corners'
  | 'Loose Mint'
  | 'Loose Played'
  | 'Custom Modified 1:64'
  | 'Sealed Factory Case'
  | 'PSA 10 Gem Mint'
  | 'PSA 9 Mint'
  | 'BGS 9.5 True Gem'
  | 'Ungraded Near Mint'
  | 'Custom Modified'

export type TradeStatus = 'available' | 'not-for-trade' | 'pending-trade'

export interface CollectionItem {
  id: string
  ownerId: string
  ownerUsername: string
  ownerName: string
  ownerAvatar: string
  category: EventCategory
  title: string
  subtitle: string
  year: number
  seriesOrSet: string
  condition: ItemCondition
  gradingCompany?: 'PSA' | 'BGS' | 'SGC' | 'None'
  gradeScore?: string // e.g. "10", "9.5"
  estimatedValue: number // in INR
  purchasePrice?: number
  tradeStatus: TradeStatus
  isOwned: boolean // false = in wishlist
  photos: string[]
  description: string
  rarityBadge?: string // "Super Treasure Hunt", "1/1 Gold Vinyl", "Redline"
  history: { date: string; value: number }[]
  // Hot Wheels 1:64 toy collector attributes
  castingName?: string
  toySeries?: string // Mainline, Premium, Car Culture, Team Transport, RLC, Boulevard, Fast & Furious HW
  wheelType?: string // Real Riders, Redline, 5-spoke, AeroDisc
  colorDeco?: string // Spectraflame Aqua, Gulf Racing Livery, Metalflake Orange
  packagingCondition?: 'Mint on Card (MOC)' | 'Loose Mint' | 'Short Card MOC' | 'Card Creased' | 'Custom Acrylic Case'
  cardBlisterCondition?: string
}

export type TradeRequestStatus = 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled'

export interface TradeRequest {
  id: string
  proposerId: string
  proposerUsername: string
  proposerName: string
  proposerAvatar: string
  recipientId: string
  recipientUsername: string
  recipientName: string
  recipientAvatar: string
  offeredItemIds: string[]
  offeredItems: CollectionItem[]
  requestedItemIds: string[]
  requestedItems: CollectionItem[]
  cashTopUpINR: number // positive means proposer adds cash, negative means recipient adds cash
  note: string
  status: TradeRequestStatus
  createdAt: string
  updatedAt: string
}

export interface CommunityPost {
  id: string
  authorId: string
  authorUsername: string
  authorName: string
  authorAvatar: string
  authorBadge?: string
  authorVerified: boolean
  category: EventCategory | 'general'
  postType: 'showcase' | 'trade' | 'discussion' | 'event-buzz' | 'question' | 'poll'
  title: string
  content: string
  images: string[]
  likesCount: number
  isLiked?: boolean
  savedCount: number
  isSaved?: boolean
  commentsCount: number
  tags: string[]
  createdAt: string
  pollOptions?: { id: string; text: string; votes: number }[]
  userVotedPollOption?: string
}

export interface PostComment {
  id: string
  postId: string
  authorUsername: string
  authorName: string
  authorAvatar: string
  authorVerified: boolean
  content: string
  createdAt: string
  likesCount: number
  isLiked?: boolean
  replies?: PostComment[]
}

export interface UserProfile {
  id: string
  username: string
  name: string
  avatar: string
  coverImage: string
  bio: string
  location: string
  collectorSince: number
  verified: boolean
  interests: string[]
  stats: {
    itemsCount: number
    portfolioValue: number
    eventsAttended: number
    eventsHosted: number
    followers: number
    following: number
    tradesCompleted: number
  }
  badges: {
    id: string
    title: string
    icon: string
    description: string
    unlockedAt: string
  }[]
  isFollowing?: boolean
}

export interface RegisteredTicket {
  id: string
  eventId: string
  eventTitle: string
  eventDate: string
  eventTime: string
  venue: string
  city: string
  coverImage: string
  tierName: string
  quantity: number
  totalPriceINR: number
  ticketCode: string
  registeredAt: string
}

export interface NotificationItem {
  id: string
  type: 
    | 'trade_offer' 
    | 'trade_accepted' 
    | 'event_reminder' 
    | 'new_follower' 
    | 'post_comment' 
    | 'new_event_city' 
    | 'item_wishlist'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  link: string
  actor?: {
    name: string
    avatar: string
  }
}

export interface OnboardingPreferences {
  completed: boolean
  interests: string[] // e.g. ['Hot Wheels', 'Football Cards']
  homeCity: string
  followedCollectors: string[]
}
