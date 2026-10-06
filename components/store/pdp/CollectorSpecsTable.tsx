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
      { label: 'Blister Packaging Condition', value: <span className="font-semibold text-emerald-700">{hw.packagingCondition}</span> },
      { label: 'Treasure Hunt Class', value: hw.treasureHuntType !== 'None' ? <strong className="text-orange-600">{hw.treasureHuntType}</strong> : 'Standard Line' },
      { label: 'Case Code', value: hw.caseCode || 'International Blister Card' },
      { label: 'BIS Toy Safety Certification', value: <span className="font-mono text-slate">{hw.bisRegistrationNo}</span> },
      { label: 'SKU Code', value: <span className="font-mono text-slate">{hw.sku}</span> }
    )
  }

  if (single) {
    rows.push(
      { label: 'Player Name', value: <strong className="text-midnight-ink">{single.player}</strong> },
      { label: 'Team & League', value: `${single.team} • ${single.league}` },
      { label: 'Sport', value: single.sport },
      { label: 'Set & Year', value: `${single.set} (${single.year})` },
      { label: 'Manufacturer', value: single.brand },
      { label: 'Card Number', value: single.cardNumber },
      { label: 'Parallel / Variant', value: <span className="text-emerald-700 font-semibold">{single.parallel}</span> },
      { label: 'Rookie Card (RC)', value: single.isRookie ? <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-xs">Yes (Official RC Shield)</span> : 'No' },
      { label: 'Certified Autograph', value: single.isAutograph ? <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-xs">Yes (On-Card Certified)</span> : 'None' },
      { label: 'Print Run / Serial Number', value: single.printRun ? <span className="font-mono font-bold text-amber-800">Numbered #{single.serialNumber || '1'} of {single.printRun}</span> : 'Base / Unnumbered' },
      { label: 'Raw Card Condition', value: <span className="font-semibold text-emerald-700">{single.cardCondition}</span> },
      { label: 'Unique Vault Item', value: <span className="font-mono text-amber-800 font-bold">Yes (Strictly 1 Copy Available)</span> },
      { label: 'SKU Code', value: <span className="font-mono text-slate">{single.sku}</span> }
    )
  }

  if (graded) {
    rows.push(
      { label: 'Player Name', value: <strong className="text-midnight-ink">{graded.player}</strong> },
      { label: 'Grading Authority', value: <strong className="text-midnight-ink">{graded.gradingCompany}</strong> },
      { label: 'Certified Grade', value: <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-black text-xs">{graded.grade}</span> },
      { label: 'Certification / Cert Number', value: <span className="font-mono font-bold text-midnight-ink">{graded.certNumber}</span> },
      { label: 'Subgrades Breakdown', value: graded.subgrades ? `Centering: ${graded.subgrades.centering} | Corners: ${graded.subgrades.corners} | Edges: ${graded.subgrades.edges} | Surface: ${graded.subgrades.surface}` : 'None provided' },
      { label: 'Acrylic Slab Condition', value: <span className="font-semibold text-emerald-700">{graded.slabCondition}</span> },
      { label: 'Team & League', value: `${graded.team} • ${graded.league}` },
      { label: 'Set & Year', value: `${graded.set} (${graded.year})` },
      { label: 'SKU Code', value: <span className="font-mono text-slate">{graded.sku}</span> }
    )
  }

  if (sealed) {
    rows.push(
      { label: 'Product Name', value: sealed.title },
      { label: 'Configuration Type', value: sealed.packType },
      { label: 'Manufacturer / Brand', value: sealed.brand },
      { label: 'Release Year', value: sealed.year },
      { label: 'Sport & League', value: `${sealed.sport} • ${sealed.league}` },
      { label: 'Packs Per Box', value: `${sealed.packsPerBox} packs` },
      { label: 'Cards Per Pack', value: `${sealed.cardsPerPack} cards` },
      { label: 'Key Chases / Inserts', value: (sealed.keyChases || sealed.guaranteedHits || []).join(', ') },
      { label: 'Factory Tamper Seal', value: <span className="font-semibold text-emerald-700">{sealed.tamperSealType || (sealed.isSealed ? 'Intact Hologram Shrink Wrap' : 'Factory Sealed')}</span> },
      { label: 'SKU Code', value: <span className="font-mono text-slate">{sealed.sku}</span> }
    )
  }

  if (supplies) {
    rows.push(
      { label: 'Product Title', value: supplies.title },
      { label: 'Protection Category', value: supplies.supplyType },
      { label: 'Compatibility', value: supplies.compatibility },
      { label: 'Material', value: supplies.material || '0.50mm Archival PET / Acrylic' },
      { label: 'Pack Quantity', value: `${supplies.packSize} units` },
      { label: 'UV Resistance Protection', value: supplies.isUVResistant ? <span className="font-bold text-emerald-700">Yes (UV Blocking)</span> : 'Standard' },
      { label: 'Acid-Free Archival', value: supplies.isAcidFree ? <span className="font-bold text-emerald-700">Yes (Archival Safe)</span> : 'Standard' },
      { label: 'SKU Code', value: <span className="font-mono text-slate">{supplies.sku}</span> }
    )
  }

  return (
    <div className="rounded-2xl bg-pure-canvas border border-silver/60 overflow-hidden shadow-sm">
      <div className="px-5 py-3.5 bg-black/[0.02] border-b border-silver/40 flex items-center justify-between">
        <h3 className="font-extrabold text-sm text-midnight-ink uppercase tracking-wider">
          Collector Specification Sheet
        </h3>
        <span className="text-[11px] font-mono font-bold text-slate">Vault Verified Data</span>
      </div>
      <div className="divide-y divide-silver/40 text-xs">
        {rows.map((row, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row sm:items-center px-5 py-3 hover:bg-black/[0.01] transition-colors">
            <span className="w-full sm:w-56 text-slate font-medium shrink-0">
              {row.label}
            </span>
            <span className="text-midnight-ink mt-0.5 sm:mt-0 font-medium">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
