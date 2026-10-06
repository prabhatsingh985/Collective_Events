import React from 'react'
import { Metadata } from 'next'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'
import { StoreMobileNav } from '@/components/store/StoreMobileNav'
import { StoreSearchModal } from '@/components/store/StoreSearchModal'
import { ProductListingView } from '@/components/store/ProductListingView'
import { getProducts } from '@/lib/api/products'

export const metadata: Metadata = {
  title: 'Search Results | CrateMeet Collector Store',
  description: 'Search results for Hot Wheels die-cast castings and sports trading cards.',
}

interface PageProps {
  searchParams: {
    q?: string
    search?: string
  }
}

export default async function SearchResultsPage({ searchParams }: PageProps) {
  const query = searchParams.q || searchParams.search || ''
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans selection:bg-hw-orange selection:text-white">
      <StoreNavbar />
      <StoreSearchModal />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-20 lg:pb-12">
        <ProductListingView
          initialProducts={products}
          category="all"
          title={query ? `Search: "${query}"` : 'All Collector Vault Items'}
          subtitle={`Explore all matching die-cast cars, sealed packs, on-card autographs, and graded slabs.`}
          badge="Search Vault"
          initialFilters={{ search: query }}
        />
      </main>

      <StoreFooter />
      <StoreMobileNav />
    </div>
  )
}
