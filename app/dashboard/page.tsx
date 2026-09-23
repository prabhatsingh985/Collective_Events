'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useApp } from '../../context/AppContext'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import {
  Calendar,
  Users,
  TrendingUp,
  Download,
  Copy,
  Plus,
  Eye,
  Trash2,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'

export default function OrganizerDashboardPage() {
  const { events, currentUser, addToast } = useApp()

  const myHostedEvents = events.filter((e) => e.organizer.username === currentUser.username || e.id.includes('custom') || e.id === 'evt-1')

  const totalAttendees = myHostedEvents.reduce((acc, curr) => acc + curr.attendeesCount, 0)
  const totalRevenue = myHostedEvents.reduce((acc, curr) => acc + curr.attendeesCount * curr.priceMin, 0)
  const totalViews = myHostedEvents.reduce((acc, curr) => acc + curr.viewsCount, 0)

  // Attendees Modal
  const [selectedEventForAttendees, setSelectedEventForAttendees] = useState<any>(null)

  const handleExportCSV = (eventTitle: string) => {
    const csvContent = "data:text/csv;charset=utf-8,TicketCode,AttendeeName,Tier,PriceINR,RegisteredAt\n" +
      "CM-MUM-8921-VIP,Shreyash Srivastava,General Collector Pass,199,2026-09-15\n" +
      "CM-MUM-4122-VIP,Kabir Mehta,Trader Table Pass,899,2026-09-16\n" +
      "CM-MUM-7731-VIP,Ananya Deshmukh,VIP Early Access,1499,2026-09-17";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${eventTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-attendees.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'success',
      title: 'Attendee Roster Exported! 📊',
      message: 'Downloaded CSV file with registered collectors.',
    })
  }

  const handleDuplicate = (title: string) => {
    addToast({
      type: 'info',
      title: 'Event Duplicated',
      message: `Draft created: "Copy of ${title}".`,
    })
  }

  return (
    <div className="min-h-screen bg-pure-canvas pb-20 select-none">
      {/* Header with Sky Periwinkle Wash */}
      <div className="bg-sky-periwinkle border-b border-silver/80 pt-10 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="soft-pink" size="sm">
                Organizer Studio
              </Badge>
              <span className="text-xs font-semibold text-slate">
                Host Management Console
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-midnight-ink">
              Organizer Dashboard
            </h1>
            <p className="text-sm text-slate mt-1 font-normal">
              Manage RSVPs, view registration velocity, and oversee your community meets.
            </p>
          </div>

          <Link href="/create">
            <Button variant="primary" size="md" icon={<Plus className="w-4 h-4" />}>
              Create New Meetup
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-pure-canvas border border-silver rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate">
              Total Registrations
            </span>
            <p className="text-3xl font-display font-bold text-midnight-ink">{totalAttendees}</p>
            <span className="text-xs font-semibold text-spearmint block">↑ 18% this month</span>
          </div>

          <div className="bg-pure-canvas border border-silver rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate">
              Gross Pass Revenue
            </span>
            <p className="text-3xl font-display font-bold text-midnight-ink">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
            <span className="text-xs text-slate font-normal block">Direct to organizer account</span>
          </div>

          <div className="bg-pure-canvas border border-silver rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate">
              Event Page Views
            </span>
            <p className="text-3xl font-display font-bold text-midnight-ink">
              {totalViews.toLocaleString('en-IN')}
            </p>
            <span className="text-xs font-medium text-slate block">Top 5% discovery rank</span>
          </div>

          <div className="bg-pure-canvas border border-silver rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate">
              RSVP Conversion Rate
            </span>
            <p className="text-3xl font-display font-bold text-midnight-ink">11.4%</p>
            <span className="text-xs text-slate font-normal block">Benchmark across metro meets</span>
          </div>
        </div>

        {/* Analytics Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Registration Velocity SVG Line Chart */}
          <div className="bg-pure-canvas border border-silver rounded-2xl p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-silver/60 pb-3">
              <h3 className="font-display font-bold text-sm text-midnight-ink">
                Registration Velocity (30 Days)
              </h3>
              <span className="text-xs font-bold text-midnight-ink">+48 RSVPs</span>
            </div>

            <div className="h-44 w-full relative pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 160">
                <line x1="20" y1="40" x2="380" y2="40" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="4" />
                <line x1="20" y1="90" x2="380" y2="90" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="4" />
                <line x1="20" y1="140" x2="380" y2="140" stroke="#f0f0f0" strokeWidth="1" />

                <polyline
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2.5"
                  points="20,130 80,110 140,115 200,80 260,75 320,45 380,30"
                />

                {[
                  { x: 20, y: 130, val: '8' },
                  { x: 80, y: 110, val: '14' },
                  { x: 140, y: 115, val: '15' },
                  { x: 200, y: 80, val: '28' },
                  { x: 260, y: 75, val: '32' },
                  { x: 320, y: 45, val: '41' },
                  { x: 380, y: 30, val: '48' },
                ].map((p, idx) => (
                  <g key={idx}>
                    <circle cx={p.x} cy={p.y} r="4" fill="#000000" stroke="#ffffff" strokeWidth="2" />
                    <text x={p.x} y={p.y - 8} fontSize="10" fontWeight="600" textAnchor="middle" fill="#495057">
                      {p.val}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Revenue by Event Bar Chart */}
          <div className="bg-pure-canvas border border-silver rounded-2xl p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-silver/60 pb-3">
              <h3 className="font-display font-bold text-sm text-midnight-ink">
                Pass Revenue Breakdown (₹)
              </h3>
              <span className="text-xs font-semibold text-slate">Top: Mumbai Grand Prix</span>
            </div>

            <div className="h-44 w-full flex items-end justify-between gap-4 pt-4 px-4 pb-2 border-b border-silver/60">
              {[
                { label: 'Mumbai GP', height: '85%', rev: '₹43.3k' },
                { label: 'Redline Inv', height: '45%', rev: '₹21.7k' },
                { label: 'Card Summit', height: '95%', rev: '₹48.9k' },
                { label: 'Drag Night', height: '60%', rev: '₹27.4k' },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[11px] font-semibold text-midnight-ink font-display">{bar.rev}</span>
                  <div
                    className="w-full bg-midnight-ink rounded-t-lg transition-all hover:bg-graphite"
                    style={{ height: bar.height }}
                  />
                  <span className="text-[11px] font-medium text-slate uppercase truncate max-w-[70px] mt-1">
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Events Management Table */}
        <div className="bg-pure-canvas border border-silver rounded-2xl p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-silver/60 pb-4">
            <h3 className="font-display font-bold text-xl text-midnight-ink">
              Manage Hosted Meets ({myHostedEvents.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-silver bg-fog/50 text-slate font-semibold uppercase text-[11px]">
                  <th className="p-3.5">Event Title</th>
                  <th className="p-3.5">Date & City</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Attendees</th>
                  <th className="p-3.5">Min Price</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-silver/60">
                {myHostedEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-fog/30 transition-colors">
                    <td className="p-3.5">
                      <Link href={`/events/${evt.id}`} className="font-semibold text-sm text-midnight-ink hover:text-graphite line-clamp-1">
                        {evt.title}
                      </Link>
                      <span className="text-[11px] text-slate block">{evt.venue}</span>
                    </td>
                    <td className="p-3.5 text-slate font-medium">
                      {evt.date} · {evt.city}
                    </td>
                    <td className="p-3.5">
                      <Badge variant="soft-mint" size="sm">
                        {evt.status}
                      </Badge>
                    </td>
                    <td className="p-3.5 font-bold text-midnight-ink font-display">
                      {evt.attendeesCount} passes
                    </td>
                    <td className="p-3.5 font-bold text-midnight-ink font-display">
                      {evt.priceMin === 0 ? 'Free' : `₹${evt.priceMin}`}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedEventForAttendees(evt)}
                          className="px-3 py-1.5 bg-pure-canvas border border-silver rounded-lg text-xs font-bold text-midnight-ink hover:bg-fog transition-colors shadow-sm"
                        >
                          View Attendees
                        </button>
                        <button
                          onClick={() => handleExportCSV(evt.title)}
                          className="p-1.5 rounded-lg border border-silver text-slate hover:text-midnight-ink hover:bg-fog transition-colors"
                          title="Export CSV"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(evt.title)}
                          className="p-1.5 rounded-lg border border-silver text-slate hover:text-midnight-ink hover:bg-fog transition-colors"
                          title="Duplicate Event"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ATTENDEE ROSTER MODAL */}
        {selectedEventForAttendees && (
          <Modal
            isOpen={Boolean(selectedEventForAttendees)}
            onClose={() => setSelectedEventForAttendees(null)}
            title={`Attendee Roster (${selectedEventForAttendees.attendeesCount})`}
            subtitle={selectedEventForAttendees.title}
            maxWidth="lg"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-silver/60 pb-3">
                <span className="text-xs font-semibold text-slate uppercase tracking-wider">
                  Confirmed Ticket Holders
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Download className="w-3.5 h-3.5" />}
                  onClick={() => handleExportCSV(selectedEventForAttendees.title)}
                >
                  Export CSV
                </Button>
              </div>

              <div className="space-y-2">
                {[
                  { name: 'Shreyash Srivastava', handle: '@shreyash', tier: 'General Collector Pass', code: 'CM-MUM-8921-VIP', time: 'Sep 15, 2026' },
                  { name: 'Kabir Mehta', handle: '@kabir_diecast', tier: 'Trader Table Pass (Half)', code: 'CM-MUM-4122-VIP', time: 'Sep 16, 2026' },
                  { name: 'Ananya Deshmukh', handle: '@ananya_cards', tier: 'VIP Early Access', code: 'CM-MUM-7731-VIP', time: 'Sep 17, 2026' },
                  { name: 'Rohit Shenoy', handle: '@rohit_redlines', tier: 'General Collector Pass', code: 'CM-MUM-5421-VIP', time: 'Sep 18, 2026' },
                ].map((att, idx) => (
                  <div key={idx} className="p-3 bg-fog/50 border border-silver rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-midnight-ink">{att.name}</p>
                      <p className="text-[11px] text-slate">{att.handle} · Registered {att.time}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-0.5 bg-pure-canvas border border-silver rounded-lg text-[10px] font-mono font-bold text-midnight-ink block">
                        {att.code}
                      </span>
                      <span className="text-[10px] font-semibold text-slate mt-0.5 block">{att.tier}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  )
}
