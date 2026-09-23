'use client'

import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with celebratory soft darkening */}
      <div
        className="fixed inset-0 bg-midnight-ink/40 backdrop-blur-md transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Partiful 16px Rounded Modal Surface */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full ${widthClasses[maxWidth]} bg-pure-canvas rounded-2xl border border-silver/60 p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b border-silver/40">
          <div>
            {title && (
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-midnight-ink">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs md:text-sm text-slate mt-1 font-normal">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate hover:text-midnight-ink hover:bg-black/5 transition-colors border border-silver/50"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}
