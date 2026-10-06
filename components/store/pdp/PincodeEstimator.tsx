'use client'

import React, { useState } from 'react'
import { Truck, MapPin, CheckCircle2, Clock } from 'lucide-react'

export function PincodeEstimator() {
  const [pincode, setPincode] = useState('400050')
  const [estimate, setEstimate] = useState<{
    city: string
    carrier: string
    date: string
    isExpress: boolean
  } | null>({
    city: 'Mumbai, Maharashtra',
    carrier: 'BlueDart Air Express',
    date: 'Tomorrow, by 2:00 PM',
    isExpress: true,
  })

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = pincode.trim()
    if (clean.length !== 6) return

    if (clean.startsWith('400') || clean.startsWith('401')) {
      setEstimate({
        city: 'Mumbai & MMR',
        carrier: 'BlueDart Air Priority Express',
        date: 'Tomorrow, by 2:00 PM',
        isExpress: true,
      })
    } else if (clean.startsWith('110') || clean.startsWith('122')) {
      setEstimate({
        city: 'Delhi NCR',
        carrier: 'BlueDart Air Express',
        date: 'In 2 Business Days',
        isExpress: true,
      })
    } else if (clean.startsWith('560')) {
      setEstimate({
        city: 'Bengaluru, Karnataka',
        carrier: 'BlueDart Air Express',
        date: 'In 2 Business Days',
        isExpress: true,
      })
    } else {
      setEstimate({
        city: 'Verified Delivery Pincode',
        carrier: 'Delhivery Surface / BlueDart',
        date: 'In 3-4 Business Days',
        isExpress: false,
      })
    }
  }

  return (
    <div className="rounded-2xl bg-pure-canvas border border-silver/60 p-4 space-y-3 shadow-sm">
      <div className="flex items-center justify-between text-xs font-bold text-midnight-ink">
        <span className="flex items-center gap-1.5">
          <Truck className="w-4 h-4 text-orange-600" />
          <span>Check Delivery Estimate</span>
        </span>
        <span className="text-[11px] font-normal text-emerald-700 font-mono font-bold">
          Free Shipping on ₹999+
        </span>
      </div>

      <form onSubmit={checkPincode} className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="w-3.5 h-3.5 text-slate absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter 6-digit Pincode"
            className="w-full pl-8 pr-3 py-1.5 rounded-[8px] bg-pure-canvas border border-silver text-xs text-midnight-ink placeholder:text-ash focus:outline-none focus:border-midnight-ink font-mono"
          />
        </div>
        <button
          type="submit"
          className="px-3.5 py-1.5 rounded-[8px] bg-midnight-ink hover:opacity-85 text-pure-canvas font-bold text-xs transition-opacity shrink-0"
        >
          Verify
        </button>
      </form>

      {estimate && (
        <div className="p-3 rounded-xl bg-black/[0.02] border border-silver/50 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-midnight-ink flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Delivers to {estimate.city}</span>
            </span>
            <span className="font-mono text-emerald-700 font-bold">{estimate.date}</span>
          </div>
          <p className="text-[11px] text-slate flex items-center gap-1">
            <Clock className="w-3 h-3 text-ash shrink-0" />
            <span>Via {estimate.carrier} with live AWB tracking link.</span>
          </p>
        </div>
      )}
    </div>
  )
}
