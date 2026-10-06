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
      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 rounded-xl">
        <CheckCircle2 className="w-4 h-4" />
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
          className="px-3 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-hw-orange"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-hw-orange hover:bg-orange-600 text-white font-bold text-xs shrink-0"
        >
          Confirm
        </button>
      </form>
    )
  }

  return (
    <button
      onClick={() => setShowInput(true)}
      className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
    >
      <Bell className="w-4 h-4 text-purple-400" />
      <span>Join Priority Drop Waitlist</span>
    </button>
  )
}
