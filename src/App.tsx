import React from 'react';
import { CollectionProvider, useCollection } from './context/CollectionContext';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { QuickSearchModal } from './components/QuickSearchModal';
import { LandingView } from './views/LandingView';
import { ExploreView } from './views/ExploreView';
import { HotWheelsView } from './views/HotWheelsView';
import { TradingCardsView } from './views/TradingCardsView';
import { MyCollectionView } from './views/MyCollectionView';
import { CollectibleDetailModal } from './views/CollectibleDetailModal';

const AppContent: React.FC = () => {
  const { activePage } = useCollection();

  return (
    <div className="min-h-screen flex flex-col bg-[#fffef0] text-[#004449] selection:bg-[#d7ffc2] selection:text-[#004449]">

      {/* Header Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1 w-full pb-16 md:pb-0">
        {activePage === 'landing' && <LandingView />}
        {activePage === 'explore' && <ExploreView />}
        {activePage === 'hot-wheels' && <HotWheelsView />}
        {activePage === 'trading-cards' && <TradingCardsView />}
        {activePage === 'my-collection' && <MyCollectionView />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Dock Navigation */}
      <MobileNav />

      {/* Global Interactive Overlays */}
      <CollectibleDetailModal />
      <QuickSearchModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <CollectionProvider>
      <AppContent />
    </CollectionProvider>
  );
}
