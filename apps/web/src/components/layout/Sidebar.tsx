'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Boxes,
  MapPin,
  ArrowDownToLine,
  ShoppingCart,
  QrCode,
  PackageCheck,
  Truck,
  RotateCcw,
  BarChart3,
  ScrollText,
} from 'lucide-react';
import { useWms } from '../../context/WmsContext';

export function Sidebar() {
  const pathname = usePathname();
  const { orders, pickTasks, alerts } = useWms();

  const pendingPicks = pickTasks.filter((t) => t.status === 'PENDING').length;
  const pendingOrders = orders.filter((o) => o.status === 'PENDING' || o.status === 'PICKING').length;

  const navItems = [
    { label: 'DC Overview', href: '/', icon: LayoutDashboard },
    { label: 'Toy Inventory & BIS', href: '/inventory', icon: Boxes },
    { label: 'Warehouse Bins & Map', href: '/locations', icon: MapPin },
    { label: 'Inbound PO & GRN', href: '/inbound', icon: ArrowDownToLine },
    { label: 'Orders & Channels', href: '/orders', icon: ShoppingCart, badge: pendingOrders > 0 ? pendingOrders : undefined },
    { label: 'Scan Picking (S-Curve)', href: '/picking', icon: QrCode, badge: pendingPicks > 0 ? pendingPicks : undefined },
    { label: 'Packing Station', href: '/packing', icon: PackageCheck },
    { label: 'Shipping & Couriers', href: '/shipping', icon: Truck },
    { label: 'Customer Returns & RTO', href: '/returns', icon: RotateCcw },
    { label: 'BIS & Margin Reports', href: '/reports', icon: BarChart3, badge: alerts.length > 0 ? alerts.length : undefined },
    { label: 'Immutable Audit Trail', href: '/audit', icon: ScrollText },
  ];

  return (
    <aside className="w-64 border-r border-slate-200/80 bg-white/70 backdrop-blur-md flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-1">
        <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Operations Management
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-blue-700 text-white'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Warehouse Status card at bottom */}
      <div className="mt-auto p-4 border-t border-slate-100">
        <div className="rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950 p-3.5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Storage Health</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <p className="text-sm font-bold mt-1.5">Zone A & B Active</p>
          <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-1.5 rounded-full w-[68%]"></div>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
            <span>Occupancy: 68%</span>
            <span>Temp: 24°C / 45% RH</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
