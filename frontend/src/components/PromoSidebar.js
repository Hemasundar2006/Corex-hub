'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Gift, MessageCircle, ChevronRight } from 'lucide-react';
import { getPromotionWhatsAppUrl } from '../lib/whatsapp';
import api, { getImageUrl } from '../lib/api';

function PromoSidebarItem({ promo, businessPhone }) {
  const waUrl = getPromotionWhatsAppUrl(promo, businessPhone);
  const fallback = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80';
  const initialImg = getImageUrl(promo.imageUrl, fallback);

  const [imgSrc, setImgSrc] = useState(initialImg);

  useEffect(() => {
    setImgSrc(initialImg);
  }, [initialImg]);

  return (
    <div className="group p-3 rounded-2xl bg-[#FAF9F0] hover:bg-[#F5F5DC] border border-[#E2E2C5] hover:border-[#C85A32] transition-all duration-200 flex flex-col gap-2.5">
      <div className="flex gap-3 items-center">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#FFFFFF] shrink-0 border border-[#E2E2C5]">
          <Image
            src={imgSrc}
            alt={promo.title}
            fill
            unoptimized
            onError={() => setImgSrc(fallback)}
            className="object-cover group-hover:scale-105 transition-transform"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-[#1C1917] truncate group-hover:text-[#C85A32]">
            {promo.title}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-black text-[#1C1917]">
              ₹{promo.price}
            </span>
            {promo.originalPrice > promo.price && (
              <span className="text-[11px] text-[#78716C] line-through">
                ₹{promo.originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick WhatsApp Order Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 w-full bg-[#25D366] hover:bg-[#20BA56] text-white py-1.5 px-3 rounded-lg text-xs font-bold shadow-xs transition-colors"
      >
        <MessageCircle className="w-3.5 h-3.5 fill-white" />
        <span>Order Combo via WhatsApp</span>
      </a>
    </div>
  );
}

export default function PromoSidebar({ businessPhone = '+919876543210' }) {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const res = await api.getPromotions(false);
        if (res.success && res.promotions) {
          setPromotions(res.promotions);
        }
      } catch (err) {
        console.warn('Could not load promotions in sidebar:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#FFFFFF] rounded-3xl p-5 border border-[#E2E2C5] shadow-xs space-y-4">
        <div className="h-6 bg-[#FAF9F0] rounded-md animate-pulse w-2/3" />
        <div className="h-32 bg-[#FAF9F0] rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!promotions || promotions.length === 0) {
    return null;
  }

  return (
    <aside className="bg-[#FFFFFF] rounded-3xl p-5 sm:p-6 border border-[#E2E2C5] shadow-sm space-y-5 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E2E2C5] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FBECE6] text-[#C85A32] border border-[#E27D5B]/30 flex items-center justify-center">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1C1917]">Combo Offers</h3>
            <p className="text-[10px] text-[#57534E]">Best value bundle deals</p>
          </div>
        </div>

        <Link
          href="/promotions"
          className="text-xs font-bold text-[#C85A32] hover:text-[#B04923] flex items-center gap-0.5"
        >
          View All <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Promos Stack */}
      <div className="space-y-4">
        {promotions.slice(0, 3).map((promo) => (
          <PromoSidebarItem
            key={promo._id}
            promo={promo}
            businessPhone={businessPhone}
          />
        ))}
      </div>
    </aside>
  );
}
