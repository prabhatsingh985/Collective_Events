import React from 'react'
import { Metadata } from 'next'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'
import { StoreMobileNav } from '@/components/store/StoreMobileNav'
import { StoreSearchModal } from '@/components/store/StoreSearchModal'
import { ProductListingView } from '@/components/store/ProductListingView'
import { getGradedCards } from '@/lib/api/products'

export const metadata: Metadata = {
  title: 'Graded Cards | PSA 10 Gem Mint & BGS 9.5 True Gem Slabs | CrateMeet',
  description:
    'Buy authenticated and graded football & sports card slabs in India. PSA 10 Gem Mint, Beckett BGS 9.5 True Gem with quad subgrades. Official cert verified.',
}

export default async function GradedCategoryPage() {
  const products = await getGradedCards()

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      <StoreNavbar />
      <StoreSearchModal />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-20 lg:pb-12">
        <ProductListingView
          initialProducts={products}
          category="graded"
          title="Graded Slabs Vault"
          subtitle="Professionally authenticated and encapsulated by PSA and Beckett (BGS). Every slab is shipped in a scratch-resistant sleeve inside a rigid armor case."
          badge="PSA & BGS Slabs"
        />
      </main>

      <StoreFooter />
      <StoreMobileNav />
    </div>
  )
}
