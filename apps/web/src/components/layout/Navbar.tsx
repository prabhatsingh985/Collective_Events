'use client';

import React, { useState } from 'react';
import { useWms } from '../../context/WmsContext';
import {
  Package,
  Building2,
  Bell,
  UserCheck,
  ShieldAlert,
  Barcode,
  Search,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  const { currentUser, switchUser, alerts } = useWms();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const roles = [
    { key: 'ADMIN', label: 'Admin (Aarav)', desc: 'Full system control & financials' },
    { key: 'WAREHOUSE_MANAGER', label: 'DC Manager (Priya)', desc: 'Approvals & dispatch management' },
    { key: 'WAREHOUSE_ASSOCIATE', label: 'Associate (Rohan)', desc: 'Pick, pack & putaway scanner' },
    { key: 'QC', label: 'QC Inspector (Sneha)', desc: 'BIS & toy safety inspection' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand & DC Selector */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-amber-500 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">KhelWMS</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  India DC
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Toy Fulfillment & BIS Compliance</p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-200 text-xs text-slate-600">
            <Building2 className="h-4 w-4 text-slate-400" />
            <span className="font-semibold text-slate-800">BLR-TOY-DC-01</span>
            <span className="text-slate-400">•</span>
            <span>Electronic City Ph-2, Bengaluru</span>
          </div>
        </div>

        {/* Global Search & Quick Actions */}
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block w-64 xl:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search SKU, Barcode, Bin, Order..."
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Quick Barcode Scanner link */}
          <Link
            href="/picking"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
          >
            <Barcode className="h-4 w-4" />
            <span className="hidden sm:inline">Scanner Mode</span>
          </Link>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Alerts & Notifications"
            >
              <Bell className="h-5 w-5" />
              {alerts.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white animate-pulse">
                  {alerts.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-amber-500" />
                    Warehouse Alerts ({alerts.length})
                  </h3>
                  <Link
                    href="/reports"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View Reports
                  </Link>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {alerts.map((alt) => (
                    <div key={alt.id} className="py-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                            alt.severity === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-amber-100 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {alt.type.replace('_', ' ')}
                        </span>
                        <span className="text-slate-400 text-[10px]">{alt.timestamp}</span>
                      </div>
                      <p className="font-medium text-slate-800 mt-1">{alt.title}</p>
                      <p className="text-slate-500 mt-0.5 leading-relaxed">{alt.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                {currentUser.name[0]}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-900 leading-none">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                  {currentUser.role.replace('_', ' ')}
                </p>
              </div>
              <UserCheck className="h-3.5 w-3.5 text-slate-400 ml-1" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900">Switch Role (Simulated Auth)</p>
                  <p className="text-[11px] text-slate-500">Test different WMS permissions</p>
                </div>
                <div className="py-1">
                  {roles.map((r) => (
                    <button
                      key={r.key}
                      onClick={() => {
                        switchUser(r.key);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        currentUser.role === r.key
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <p>{r.label}</p>
                        <p className="text-[10px] text-slate-400 font-normal">{r.desc}</p>
                      </div>
                      {currentUser.role === r.key && <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
