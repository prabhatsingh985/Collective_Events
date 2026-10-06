import React from 'react'
import { Metadata } from 'next'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'
import { StoreMobileNav } from '@/components/store/StoreMobileNav'
import { StoreSearchModal } from '@/components/store/StoreSearchModal'
import { ProductListingView } from '@/components/store/ProductListingView'
import { getHotWheelsProducts } from '@/lib/api/products'

export const metadata: Metadata = {
  title: 'Hot Wheels & Die-Cast Toy Cars | Super $TH, RLC, Mainlines | CrateMeet',
  description:
    'Shop authentic 1:64 scale die-cast toy cars in India. Factory unpunched Super Treasure Hunts ($TH), Red Line Club (RLC) Chrome editions, Car Culture Real Riders, and Blvd series.',
}

interface PageProps {
  searchParams: {
    series?: string
    search?: string
    treasureHuntType?: string
  }
}

export default async function HotWheelsCategoryPage({ searchParams }: PageProps) {
  const products = await getHotWheelsProducts()

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans selection:bg-hw-orange selection:text-white">
      <StoreNavbar />
      <StoreSearchModal />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-20 lg:pb-12">
        <ProductListingView
          initialProducts={products}
          category="hot-wheels"
          title="Hot Wheels & Die-Cast Speedway"
          subtitle="Discover pristine 1:64 scale Mattel collectibles, Spectraflame grails, and factory unpunched card castings. 100% verified authentic with blister clamshell protection."
          badge="1:64 Die-Cast"
          initialFilters={{
            series: searchParams.series,
            search: searchParams.search,
            treasureHuntType: searchParams.treasureHuntType,
          }}
        />
      </main>

      <StoreFooter />
      <StoreMobileNav />
    </div>
  )
}
