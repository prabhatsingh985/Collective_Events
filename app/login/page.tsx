'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useApp } from '../../context/AppContext'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { addToast } = useApp()

  const [email, setEmail] = useState('shreyash@cratemeet.com')
  const [password, setPassword] = useState('••••••••••••')
  const [forgotModalOpen, setForgotModalOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    addToast({
      type: 'success',
      title: 'Welcome Back, Shreyash! ⚡',
      message: 'Signed in successfully to CrateMeet.',
    })
    router.push('/')
  }

  const handleGoogleMock = () => {
    addToast({
      type: 'success',
      title: 'Google Auth Verified! ⚡',
      message: 'Welcome back, Shreyash Srivastava.',
    })
    router.push('/')
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    setForgotModalOpen(false)
    addToast({
      type: 'info',
      title: 'Recovery Link Dispatched 📩',
      message: `Password reset link sent to ${resetEmail || 'your email'}.`,
    })
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 select-none bg-pure-canvas">
      <div className="w-full max-w-md bg-pure-canvas border border-silver rounded-2xl shadow-card p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-midnight-ink text-pure-canvas flex items-center justify-center font-bold text-sm shadow-sm">
              <Sparkles className="w-4 h-4 text-party-pink" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-midnight-ink">
              CrateMeet
            </span>
          </Link>
          <h2 className="font-display font-bold text-2xl text-midnight-ink">
            Sign In to Your Account
          </h2>
          <p className="text-xs text-slate font-normal">
            Access your tickets, collector vault, and peer-to-peer trades.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-midnight-ink block mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20 focus:border-midnight-ink"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-midnight-ink">
                Password
              </label>
              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-[11px] font-semibold text-slate hover:text-midnight-ink hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20 focus:border-midnight-ink"
            />
          </div>

          <Button variant="primary" size="lg" fullWidth type="submit">
            Sign In with Email →
          </Button>
        </form>

        <div className="relative flex items-center justify-center border-t border-silver/60 pt-4">
          <button
            type="button"
            onClick={handleGoogleMock}
            className="w-full p-3 border border-silver rounded-lg bg-pure-canvas hover:bg-fog/50 font-semibold text-xs text-midnight-ink flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span>Continue with Google (One-Tap Demo)</span>
          </button>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-slate">
            Don&apos;t have an account yet?{' '}
            <Link href="/signup" className="text-midnight-ink font-bold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>

      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Password"
        subtitle="We'll send an email with instructions to restore access."
        maxWidth="sm"
      >
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-midnight-ink block mb-1">
              Account Email
            </label>
            <input
              type="email"
              required
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="shreyash@cratemeet.com"
              className="w-full p-2.5 bg-pure-canvas border border-silver rounded-lg text-xs font-medium text-midnight-ink focus:outline-none focus:ring-2 focus:ring-midnight-ink/20"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setForgotModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Send Instructions
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
