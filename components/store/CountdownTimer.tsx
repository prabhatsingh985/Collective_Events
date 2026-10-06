'use client'

import React, { useState, useEffect } from 'react'

interface CountdownTimerProps {
  targetDate: string
  compact?: boolean
  label?: string
  className?: string
  onExpire?: () => void
}

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

export function CountdownTimer({
  targetDate,
  compact = false,
  label,
  className = '',
  onExpire,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  })

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime()

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true })
        if (onExpire) onExpire()
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / 1000 / 60) % 60)
      const seconds = Math.floor((difference / 1000) % 60)

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false })
    }

    calculateTime()
    const interval = setInterval(calculateTime, 1000)
    return () => clearInterval(interval)
  }, [targetDate, onExpire])

  if (timeLeft.isExpired) {
    return (
      <div className={`inline-flex items-center gap-1.5 text-xs font-bold text-hw-flame uppercase tracking-wider ${className}`}>
        <span className="w-2 h-2 rounded-full bg-hw-flame animate-ping" />
        <span>DROP LIVE NOW</span>
      </div>
    )
  }

  const pad = (n: number) => String(n).padStart(2, '0')

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1 font-mono font-bold text-xs tracking-tight ${className}`}>
        {label && <span className="text-zinc-400 font-sans font-medium text-[11px] mr-1">{label}</span>}
        <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-white">
          {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
          {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
        </span>
      </div>
    )
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{label}</span>}
      <div className="flex items-center gap-2">
        {timeLeft.days > 0 && (
          <div className="flex flex-col items-center min-w-[50px] p-2 rounded-lg bg-zinc-900 border border-zinc-800 shadow-inner">
            <span className="font-mono text-xl sm:text-2xl font-black text-white">{pad(timeLeft.days)}</span>
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Days</span>
          </div>
        )}
        <div className="flex flex-col items-center min-w-[50px] p-2 rounded-lg bg-zinc-900 border border-zinc-800 shadow-inner">
          <span className="font-mono text-xl sm:text-2xl font-black text-white">{pad(timeLeft.hours)}</span>
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Hours</span>
        </div>
        <span className="text-xl font-black text-zinc-600">:</span>
        <div className="flex flex-col items-center min-w-[50px] p-2 rounded-lg bg-zinc-900 border border-zinc-800 shadow-inner">
          <span className="font-mono text-xl sm:text-2xl font-black text-white">{pad(timeLeft.minutes)}</span>
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Mins</span>
        </div>
        <span className="text-xl font-black text-zinc-600">:</span>
        <div className="flex flex-col items-center min-w-[50px] p-2 rounded-lg bg-zinc-900 border border-zinc-800 shadow-inner">
          <span className="font-mono text-xl sm:text-2xl font-black text-hw-yellow animate-pulse">{pad(timeLeft.seconds)}</span>
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Secs</span>
        </div>
      </div>
    </div>
  )
}
