'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Gift,
  Truck,
  GraduationCap,
  X,
  ChevronRight,
} from 'lucide-react';
import api from '../lib/api';

export default function DiscountBanner() {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const [discRes, promoRes] = await Promise.all([
          api.getDiscount().catch(() => ({ discount: null })),
          api.getPromotions(false).catch(() => ({ promotions: [] })),
        ]);

        const offerList = [];

        // 1. Dynamic Discount Announcement from Admin
        if (discRes?.discount?.isActive && discRes.discount.text) {
          offerList.push({
            id: 'discount-main',
            badgeText: discRes.discount.badgeText || 'LIMITED OFFER',
            badgeColor: 'bg-[#FBECE6] text-[#C85A32] border-[#E27D5B]/30',
            text: discRes.discount.text,
            linkUrl: discRes.discount.linkUrl || '/products',
            linkText: 'Shop Now',
            icon: Sparkles,
          });
        }

        // 2. Active Combo Promotions from Admin
        if (promoRes?.promotions && Array.isArray(promoRes.promotions)) {
          promoRes.promotions.forEach((promo) => {
            if (promo.isActive) {
              const savings =
                promo.originalPrice > promo.price
                  ? ` (Save ₹${promo.originalPrice - promo.price})`
                  : '';
              offerList.push({
                id: `promo-${promo._id}`,
                badgeText: 'COMBO DEAL',
                badgeColor: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40',
                text: `${promo.title}: ₹${promo.price}${savings} - Available for instant WhatsApp dispatch!`,
                linkUrl: '/promotions',
                linkText: 'View Deal',
                icon: Gift,
              });
            }
          });
        }

        // 3. Customer Guarantees & Offers
        offerList.push({
          id: 'shipping-dispatch',
          badgeText: 'FAST SHIPPING',
          badgeColor: 'bg-amber-950/40 text-amber-300 border-amber-500/40',
          text: '⚡ Express Courier Dispatch Across India • WhatsApp Tracking Provided',
          linkUrl: '/products',
          linkText: 'Explore Stock',
          icon: Truck,
        });

        offerList.push({
          id: 'student-rates',
          badgeText: 'STUDENT RATES',
          badgeColor: 'bg-orange-950/40 text-orange-300 border-orange-500/40',
          text: '🎓 B.Tech Mini & Major Projects: Send custom BOM lists on WhatsApp for discount rates!',
          linkUrl: '/about',
          linkText: 'Contact Us',
          icon: GraduationCap,
        });

        setItems(offerList);
      } catch (err) {
        console.warn('Could not load offers for banner:', err);
      }
    };

    fetchOffers();
  }, []);

  // Vertical switching ticker loop: changes every 3.2 seconds continuously
  useEffect(() => {
    if (items.length <= 1) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        setIsTransitioning(false);
      }, 300);
    }, 3200);

    return () => clearInterval(timer);
  }, [items.length]);

  if (!isVisible || items.length === 0) {
    return null;
  }

  const currentOffer = items[currentIndex] || items[0];
  const IconComponent = currentOffer.icon || Sparkles;

  return (
    <aside
      aria-label="Promotions and Announcements"
      className="relative bg-[#1C1917] text-[#F5F5DC] py-2 sm:py-2.5 px-4 z-40 border-b border-[#E2E2C5]/30 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center relative min-h-[28px]">
        {/* Centered Animated Loop Item */}
        <div className="w-full flex items-center justify-center text-center overflow-hidden px-8 sm:px-16">
          <div
            key={currentOffer.id || currentIndex}
            className={`inline-flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap text-center transition-all duration-300 transform ${
              isTransitioning
                ? '-translate-y-3 opacity-0 scale-98'
                : 'translate-y-0 opacity-100 scale-100 animate-in slide-in-from-bottom-3 duration-300'
            }`}
          >
            {/* Pill Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider shadow-xs border shrink-0 ${
                currentOffer.badgeColor || 'bg-[#FBECE6] text-[#C85A32] border-[#E27D5B]/30'
              }`}
            >
              <IconComponent className="w-3 h-3 animate-pulse" />
              <span>{currentOffer.badgeText}</span>
            </span>

            {/* Offer Text */}
            <span className="text-[#F5F5DC] text-[11px] sm:text-sm font-medium text-center truncate max-w-[170px] xs:max-w-[220px] sm:max-w-xl md:max-w-none">
              {currentOffer.text}
            </span>

            {/* Action Link */}
            {currentOffer.linkUrl && (
              <Link
                href={currentOffer.linkUrl}
                className="inline-flex items-center gap-0.5 text-[#E27D5B] hover:text-white font-bold underline underline-offset-2 text-xs transition-colors shrink-0"
              >
                <span>{currentOffer.linkText || 'Shop Now'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Dismiss button pinned to the right */}
        <div className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-full hover:bg-white/10 text-[#F5F5DC]/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Dismiss banner"
            title="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
