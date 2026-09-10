'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import DiscountBanner from './DiscountBanner';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppFloat from './WhatsAppFloat';
import CartDrawer from './CartDrawer';
import { CartProvider } from '../lib/cartContext';

export default function StoreShell({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <div className="min-h-screen bg-[#F5F5DC] text-[#1C1917]">{children}</div>;
  }

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#F5F5DC] text-[#1C1917]">
        <DiscountBanner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
