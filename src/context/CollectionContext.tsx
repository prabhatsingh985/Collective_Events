import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { Collectible, ActivePage, ToastMessage, CollectibleCategory } from '../types/collectible';
import { INITIAL_COLLECTIBLES, DEFAULT_COLLECTION_IDS, DEFAULT_WISHLIST_IDS } from '../data/collectibles';


interface CollectionContextType {
  collectibles: Collectible[];
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  collectionIds: string[];
  wishlistIds: string[];
  isInCollection: (id: string) => boolean;
  isInWishlist: (id: string) => boolean;
  addToCollection: (id: string) => void;
  removeFromCollection: (id: string) => void;
  toggleWishlist: (id: string) => void;
  selectedCollectible: Collectible | null;
  setSelectedCollectible: (collectible: Collectible | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategoryFilter: 'all' | CollectibleCategory;
  setActiveCategoryFilter: (cat: 'all' | CollectibleCategory) => void;
  toasts: ToastMessage[];
  addToast: (title: string, description: string, type?: 'success' | 'info' | 'remove') => void;
  removeToast: (id: string) => void;
  quickSearchOpen: boolean;
  setQuickSearchOpen: (open: boolean) => void;
  collectionStats: {
    totalItems: number;
    totalValue: number;
    hotWheelsCount: number;
    hotWheelsValue: number;
    tradingCardsCount: number;
    tradingCardsValue: number;
    wishlistCount: number;
    recentlyAddedCount: number;
  };
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export const CollectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePageState] = useState<ActivePage>('landing');
  const [selectedCollectible, setSelectedCollectible] = useState<Collectible | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | CollectibleCategory>('all');
  const [quickSearchOpen, setQuickSearchOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load persisted collection or defaults
  const [collectionIds, setCollectionIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('collectr_collection');
      return saved ? JSON.parse(saved) : DEFAULT_COLLECTION_IDS;
    } catch {
      return DEFAULT_COLLECTION_IDS;
    }
  });

  // Load persisted wishlist or defaults
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('collectr_wishlist');
      return saved ? JSON.parse(saved) : DEFAULT_WISHLIST_IDS;
    } catch {
      return DEFAULT_WISHLIST_IDS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('collectr_collection', JSON.stringify(collectionIds));
    } catch (e) {
      console.error(e);
    }
  }, [collectionIds]);

  useEffect(() => {
    try {
      localStorage.setItem('collectr_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds]);

  const setActivePage = (page: ActivePage) => {
    setActivePageState(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToast = (title: string, description: string, type: 'success' | 'info' | 'remove' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const isInCollection = (id: string) => collectionIds.includes(id);
  const isInWishlist = (id: string) => wishlistIds.includes(id);

  const addToCollection = (id: string) => {
    const item = INITIAL_COLLECTIBLES.find((c) => c.id === id);
    if (!item) return;

    if (!collectionIds.includes(id)) {
      setCollectionIds((prev) => [id, ...prev]);
      addToast(
        'Added to Vault! 🎉',
        `${item.name} is now tracked in your personal collection.`,
        'success'
      );

      // Trigger celebratory micro-confetti
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#f59e0b', '#8b5cf6', '#10b981', '#38bdf8']
        });
      } catch (err) {
        // ignore if canvas-confetti is not loaded
      }
    }
  };

  const removeFromCollection = (id: string) => {
    const item = INITIAL_COLLECTIBLES.find((c) => c.id === id);
    setCollectionIds((prev) => prev.filter((itemId) => itemId !== id));
    if (item) {
      addToast('Removed from Vault', `${item.name} was removed from your collection.`, 'remove');
    }
  };

  const toggleWishlist = (id: string) => {
    const item = INITIAL_COLLECTIBLES.find((c) => c.id === id);
    if (!item) return;

    if (wishlistIds.includes(id)) {
      setWishlistIds((prev) => prev.filter((itemId) => itemId !== id));
      addToast('Removed from Wishlist', `${item.name} removed from your saved list.`, 'remove');
    } else {
      setWishlistIds((prev) => [id, ...prev]);
      addToast('Saved to Wishlist ❤️', `${item.name} added to your watchlist.`, 'info');
    }
  };

  // Compute live collection statistics
  const collectedItems = INITIAL_COLLECTIBLES.filter((item) => collectionIds.includes(item.id));
  const hotWheelsInVault = collectedItems.filter((i) => i.category === 'hot-wheels');
  const cardsInVault = collectedItems.filter((i) => i.category === 'trading-cards');

  const totalValue = collectedItems.reduce((acc, curr) => acc + curr.estimatedValue, 0);
  const hotWheelsValue = hotWheelsInVault.reduce((acc, curr) => acc + curr.estimatedValue, 0);
  const tradingCardsValue = cardsInVault.reduce((acc, curr) => acc + curr.estimatedValue, 0);


  const collectionStats = {
    totalItems: collectedItems.length,
    totalValue,
    hotWheelsCount: hotWheelsInVault.length,
    hotWheelsValue,
    tradingCardsCount: cardsInVault.length,
    tradingCardsValue,
    wishlistCount: wishlistIds.length,
    recentlyAddedCount: Math.min(3, collectedItems.length)
  };

  return (
    <CollectionContext.Provider
      value={{
        collectibles: INITIAL_COLLECTIBLES,
        activePage,
        setActivePage,
        collectionIds,
        wishlistIds,
        isInCollection,
        isInWishlist,
        addToCollection,
        removeFromCollection,
        toggleWishlist,
        selectedCollectible,
        setSelectedCollectible,
        searchQuery,
        setSearchQuery,
        activeCategoryFilter,
        setActiveCategoryFilter,
        toasts,
        addToast,
        removeToast,
        quickSearchOpen,
        setQuickSearchOpen,
        collectionStats,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};

export const useCollection = () => {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollection must be used within a CollectionProvider');
  }
  return context;
};
