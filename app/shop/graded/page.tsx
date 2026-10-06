import React from 'react'
import { Metadata } from 'next'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'
import { ProductListingView } from '@/components/store/ProductListingView'
import { getGradedCards } from '@/lib/api/products'

export const metadata: Metadata = {
  title: 'Graded Sports Cards (Slabs) | PSA 10 Gem Mint & BGS 9.5 | CrateMeet',
  description:
    'Shop authenticated and graded football & sports card slabs in India. PSA 10 Gem Mint and BGS 9.5 True Gem grails with verified certification numbers.',
}

export default async function GradedCategoryPage() {
  const products = await getGradedCards()

  return (
    <div className="min-h-screen bg-pure-canvas text-midnight-ink flex flex-col font-sans selection:bg-party-pink selection:text-midnight-ink">
      <StoreNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-20 lg:pb-12">
        <ProductListingView
          initialProducts={products}
          category="graded"
          title="Graded Card Slabs (PSA 10 & BGS 9.5)"
          subtitle="Highest condition tier collectibles. Encapsulated in ultrasonic tamper-proof acrylic slabs. Every cert number verified directly against the PSA/BGS registry database."
          badge="PSA / BGS Slabs"
        />
      </main>

      <StoreFooter />
    </div>
  )
}
