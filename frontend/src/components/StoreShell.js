'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import DiscountBanner from './DiscountBanner';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import Chatbot from './Chatbot';
import { CartProvider } from '../lib/cartContext';
import { useCart } from '../lib/cartContext';
import { ShoppingBag } from 'lucide-react';

function FloatingCartButton() {
  const { openCart, totalItemsCount } = useCart();
  if (totalItemsCount === 0) return null;
  return (
    <button
      onClick={openCart}
      className="fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-40 flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-white pl-3 pr-4 py-2.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
      aria-label="Open cart"
    >
      <div className="relative">
        <ShoppingBag className="w-5 h-5" />
        <span className="absolute -top-2 -right-2 w-4.5 h-4.5 bg-[#C85A32] text-white rounded-full text-[10px] font-black flex items-center justify-center border border-[#1C1917]">
          {totalItemsCount > 9 ? '9+' : totalItemsCount}
        </span>
      </div>
      <span className="text-xs font-bold">View Cart</span>
    </button>
  );
}

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
        <FloatingCartButton />
        <Chatbot />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}

