'use client'

import React, { useState } from 'react'
import { Drop } from '@/types/store'
import { Bell, CheckCircle2 } from 'lucide-react'

interface DropWaitlistButtonProps {
  drop: Drop
}

export function DropWaitlistButton({ drop }: DropWaitlistButtonProps) {
  const [joined, setJoined] = useState(false)
  const [email, setEmail] = useState('')
  const [showInput, setShowInput] = useState(false)

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setJoined(true)
    setShowInput(false)
  }

  if (joined) {
    return (
      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl">
        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        <span>Waitlist Joined! You'll receive early SMS access.</span>
      </div>
    )
  }

  if (showInput) {
    return (
      <form onSubmit={handleJoin} className="flex gap-2 w-full sm:w-auto">
        <input
          type="email"
          autoFocus
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter phone or email"
          className="px-3 py-2 text-xs rounded-xl bg-fog/50 border border-silver/60 text-midnight-ink placeholder-slate focus:outline-none focus:border-midnight-ink"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-midnight-ink hover:bg-midnight-ink/90 text-pure-canvas font-bold text-xs shrink-0 transition-all"
        >
          Confirm
        </button>
      </form>
    )
  }

  return (
    <button
      onClick={() => setShowInput(true)}
      className="px-6 py-3 rounded-xl bg-midnight-ink hover:bg-midnight-ink/90 text-pure-canvas font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all w-full sm:w-auto shadow-sm"
    >
      <Bell className="w-4 h-4 text-party-pink" />
      <span>Join Priority Drop Waitlist</span>
    </button>
  )
}
