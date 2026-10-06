import React from 'react'
import { Metadata } from 'next'
import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'
import { ProductListingView } from '@/components/store/ProductListingView'
import { getSupplies } from '@/lib/api/products'

export const metadata: Metadata = {
  title: 'Collector Protective Supplies | Clamshell Cases & Magnetic One-Touch | CrateMeet',
  description:
    'Protect your Hot Wheels blisters and sports cards with UV-resistant clamshell cases, magnetic 35pt one-touches, and penny sleeves.',
}

export default async function SuppliesCategoryPage() {
  const products = await getSupplies()

  return (
    <div className="min-h-screen bg-pure-canvas text-midnight-ink flex flex-col font-sans selection:bg-party-pink selection:text-midnight-ink">
      <StoreNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full pb-20 lg:pb-12">
        <ProductListingView
          initialProducts={products}
          category="supplies"
          title="Protective Supplies & Vault Accessories"
          subtitle="Shield your grails against UV fading, corner creases, and moisture. Premium clamshell blister protectors and archival magnetic holders."
          badge="Armored Supplies"
        />
      </main>

      <StoreFooter />
    </div>
  )
}
