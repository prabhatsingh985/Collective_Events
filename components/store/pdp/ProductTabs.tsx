'use client'

import React, { useState } from 'react'
import { Product, StoreReview } from '@/types/store'
import { MOCK_REVIEWS } from '@/lib/mock-store-data'
import {
  FileText,
  Truck,
  HelpCircle,
  MessageSquare,
  Star,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react'

interface ProductTabsProps {
  product: Product
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'shipping' | 'qa' | 'reviews'>('details')

  // Find reviews for this product or fallback to general collector reviews
  const relevantReviews = MOCK_REVIEWS.filter((r) => r.productId === product.id)
  const reviewsToDisplay = relevantReviews.length > 0 ? relevantReviews : MOCK_REVIEWS

  return (
    <div className="rounded-2xl bg-pure-canvas border border-silver/60 overflow-hidden shadow-sm">
      {/* Tab Navigation */}
      <div className="flex border-b border-silver/40 bg-black/[0.02] overflow-x-auto">
        {[
          { id: 'details', label: 'Item Details', icon: FileText },
          { id: 'shipping', label: 'Shipping & Returns', icon: Truck },
          { id: 'qa', label: 'Collector Q&A', icon: HelpCircle },
          { id: 'reviews', label: `Reviews (${reviewsToDisplay.length})`, icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold transition-all whitespace-nowrap border-b-2 ${
                isActive
                  ? 'border-midnight-ink text-midnight-ink bg-pure-canvas'
                  : 'border-transparent text-slate hover:text-midnight-ink hover:bg-black/[0.02]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-midnight-ink' : 'text-slate'}`} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Contents */}
      <div className="p-6">
        {/* 1. Item Details */}
        {activeTab === 'details' && (
          <div className="space-y-6 text-xs text-midnight-ink">
            <div>
              <h4 className="font-extrabold text-sm text-midnight-ink mb-2">Description</h4>
              <p className="leading-relaxed text-slate text-sm">{product.description}</p>
            </div>

            {product.features && product.features.length > 0 && (
              <div>
                <h4 className="font-extrabold text-sm text-midnight-ink mb-2">Key Collector Highlights</h4>
                <ul className="space-y-2">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-600 shrink-0 mt-1.5" />
                      <span className="text-midnight-ink font-medium">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* 2. Shipping & Returns */}
        {activeTab === 'shipping' && (
          <div className="space-y-5 text-xs text-midnight-ink">
            <div className="p-4 rounded-xl bg-black/[0.02] border border-silver/50 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Risk 7-Day Replacement Guarantee</span>
              </div>
              <p className="text-slate leading-relaxed">
                If the blister card sustains any soft corners during BlueDart transit, or if a factory seal shows unexpected blemishes, you can request an instant return or replacement directly from your account page within 7 days of delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-black/[0.02] border border-silver/50">
                <span className="font-bold text-midnight-ink block mb-1">Dispatch Schedule</span>
                <p className="text-slate leading-relaxed">
                  Orders placed before 2:00 PM IST dispatch the same business day from our Mumbai Central WMS vault.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/[0.02] border border-silver/50">
                <span className="font-bold text-midnight-ink block mb-1">Carrier Partnerships</span>
                <p className="text-slate leading-relaxed">
                  All consignments move via BlueDart Air Express or Delhivery Surface with end-to-end barcode tracking and OTP verification upon delivery.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. Collector Q&A */}
        {activeTab === 'qa' && (
          <div className="space-y-4 text-xs">
            {[
              {
                q: 'How do you prevent soft corners or card creasing on Hot Wheels blisters?',
                a: 'Every carded car is placed inside a crystal-clear heavy PET clamshell protector (free of charge on premium items), secured with corner foam blocks inside a rigid 5-ply carton.',
              },
              {
                q: 'Are sports card boxes weighed or searched?',
                a: 'Never. All Panini and Topps boxes are factory-sealed cases with original unbroken manufacturer hologram shrink-wrap. We do not sell loose unverified packs from opened boxes.',
              },
              {
                q: 'Can I verify the BGS/PSA certificate number before ordering?',
                a: 'Yes! The official certificate number is clearly listed in the specifications table above and can be checked directly on the official PSA or Beckett online database.',
              },
              {
                q: 'Is Cash on Delivery available for high-value collector items?',
                a: 'COD is available for orders up to ₹7,500. Orders above this threshold require prepaid payment (UPI / Cards) to ensure insured armored courier handling.',
              },
            ].map((qa, i) => (
              <div key={i} className="p-4 rounded-xl bg-black/[0.02] border border-silver/50 space-y-1.5">
                <span className="font-bold text-midnight-ink flex items-center gap-1.5">
                  <span className="text-orange-600 font-mono font-bold">Q:</span>
                  <span>{qa.q}</span>
                </span>
                <p className="text-slate pl-4 leading-relaxed">{qa.a}</p>
              </div>
            ))}
          </div>
        )}

        {/* 4. Verified Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-silver/40">
              <div className="flex items-center gap-3">
                <div className="font-mono text-3xl font-extrabold text-midnight-ink">{product.rating}</div>
                <div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                  <span className="text-xs text-slate font-medium">
                    Based on {product.reviewsCount} verified collector orders
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {reviewsToDisplay.map((rev) => (
                <div key={rev.id} className="p-4 rounded-xl bg-black/[0.02] border border-silver/50 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-midnight-ink">{rev.authorName}</span>
                      <span className="text-slate">• {rev.authorLocation}</span>
                      {rev.verifiedPurchase && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified Collector</span>
                        </span>
                      )}
                    </div>
                    <div className="flex text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  <h5 className="font-bold text-midnight-ink">{rev.title}</h5>
                  <p className="text-slate leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
