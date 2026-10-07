'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  X,
  Flame,
  Sparkles,
  Clock,
  ArrowRight,
  TrendingUp,
  CornerDownLeft,
} from 'lucide-react'
import { useStore } from '@/lib/store/useStore'
import { searchStore } from '@/lib/api/search'
import { SearchResults } from '@/types/store'

export function StoreSearchModal() {
  const router = useRouter()
  const { isSearchOpen, setSearchOpen, recentSearches, addRecentSearch, clearRecentSearches } = useStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults>({ products: [], suggestions: [], totalHits: 0 })
  const [loading, setLoading] = useState(false)

  // Keyboard shortcut listener: Cmd/Ctrl + K or /
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      } else if (e.key === 'Escape' && isSearchOpen) {
        setSearchOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSearchOpen, setSearchOpen])

  // Debounced search fetch
  useEffect(() => {
    if (!query.trim()) {
      setResults({ products: [], suggestions: [], totalHits: 0 })
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await searchStore(query)
        setResults(res)
      } finally {
        setLoading(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    addRecentSearch(query.trim())
    setSearchOpen(false)
    router.push(`/shop?search=${encodeURIComponent(query.trim())}`)
  }

  const handleSelectRecent = (term: string) => {
    setQuery(term)
    addRecentSearch(term)
    setSearchOpen(false)
    router.push(`/shop?search=${encodeURIComponent(term)}`)
  }

  if (!isSearchOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 font-sans selection:bg-party-pink selection:text-midnight-ink">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-midnight-ink/60 backdrop-blur-sm transition-opacity"
        onClick={() => setSearchOpen(false)}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="relative mx-auto max-w-2xl rounded-3xl bg-pure-canvas border border-silver/60 shadow-2xl overflow-hidden text-midnight-ink"
      >
        {/* Search Input Bar */}
        <form onSubmit={handleSubmit} className="flex items-center px-4 py-3.5 border-b border-silver/50 bg-fog/50">
          <Search className="w-5 h-5 text-slate mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search die-cast castings, cards, players, sets (e.g. Datsun, Haaland, Prizm)..."
            className="flex-1 bg-transparent border-0 text-sm text-midnight-ink placeholder-slate focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-slate hover:text-midnight-ink"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            className="ml-2 text-xs font-mono text-slate hover:text-midnight-ink px-2 py-1 rounded-lg bg-fog border border-silver/60"
          >
            ESC
          </button>
        </form>

        <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-silver/40">
          {/* Quick Suggestions */}
          {results.suggestions.length > 0 && (
            <div className="pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate block mb-2">
                Suggestions
              </span>
              <div className="flex flex-wrap gap-2">
                {results.suggestions.map((s, idx) => (
                  <Link
                    key={idx}
                    href={s.href}
                    onClick={() => {
                      addRecentSearch(s.label)
                      setSearchOpen(false)
                    }}
                    className="px-2.5 py-1 rounded-xl bg-pure-canvas hover:bg-fog border border-silver/60 text-xs text-midnight-ink flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    {s.type === 'Player' ? (
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Flame className="w-3 h-3 text-orange-600" />
                    )}
                    <span className="font-medium">{s.label}</span>
                    <span className="text-[10px] text-slate">({s.type})</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Product Hits */}
          {results.products.length > 0 && (
            <div className="py-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate block mb-2">
                Matching Products ({results.products.length})
              </span>
              <div className="space-y-1.5">
                {results.products.map((p) => (
                  <Link
                    key={p.id}
                    href={`/shop/products/${p.slug}`}
                    onClick={() => {
                      addRecentSearch(p.title)
                      setSearchOpen(false)
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-fog/60 transition-colors group"
                  >
                    <div className="relative w-12 h-12 rounded-xl bg-fog overflow-hidden shrink-0 border border-silver/60">
                      <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-midnight-ink group-hover:text-party-pink/90 truncate transition-colors">
                        {p.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate mt-0.5">
                        <span className="font-semibold text-midnight-ink">₹{p.price.toLocaleString('en-IN')}</span>
                        <span>•</span>
                        <span>{p.productType}</span>
                        {p.badge && (
                          <>
                            <span>•</span>
                            <span className="text-amber-700 font-semibold">{p.badge}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate group-hover:text-midnight-ink group-hover:translate-x-1 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty state when searching */}
          {query.trim() && results.products.length === 0 && !loading && (
            <div className="py-8 text-center text-slate text-xs">
              No collector items found matching <strong className="text-midnight-ink">"{query}"</strong>.
              <p className="mt-1 text-slate">Try searching "Super", "RLC", "Prizm", or "Haaland".</p>
            </div>
          )}

          {/* Recent Searches (when query is empty) */}
          {!query.trim() && recentSearches.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  <span>Recent Searches</span>
                </span>
                <button
                  onClick={clearRecentSearches}
                  className="text-[10px] text-slate hover:text-midnight-ink font-medium"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectRecent(term)}
                    className="px-3 py-1 rounded-full bg-fog hover:bg-silver/40 text-xs text-midnight-ink border border-silver/60 transition-colors font-medium"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-fog/50 border-t border-silver/50 flex items-center justify-between text-[11px] text-slate">
          <span className="flex items-center gap-1">
            <CornerDownLeft className="w-3 h-3 text-slate" />
            <span>Press Enter to view all results</span>
          </span>
          <span className="font-semibold text-midnight-ink">CollectorEvents Vault Search</span>
        </div>
      </motion.div>
    </div>
  )
}
