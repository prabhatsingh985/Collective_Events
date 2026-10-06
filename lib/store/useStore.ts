import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Product, CartItem, Order, Address, Coupon } from '@/types/store'
import { MOCK_ORDERS } from '@/lib/mock-store-data'

export interface StoreState {
  // Cart
  cart: CartItem[]
  reservationExpiresAt: number | null // Unix timestamp in ms
  appliedCoupon: Coupon | null
  addToCart: (product: Product, quantity?: number) => { success: boolean; message: string }
  updateQuantity: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  applyCoupon: (coupon: Coupon | null) => void
  startReservationTimer: () => void
  clearReservationTimer: () => void

  // Wishlist
  wishlist: string[] // Product IDs
  toggleWishlist: (productId: string) => boolean
  isInWishlist: (productId: string) => boolean

  // Recently Viewed & Searches
  recentlyViewedIds: string[]
  addRecentlyViewed: (productId: string) => void
  recentSearches: string[]
  addRecentSearch: (query: string) => void
  clearRecentSearches: () => void

  // Orders & Addresses
  orders: Order[]
  addOrder: (order: Order) => void
  cancelOrder: (orderId: string, reason: string) => void
  requestReturn: (
    orderId: string,
    returnData: { reason: string; notes?: string; photoUrl?: string }
  ) => void
  addresses: Address[]
  addAddress: (address: Address) => void
  updateAddress: (address: Address) => void
  deleteAddress: (id: string) => void
  setDefaultAddress: (id: string) => void

  // Global UI Toggles
  isCartOpen: boolean
  setCartOpen: (open: boolean) => void
  isSearchOpen: boolean
  setSearchOpen: (open: boolean) => void

  // Hydration state
  hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    fullName: 'Shreyash Srivastava',
    phone: '+91 98201 55902',
    addressLine: 'Flat 402, Sea Green Apartments, Carter Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    isDefault: true,
  },
  {
    id: 'addr-2',
    fullName: 'Shreyash (Bangalore Vault)',
    phone: '+91 98201 55902',
    addressLine: 'Villa 14, Prestige Silver Springs, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    isDefault: false,
  },
]

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart
      cart: [],
      reservationExpiresAt: null,
      appliedCoupon: null,

      addToCart: (product: Product, quantity = 1) => {
        const { cart, startReservationTimer } = get()
        const existingIndex = cart.findIndex((item) => item.product.id === product.id)

        // Unique item check: Singles and Graded slabs can only have quantity 1
        const isUnique = 'isUniqueItem' in product && (product as any).isUniqueItem

        if (existingIndex > -1) {
          if (isUnique) {
            return {
              success: false,
              message: 'This unique collector card is strictly limited to 1 copy per customer.',
            }
          }

          const currentQty = cart[existingIndex].quantity
          const maxAllowed = product.isDropExclusive ? Math.min(product.stock, 2) : product.stock

          if (currentQty + quantity > maxAllowed) {
            return {
              success: false,
              message: `Maximum stock limit reached (${maxAllowed} available).`,
            }
          }

          const updatedCart = [...cart]
          updatedCart[existingIndex].quantity += quantity
          set({ cart: updatedCart })
          return { success: true, message: `Added to cart (${updatedCart[existingIndex].quantity} in cart)` }
        } else {
          if (product.stock <= 0) {
            return { success: false, message: 'Sorry, this item is currently out of stock.' }
          }

          const addedQty = isUnique ? 1 : Math.min(quantity, product.stock)
          const newCart = [...cart, { product, quantity: addedQty, addedAt: new Date().toISOString() }]

          // If adding a drop exclusive, activate 10-minute hold reservation timer
          if (product.isDropExclusive) {
            startReservationTimer()
          }

          set({ cart: newCart })
          return { success: true, message: `Added "${product.title}" to cart!` }
        }
      },

      updateQuantity: (productId: string, quantity: number) => {
        const { cart } = get()
        if (quantity <= 0) {
          set({ cart: cart.filter((i) => i.product.id !== productId) })
          return
        }

        set({
          cart: cart.map((item) => {
            if (item.product.id === productId) {
              const isUnique = 'isUniqueItem' in item.product && (item.product as any).isUniqueItem
              const maxStock = isUnique ? 1 : item.product.stock
              return { ...item, quantity: Math.min(quantity, maxStock) }
            }
            return item
          }),
        })
      },

      removeFromCart: (productId: string) => {
        const { cart } = get()
        const newCart = cart.filter((item) => item.product.id !== productId)
        set({ cart: newCart })
        if (newCart.length === 0) {
          get().clearReservationTimer()
          set({ appliedCoupon: null })
        }
      },

      clearCart: () => {
        set({ cart: [], appliedCoupon: null, reservationExpiresAt: null })
      },

      applyCoupon: (coupon: Coupon | null) => {
        set({ appliedCoupon: coupon })
      },

      startReservationTimer: () => {
        // 10 minutes hold = 600,000 ms
        set({ reservationExpiresAt: Date.now() + 10 * 60 * 1000 })
      },

      clearReservationTimer: () => {
        set({ reservationExpiresAt: null })
      },

      // Wishlist
      wishlist: ['hw-1', 'card-1'], // Pre-seeded favorites
      toggleWishlist: (productId: string) => {
        const { wishlist } = get()
        const exists = wishlist.includes(productId)
        if (exists) {
          set({ wishlist: wishlist.filter((id) => id !== productId) })
          return false
        } else {
          set({ wishlist: [...wishlist, productId] })
          return true
        }
      },
      isInWishlist: (productId: string) => {
        return get().wishlist.includes(productId)
      },

      // Recently Viewed & Searches
      recentlyViewedIds: ['hw-1', 'card-2', 'hw-3'],
      addRecentlyViewed: (productId: string) => {
        const { recentlyViewedIds } = get()
        const filtered = recentlyViewedIds.filter((id) => id !== productId)
        set({ recentlyViewedIds: [productId, ...filtered].slice(0, 12) })
      },

      recentSearches: ['Super Treasure Hunt', 'Prizm Blaster', 'RLC Skyline', 'Erling Haaland'],
      addRecentSearch: (query: string) => {
        const clean = query.trim()
        if (!clean) return
        const { recentSearches } = get()
        const filtered = recentSearches.filter((q) => q.toLowerCase() !== clean.toLowerCase())
        set({ recentSearches: [clean, ...filtered].slice(0, 8) })
      },
      clearRecentSearches: () => {
        set({ recentSearches: [] })
      },

      // Orders & Addresses
      orders: MOCK_ORDERS,
      addOrder: (order: Order) => {
        const { orders, clearCart } = get()
        set({ orders: [order, ...orders] })
        clearCart()
      },
      cancelOrder: (orderId: string, reason: string) => {
        const { orders } = get()
        set({
          orders: orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: 'CANCELLED',
                  cancellationReason: reason,
                  cancelledAt: new Date().toISOString(),
                }
              : o
          ),
        })
      },
      requestReturn: (orderId: string, returnData) => {
        const { orders } = get()
        set({
          orders: orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: 'RETURN_REQUESTED',
                  returnReason: returnData.reason,
                  returnRequestedAt: new Date().toISOString(),
                }
              : o
          ),
        })
      },

      addresses: DEFAULT_ADDRESSES,
      addAddress: (address: Address) => {
        const { addresses } = get()
        if (address.isDefault) {
          set({
            addresses: [
              ...addresses.map((a) => ({ ...a, isDefault: false })),
              address,
            ],
          })
        } else {
          set({ addresses: [...addresses, address] })
        }
      },
      updateAddress: (address: Address) => {
        const { addresses } = get()
        set({
          addresses: addresses.map((a) => (a.id === address.id ? address : a)),
        })
      },
      deleteAddress: (id: string) => {
        const { addresses } = get()
        set({ addresses: addresses.filter((a) => a.id !== id) })
      },
      setDefaultAddress: (id: string) => {
        const { addresses } = get()
        set({
          addresses: addresses.map((a) => ({ ...a, isDefault: a.id === id })),
        })
      },

      // Global UI Toggles
      isCartOpen: false,
      setCartOpen: (open: boolean) => set({ isCartOpen: open }),
      isSearchOpen: false,
      setSearchOpen: (open: boolean) => set({ isSearchOpen: open }),

      // Hydration
      hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),
    }),
    {
      name: 'cratemeet_store_v1',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        recentlyViewedIds: state.recentlyViewedIds,
        recentSearches: state.recentSearches,
        addresses: state.addresses,
        orders: state.orders,
        reservationExpiresAt: state.reservationExpiresAt,
      }),
    }
  )
)
