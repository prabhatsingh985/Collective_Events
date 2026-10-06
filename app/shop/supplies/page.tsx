import React from 'react'
import { Metadata } from 'next'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'
import { StoreMobileNav } from '@/components/store/StoreMobileNav'
import { StoreSearchModal } from '@/components/store/StoreSearchModal'
import { ProductListingView } from '@/components/store/ProductListingView'
import { getSupplies } from '@/lib/api/products'

export const metadata: Metadata = {
  title: 'Collector Protective Supplies | Hot Wheels Clamshells & One-Touch Cases | CrateMeet',
  description:
    'Protect your investment with acid-free PET blister clamshell cases for Hot Wheels cards, 35pt magnetic one-touch card holders, top loaders, and penny sleeves.',
}

export default async function SuppliesCategoryPage() {
  const products = await getSupplies()

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      <StoreNavbar />
      <StoreSearchModal />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-20 lg:pb-12">
        <ProductListingView
          initialProducts={products}
          category="supplies"
          title="Armor & Protective Supplies"
          subtitle="Heavy-duty 0.50mm PET clamshell protectors for Hot Wheels cards, UV-shield magnetic one-touch cases, and archival penny sleeves."
          badge="Protective Armor"
        />
      </main>

      <StoreFooter />
      <StoreMobileNav />
    </div>
  )
}
