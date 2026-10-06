'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {
  EventItem,
  CollectionItem,
  TradeRequest,
  CommunityPost,
  UserProfile,
  NotificationItem,
  RegisteredTicket,
  OnboardingPreferences,
  ShopProduct,
  CartItem,
  ShopOrder,
  OrderFulfillmentStatus,
} from '@/types'
import {
  MOCK_EVENTS,
  MOCK_COLLECTION_ITEMS,
  MOCK_TRADES,
  MOCK_COMMUNITY_POSTS,
  MOCK_USERS,
  MOCK_NOTIFICATIONS,
  MOCK_REGISTERED_TICKETS,
} from '@/lib/mock-data'
import {
  MOCK_SHOP_PRODUCTS,
  MOCK_INITIAL_ORDERS,
} from '@/lib/shop-data'


export interface ToastItem {
  id: string
  type: 'success' | 'error' | 'info'
  title: string
  message?: string
}

interface AppContextType {
  events: EventItem[]
  savedEventIds: string[]
  registeredTickets: RegisteredTicket[]
  collectionItems: CollectionItem[]
  trades: TradeRequest[]
  communityPosts: CommunityPost[]
  notifications: NotificationItem[]
  currentUser: UserProfile
  users: UserProfile[]
  onboarding: OnboardingPreferences
  toasts: ToastItem[]
  isSearchOpen: boolean
  setIsSearchOpen: (open: boolean) => void

  // Amazon-style Shop & Cart State
  shopProducts: ShopProduct[]
  cartItems: CartItem[]
  shopOrders: ShopOrder[]
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void

  // Actions
  toggleSaveEvent: (eventId: string) => void
  isEventSaved: (eventId: string) => boolean
  registerTicket: (params: {
    eventId: string
    tierId: string
    quantity: number
  }) => Promise<{ success: boolean; ticket?: RegisteredTicket }>
  createEvent: (eventData: Partial<EventItem>) => Promise<EventItem>
  addCollectionItem: (item: Partial<CollectionItem>) => void
  updateCollectionItem: (id: string, updates: Partial<CollectionItem>) => void
  deleteCollectionItem: (id: string) => void
  proposeTrade: (params: {
    recipientId: string
    offeredItemIds: string[]
    requestedItemIds: string[]
    cashTopUpINR: number
    note: string
  }) => Promise<TradeRequest>
  respondToTrade: (tradeId: string, action: 'accept' | 'decline') => void
  createPost: (postData: Partial<CommunityPost>) => void
  toggleLikePost: (postId: string) => void
  votePoll: (postId: string, optionId: string) => void
  toggleFollowUser: (username: string) => void
  updateCurrentUser: (updates: Partial<UserProfile>) => void
  updateOnboarding: (updates: Partial<OnboardingPreferences>) => void
  markAllNotificationsRead: () => void
  addToast: (toast: Omit<ToastItem, 'id'>) => void
  removeToast: (id: string) => void

  // Shop & WMS Actions
  addToCart: (product: ShopProduct, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  placeOrder: (
    customer: ShopOrder['customer'],
    paymentMethod: ShopOrder['paymentMethod'],
    discount?: number
  ) => Promise<ShopOrder>
  updateOrderStatus: (
    orderId: string,
    status: OrderFulfillmentStatus,
    wmsUpdates?: Partial<NonNullable<ShopOrder['wms']>>
  ) => void
  updateProductStock: (productId: string, newStock: number) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const STORAGE_KEYS = {
  SAVED_EVENTS: 'cratemeet_saved_events',
  TICKETS: 'cratemeet_tickets',
  COLLECTION: 'cratemeet_collection',
  TRADES: 'cratemeet_trades',
  POSTS: 'cratemeet_posts',
  NOTIFICATIONS: 'cratemeet_notifications',
  EVENTS: 'cratemeet_events',
  USER: 'cratemeet_current_user',
  ONBOARDING: 'cratemeet_onboarding',
  CART: 'cratemeet_cart',
  ORDERS: 'cratemeet_orders',
  SHOP_PRODUCTS: 'cratemeet_shop_products',
}


export function AppProvider({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false)
  const [events, setEvents] = useState<EventItem[]>(MOCK_EVENTS)
  const [savedEventIds, setSavedEventIds] = useState<string[]>(['evt-1', 'evt-2', 'evt-6'])
  const [registeredTickets, setRegisteredTickets] = useState<RegisteredTicket[]>(MOCK_REGISTERED_TICKETS)
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>(MOCK_COLLECTION_ITEMS)
  const [trades, setTrades] = useState<TradeRequest[]>(MOCK_TRADES)
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(MOCK_COMMUNITY_POSTS)
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS)
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USERS[0])
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS)
  const [onboarding, setOnboarding] = useState<OnboardingPreferences>({
    completed: true,
    interests: ['Hot Wheels', 'Football Cards', 'Trading'],
    homeCity: 'Mumbai',
    followedCollectors: ['kabir_diecast', 'ananya_cards'],
  })
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Amazon-style Shop & Cart State
  const [shopProducts, setShopProducts] = useState<ShopProduct[]>(MOCK_SHOP_PRODUCTS)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [shopOrders, setShopOrders] = useState<ShopOrder[]>(MOCK_INITIAL_ORDERS)
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const storedSaved = localStorage.getItem(STORAGE_KEYS.SAVED_EVENTS)
      if (storedSaved) setSavedEventIds(JSON.parse(storedSaved))

      const storedTickets = localStorage.getItem(STORAGE_KEYS.TICKETS)
      if (storedTickets) setRegisteredTickets(JSON.parse(storedTickets))

      const storedCollection = localStorage.getItem(STORAGE_KEYS.COLLECTION)
      if (storedCollection) setCollectionItems(JSON.parse(storedCollection))

      const storedTrades = localStorage.getItem(STORAGE_KEYS.TRADES)
      if (storedTrades) setTrades(JSON.parse(storedTrades))

      const storedPosts = localStorage.getItem(STORAGE_KEYS.POSTS)
      if (storedPosts) setCommunityPosts(JSON.parse(storedPosts))

      const storedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)
      if (storedNotifs) setNotifications(JSON.parse(storedNotifs))

      const storedCart = localStorage.getItem(STORAGE_KEYS.CART)
      if (storedCart) setCartItems(JSON.parse(storedCart))

      const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS)
      if (storedOrders) setShopOrders(JSON.parse(storedOrders))

      const storedShopProducts = localStorage.getItem(STORAGE_KEYS.SHOP_PRODUCTS)
      if (storedShopProducts) setShopProducts(JSON.parse(storedShopProducts))

      const storedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS)
      if (storedEvents) {
        const customEvents: EventItem[] = JSON.parse(storedEvents)
        // Merge without duplicates
        const customIds = new Set(customEvents.map((e) => e.id))
        setEvents([...customEvents, ...MOCK_EVENTS.filter((e) => !customIds.has(e.id))])
      }

      const storedUser = localStorage.getItem(STORAGE_KEYS.USER)
      if (storedUser) {
        const parsed = JSON.parse(storedUser)
        if (parsed.username === 'shreyash' || parsed.id === 'user-current') {
          parsed.avatar = '/avatars/shreyash.jpg'
          parsed.name = 'Shreyash Srivastava'
        }
        setCurrentUser(parsed)
      }

      const storedOnboarding = localStorage.getItem(STORAGE_KEYS.ONBOARDING)
      if (storedOnboarding) setOnboarding(JSON.parse(storedOnboarding))
    } catch (e) {
      console.error('Failed to load state from localStorage', e)
    } finally {
      setIsHydrated(true)
    }
  }, [])


  // Sync to localStorage
  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_EVENTS, JSON.stringify(savedEventIds))
    } catch {}
  }, [savedEventIds, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(registeredTickets))
    } catch {}
  }, [registeredTickets, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(STORAGE_KEYS.COLLECTION, JSON.stringify(collectionItems))
    } catch {}
  }, [collectionItems, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(trades))
    } catch {}
  }, [trades, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(communityPosts))
    } catch {}
  }, [communityPosts, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications))
    } catch {}
  }, [notifications, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser))
    } catch {}
  }, [currentUser, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(onboarding))
    } catch {}
  }, [onboarding, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems))
    } catch {}
  }, [cartItems, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(shopOrders))
    } catch {}
  }, [shopOrders, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(STORAGE_KEYS.SHOP_PRODUCTS, JSON.stringify(shopProducts))
    } catch {}
  }, [shopProducts, isHydrated])


  const addToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    const newToast = { ...toast, id }
    setToasts((prev) => [...prev, newToast])

    setTimeout(() => {
      removeToast(id)
    }, 4500)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const toggleSaveEvent = (eventId: string) => {
    const isSaved = savedEventIds.includes(eventId)
    const nextSaved = isSaved
      ? savedEventIds.filter((id) => id !== eventId)
      : [...savedEventIds, eventId]
    setSavedEventIds(nextSaved)

    const event = events.find((e) => e.id === eventId)
    const title = event ? event.title : 'Event'

    if (isSaved) {
      addToast({
        type: 'info',
        title: 'Removed from Saved',
        message: `Removed "${title}" from your watch list.`,
      })
    } else {
      addToast({
        type: 'success',
        title: 'Event Bookmarked! 📌',
        message: `"${title}" has been saved to your schedule.`,
      })
    }
  }

  const isEventSaved = (eventId: string) => savedEventIds.includes(eventId)

  const registerTicket = async ({
    eventId,
    tierId,
    quantity,
  }: {
    eventId: string
    tierId: string
    quantity: number
  }): Promise<{ success: boolean; ticket?: RegisteredTicket }> => {
    // Simulate API network latency
    await new Promise((resolve) => setTimeout(resolve, 600))

    const event = events.find((e) => e.id === eventId)
    if (!event) return { success: false }

    const tier = event.ticketTiers.find((t) => t.id === tierId)
    if (!tier) return { success: false }

    const total = tier.price * quantity
    const ticketCode = `CM-${event.city.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-${tier.name.substring(0, 3).toUpperCase()}`

    const newTicket: RegisteredTicket = {
      id: `tkt-${Date.now()}`,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: `${event.startTime} - ${event.endTime}`,
      venue: event.venue,
      city: event.city,
      coverImage: event.coverImage,
      tierName: tier.name,
      quantity,
      totalPriceINR: total,
      ticketCode,
      registeredAt: new Date().toISOString(),
    }

    setRegisteredTickets((prev) => [newTicket, ...prev])
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          return {
            ...e,
            attendeesCount: e.attendeesCount + quantity,
            ticketTiers: e.ticketTiers.map((t) =>
              t.id === tierId ? { ...t, available: Math.max(0, t.available - quantity) } : t
            ),
          }
        }
        return e
      })
    )

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'event_reminder',
      title: `Registration Confirmed: ${event.title}`,
      message: `Your ${quantity}x ${tier.name} ticket(s) are ready in your profile!`,
      timestamp: 'Just now',
      isRead: false,
      link: `/profile/${currentUser.username}?tab=tickets`,
    }
    setNotifications((prev) => [newNotif, ...prev])

    addToast({
      type: 'success',
      title: 'Tickets Confirmed! 🎉',
      message: `You're all set for ${event.title}. Pass code: ${ticketCode}`,
    })

    return { success: true, ticket: newTicket }
  }

  const createEvent = async (eventData: Partial<EventItem>): Promise<EventItem> => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newEvent: EventItem = {
      id: `evt-custom-${Date.now()}`,
      title: eventData.title || 'Untitled Meetup',
      slug: (eventData.title || 'untitled-meetup')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, ''),
      category: eventData.category || 'hot-wheels',
      eventType: eventData.eventType || 'meet',
      tagline: eventData.tagline || 'Collector gathering in India.',
      description: eventData.description || 'Join fellow collectors at this event.',
      date: eventData.date || new Date().toISOString().split('T')[0],
      startTime: eventData.startTime || '11:00 AM',
      endTime: eventData.endTime || '05:00 PM',
      city: eventData.city || currentUser.location.split(',')[0] || 'Mumbai',
      venue: eventData.venue || 'City Convention Center',
      address: eventData.address || 'Central Road',
      isOnline: Boolean(eventData.isOnline),
      isFeatured: false,
      isTrending: true,
      status: eventData.status || 'published',
      coverImage:
        eventData.coverImage ||
        'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=1200&q=80',
      galleryImages: eventData.galleryImages || [],
      organizer: {
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatar,
        verified: currentUser.verified,
        eventsHostedCount: currentUser.stats.eventsHosted + 1,
        rating: 5.0,
        followersCount: currentUser.stats.followers,
        bio: currentUser.bio,
      },
      ticketTiers:
        eventData.ticketTiers && eventData.ticketTiers.length > 0
          ? eventData.ticketTiers
          : [
              {
                id: `tier-${Date.now()}`,
                name: 'General Admission',
                price: 0,
                quantity: 100,
                available: 100,
                description: 'Free entry for collectors',
                perks: ['Open floor access'],
              },
            ],
      attendeesCount: 1,
      attendeeAvatars: [currentUser.avatar],
      savedCount: 0,
      viewsCount: 1,
      schedule: eventData.schedule || [],
      hotWheelsDetails: eventData.hotWheelsDetails,
      footballCardDetails: eventData.footballCardDetails,
      faqs: eventData.faqs || [],
      tags: eventData.tags || ['Community Meet'],
      priceMin: eventData.ticketTiers?.length
        ? Math.min(...eventData.ticketTiers.map((t) => t.price))
        : 0,
      priceMax: eventData.ticketTiers?.length
        ? Math.max(...eventData.ticketTiers.map((t) => t.price))
        : 0,
    }

    setEvents((prev) => [newEvent, ...prev])
    setCurrentUser((prev) => ({
      ...prev,
      stats: { ...prev.stats, eventsHosted: prev.stats.eventsHosted + 1 },
    }))

    // Save custom events list
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EVENTS)
      const existing: EventItem[] = stored ? JSON.parse(stored) : []
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify([newEvent, ...existing]))
    } catch {}

    addToast({
      type: 'success',
      title: 'Event Published! 🚀',
      message: `"${newEvent.title}" is now live for all collectors to discover.`,
    })

    return newEvent
  }

  const addCollectionItem = (item: Partial<CollectionItem>) => {
    const newItem: CollectionItem = {
      id: `col-${Date.now()}`,
      ownerId: currentUser.id,
      ownerUsername: currentUser.username,
      ownerName: currentUser.name,
      ownerAvatar: currentUser.avatar,
      category: item.category || 'hot-wheels',
      title: item.title || 'Untitled Collectible',
      subtitle: item.subtitle || '',
      year: item.year || new Date().getFullYear(),
      seriesOrSet: item.seriesOrSet || 'Mainline',
      condition: item.condition || 'Carded / Mint in Blister',
      gradingCompany: item.gradingCompany,
      gradeScore: item.gradeScore,
      estimatedValue: item.estimatedValue || 1000,
      purchasePrice: item.purchasePrice,
      tradeStatus: item.tradeStatus || 'available',
      isOwned: item.isOwned !== undefined ? item.isOwned : true,
      photos: item.photos?.length
        ? item.photos
        : ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'],
      description: item.description || '',
      rarityBadge: item.rarityBadge,
      history: [
        { date: '2024-01', value: Math.round((item.estimatedValue || 1000) * 0.8) },
        { date: '2025-01', value: item.estimatedValue || 1000 },
      ],
    }

    setCollectionItems((prev) => [newItem, ...prev])
    if (newItem.isOwned) {
      setCurrentUser((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          itemsCount: prev.stats.itemsCount + 1,
          portfolioValue: prev.stats.portfolioValue + (newItem.estimatedValue || 0),
        },
      }))
    }

    addToast({
      type: 'success',
      title: 'Vault Updated! 💎',
      message: `"${newItem.title}" added to your ${newItem.isOwned ? 'collection' : 'wishlist'}.`,
    })
  }

  const updateCollectionItem = (id: string, updates: Partial<CollectionItem>) => {
    setCollectionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    )
    addToast({
      type: 'info',
      title: 'Item Updated',
      message: 'Your collectible details were updated.',
    })
  }

  const deleteCollectionItem = (id: string) => {
    const item = collectionItems.find((i) => i.id === id)
    setCollectionItems((prev) => prev.filter((i) => i.id !== id))
    if (item && item.isOwned) {
      setCurrentUser((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          itemsCount: Math.max(0, prev.stats.itemsCount - 1),
          portfolioValue: Math.max(0, prev.stats.portfolioValue - item.estimatedValue),
        },
      }))
    }
    addToast({
      type: 'info',
      title: 'Item Removed',
      message: 'Item has been removed from your vault.',
    })
  }

  const proposeTrade = async ({
    recipientId,
    offeredItemIds,
    requestedItemIds,
    cashTopUpINR,
    note,
  }: {
    recipientId: string
    offeredItemIds: string[]
    requestedItemIds: string[]
    cashTopUpINR: number
    note: string
  }): Promise<TradeRequest> => {
    await new Promise((resolve) => setTimeout(resolve, 700))

    const recipient = users.find((u) => u.id === recipientId) || users[1]
    const offered = collectionItems.filter((i) => offeredItemIds.includes(i.id))
    const requested = collectionItems.filter((i) => requestedItemIds.includes(i.id))

    const newTrade: TradeRequest = {
      id: `tr-${Date.now()}`,
      proposerId: currentUser.id,
      proposerUsername: currentUser.username,
      proposerName: currentUser.name,
      proposerAvatar: currentUser.avatar,
      recipientId: recipient.id,
      recipientUsername: recipient.username,
      recipientName: recipient.name,
      recipientAvatar: recipient.avatar,
      offeredItemIds,
      offeredItems: offered,
      requestedItemIds,
      requestedItems: requested,
      cashTopUpINR,
      note,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setTrades((prev) => [newTrade, ...prev])

    addToast({
      type: 'success',
      title: 'Trade Proposed! 🤝',
      message: `Your exchange offer has been sent to @${recipient.username}.`,
    })

    return newTrade
  }

  const respondToTrade = (tradeId: string, action: 'accept' | 'decline') => {
    setTrades((prev) =>
      prev.map((trade) => {
        if (trade.id === tradeId) {
          return {
            ...trade,
            status: action === 'accept' ? 'accepted' : 'declined',
            updatedAt: new Date().toISOString(),
          }
        }
        return trade
      })
    )

    if (action === 'accept') {
      setCurrentUser((prev) => ({
        ...prev,
        stats: { ...prev.stats, tradesCompleted: prev.stats.tradesCompleted + 1 },
      }))
      addToast({
        type: 'success',
        title: 'Trade Accepted! 🤝🎉',
        message: 'Congratulations on completing this collector trade!',
      })
    } else {
      addToast({
        type: 'info',
        title: 'Trade Declined',
        message: 'You declined this trade offer.',
      })
    }
  }

  const createPost = (postData: Partial<CommunityPost>) => {
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorUsername: currentUser.username,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorVerified: currentUser.verified,
      authorBadge: 'Pioneer Member',
      category: postData.category || 'general',
      postType: postData.postType || 'discussion',
      title: postData.title || '',
      content: postData.content || '',
      images: postData.images || [],
      likesCount: 1,
      isLiked: true,
      savedCount: 0,
      commentsCount: 0,
      tags: postData.tags || ['CommunityDrop'],
      createdAt: 'Just now',
    }

    setCommunityPosts((prev) => [newPost, ...prev])
    addToast({
      type: 'success',
      title: 'Post Published! 💬',
      message: 'Your discussion is now visible in the community feed.',
    })
  }

  const toggleLikePost = (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = post.isLiked
          return {
            ...post,
            isLiked: !isLiked,
            likesCount: isLiked ? Math.max(0, post.likesCount - 1) : post.likesCount + 1,
          }
        }
        return post
      })
    )
  }

  const votePoll = (postId: string, optionId: string) => {
    setCommunityPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId && post.pollOptions) {
          return {
            ...post,
            userVotedPollOption: optionId,
            pollOptions: post.pollOptions.map((opt) =>
              opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
            ),
          }
        }
        return post
      })
    )
    addToast({
      type: 'info',
      title: 'Vote Counted! 📊',
      message: 'Thank you for contributing to the community poll.',
    })
  }

  const toggleFollowUser = (username: string) => {
    const isFollowing = currentUser.interests.includes(username) || false
    setUsers((prev) =>
      prev.map((u) => {
        if (u.username === username) {
          const nextState = !u.isFollowing
          return {
            ...u,
            isFollowing: nextState,
            stats: {
              ...u.stats,
              followers: nextState ? u.stats.followers + 1 : Math.max(0, u.stats.followers - 1),
            },
          }
        }
        return u
      })
    )

    const target = users.find((u) => u.username === username)
    const name = target ? target.name : username

    addToast({
      type: 'info',
      title: isFollowing ? `Unfollowed @${username}` : `Following @${username}! ⭐`,
      message: isFollowing ? `You will no longer see priority updates from ${name}.` : `You'll now see drops and trades from ${name}.`,
    })
  }

  const updateCurrentUser = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }))
    addToast({
      type: 'success',
      title: 'Profile Updated! 👤',
      message: 'Your collector profile changes have been saved.',
    })
  }

  const updateOnboarding = (updates: Partial<OnboardingPreferences>) => {
    setOnboarding((prev) => ({ ...prev, ...updates }))
  }

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    addToast({
      type: 'info',
      title: 'All Caught Up! 🔔',
      message: 'All notifications marked as read.',
    })
  }

  // SHOP & WMS ACTIONS
  const addToCart = (product: ShopProduct, quantity: number = 1) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((item) => item.product.id === product.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx].quantity += quantity
        return next
      }
      return [...prev, { product, quantity }]
    })
    addToast({
      type: 'success',
      title: 'Added to Cart! 🛒',
      message: `${product.title} (1:64 scale casting) added to your order.`,
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId))
    addToast({
      type: 'info',
      title: 'Item Removed',
      message: 'Item removed from your cart.',
    })
  }

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const placeOrder = async (
    customer: ShopOrder['customer'],
    paymentMethod: ShopOrder['paymentMethod'],
    discount: number = 0
  ): Promise<ShopOrder> => {
    const totalItems = cartItems.reduce((acc, curr) => acc + curr.quantity, 0)
    const subtotal = cartItems.reduce(
      (acc, curr) => acc + curr.product.price * curr.quantity,
      0
    )
    const shippingFee = subtotal >= 999 ? 0 : 99
    const totalAmount = Math.max(0, subtotal - discount + shippingFee)

    const orderId = `HW-ORD-${Math.floor(10000 + Math.random() * 90000)}`

    const newOrder: ShopOrder = {
      id: orderId,
      items: cartItems.map((item) => ({
        productId: item.product.id,
        title: item.product.title,
        castingName: item.product.castingName,
        series: item.product.series,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.images[0] || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
        sku: item.product.sku,
        location: item.product.warehouseLocation,
        weightGrams: item.product.weightGrams,
      })),
      totalItems,
      subtotal,
      discount,
      shippingFee,
      totalAmount,
      customer,
      paymentMethod,
      status: 'PENDING_ALLOCATION',
      createdAt: new Date().toISOString(),
      estimatedDelivery: 'Tomorrow by 2:00 PM via Collector Express',
      wms: {
        recommendedCarton: totalItems <= 2 ? 'Carton S (18 x 12 x 6 cm)' : 'Carton M (24 x 16 x 8 cm)',
      },
    }

    // Decrement stock in shop products
    setShopProducts((prev) =>
      prev.map((prod) => {
        const cartItem = cartItems.find((c) => c.product.id === prod.id)
        if (cartItem) {
          return {
            ...prod,
            stockCount: Math.max(0, prod.stockCount - cartItem.quantity),
          }
        }
        return prod
      })
    )

    setShopOrders((prev) => [newOrder, ...prev])
    clearCart()

    addToast({
      type: 'success',
      title: 'Order Placed! 🏎️📦',
      message: `Order #${newOrder.id} confirmed. Routed to Toy Fulfillment WMS.`,
    })

    return newOrder
  }

  const updateOrderStatus = (
    orderId: string,
    status: OrderFulfillmentStatus,
    wmsUpdates?: Partial<NonNullable<ShopOrder['wms']>>
  ) => {
    setShopOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status,
            wms: {
              ...(ord.wms || {}),
              ...(wmsUpdates || {}),
            },
          }
        }
        return ord
      })
    )
    addToast({
      type: 'info',
      title: `Order Updated: ${status} 🏭`,
      message: `Order #${orderId} moved to ${status}.`,
    })
  }

  const updateProductStock = (productId: string, newStock: number) => {
    setShopProducts((prev) =>
      prev.map((prod) =>
        prod.id === productId ? { ...prod, stockCount: Math.max(0, newStock) } : prod
      )
    )
  }

  return (
    <AppContext.Provider
      value={{
        events,
        savedEventIds,
        registeredTickets,
        collectionItems,
        trades,
        communityPosts,
        notifications,
        currentUser,
        users,
        onboarding,
        toasts,
        isSearchOpen,
        setIsSearchOpen,
        shopProducts,
        cartItems,
        shopOrders,
        isCartOpen,
        setIsCartOpen,
        toggleSaveEvent,
        isEventSaved,
        registerTicket,
        createEvent,
        addCollectionItem,
        updateCollectionItem,
        deleteCollectionItem,
        proposeTrade,
        respondToTrade,
        createPost,
        toggleLikePost,
        votePoll,
        toggleFollowUser,
        updateCurrentUser,
        updateOnboarding,
        markAllNotificationsRead,
        addToast,
        removeToast,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        updateOrderStatus,
        updateProductStock,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}


export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
