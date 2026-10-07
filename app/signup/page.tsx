'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useApp } from '../../context/AppContext'
import { Button } from '../../components/ui/Button'
import { Sparkles } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const { updateCurrentUser, addToast } = useApp()

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      updateCurrentUser({
        name,
        username: username.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'new_collector',
      })
    }
    addToast({
      type: 'success',
      title: 'Welcome to CollectorEvents! 🏎️',
      message: 'Let’s personalize your collector discovery experience.',
    })
    router.push('/onboarding')
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 select-none bg-pure-canvas">
      <div className="w-full max-w-md bg-pure-canvas border border-silver rounded-2xl shadow-card p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <Image
              src="/brand/logo-mark.png"
              alt="CollectorEvents"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="font-extrabold text-2xl tracking-tight text-midnight-ink">
              Collector<span className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent">Events</span>
            </span>
          </Link>
          <h2 className="font-display font-bold text-2xl text-midnight-ink">
            Join the Collector Network
          </h2>
          <p className="text-xs text-slate font-normal">
            Discover local swap meets, track your die-cast vault, and trade sports cards.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-midnight-ink block mb-1">
              Full Collector Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Shreyash Srivastava"
              className="w-full p-3 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20 focus:border-midnight-ink"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-midnight-ink block mb-1">
              Desired Username *
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. shreyash"
              className="w-full p-3 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20 focus:border-midnight-ink"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-midnight-ink block mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full p-3 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20 focus:border-midnight-ink"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-midnight-ink block mb-1">
              Create Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20 focus:border-midnight-ink"
            />
          </div>

          <Button variant="primary" size="lg" fullWidth type="submit">
            Create Free Account →
          </Button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate">
            Already have an account?{' '}
            <Link href="/login" className="text-midnight-ink font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
