import React from 'react'
import {
  Product,
  HotWheelsProduct,
  SingleCardProduct,
  GradedCardProduct,
  SealedCardProduct,
  SuppliesProduct,
} from '@/types/store'

interface CollectorSpecsTableProps {
  product: Product
}

export function CollectorSpecsTable({ product }: CollectorSpecsTableProps) {
  const isHotWheels = product.productType === 'hot-wheels'
  const isSingle = product.productType === 'card-single'
  const isGraded = product.productType === 'card-graded'
  const isSealed = product.productType === 'card-sealed'
  const isSupplies = product.productType === 'supplies'

  const hw = isHotWheels ? (product as HotWheelsProduct) : null
  const single = isSingle ? (product as SingleCardProduct) : null
  const graded = isGraded ? (product as GradedCardProduct) : null
  const sealed = isSealed ? (product as SealedCardProduct) : null
  const supplies = isSupplies ? (product as SuppliesProduct) : null

  const rows: { label: string; value: React.ReactNode }[] = []

  if (hw) {
    rows.push(
      { label: 'Casting Name', value: hw.castingName },
      { label: 'Series', value: hw.series },
      { label: 'Scale', value: hw.scale },
      { label: 'Model Year', value: hw.year },
      { label: 'Color / Finish', value: hw.color },
      { label: 'Wheel & Tire Type', value: hw.wheelType },
      { label: 'Blister Packaging Condition', value: <span className="font-semibold text-emerald-400">{hw.packagingCondition}</span> },
      { label: 'Treasure Hunt Class', value: hw.treasureHuntType !== 'None' ? <strong className="text-amber-400">{hw.treasureHuntType}</strong> : 'Standard Line' },
      { label: 'Case Code', value: hw.caseCode || 'International Blister Card' },
      { label: 'BIS Toy Safety Certification', value: <span className="font-mono text-zinc-300">{hw.bisRegistrationNo}</span> },
      { label: 'SKU Code', value: <span className="font-mono text-zinc-400">{hw.sku}</span> }
    )
  }

  if (single) {
    rows.push(
      { label: 'Player Name', value: <strong className="text-white">{single.player}</strong> },
      { label: 'Team & League', value: `${single.team} • ${single.league}` },
      { label: 'Sport', value: single.sport },
      { label: 'Set & Year', value: `${single.set} (${single.year})` },
      { label: 'Manufacturer', value: single.brand },
      { label: 'Card Number', value: single.cardNumber },
      { label: 'Parallel / Variant', value: <span className="text-emerald-400 font-semibold">{single.parallel}</span> },
      { label: 'Rookie Card (RC)', value: single.isRookie ? <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-bold text-xs">Yes (Official RC Shield)</span> : 'No' },
      { label: 'Certified Autograph', value: single.isAutograph ? <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-bold text-xs">Yes (On-Card Certified)</span> : 'None' },
      { label: 'Print Run / Serial Number', value: single.printRun ? <span className="font-mono font-bold text-amber-300">Numbered #{single.serialNumber || '1'} of {single.printRun}</span> : 'Base / Unnumbered' },
      { label: 'Raw Card Condition', value: <span className="font-semibold text-emerald-400">{single.cardCondition}</span> },
      { label: 'Unique Vault Item', value: <span className="font-mono text-amber-400 font-bold">Yes (Strictly 1 Copy Available)</span> },
      { label: 'SKU Code', value: <span className="font-mono text-zinc-400">{single.sku}</span> }
    )
  }

  if (graded) {
    rows.push(
      { label: 'Player Name', value: <strong className="text-white">{graded.player}</strong> },
      { label: 'Grading Authority', value: <strong className="text-amber-400 font-mono">{graded.gradingCompany}</strong> },
      { label: 'Official Assigned Grade', value: <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-black font-mono">{graded.grade}</span> },
      { label: 'Certification / Serial No.', value: <span className="font-mono text-white font-bold">{graded.certNumber}</span> },
      { label: 'Subgrades', value: graded.subgrades ? `Centering: ${graded.subgrades.centering} | Corners: ${graded.subgrades.corners} | Edges: ${graded.subgrades.edges} | Surface: ${graded.subgrades.surface}` : 'None Assigned' },
      { label: 'Team & League', value: `${graded.team} • ${graded.league}` },
      { label: 'Set & Year', value: `${graded.set} (${graded.year})` },
      { label: 'Parallel', value: graded.parallel },
      { label: 'Slab Condition', value: <span className="text-emerald-400 font-semibold">{graded.slabCondition}</span> },
      { label: 'SKU Code', value: <span className="font-mono text-zinc-400">{graded.sku}</span> }
    )
  }

  if (sealed) {
    rows.push(
      { label: 'Set & Brand', value: `${sealed.brand} ${sealed.set}` },
      { label: 'Format / Box Type', value: <strong className="text-blue-400">{sealed.packType}</strong> },
      { label: 'Release Year', value: sealed.year },
      { label: 'Packs Per Box', value: `${sealed.packsPerBox} Sealed Packs` },
      { label: 'Cards Per Pack', value: `${sealed.cardsPerPack} Cards/Pack` },
      { label: 'Guaranteed Hits', value: sealed.guaranteedHits.join(' • ') },
      { label: 'Factory Seal', value: <span className="text-emerald-400 font-semibold">100% Panini / Topps Hologram Shrink Wrap Intact</span> },
      { label: 'SKU Code', value: <span className="font-mono text-zinc-400">{sealed.sku}</span> }
    )
  }

  if (supplies) {
    rows.push(
      { label: 'Supply Classification', value: supplies.supplyType },
      { label: 'Package Size', value: `${supplies.packSize} Units per Pack` },
      { label: 'Compatibility', value: supplies.compatibility },
      { label: 'Material', value: 'Archival Acid-Free PET / UV-Resistant Polymer' },
      { label: 'SKU Code', value: <span className="font-mono text-zinc-400">{supplies.sku}</span> }
    )
  }

  return (
    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-inner">
      <div className="px-5 py-3.5 bg-zinc-850 border-b border-zinc-800 flex items-center justify-between">
        <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
          Collector Specification Sheet
        </h3>
        <span className="text-[11px] font-mono text-zinc-400">Vault Verified Data</span>
      </div>
      <div className="divide-y divide-zinc-800/80 text-xs">
        {rows.map((row, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row sm:items-center px-5 py-2.5 hover:bg-zinc-850/40 transition-colors">
            <span className="w-full sm:w-56 text-zinc-400 font-medium shrink-0">
              {row.label}
            </span>
            <span className="text-zinc-200 mt-0.5 sm:mt-0 font-medium">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
