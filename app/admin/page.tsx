'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useApp } from '../../context/AppContext'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Star,
  Users,
  AlertTriangle,
  BarChart,
  Sliders,
  ArrowUp,
  ArrowDown,
  Trash2,
} from 'lucide-react'

export default function AdminDashboardPage() {
  const { events, users, addToast } = useApp()

  const [adminTab, setAdminTab] = useState<'moderation' | 'reported' | 'users' | 'curation' | 'analytics'>('moderation')

  // Mock Moderation Queue
  const [moderationQueue, setModerationQueue] = useState([
    {
      id: 'mod-1',
      title: 'South Delhi Die-Cast Late Night Paddock',
      organizer: '@delhi_guild',
      category: 'Hot Wheels',
      city: 'Delhi',
      submittedAt: '35 mins ago',
      status: 'pending',
    },
    {
      id: 'mod-2',
      title: 'Bengaluru Champions League Case Break Night',
      organizer: '@bengaluru_cards',
      category: 'Football Cards',
      city: 'Bengaluru',
      submittedAt: '2 hours ago',
      status: 'pending',
    },
  ])

  // Reported items
  const [reportedItems, setReportedItems] = useState([
    {
      id: 'rep-1',
      type: 'Listing Report',
      title: 'Counterfeit Redline Camaro (Faux Bearing Wheels)',
      reportedBy: '@kabir_diecast',
      reason: 'Suspected reproduction casting sold as authentic 1968 Hong Kong original.',
      status: 'review',
    },
  ])

  const handleModerationAction = (id: string, action: 'approved' | 'rejected' | 'featured') => {
    setModerationQueue(moderationQueue.filter((m) => m.id !== id))
    addToast({
      type: action === 'approved' ? 'success' : action === 'featured' ? 'success' : 'info',
      title: `Event ${action.toUpperCase()}! 🛡️`,
      message: `Moderation task has been executed.`,
    })
  }

  return (
    <div className="min-h-screen bg-pure-canvas pb-20 select-none">
      {/* Top Header Bar */}
      <div className="bg-sky-periwinkle border-b border-silver/80 pt-10 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="bg-midnight-ink text-pure-canvas p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-card">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-spearmint animate-pulse" />
              <span className="font-bold text-xs uppercase tracking-wider">
                CrateMeet Internal Administration Console
              </span>
              <span className="px-2 py-0.5 bg-pure-canvas/20 rounded-full text-[10px] text-pure-canvas">
                ENV: Production
              </span>
            </div>
            <div className="text-xs text-ash">
              Signed in as SuperAdmin (Shreyash Srivastava)
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Admin Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-fog/70 border border-silver p-1 rounded-full w-fit">
          {[
            { id: 'moderation', label: `Moderation Queue (${moderationQueue.length})` },
            { id: 'reported', label: `Flagged Reports (${reportedItems.length})` },
            { id: 'users', label: `User Directory (${users.length})` },
            { id: 'curation', label: 'Homepage Curation' },
            { id: 'analytics', label: 'Platform Telemetry' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                adminTab === tab.id
                  ? 'bg-midnight-ink text-pure-canvas shadow-sm'
                  : 'text-slate hover:text-midnight-ink hover:bg-pure-canvas'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: MODERATION QUEUE */}
        {adminTab === 'moderation' && (
          <div className="bg-pure-canvas border border-silver rounded-2xl p-6 shadow-card space-y-6">
            <div className="flex items-center justify-between border-b border-silver/60 pb-3">
              <h3 className="font-display font-bold text-base text-midnight-ink">
                Event Publication Review Queue ({moderationQueue.length})
              </h3>
              <span className="text-xs text-slate">SLA Target: &lt; 2 Hours</span>
            </div>

            {moderationQueue.length > 0 ? (
              <div className="space-y-3">
                {moderationQueue.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-fog/50 border border-silver rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="soft-pink" size="sm">
                          {item.category}
                        </Badge>
                        <span className="text-slate text-[11px]">{item.city} · Submitted {item.submittedAt}</span>
                      </div>
                      <h4 className="font-semibold text-sm text-midnight-ink">{item.title}</h4>
                      <p className="text-[11px] text-slate">Host Organizer: {item.organizer}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleModerationAction(item.id, 'featured')}
                        className="px-3 py-1.5 bg-pure-canvas text-midnight-ink border border-silver rounded-lg text-xs font-bold hover:bg-fog flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Star className="w-3.5 h-3.5" /> Feature
                      </button>
                      <button
                        onClick={() => handleModerationAction(item.id, 'approved')}
                        className="px-3 py-1.5 bg-midnight-ink text-pure-canvas rounded-lg text-xs font-bold hover:bg-graphite flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => handleModerationAction(item.id, 'rejected')}
                        className="px-3 py-1.5 bg-pure-canvas border border-silver text-slate hover:text-midnight-ink rounded-lg text-xs font-bold hover:bg-fog flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate border border-dashed border-silver rounded-xl text-xs">
                ✓ All submissions reviewed! Moderation queue is clear.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REPORTED ITEMS */}
        {adminTab === 'reported' && (
          <div className="bg-pure-canvas border border-silver rounded-2xl p-6 shadow-card space-y-4">
            <h3 className="font-display font-bold text-base text-midnight-ink border-b border-silver/60 pb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-midnight-ink" /> Reported Listings & Authenticity Disputes
            </h3>
            <div className="space-y-3">
              {reportedItems.map((r) => (
                <div key={r.id} className="p-4 bg-fog/50 border border-silver rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-midnight-ink uppercase tracking-wider">{r.type}</span>
                    <span className="text-slate text-xs">Reported by {r.reportedBy}</span>
                  </div>
                  <h4 className="font-semibold text-sm text-midnight-ink">{r.title}</h4>
                  <p className="text-xs text-slate">{r.reason}</p>
                  <div className="pt-2 flex gap-2">
                    <button className="px-3 py-1.5 bg-midnight-ink text-pure-canvas rounded-lg text-xs font-bold hover:bg-graphite">
                      Suspend Listing
                    </button>
                    <button className="px-3 py-1.5 bg-pure-canvas border border-silver rounded-lg text-xs font-bold text-slate hover:text-midnight-ink hover:bg-fog">
                      Dismiss Flag
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: USERS & ORGANIZERS */}
        {adminTab === 'users' && (
          <div className="bg-pure-canvas border border-silver rounded-2xl p-6 shadow-card space-y-4">
            <h3 className="font-display font-bold text-base text-midnight-ink border-b border-silver/60 pb-3">
              Registered Collector Directory ({users.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-silver bg-fog/50 text-slate uppercase text-[10px] font-semibold">
                    <th className="p-3">User</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Role / Badge</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-silver/60">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-fog/30 transition-colors">
                      <td className="p-3 font-semibold">
                        <Link href={`/profile/${u.username}`} className="text-midnight-ink hover:underline">
                          {u.name} (@{u.username})
                        </Link>
                      </td>
                      <td className="p-3 text-slate">{u.location}</td>
                      <td className="p-3 text-slate">{u.verified ? 'Verified Collector' : 'Collector'}</td>
                      <td className="p-3 font-bold text-midnight-ink font-display">{u.stats.itemsCount}</td>
                      <td className="p-3">
                        <span className="text-spearmint font-semibold">Active</span>
                      </td>
                      <td className="p-3 text-right">
                        <button className="px-2.5 py-1 rounded-lg border border-silver text-slate hover:text-midnight-ink text-xs font-semibold hover:bg-fog">
                          Suspend
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: HOMEPAGE CURATION */}
        {adminTab === 'curation' && (
          <div className="bg-pure-canvas border border-silver rounded-2xl p-6 shadow-card space-y-4">
            <h3 className="font-display font-bold text-base text-midnight-ink border-b border-silver/60 pb-3">
              Featured Meets Reordering Controls
            </h3>
            <div className="space-y-2">
              {events.slice(0, 5).map((evt, idx) => (
                <div
                  key={evt.id}
                  className="p-3 bg-fog/50 border border-silver rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-midnight-ink text-pure-canvas flex items-center justify-center font-bold text-xs">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-xs text-midnight-ink">{evt.title}</p>
                      <p className="text-[11px] text-slate">{evt.city} · {evt.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button className="p-1 rounded-lg border border-silver bg-pure-canvas hover:bg-fog text-slate hover:text-midnight-ink">
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 rounded-lg border border-silver bg-pure-canvas hover:bg-fog text-slate hover:text-midnight-ink">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: TELEMETRY & ANALYTICS */}
        {adminTab === 'analytics' && (
          <div className="bg-pure-canvas border border-silver rounded-2xl p-6 shadow-card space-y-6">
            <h3 className="font-display font-bold text-base text-midnight-ink border-b border-silver/60 pb-3">
              System Telemetry & Platform Volume
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-silver bg-pure-canvas shadow-card space-y-1">
                <span className="text-slate uppercase text-[10px] font-semibold block">Total Gross GMV</span>
                <p className="text-xl font-bold font-display text-midnight-ink">₹32,48,500</p>
              </div>
              <div className="p-4 rounded-xl border border-silver bg-pure-canvas shadow-card space-y-1">
                <span className="text-slate uppercase text-[10px] font-semibold block">Active Passes</span>
                <p className="text-xl font-bold font-display text-midnight-ink">1,842</p>
              </div>
              <div className="p-4 rounded-xl border border-silver bg-pure-canvas shadow-card space-y-1">
                <span className="text-slate uppercase text-[10px] font-semibold block">Trade Velocity</span>
                <p className="text-xl font-bold font-display text-midnight-ink">58 Trades/Wk</p>
              </div>
              <div className="p-4 rounded-xl border border-silver bg-pure-canvas shadow-card space-y-1">
                <span className="text-slate uppercase text-[10px] font-semibold block">Server Uptime</span>
                <p className="text-xl font-bold font-display text-spearmint">99.98%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
