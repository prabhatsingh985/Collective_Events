'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useApp } from '../../context/AppContext'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import {
  Bell,
  CheckCircle2,
  Calendar,
  ArrowLeftRight,
  UserPlus,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

export default function NotificationsPage() {
  const router = useRouter()
  const { notifications, markAllNotificationsRead } = useApp()

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const getIcon = (type: string) => {
    switch (type) {
      case 'trade_offer':
      case 'trade_accepted':
        return <ArrowLeftRight className="w-4 h-4 text-midnight-ink" />
      case 'event_reminder':
      case 'new_event_city':
        return <Calendar className="w-4 h-4 text-midnight-ink" />
      case 'new_follower':
        return <UserPlus className="w-4 h-4 text-spearmint" />
      case 'post_comment':
        return <MessageSquare className="w-4 h-4 text-midnight-blue" />
      default:
        return <Sparkles className="w-4 h-4 text-party-pink" />
    }
  }

  return (
    <div className="min-h-screen bg-pure-canvas pb-20 select-none">
      {/* Header with Sky Periwinkle Wash */}
      <div className="bg-sky-periwinkle border-b border-silver/80 pt-10 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="soft-pink" size="sm">
                Activity Feed
              </Badge>
              {unreadCount > 0 && (
                <span className="text-xs font-semibold text-slate">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-midnight-ink">
              Notifications Center
            </h1>
            <p className="text-sm text-slate mt-1 font-normal">
              Stay in the loop with meetup reminders, trade offers, and community discussions.
            </p>
          </div>

          {unreadCount > 0 && (
            <Button variant="secondary" size="sm" onClick={markAllNotificationsRead}>
              Mark All as Read
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => router.push(notif.link)}
            className={`group p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
              !notif.isRead
                ? 'bg-pure-canvas border-midnight-ink shadow-[rgba(0,0,0,0.08)_0px_2px_12px_0px]'
                : 'bg-pure-canvas border-silver/50 hover:border-silver shadow-[rgba(0,0,0,0.04)_0px_1px_4px_0px]'
            }`}
          >
            {/* Actor Avatar or Icon */}
            <div className="p-2.5 rounded-full bg-black/[0.04] border border-silver/50 flex-shrink-0">
              {getIcon(notif.type)}
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-semibold text-sm text-midnight-ink group-hover:text-graphite transition-colors">
                  {notif.title}
                </h4>
                <span className="text-[11px] text-slate font-medium flex-shrink-0">
                  {notif.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate font-normal leading-relaxed">
                {notif.message}
              </p>
            </div>

            <ArrowRight className="w-4 h-4 text-slate group-hover:text-midnight-ink transition-colors self-center flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
