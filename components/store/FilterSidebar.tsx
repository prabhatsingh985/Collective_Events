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
  SlidersHorizontal,
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
    <div className="space-y-6 text-midnight-ink">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-silver/40">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-midnight-blue" />
          <span className="font-extrabold text-sm text-midnight-ink uppercase tracking-wider">
            Filters
          </span>
          <span className="text-[11px] font-mono font-bold text-slate">({totalCount})</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate hover:text-midnight-ink flex items-center gap-1 transition-colors font-semibold"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Stock Availability */}
      <div className="pb-4 border-b border-silver/40">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-midnight-ink">
          <input
            type="checkbox"
            checked={!!filters.inStockOnly}
            onChange={(e) => update({ inStockOnly: e.target.checked })}
            className="w-4 h-4 rounded border-silver text-midnight-ink focus:ring-0 focus:ring-offset-0"
          />
          <span>In Stock Only (Vault Ready)</span>
        </label>
      </div>

      {/* Price Range */}
      <div className="pb-4 border-b border-silver/40">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between text-xs font-extrabold text-midnight-ink uppercase tracking-wider mb-2"
        >
          <span>Price Range (₹)</span>
          {openSections.price ? <ChevronUp className="w-3.5 h-3.5 text-slate" /> : <ChevronDown className="w-3.5 h-3.5 text-slate" />}
        </button>
        {openSections.price && (
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={filters.minPrice || ''}
                onChange={(e) =>
                  update({ minPrice: e.target.value ? Number(e.target.value) : undefined })
                }
                className="w-full bg-pure-canvas border border-silver/60 rounded-[8px] px-2.5 py-1.5 text-xs text-midnight-ink focus:outline-none focus:border-midnight-ink"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={filters.maxPrice || ''}
                onChange={(e) =>
                  update({ maxPrice: e.target.value ? Number(e.target.value) : undefined })
                }
                className="w-full bg-pure-canvas border border-silver/60 rounded-[8px] px-2.5 py-1.5 text-xs text-midnight-ink focus:outline-none focus:border-midnight-ink"
              />
            </div>
          </div>
        )}
      </div>

      {/* HOT WHEELS FILTERS */}
      {isHotWheelsCategory && (
        <>
          {/* Treasure Hunt Filter */}
          <div className="pb-4 border-b border-silver/40">
            <button
              onClick={() => toggleSection('th')}
              className="w-full flex items-center justify-between text-xs font-extrabold text-midnight-ink uppercase tracking-wider mb-2"
            >
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-600" />
                <span>Treasure Hunt Tier</span>
              </span>
              {openSections.th ? <ChevronUp className="w-3.5 h-3.5 text-slate" /> : <ChevronDown className="w-3.5 h-3.5 text-slate" />}
            </button>
            {openSections.th && (
              <div className="space-y-1.5 pt-1">
                {[
                  { label: 'All Hot Wheels', value: undefined },
                  { label: 'Super Treasure Hunt ($TH)', value: 'Super $TH' },
                  { label: 'Regular Treasure Hunt (TH)', value: 'Regular TH' },
                ].map((item) => (
                  <label
                    key={item.label}
                    className="flex items-center gap-2 cursor-pointer text-xs hover:text-orange-600 transition-colors"
                  >
                    <input
                      type="radio"
                      name="treasureHuntType"
                      checked={filters.treasureHuntType === item.value}
                      onChange={() => update({ treasureHuntType: item.value })}
                      className="text-orange-600 border-silver focus:ring-0"
                    />
                    <span className={filters.treasureHuntType === item.value ? 'font-bold text-midnight-ink' : 'text-slate'}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Series Filter */}
          <div className="pb-4 border-b border-silver/40">
            <button
              onClick={() => toggleSection('series')}
              className="w-full flex items-center justify-between text-xs font-extrabold text-midnight-ink uppercase tracking-wider mb-2"
            >
              <span>Hot Wheels Series</span>
              {openSections.series ? <ChevronUp className="w-3.5 h-3.5 text-slate" /> : <ChevronDown className="w-3.5 h-3.5 text-slate" />}
            </button>
            {openSections.series && (
              <div className="space-y-1.5 pt-1">
                {[
                  'Mainline',
                  'Car Culture',
                  'Boulevard',
                  'Red Line Club (RLC)',
                  'Pop Culture',
                  'Fast & Furious Premium',
                  'Team Transport',
                ].map((s) => (
                  <label
                    key={s}
                    className="flex items-center gap-2 cursor-pointer text-xs hover:text-midnight-ink transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.series === s}
                      onChange={(e) => update({ series: e.target.checked ? s : undefined })}
                      className="w-3.5 h-3.5 rounded border-silver text-midnight-ink focus:ring-0"
                    />
                    <span className={filters.series === s ? 'font-bold text-midnight-ink' : 'text-slate'}>
                      {s}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Packaging Condition */}
          <div className="pb-4 border-b border-silver/40">
            <button
              onClick={() => toggleSection('condition')}
              className="w-full flex items-center justify-between text-xs font-extrabold text-midnight-ink uppercase tracking-wider mb-2"
            >
              <span>Blister Packaging</span>
              {openSections.condition ? <ChevronUp className="w-3.5 h-3.5 text-slate" /> : <ChevronDown className="w-3.5 h-3.5 text-slate" />}
            </button>
            {openSections.condition && (
              <div className="space-y-1.5 pt-1">
                {[
                  'Mint on Card (MOC)',
                  'Unpunched Card',
                  'Short Card Mint',
                  'Protector Case Included',
                  'Loose Mint',
                ].map((c) => (
                  <label
                    key={c}
                    className="flex items-center gap-2 cursor-pointer text-xs hover:text-midnight-ink transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.packagingCondition === c}
                      onChange={(e) =>
                        update({ packagingCondition: e.target.checked ? c : undefined })
                      }
                      className="w-3.5 h-3.5 rounded border-silver text-midnight-ink focus:ring-0"
                    />
                    <span className={filters.packagingCondition === c ? 'font-bold text-midnight-ink' : 'text-slate'}>
                      {c}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* SPORTS CARD FILTERS */}
      {isCardsCategory && (
        <>
          {/* Sport / League */}
          <div className="pb-4 border-b border-silver/40">
            <button
              onClick={() => toggleSection('sport')}
              className="w-full flex items-center justify-between text-xs font-extrabold text-midnight-ink uppercase tracking-wider mb-2"
            >
              <span>Sport & League</span>
              {openSections.sport ? <ChevronUp className="w-3.5 h-3.5 text-slate" /> : <ChevronDown className="w-3.5 h-3.5 text-slate" />}
            </button>
            {openSections.sport && (
              <div className="space-y-1.5 pt-1">
                {[
                  'Premier League',
                  'UEFA Champions League',
                  'La Liga',
                  'FIFA World Cup',
                  'Formula 1',
                  'Cricket',
                ].map((lg) => (
                  <label
                    key={lg}
                    className="flex items-center gap-2 cursor-pointer text-xs hover:text-midnight-ink transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.league === lg}
                      onChange={(e) => update({ league: e.target.checked ? lg : undefined })}
                      className="w-3.5 h-3.5 rounded border-silver text-midnight-ink focus:ring-0"
                    />
                    <span className={filters.league === lg ? 'font-bold text-midnight-ink' : 'text-slate'}>
                      {lg}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Card Features: Rookie / Auto */}
          <div className="pb-4 border-b border-silver/40">
            <button
              onClick={() => toggleSection('cardType')}
              className="w-full flex items-center justify-between text-xs font-extrabold text-midnight-ink uppercase tracking-wider mb-2"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Card Features</span>
              </span>
              {openSections.cardType ? <ChevronUp className="w-3.5 h-3.5 text-slate" /> : <ChevronDown className="w-3.5 h-3.5 text-slate" />}
            </button>
            {openSections.cardType && (
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-midnight-ink">
                  <input
                    type="checkbox"
                    checked={!!filters.isRookie}
                    onChange={(e) => update({ isRookie: e.target.checked || undefined })}
                    className="w-3.5 h-3.5 rounded border-silver text-midnight-ink focus:ring-0"
                  />
                  <span>Rookie Cards (RC) Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-midnight-ink">
                  <input
                    type="checkbox"
                    checked={!!filters.isAutograph}
                    onChange={(e) => update({ isAutograph: e.target.checked || undefined })}
                    className="w-3.5 h-3.5 rounded border-silver text-midnight-ink focus:ring-0"
                  />
                  <span>On-Card Autographs Only</span>
                </label>
              </div>
            )}
          </div>

          {/* Grading Company */}
          <div className="pb-4 border-b border-silver/40">
            <button
              onClick={() => toggleSection('grade')}
              className="w-full flex items-center justify-between text-xs font-extrabold text-midnight-ink uppercase tracking-wider mb-2"
            >
              <span>Graded Slabs (PSA / BGS)</span>
              {openSections.grade ? <ChevronUp className="w-3.5 h-3.5 text-slate" /> : <ChevronDown className="w-3.5 h-3.5 text-slate" />}
            </button>
            {openSections.grade && (
              <div className="space-y-1.5 pt-1">
                {['PSA', 'BGS', 'CGC', 'Raw / Ungraded'].map((company) => (
                  <label
                    key={company}
                    className="flex items-center gap-2 cursor-pointer text-xs hover:text-midnight-ink transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.gradingCompany === company}
                      onChange={(e) =>
                        update({ gradingCompany: e.target.checked ? company : undefined })
                      }
                      className="w-3.5 h-3.5 rounded border-silver text-midnight-ink focus:ring-0"
                    />
                    <span className={filters.gradingCompany === company ? 'font-bold text-midnight-ink' : 'text-slate'}>
                      {company}
                    </span>
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
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="bg-pure-canvas border border-silver/50 rounded-2xl p-5 shadow-[rgba(0,0,0,0.06)_0px_2px_12px_0px] sticky top-32">
          {content}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-pure-canvas border-r border-silver/50 p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-silver/40 mb-6">
                <span className="font-extrabold text-base text-midnight-ink">Filter Catalog</span>
                <button
                  onClick={onCloseMobile}
                  className="p-1 rounded-full text-slate hover:text-midnight-ink"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>
            <div className="pt-6 border-t border-silver/40 mt-6">
              <button
                onClick={onCloseMobile}
                className="w-full py-2.5 rounded-[8px] bg-midnight-ink text-pure-canvas font-bold text-xs shadow-sm hover:opacity-90"
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
