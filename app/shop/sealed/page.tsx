import React from 'react'
import { Metadata } from 'next'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'
import { ProductListingView } from '@/components/store/ProductListingView'
import { getSealedCards } from '@/lib/api/products'

export const metadata: Metadata = {
  title: 'Factory Sealed Card Boxes & Blasters | Panini Prizm, Topps Chrome | CollectorEvents',
  description:
    'Shop authentic factory-sealed football and sports card hobby boxes, blasters, and wax packs in India. 100% manufacturer shrink wrap intact.',
}

export default async function SealedCategoryPage() {
  const products = await getSealedCards()

  return (
    <div className="min-h-screen bg-pure-canvas text-midnight-ink flex flex-col font-sans selection:bg-party-pink selection:text-midnight-ink">
      <StoreNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-20 lg:pb-12">
        <ProductListingView
          initialProducts={products}
          category="sealed"
          title="Factory Sealed Boxes & Wax Packs"
          subtitle="Direct from Panini & Topps authorized distributors. Guaranteed unsearched, unweighed boxes with manufacturer hologram shrink wrap intact."
          badge="Sealed Wax"
        />
      </main>

      <StoreFooter />
    </div>
  )
}
