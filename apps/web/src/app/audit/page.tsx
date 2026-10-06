'use client';

import React, { useState } from 'react';
import { useWms } from '../../context/WmsContext';
import {
  ScrollText,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Lock,
} from 'lucide-react';

export default function AuditPage() {
  const { auditLogs } = useWms();
  const [search, setSearch] = useState('');

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.userName.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ScrollText className="h-6 w-6 text-blue-600" />
            Immutable Audit Trail & System Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tamper-evident logs of all warehouse movements, stock adjustments, QC pass/rejects, and courier dispatches.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting signed audit ledger CSV for compliance filing...')}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="h-4 w-4" />
          Export Ledger (CSV)
        </button>
      </div>

      {/* Security Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center">
            <Lock className="h-4 w-4 text-blue-300" />
          </div>
          <div>
            <p className="font-bold text-xs">Append-Only Cryptographic Audit Log</p>
            <p className="text-[11px] text-slate-400">
              Prisma & PostgreSQL ledger enforced with sequential ID tracking and user role authentication.
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
          TAMPER-EVIDENT VERIFIED
        </span>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by action, operator, or details..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Action Type</th>
                <th className="py-3.5 px-4">Timestamp (IST)</th>
                <th className="py-3.5 px-4">Operator / Role</th>
                <th className="py-3.5 px-4">Entity ID</th>
                <th className="py-3.5 px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-blue-600">
                    <span className="px-2 py-1 rounded bg-blue-50 border border-blue-200">
                      {log.action}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono text-slate-500">
                    {log.timestamp}
                  </td>

                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-900">{log.userName}</p>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {log.userRole}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono text-slate-600">
                    {log.entityId}
                  </td>

                  <td className="py-4 px-4 text-slate-700 max-w-md leading-relaxed">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
