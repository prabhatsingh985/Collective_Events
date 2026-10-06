import React from 'react'
import { ShieldCheck, CheckCircle2, HelpCircle, AlertCircle } from 'lucide-react'

export function AuthenticityConditionGuide() {
  return (
    <div className="rounded-2xl bg-pure-canvas border border-silver/60 p-5 sm:p-6 space-y-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h4 className="font-extrabold text-sm sm:text-base text-midnight-ink">
            100% Authenticity & Collector Condition Guarantee
          </h4>
          <p className="text-xs text-slate">
            Strict grading standards applied by our senior collector authentication team.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
        <div className="p-3.5 rounded-xl bg-black/[0.02] border border-silver/50">
          <span className="font-bold text-emerald-700 block mb-1">
            Mint on Card (MOC)
          </span>
          <p className="text-slate leading-relaxed">
            Cardboard backing is flat with sharp 90° unbent corners. Plastic blister bubble is crystal-clear with zero dents or cracking.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-black/[0.02] border border-silver/50">
          <span className="font-bold text-amber-800 block mb-1">
            Raw Near Mint-Mint (NM-MT)
          </span>
          <p className="text-slate leading-relaxed">
            Raw sports cards with four sharp corners, minimum 60/40 centering, clean edges, and no surface scratches under direct inspection.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-black/[0.02] border border-silver/50">
          <span className="font-bold text-blue-800 block mb-1">
            PSA 10 / BGS 9.5 True Gem
          </span>
          <p className="text-slate leading-relaxed">
            Officially verified by professional third-party grading authorities. Certification numbers can be verified live on PSA and Beckett databases.
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-silver/40 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>BIS Toy Safety Compliant (IS 9873)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Panini & Topps Tamper-Seal Verification</span>
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Serialized Hologram Tracking</span>
        </span>
      </div>
    </div>
  )
}
