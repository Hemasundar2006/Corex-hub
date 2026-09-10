'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  Gift,
  Tag,
  Settings,
  LogOut,
  ExternalLink,
  Cpu,
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Combo Offers', href: '/admin/promotions', icon: Gift },
    { name: 'Discount Banner', href: '/admin/discounts', icon: Tag },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#ECECD0] border-r border-[#E2E2C5] flex flex-col justify-between h-screen sticky top-0 shrink-0 text-[#1C1917]">
      <div>
        {/* Brand */}
        <div className="p-6 border-b border-[#E2E2C5]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C85A32] flex items-center justify-center text-white shadow-sm">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-black text-[#1C1917]">COREX</span>{' '}
              <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32] block">
                Admin Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Current user badge */}
        {admin && (
          <div className="px-6 py-3.5 bg-[#FAF9F0] border-b border-[#E2E2C5] text-xs">
            <p className="font-semibold text-[#1C1917] truncate">{admin.name || 'Store Admin'}</p>
            <p className="text-[11px] text-[#78716C] truncate">{admin.email}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#FFFFFF] text-[#C85A32] border border-[#E2E2C5] shadow-xs'
                    : 'text-[#57534E] hover:bg-[#FAF9F0] hover:text-[#1C1917] border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C85A32]' : 'text-[#78716C]'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer controls */}
      <div className="p-4 border-t border-[#E2E2C5] space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-[#57534E] hover:text-[#1C1917] hover:bg-[#FAF9F0] transition-colors"
        >
          <span>View Live Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={logout}
          className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-100/70 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
