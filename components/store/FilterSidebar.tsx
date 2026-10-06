'use client'

import React, { useState } from 'react'
import {
  Filter,
  X,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  Flame,
  Sparkles,
} from 'lucide-react'

export interface FilterState {
  search?: string
  series?: string
  sport?: string
  league?: string
  team?: string
  castingName?: string
  year?: string
  packagingCondition?: string
  treasureHuntType?: string
  cardCondition?: string
  gradingCompany?: string
  grade?: string
  isRookie?: boolean
  isAutograph?: boolean
  inStockOnly?: boolean
  minPrice?: number
  maxPrice?: number
  packType?: string
  supplyType?: string
}

interface FilterSidebarProps {
  category: 'all' | 'hot-wheels' | 'cards' | 'sealed' | 'graded' | 'supplies'
  filters: FilterState
  onFilterChange: (newFilters: FilterState) => void
  onReset: () => void
  totalCount: number
  isOpenMobile: boolean
  onCloseMobile: () => void
}

export function FilterSidebar({
  category,
  filters,
  onFilterChange,
  onReset,
  totalCount,
  isOpenMobile,
  onCloseMobile,
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    series: true,
    condition: true,
    th: true,
    price: true,
    sport: true,
    cardType: true,
    grade: true,
  })

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }))
  }

  const update = (patch: Partial<FilterState>) => {
    onFilterChange({ ...filters, ...patch })
  }

  const isHotWheelsCategory = category === 'hot-wheels' || category === 'all'
  const isCardsCategory = category === 'cards' || category === 'sealed' || category === 'graded' || category === 'all'

  const content = (
    <div className="space-y-6 text-zinc-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-hw-orange" />
          <span className="font-extrabold text-sm text-white uppercase tracking-wider">
            Filters
          </span>
          <span className="text-[11px] font-mono text-zinc-500">({totalCount})</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-zinc-400 hover:text-hw-orange flex items-center gap-1 transition-colors font-semibold"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Stock Availability */}
      <div className="pb-4 border-b border-zinc-800">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-zinc-200">
          <input
            type="checkbox"
            checked={!!filters.inStockOnly}
            onChange={(e) => update({ inStockOnly: e.target.checked })}
            className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-hw-orange focus:ring-0 focus:ring-offset-0"
          />
          <span>In Stock Only (Ready to Dispatch)</span>
        </label>
      </div>

      {/* Price Range */}
      <div className="pb-4 border-b border-zinc-800">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between text-xs font-extrabold text-white uppercase tracking-wider mb-2"
        >
          <span>Price Range (₹)</span>
          {openSections.price ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        {openSections.price && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2 text-xs">
              <input
                type="number"
                placeholder="Min ₹"
                value={filters.minPrice || ''}
                onChange={(e) => update({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-hw-orange font-mono"
              />
              <span className="text-zinc-600">-</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={filters.maxPrice || ''}
                onChange={(e) => update({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-hw-orange font-mono"
              />
            </div>
            {/* Quick Price Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
              {[
                { label: 'Under ₹1,000', max: 1000 },
                { label: '₹1k - ₹5k', min: 1000, max: 5000 },
                { label: '₹5k - ₹15k', min: 5000, max: 15000 },
                { label: '₹15k+', min: 15000 },
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => update({ minPrice: p.min, maxPrice: p.max })}
                  className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= HOT WHEELS SPECIFIC FILTERS ================= */}
      {isHotWheelsCategory && (
        <>
          {/* Series */}
          <div className="pb-4 border-b border-zinc-800">
            <button
              onClick={() => toggleSection('series')}
              className="w-full flex items-center justify-between text-xs font-extrabold text-white uppercase tracking-wider mb-2"
            >
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-hw-orange" />
                <span>Die-Cast Series</span>
              </span>
              {openSections.series ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {openSections.series && (
              <div className="space-y-1.5 pt-1">
                {[
                  'All Series',
                  'Super Treasure Hunt ($TH)',
                  'Red Line Club (RLC)',
                  'Car Culture Premium',
                  'Boulevard',
                  'Team Transport',
                  'Mainline',
                ].map((s) => {
                  const val = s === 'All Series' ? undefined : s
                  const isChecked = filters.series === val
                  return (
                    <label key={s} className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 hover:text-white">
                      <input
                        type="radio"
                        name="hw-series"
                        checked={isChecked}
                        onChange={() => update({ series: val })}
                        className="w-3.5 h-3.5 text-hw-orange bg-zinc-900 border-zinc-700"
                      />
                      <span>{s}</span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>

          {/* Treasure Hunt / Chase */}
          <div className="pb-4 border-b border-zinc-800">
            <button
              onClick={() => toggleSection('th')}
              className="w-full flex items-center justify-between text-xs font-extrabold text-white uppercase tracking-wider mb-2"
            >
              <span>Treasure Hunt Badge</span>
              {openSections.th ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {openSections.th && (
              <div className="space-y-1.5 pt-1">
                {[
                  { label: 'All Items', val: undefined },
                  { label: 'Super $TH (Real Riders)', val: 'Super $TH' },
                  { label: 'Regular TH (Flame Emblem)', val: 'Regular TH' },
                ].map((th) => (
                  <label key={th.label} className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 hover:text-white">
                    <input
                      type="radio"
                      name="th-type"
                      checked={filters.treasureHuntType === th.val}
                      onChange={() => update({ treasureHuntType: th.val })}
                      className="w-3.5 h-3.5 text-hw-orange bg-zinc-900 border-zinc-700"
                    />
                    <span>{th.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Blister Card Condition */}
          <div className="pb-4 border-b border-zinc-800">
            <button
              onClick={() => toggleSection('condition')}
              className="w-full flex items-center justify-between text-xs font-extrabold text-white uppercase tracking-wider mb-2"
            >
              <span>Packaging Condition</span>
              {openSections.condition ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {openSections.condition && (
              <div className="space-y-1.5 pt-1">
                {[
                  'All Conditions',
                  'Mint on Card (MOC)',
                  'Short Card MOC',
                  'Sealed RLC Clamshell',
                  'Card Creased / Soft Corners',
                ].map((c) => {
                  const val = c === 'All Conditions' ? undefined : c
                  return (
                    <label key={c} className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 hover:text-white">
                      <input
                        type="radio"
                        name="card-cond"
                        checked={filters.packagingCondition === val}
                        onChange={() => update({ packagingCondition: val })}
                        className="w-3.5 h-3.5 text-hw-orange bg-zinc-900 border-zinc-700"
                      />
                      <span>{c}</span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* ================= TRADING CARDS SPECIFIC FILTERS ================= */}
      {isCardsCategory && (
        <>
          {/* League / Sport */}
          <div className="pb-4 border-b border-zinc-800">
            <button
              onClick={() => toggleSection('sport')}
              className="w-full flex items-center justify-between text-xs font-extrabold text-white uppercase tracking-wider mb-2"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sport / League</span>
              </span>
              {openSections.sport ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {openSections.sport && (
              <div className="space-y-1.5 pt-1">
                {[
                  'All Leagues',
                  'Premier League',
                  'UEFA Champions League',
                  'La Liga',
                  'Serie A',
                  'Formula 1',
                ].map((l) => {
                  const val = l === 'All Leagues' ? undefined : l
                  return (
                    <label key={l} className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 hover:text-white">
                      <input
                        type="radio"
                        name="league"
                        checked={filters.league === val}
                        onChange={() => update({ league: val })}
                        className="w-3.5 h-3.5 text-emerald-500 bg-zinc-900 border-zinc-700"
                      />
                      <span>{l}</span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>

          {/* Rookie / Autograph Flags */}
          <div className="pb-4 border-b border-zinc-800">
            <button
              onClick={() => toggleSection('cardType')}
              className="w-full flex items-center justify-between text-xs font-extrabold text-white uppercase tracking-wider mb-2"
            >
              <span>Card Attributes</span>
              {openSections.cardType ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {openSections.cardType && (
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={!!filters.isRookie}
                    onChange={(e) => update({ isRookie: e.target.checked ? true : undefined })}
                    className="w-3.5 h-3.5 rounded text-emerald-500 bg-zinc-900 border-zinc-700"
                  />
                  <span>RC Rookie Shield</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={!!filters.isAutograph}
                    onChange={(e) => update({ isAutograph: e.target.checked ? true : undefined })}
                    className="w-3.5 h-3.5 rounded text-emerald-500 bg-zinc-900 border-zinc-700"
                  />
                  <span>Certified On-Card Autograph</span>
                </label>
              </div>
            )}
          </div>

          {/* Grading Company & Grade */}
          <div className="pb-4 border-b border-zinc-800">
            <button
              onClick={() => toggleSection('grade')}
              className="w-full flex items-center justify-between text-xs font-extrabold text-white uppercase tracking-wider mb-2"
            >
              <span>Graded Slabs (PSA / BGS)</span>
              {openSections.grade ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {openSections.grade && (
              <div className="space-y-1.5 pt-1">
                {[
                  { label: 'All (Raw & Graded)', val: undefined },
                  { label: 'PSA 10 Gem Mint', val: 'PSA' },
                  { label: 'BGS 9.5 True Gem', val: 'BGS' },
                ].map((g) => (
                  <label key={g.label} className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 hover:text-white">
                    <input
                      type="radio"
                      name="grading"
                      checked={filters.gradingCompany === g.val}
                      onChange={() => update({ gradingCompany: g.val })}
                      className="w-3.5 h-3.5 text-amber-500 bg-zinc-900 border-zinc-700"
                    />
                    <span>{g.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 pr-6 border-r border-zinc-800/80">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 custom-scrollbar">
          {content}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col justify-between shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
              <span className="font-extrabold text-base text-white">Filter Vault</span>
              <button onClick={onCloseMobile} className="p-1 rounded text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2">{content}</div>
            <div className="pt-4 border-t border-zinc-800 mt-4">
              <button
                onClick={onCloseMobile}
                className="w-full py-2.5 rounded-xl bg-hw-orange text-white font-extrabold text-xs uppercase tracking-wider"
              >
                Apply Filters ({totalCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
