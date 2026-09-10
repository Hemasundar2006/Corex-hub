'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cpu, MessageCircle, MapPin, Mail, Phone, Clock, ShieldCheck } from 'lucide-react';
import { getGeneralWhatsAppUrl } from '../lib/whatsapp';
import api from '../lib/api';

export default function Footer({ businessPhone: propPhone }) {
  const [settings, setSettings] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const [setRes, catRes] = await Promise.all([
          api.getSettings().catch(() => ({ settings: null })),
          api.getCategories().catch(() => ({ categories: [] })),
        ]);
        if (setRes.settings) setSettings(setRes.settings);
        if (catRes.categories) setCategories(catRes.categories);
      } catch (err) {
        console.warn('Could not load footer data:', err);
      }
    };
    fetchFooterData();
  }, []);

  const businessPhone = propPhone || settings?.businessPhone || '+919573464809';
  const storeName = settings?.storeName || 'Corex Projects Hub';
  const storeAddress = settings?.address || 'Shop #14, Electronics Market Complex, Tech Road, City Center';
  const storeEmail = settings?.email || 'contact@corexprojects.com';
  const waUrl = getGeneralWhatsAppUrl(businessPhone);

  return (
    <footer className="bg-[#ECECD0] border-t border-[#E2E2C5] text-[#1C1917] pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand Info from API */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C85A32] to-[#E27D5B] flex items-center justify-center text-white shadow-xs">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black text-[#1C1917]">{storeName}</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
              {settings?.tagline || 'Your One-Stop Electronics Components & Project Supplies Hub'}
            </p>
            <div className="pt-1">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA56] text-white px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                WhatsApp Direct Helpline
              </a>
            </div>
          </div>

          {/* Col 2: Categories from API */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#C85A32]">
              Categories
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#57534E]">
              <li>
                <Link href="/products" className="hover:text-[#C85A32] transition-colors font-medium">
                  All Electronic Components
                </Link>
              </li>
              {categories.slice(0, 5).map((cat) => (
                <li key={cat._id || cat.slug}>
                  <Link href={`/products?category=${cat.slug}`} className="hover:text-[#C85A32] transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/promotions" className="hover:text-[#C85A32] transition-colors font-bold text-[#C85A32]">
                  🎁 Active Combo Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Order Instructions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#C85A32]">
              Ordering via WhatsApp
            </h3>
            <div className="space-y-2.5 text-xs text-[#57534E]">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-white text-[#C85A32] border border-[#E2E2C5] flex items-center justify-center font-bold shrink-0 text-[10px]">
                  1
                </span>
                <span>Select components or add multiple items to your Cart.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-white text-[#C85A32] border border-[#E2E2C5] flex items-center justify-center font-bold shrink-0 text-[10px]">
                  2
                </span>
                <span>Enter your delivery details (name, address, pincode).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-white text-[#C85A32] border border-[#E2E2C5] flex items-center justify-center font-bold shrink-0 text-[10px]">
                  3
                </span>
                <span>Confirm order and payment options directly on WhatsApp.</span>
              </div>
            </div>
          </div>

          {/* Col 4: Store Contact & Location from API */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-wider uppercase text-[#C85A32]">
              Store Information
            </h3>
            <ul className="space-y-2.5 text-xs text-[#57534E]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C85A32] shrink-0 mt-0.5" />
                <span>{storeAddress}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C85A32] shrink-0" />
                <span className="font-semibold text-[#1C1917]">{businessPhone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C85A32] shrink-0" />
                <span>{storeEmail}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#E2E2C5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716C]">
          <p>© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-[#1C1917] transition-colors">
              About & Contact
            </Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-[#C85A32] transition-colors flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C85A32]" />
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
