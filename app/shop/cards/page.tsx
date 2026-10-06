import React from 'react'
import { Metadata } from 'next'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'
import { StoreMobileNav } from '@/components/store/StoreMobileNav'
import { StoreSearchModal } from '@/components/store/StoreSearchModal'
import { ProductListingView } from '@/components/store/ProductListingView'
import { getTradingCardProducts } from '@/lib/api/products'

export const metadata: Metadata = {
  title: 'Sports Trading Cards & Wax | Panini Prizm, Topps Chrome, Rookies | CrateMeet',
  description:
    'Shop authentic football, soccer & sports cards in India. Sealed hobby boxes, retail blasters, certified on-card autographs, and PSA/BGS graded gem mint singles.',
}

interface PageProps {
  searchParams: {
    sport?: string
    league?: string
    isRookie?: string
    isAutograph?: string
    search?: string
  }
}

export default async function CardsCategoryPage({ searchParams }: PageProps) {
  const products = await getTradingCardProducts()

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      <StoreNavbar />
      <StoreSearchModal />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-20 lg:pb-12">
        <ProductListingView
          initialProducts={products}
          category="cards"
          title="Sports Trading Cards Stadium"
          subtitle="From factory-sealed Panini Prizm hobby wax to on-card autographed rookie cards and PSA 10 slabs. 100% hologram tamper-seal verified."
          badge="Panini & Topps"
          initialFilters={{
            league: searchParams.league,
            sport: searchParams.sport,
            isRookie: searchParams.isRookie === 'true',
            isAutograph: searchParams.isAutograph === 'true',
            search: searchParams.search,
          }}
        />
      </main>

      <StoreFooter />
      <StoreMobileNav />
    </div>
  )
}
