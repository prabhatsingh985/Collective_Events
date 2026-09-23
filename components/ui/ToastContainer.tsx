'use client'

import React from 'react'
import { useApp } from '@/context/AppContext'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export function ToastContainer() {
  const { toasts, removeToast } = useApp()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-spearmint flex-shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-midnight-ink flex-shrink-0" />,
          info: <Info className="w-5 h-5 text-midnight-blue flex-shrink-0" />,
        }

        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-pure-canvas border border-silver rounded-xl p-4 shadow-card hover:shadow-card-hover flex items-start gap-3 transition-all animate-pack-reveal"
          >
            {icons[toast.type]}
            <div className="flex-1 pr-2">
              <h4 className="font-bold text-xs text-midnight-ink">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-xs text-slate mt-0.5 leading-snug font-normal">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate hover:text-midnight-ink p-1 transition-colors rounded-lg hover:bg-fog"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
