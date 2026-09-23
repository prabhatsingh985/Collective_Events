'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export default function CreatePreviewPage() {
  const router = useRouter()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 select-none">
      <div className="border-b-3 border-ink-black pb-4 flex items-center justify-between">
        <div>
          <Badge variant="magenta" size="sm">
            Event Preview Sandbox
          </Badge>
          <h1 className="text-3xl font-black uppercase text-ink-black tracking-tight font-walsheim mt-1">
            Standalone Event Preview
          </h1>
        </div>
        <Link
          href="/create"
          className="text-xs font-black uppercase text-ink-black hover:text-spotlight-magenta font-walsheim flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Wizard</span>
        </Link>
      </div>

      <div className="bg-paper-white border-3 border-ink-black p-8 shadow-broadside space-y-6">
        <p className="text-sm text-steel-gray leading-relaxed font-medium">
          This preview sandbox reflects the active draft stored in your browser session. If you have filled out details in the wizard, you can finalize publishing directly from the creation flow.
        </p>

        <div className="flex gap-4">
          <Button variant="primary" size="md" onClick={() => router.push('/create')}>
            Continue Editing in Wizard →
          </Button>
          <Button variant="outline" size="md" onClick={() => router.push('/events')}>
            Browse Live Directory
          </Button>
        </div>
      </div>
    </div>
  )
}
