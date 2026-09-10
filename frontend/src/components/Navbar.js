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
    <header className="sticky top-3 sm:top-4 z-40 px-3 sm:px-6 pointer-events-none transition-all duration-300">
      <div className="max-w-4xl lg:max-w-5xl mx-auto pointer-events-auto">
        <div className="bg-white/80 backdrop-blur-xl border border-[#E2E2C5] rounded-full shadow-lg shadow-[#1C1917]/5 px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between transition-all duration-300">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#C85A32] to-[#E27D5B] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1 leading-tight">
                <span className="text-sm sm:text-base font-black tracking-tight text-[#1C1917]">
                  IoT
                </span>
                <span className="text-sm sm:text-base font-bold tracking-tight text-[#C85A32]">
                  Garage
                </span>
              </div>
              <p className="text-[9px] tracking-wider uppercase font-semibold text-[#78716C] leading-none">
                Electronics & WhatsApp Ordering
              </p>
            </div>
            <span className="sm:hidden font-black text-[#1C1917] text-sm tracking-tight">
              IoT <span className="text-[#C85A32]">Garage</span>
            </span>
          </Link>

          {/* Centered Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
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
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Cart Button with Count Badge */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-1.5 bg-white hover:bg-white/90 text-[#1C1917] px-3 py-1.5 rounded-full text-xs font-bold border border-[#E2E2C5] shadow-xs hover:border-[#C85A32] transition-all cursor-pointer active:scale-95"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#C85A32]" />
              <span className="hidden xs:inline">Cart</span>
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
              className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20BA56] text-white px-3 sm:px-3.5 py-1.5 rounded-full font-bold text-xs shadow-sm shadow-[#25D366]/20 hover:shadow-md transition-all duration-200 active:scale-95 shrink-0"
              aria-label="Order via WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span className="hidden sm:inline">Order</span>
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-full text-[#1C1917] hover:bg-white/80 md:hidden focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Floating Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mt-2 w-full max-w-sm mx-auto bg-white/95 backdrop-blur-xl border border-[#E2E2C5] rounded-2xl shadow-xl p-3 space-y-1 animate-in slide-in-from-top-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#F5F5DC] text-[#C85A32] font-bold border border-[#E2E2C5]'
                      : 'text-[#1C1917] hover:bg-[#F5F5DC]/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#C85A32]' : 'text-[#78716C]'}`} />
                  {item.name}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-[#E2E2C5] flex flex-col gap-1.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openCart();
                }}
                className="flex items-center justify-center gap-2 w-full bg-[#F5F5DC] text-[#1C1917] py-2 rounded-xl font-bold text-xs border border-[#E2E2C5]"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#C85A32]" />
                <span>View Cart ({totalItemsCount} items)</span>
              </button>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-2 rounded-xl font-bold shadow-xs text-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                Direct WhatsApp Support
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
