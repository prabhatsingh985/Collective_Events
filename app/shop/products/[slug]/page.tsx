import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Home, Flame, Sparkles } from 'lucide-react'

import { StoreNavbar } from '@/components/store/StoreNavbar'
import { StoreFooter } from '@/components/store/StoreFooter'
import { StoreMobileNav } from '@/components/store/StoreMobileNav'
import { StoreSearchModal } from '@/components/store/StoreSearchModal'
import { ProductCard } from '@/components/store/ProductCard'
import { ProductGallery } from '@/components/store/pdp/ProductGallery'
import { CollectorSpecsTable } from '@/components/store/pdp/CollectorSpecsTable'
import { AuthenticityConditionGuide } from '@/components/store/pdp/AuthenticityConditionGuide'
import { PincodeEstimator } from '@/components/store/pdp/PincodeEstimator'
import { PackagingPromise } from '@/components/store/pdp/PackagingPromise'
import { ProductTabs } from '@/components/store/pdp/ProductTabs'
import { ProductPurchaseCard } from '@/components/store/pdp/ProductPurchaseCard'

import { getProductBySlug, getRelatedProducts } from '@/lib/api/products'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  if (!product) return { title: 'Product Not Found | CrateMeet' }

  return {
    title: `${product.title} | CrateMeet Collector Store`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images,
    },
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug)
  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product, 4)

  const isHotWheels = product.productType === 'hot-wheels'
  const isCard = product.productType.startsWith('card-')

  // Schema.org Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images,
    description: product.description,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      availability:
        product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans selection:bg-hw-orange selection:text-white">
      {/* Schema.org Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <StoreNavbar />
      <StoreSearchModal />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full pb-20 lg:pb-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-zinc-400 mb-6 overflow-x-auto whitespace-nowrap">
          <Link href="/shop" className="hover:text-white flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>Store</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
          <Link
            href={isHotWheels ? '/shop/hot-wheels' : '/shop/cards'}
            className="hover:text-white font-semibold"
          >
            {isHotWheels ? 'Hot Wheels Die-Cast' : 'Sports Trading Cards'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
          <span className="text-zinc-300 font-bold truncate max-w-xs">{product.title}</span>
        </nav>

        {/* 2-Column Product Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (Images, Deep Collector Specs, Packaging, Tabs) - 7 cols */}
          <div className="lg:col-span-7 space-y-8">
            <ProductGallery
              images={product.images}
              title={product.title}
              isHotWheels={isHotWheels}
              isCard={isCard}
              badge={product.badge}
            />

            <CollectorSpecsTable product={product} />

            <PackagingPromise isHotWheels={isHotWheels} isCard={isCard} />

            <AuthenticityConditionGuide />

            <ProductTabs product={product} />
          </div>

          {/* Right Column (Sticky Purchase Box & Estimator) - 5 cols */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Title & Category Snippet */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {isHotWheels && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-hw-orange text-white flex items-center gap-1">
                    <Flame className="w-3 h-3 text-hw-yellow fill-hw-yellow" />
                    <span>Hot Wheels 1:64</span>
                  </span>
                )}
                {isCard && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-yellow-300" />
                    <span>Trading Cards Vault</span>
                  </span>
                )}
                <span className="text-xs text-zinc-500 font-mono">
                  {product.sku}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                {product.title}
              </h1>
            </div>

            {/* Purchase Card */}
            <ProductPurchaseCard product={product} />

            {/* Pincode Estimator */}
            <PincodeEstimator />
          </div>
        </div>

        {/* ============================================================ */}
        {/* RELATED ITEMS & COMPLETE YOUR COLLECTION                     */}
        {/* ============================================================ */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-zinc-850">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-hw-orange block mb-1">
                  Recommendations
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  Complete Your Collection
                </h3>
              </div>
              <Link
                href={isHotWheels ? '/shop/hot-wheels' : '/shop/cards'}
                className="text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1"
              >
                <span>View More</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <StoreFooter />
      <StoreMobileNav />
    </div>
  )
}
