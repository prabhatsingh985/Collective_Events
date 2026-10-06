'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useApp } from '@/context/AppContext'
import { ShopProduct } from '@/types'
import { CartDrawer } from '@/components/shop/CartDrawer'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import {
  Search,
  ShoppingBag,
  Zap,
  Star,
  ShieldCheck,
  Truck,
  Flame,
  Filter,
  Check,
  ChevronDown,
  Info,
  Clock,
  Sparkles,
  ArrowRight,
  Package,
} from 'lucide-react'

export default function HotWheelsShopPage() {
  const {
    shopProducts,
    addToCart,
    cartItems,
    setIsCartOpen,
  } = useApp()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSeries, setSelectedSeries] = useState<string>('all')
  const [selectedCondition, setSelectedCondition] = useState<string>('all')
  const [primeOnly, setPrimeOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured')

  // Selected product modal
  const [previewProduct, setPreviewProduct] = useState<ShopProduct | null>(null)

  const seriesOptions = [
    { id: 'all', label: 'All Die-Cast Castings' },
    { id: 'Super Treasure Hunt ($TH)', label: 'Super Treasure Hunts ($TH)' },
    { id: 'Red Line Club (RLC)', label: 'Red Line Club (RLC)' },
    { id: 'Car Culture Premium', label: 'Car Culture Premium' },
    { id: 'Mainline', label: 'Mainlines' },
    { id: 'Accessories', label: 'Protector Cases' },
  ]

  const conditionOptions = [
    { id: 'all', label: 'All Conditions' },
    { id: 'Mint on Card (MOC)', label: 'Mint on Card (MOC)' },
    { id: 'Short Card MOC', label: 'Short Card MOC' },
    { id: 'Sealed RLC Clamshell', label: 'Sealed RLC Clamshell' },
    { id: 'Custom Acrylic Case', label: 'Custom Acrylic Case' },
  ]

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return shopProducts
      .filter((prod) => {
        if (selectedSeries !== 'all' && prod.series !== selectedSeries) return false
        if (selectedCondition !== 'all' && prod.packagingCondition !== selectedCondition) return false
        if (primeOnly && !prod.primeDelivery) return false

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchTitle = prod.title.toLowerCase().includes(q)
          const matchCasting = prod.castingName.toLowerCase().includes(q)
          const matchSeries = prod.series.toLowerCase().includes(q)
          const matchWheels = prod.wheelType.toLowerCase().includes(q)
          if (!matchTitle && !matchCasting && !matchSeries && !matchWheels) return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price
        if (sortBy === 'price-desc') return b.price - a.price
        if (sortBy === 'rating') return b.rating - a.rating
        return 0 // featured default order
      })
  }, [shopProducts, selectedSeries, selectedCondition, primeOnly, searchQuery, sortBy])

  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0)

  const handleBuyNow = (product: ShopProduct) => {
    addToCart(product, 1)
    setIsCartOpen(true)
  }

  return (
    <div className="min-h-screen bg-pure-canvas pb-24 select-none">
      <CartDrawer />

      {/* Top Banner: Amazon / Partiful Style Storefront */}
      <div className="bg-gradient-to-r from-sky-periwinkle via-party-pink/30 to-warm-sand/40 border-b border-silver/80 pt-10 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-orange-600 text-pure-canvas text-xs font-bold rounded-full tracking-wide flex items-center gap-1 shadow-sm">
                  <Flame className="w-3.5 h-3.5 fill-pure-canvas" />
                  <span>HOT WHEELS STORE</span>
                </span>
                <span className="px-2.5 py-0.5 bg-pure-canvas border border-silver text-midnight-ink text-xs font-semibold rounded-full flex items-center gap-1 shadow-sm">
                  <Zap className="w-3.5 h-3.5 text-midnight-blue fill-midnight-blue" />
                  <span>Collector Express Dispatch</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-midnight-ink tracking-tight font-display">
                Authentic 1:64 Scale Die-Cast Toy Store
              </h1>
              <p className="text-sm text-slate max-w-2xl font-normal leading-relaxed">
                Shop genuine Mattel Hot Wheels castings, Super Treasure Hunts ($TH), Red Line Club (RLC) exclusives, Car Culture premiums, and archival clamshell protectors. Direct warehouse fulfillment in Mumbai, Delhi & Bengaluru.
              </p>
            </div>

            {/* Floating Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-3 px-5 py-3 bg-midnight-ink text-pure-canvas rounded-2xl shadow-card hover:opacity-90 transition-all shrink-0 active:scale-98 self-start md:self-auto"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-pure-canvas" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-party-pink text-midnight-ink rounded-full text-[11px] font-extrabold flex items-center justify-center border-2 border-midnight-ink">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <div className="text-left">
                <div className="text-[10px] text-ash uppercase font-semibold leading-none">View Cart</div>
                <div className="text-xs font-bold leading-tight">
                  {totalCartCount > 0 ? `${totalCartCount} Castings` : 'Cart is Empty'}
                </div>
              </div>
            </button>
          </div>

          {/* CRITICAL COLLECTOR SCOPE DISCLAIMER BANNER */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3 text-xs text-amber-950 font-medium">
            <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="text-amber-900 font-bold block">
                Collector Authenticity Notice:
              </strong>
              <span>
                All listings on this storefront are <strong>1:64 scale die-cast toy collectibles</strong> manufactured by Mattel (or adjacent scale toy brands). Items feature blister-card packaging, real-rider rubber tires, and toy safety BIS compliance (IS 9873). These are <strong>NOT</strong> real-world automobile sales or full-scale vehicles.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Search, Filter Chips & Sorting Toolbar */}
        <div className="bg-pure-canvas border border-silver rounded-2xl p-4 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Amazon-style Search Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search castings, series (e.g. Datsun 240Z $TH, R34 RLC, Real Riders)..."
                className="w-full pl-10 pr-4 py-2.5 bg-black/[0.03] border border-silver/80 rounded-xl text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20 focus:bg-pure-canvas"
              />
            </div>

            {/* Sort & Prime Toggle */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <label
                onClick={() => setPrimeOnly(!primeOnly)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                  primeOnly
                    ? 'border-midnight-blue bg-midnight-blue/10 text-midnight-blue'
                    : 'border-silver bg-pure-canvas text-slate hover:text-midnight-ink'
                }`}
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>⚡ Express Delivery Only</span>
              </label>

              <div className="flex items-center gap-1.5 border border-silver rounded-xl px-3 py-1.5 bg-pure-canvas">
                <span className="text-[11px] text-slate font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-bold text-midnight-ink focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Customer Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Series Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {seriesOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedSeries(opt.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedSeries === opt.id
                    ? 'bg-midnight-ink text-pure-canvas shadow-sm'
                    : 'bg-black/[0.03] text-slate hover:text-midnight-ink hover:bg-black/[0.06]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-midnight-ink flex items-center gap-2">
              <span>Die-Cast Toy Catalog</span>
              <span className="text-xs font-semibold text-slate">
                ({filteredProducts.length} castings available)
              </span>
            </h2>
            <span className="text-xs text-slate font-medium">
              📦 Armored Delivery with Corner Protectors
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-pure-canvas border border-silver rounded-2xl p-16 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-fog rounded-full mx-auto flex items-center justify-center text-3xl">
                🔍
              </div>
              <h3 className="text-xl font-bold text-midnight-ink">No castings found</h3>
              <p className="text-xs text-slate max-w-sm mx-auto">
                No die-cast items matched your search filters. Try clearing your search or switching series.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedSeries('all')
                  setSelectedCondition('all')
                  setPrimeOnly(false)
                }}
                className="px-4 py-2 bg-midnight-ink text-pure-canvas text-xs font-bold rounded-lg"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((product) => {
                const inStock = product.stockCount > 0
                return (
                  <div
                    key={product.id}
                    className="group bg-pure-canvas rounded-2xl border border-silver/70 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden relative"
                  >
                    {/* Top Image & Badges */}
                    <div>
                      <div className="relative h-56 w-full bg-fog overflow-hidden cursor-pointer" onClick={() => setPreviewProduct(product)}>
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                          {product.badge && (
                            <span className="px-2.5 py-0.5 bg-midnight-ink text-pure-canvas text-[10px] font-extrabold rounded-md shadow-sm">
                              {product.badge}
                            </span>
                          )}
                          <span className="px-2 py-0.5 bg-pure-canvas/90 backdrop-blur-md text-midnight-ink text-[10px] font-bold rounded-md border border-silver/60">
                            1:64 Scale Die-Cast
                          </span>
                        </div>

                        {/* Condition Tag on bottom image */}
                        <div className="absolute bottom-2 left-2.5">
                          <span className="px-2 py-0.5 bg-black/75 text-pure-canvas text-[10px] font-semibold rounded-md backdrop-blur-md">
                            📦 {product.packagingCondition}
                          </span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-4 space-y-2.5">
                        {/* Series and Rating */}
                        <div className="flex items-center justify-between gap-1 text-xs">
                          <span className="text-[11px] font-bold text-midnight-blue truncate">
                            {product.series}
                          </span>
                          <div className="flex items-center gap-1 shrink-0 text-amber-500 font-bold text-xs">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{product.rating}</span>
                            <span className="text-slate text-[10px] font-medium">({product.reviewsCount})</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3
                          onClick={() => setPreviewProduct(product)}
                          className="font-bold text-sm text-midnight-ink line-clamp-2 hover:text-midnight-blue transition-colors cursor-pointer leading-snug"
                        >
                          {product.title}
                        </h3>

                        {/* Specs bullet preview */}
                        <div className="text-[11px] text-slate space-y-0.5">
                          <p className="truncate">🛞 {product.wheelType}</p>
                          <p className="truncate text-spearmint font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            <span>BIS Certified: {product.bisRegistrationNo}</span>
                          </p>
                        </div>

                        {/* Prime Express delivery notice */}
                        {product.primeDelivery && (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-midnight-ink">
                            <Zap className="w-3.5 h-3.5 text-midnight-blue fill-midnight-blue" />
                            <span>Collector Express</span>
                            <span className="text-slate font-normal text-[10px]">· Tomorrow by 2 PM</span>
                          </div>
                        )}

                        {/* Pricing section */}
                        <div className="pt-1.5 border-t border-silver/50">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-extrabold text-midnight-ink">
                              ₹{product.price}
                            </span>
                            <span className="text-xs text-slate line-through">
                              ₹{product.mrp}
                            </span>
                            <span className="text-xs font-bold text-spearmint">
                              {product.discountPercent}% OFF
                            </span>
                          </div>

                          {/* Stock status */}
                          <div className="text-[10px] pt-0.5">
                            {product.stockCount <= 3 ? (
                              <span className="text-crimson font-bold">
                                Only {product.stockCount} left in stock - order soon
                              </span>
                            ) : (
                              <span className="text-spearmint font-semibold">
                                In Stock (Dispatched from WMS Hub)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons: Add to Cart & Buy Now */}
                    <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="py-2.5 px-3 bg-fog hover:bg-black/[0.08] text-midnight-ink text-xs font-bold rounded-xl border border-silver transition-colors flex items-center justify-center gap-1.5 active:scale-98"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>

                      <button
                        onClick={() => handleBuyNow(product)}
                        className="py-2.5 px-3 bg-midnight-ink hover:opacity-90 text-pure-canvas text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 active:scale-98"
                      >
                        <span>Buy Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* PRODUCT DETAIL PREVIEW MODAL */}
      {previewProduct && (
        <Modal
          isOpen={!!previewProduct}
          onClose={() => setPreviewProduct(null)}
          title={previewProduct.title}
          subtitle={`1:64 Scale Die-Cast Toy Collectible · ${previewProduct.series}`}
          maxWidth="2xl"
        >
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <img
                  src={previewProduct.images[0]}
                  alt={previewProduct.title}
                  className="w-full h-64 object-cover rounded-xl border border-silver"
                />
                <div className="flex gap-2">
                  {previewProduct.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="Thumbnail"
                      className="w-16 h-16 object-cover rounded-lg border border-silver"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-party-pink/40 text-midnight-ink text-xs font-bold rounded-full">
                    {previewProduct.series}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{previewProduct.rating}</span>
                    <span className="text-slate">({previewProduct.reviewsCount} reviews)</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-midnight-ink">
                    ₹{previewProduct.price}
                  </span>
                  <span className="text-sm text-slate line-through">
                    ₹{previewProduct.mrp}
                  </span>
                  <span className="text-xs font-bold text-spearmint">
                    Save {previewProduct.discountPercent}%
                  </span>
                </div>

                <p className="text-xs text-slate leading-relaxed">
                  {previewProduct.description}
                </p>

                <div className="p-3 bg-fog/80 border border-silver/60 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate">Casting Name:</span>
                    <span className="font-bold text-midnight-ink">{previewProduct.castingName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate">Wheel Type:</span>
                    <span className="font-bold text-midnight-ink">{previewProduct.wheelType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate">Packaging Condition:</span>
                    <span className="font-bold text-midnight-ink">{previewProduct.packagingCondition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate">Toy BIS Certification:</span>
                    <span className="font-bold text-spearmint">{previewProduct.bisRegistrationNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate">Weight & Dimensions:</span>
                    <span className="font-bold text-midnight-ink">
                      {previewProduct.weightGrams}g ({previewProduct.dimensionsCm.length} x {previewProduct.dimensionsCm.width} cm)
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      addToCart(previewProduct, 1)
                      setPreviewProduct(null)
                    }}
                    className="flex-1 py-3 bg-midnight-ink text-pure-canvas text-xs font-bold rounded-xl hover:opacity-90 shadow-md flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart & Checkout</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="border-t border-silver/60 pt-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate">
                Collector Authenticity Specifications:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate">
                {previewProduct.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 font-medium">
                    <Check className="w-3.5 h-3.5 text-spearmint shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
