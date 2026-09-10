'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Cpu,
  Menu,
  X,
  MessageCircle,
  Package,
  Gift,
  Info,
  Home,
  ShoppingBag,
} from 'lucide-react';
import { getGeneralWhatsAppUrl } from '../lib/whatsapp';
import { useCart } from '../lib/cartContext';
import api from '../lib/api';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [businessPhone, setBusinessPhone] = useState('+919876543210');
  const pathname = usePathname();
  const { totalItemsCount, openCart } = useCart();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await api.getSettings();
        if (res.success && res.settings?.businessPhone) {
          setBusinessPhone(res.settings.businessPhone);
        }
      } catch (err) {
        console.warn('Could not fetch store phone:', err);
      }
    };
    loadSettings();
  }, []);

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Products Catalogue', href: '/products', icon: Package },
    { name: 'Combo Offers', href: '/promotions', icon: Gift },
    { name: 'About & Contact', href: '/about', icon: Info },
  ];

  const waUrl = getGeneralWhatsAppUrl(businessPhone);

  return (
    <header className="relative w-full bg-[#FFFFFF] border-b border-[#E2E2C5] z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#C85A32] to-[#E27D5B] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1 leading-tight">
                <span className="text-base sm:text-lg font-black tracking-tight text-[#1C1917]">
                  IoT
                </span>
                <span className="text-base sm:text-lg font-bold tracking-tight text-[#C85A32]">
                  Garage
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] tracking-wider uppercase font-semibold text-[#78716C] leading-none hidden xs:block">
                Electronics & WhatsApp Ordering
              </p>
            </div>
          </Link>

          {/* Centered Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#FAF9F0] border border-[#E2E2C5] px-3 py-1.5 rounded-full">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-[#C85A32] border border-[#E2E2C5] shadow-xs'
                      : 'text-[#1C1917] hover:bg-white/70 hover:text-[#C85A32]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C85A32]' : 'text-[#78716C]'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart Button with Count Badge */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-1.5 bg-[#FAF9F0] hover:bg-white text-[#1C1917] px-3 sm:px-4 py-2 rounded-xl text-xs font-bold border border-[#E2E2C5] shadow-xs hover:border-[#C85A32] transition-all cursor-pointer active:scale-95"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#C85A32]" />
              <span className="hidden sm:inline">Cart</span>
              {totalItemsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#C85A32] text-white text-[10px] font-black flex items-center justify-center animate-in zoom-in">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* WhatsApp CTA */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20BA56] text-white px-3 sm:px-4 py-2 rounded-xl font-bold text-xs shadow-sm shadow-[#25D366]/20 hover:shadow-md transition-all duration-200 active:scale-95 shrink-0"
              aria-label="Order via WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span className="hidden sm:inline">WhatsApp Order</span>
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#1C1917] hover:bg-[#FAF9F0] border border-[#E2E2C5] md:hidden focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-[#E2E2C5] space-y-1 animate-in slide-in-from-top-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#F5F5DC] text-[#C85A32] font-bold border border-[#E2E2C5]'
                      : 'text-[#1C1917] hover:bg-[#FAF9F0]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#C85A32]' : 'text-[#78716C]'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <div className="pt-2 border-t border-[#E2E2C5] flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openCart();
                }}
                className="flex items-center justify-center gap-2 w-full bg-[#FAF9F0] text-[#1C1917] py-2.5 rounded-xl font-bold text-xs border border-[#E2E2C5]"
              >
                <ShoppingBag className="w-4 h-4 text-[#C85A32]" />
                <span>View Cart ({totalItemsCount} items)</span>
              </button>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-2.5 rounded-xl font-bold shadow-xs text-xs"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Direct WhatsApp Support</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
