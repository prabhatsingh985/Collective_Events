import React from 'react'
import { Package, ShieldAlert, CheckCircle, Box, Layers } from 'lucide-react'

interface PackagingPromiseProps {
  isHotWheels?: boolean
  isCard?: boolean
}

export function PackagingPromise({ isHotWheels = true, isCard = false }: PackagingPromiseProps) {
  return (
    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
          <Box className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h4 className="font-extrabold text-sm text-white">
            CrateMeet Armored Collector Packaging Promise
          </h4>
          <p className="text-xs text-zinc-400">
            Engineered so your blister card and slabs arrive in 100% untouched condition.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-850">
          <span className="font-bold text-zinc-200 block mb-1">
            {isHotWheels ? '1. Clamshell Blister Protector' : '1. Hardtop One-Touch Case'}
          </span>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            {isHotWheels
              ? 'Every carded car is placed inside a crystal-clear heavy PET clamshell protector to prevent card creasing.'
              : 'Every single card is enclosed in an archival penny sleeve inside a rigid 35pt magnetic one-touch slab.'}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-850">
          <span className="font-bold text-zinc-200 block mb-1">
            2. Foam Corner Edge Guards
          </span>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            High-density corner foam protectors absorb any transit impacts or sorting drop shocks.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-850">
          <span className="font-bold text-zinc-200 block mb-1">
            3. 5-Ply Corrugated Armor Box
          </span>
          <p className="text-zinc-400 text-[11px] leading-relaxed">
            Packed in double-walled export-grade boxes with security tamper-evident tape.
          </p>
        </div>
      </div>
    </div>
  )
}
