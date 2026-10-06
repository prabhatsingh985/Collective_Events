'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Flame, Sparkles, Clock, ArrowRight, CornerDownLeft } from 'lucide-react'
import { useStore } from '@/lib/store/useStore'
import { searchStore } from '@/lib/api/products'
import { Product } from '@/types/store'

export function StoreSearchModal() {
  const router = useRouter()
  const { isSearchOpen, setSearchOpen, recentSearches, addRecentSearch, clearRecentSearches } = useStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{
    products: Product[]
    suggestions: { label: string; type: string; href: string }[]
  }>({ products: [], suggestions: [] })
  const [loading, setLoading] = useState(false)

  // Listen to Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(!isSearchOpen)
      } else if (e.key === 'Escape' && isSearchOpen) {
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSearchOpen, setSearchOpen])

  useEffect(() => {
    if (!query.trim()) {
      setResults({ products: [], suggestions: [] })
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      const data = await searchStore(query)
      setResults(data)
      setLoading(false)
    }, 150)

    return () => clearTimeout(timer)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    addRecentSearch(query)
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
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setSearchOpen(false)}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className="relative mx-auto max-w-2xl rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden text-white"
      >
        {/* Search Input Bar */}
        <form onSubmit={handleSubmit} className="flex items-center px-4 py-3.5 border-b border-zinc-800 bg-zinc-900/60">
          <Search className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search die-cast castings, cards, players, sets (e.g. Datsun, Haaland, Prizm)..."
            className="flex-1 bg-transparent border-0 text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            className="ml-2 text-xs font-mono text-zinc-500 hover:text-zinc-300 px-2 py-1 rounded bg-zinc-800 border border-zinc-700"
          >
            ESC
          </button>
        </form>

        <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-zinc-850">
          {/* Quick Suggestions */}
          {results.suggestions.length > 0 && (
            <div className="pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
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
                    className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    {s.type === 'Player' ? (
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Flame className="w-3 h-3 text-hw-orange" />
                    )}
                    <span>{s.label}</span>
                    <span className="text-[10px] text-zinc-400">({s.type})</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Product Hits */}
          {results.products.length > 0 && (
            <div className="py-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
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
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-900 transition-colors group"
                  >
                    <div className="relative w-12 h-12 rounded-lg bg-zinc-900 overflow-hidden shrink-0 border border-zinc-800">
                      <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-zinc-200 group-hover:text-hw-orange truncate transition-colors">
                        {p.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                        <span className="font-semibold text-zinc-300">₹{p.price.toLocaleString('en-IN')}</span>
                        <span>•</span>
                        <span>{p.productType}</span>
                        {p.badge && (
                          <>
                            <span>•</span>
                            <span className="text-amber-400">{p.badge}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty state when searching */}
          {query.trim() && results.products.length === 0 && !loading && (
            <div className="py-8 text-center text-zinc-400 text-xs">
              No collector items found matching <strong className="text-white">"{query}"</strong>.
              <p className="mt-1 text-zinc-500">Try searching "Super", "RLC", "Prizm", or "Haaland".</p>
            </div>
          )}

          {/* Recent Searches (when query is empty) */}
          {!query.trim() && recentSearches.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  <span>Recent Searches</span>
                </span>
                <button
                  onClick={clearRecentSearches}
                  className="text-[10px] text-zinc-400 hover:text-zinc-300"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectRecent(term)}
                    className="px-3 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 border border-zinc-800 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-zinc-900 border-t border-zinc-850 flex items-center justify-between text-[11px] text-zinc-400">
          <span className="flex items-center gap-1">
            <CornerDownLeft className="w-3 h-3 text-zinc-400" />
            <span>Press Enter to view all results</span>
          </span>
          <span>CrateMeet Vault Search</span>
        </div>
      </motion.div>
    </div>
  )
}
