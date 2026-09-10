'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gift, MessageCircle, Zap } from 'lucide-react';
import api from '../../lib/api';
import PromoCard from '../../components/PromoCard';
import { getGeneralWhatsAppUrl } from '../../lib/whatsapp';

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        setLoading(true);
        const [promoRes, setRes] = await Promise.all([
          api.getPromotions(false).catch(() => ({ promotions: [] })),
          api.getSettings().catch(() => ({ settings: null })),
        ]);
        if (promoRes.promotions) setPromotions(promoRes.promotions);
        if (setRes.settings) setSettings(setRes.settings);
      } catch (err) {
        console.error('Error loading promotions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPromos();
  }, []);

  const businessPhone = settings?.businessPhone || '+919876543210';
  const customWaUrl = getGeneralWhatsAppUrl(
    businessPhone,
    'Hi Corex Projects Hub! 👋 I am looking for a custom combo bundle / bill-of-materials for our project. Can you provide a quotation?'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-[#1C1917]">
      {/* Header Banner */}
      <div className="bg-[#ECECD0]/70 border border-[#E2E2C5] rounded-3xl p-8 sm:p-12 text-[#1C1917] shadow-xs relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-[#FFFFFF] border border-[#E2E2C5] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#C85A32]">
            <Gift className="w-3.5 h-3.5 fill-current" />
            <span>Exclusive Package Deals</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1C1917]">
            Combo Offers & Project Starter Kits
          </h1>

          <p className="text-sm sm:text-base text-[#57534E] leading-relaxed">
            Save up to 30% on curated bundles designed for IoT development, Arduino engineering projects, robotics chassis, and lab prototyping. Order directly on WhatsApp with instant confirmation.
          </p>
        </div>
      </div>

      {/* Promotions Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-[#FFFFFF] rounded-3xl border border-[#E2E2C5] h-96 animate-pulse p-6 space-y-4"
            >
              <div className="aspect-16/9 bg-[#FAF9F0] rounded-2xl w-full" />
              <div className="h-5 bg-[#FAF9F0] rounded w-3/4" />
              <div className="h-4 bg-[#FAF9F0] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : promotions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promo) => (
            <PromoCard
              key={promo._id}
              promotion={promo}
              businessPhone={businessPhone}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#FFFFFF] rounded-3xl p-12 text-center border border-[#E2E2C5] space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#FAF9F0] text-[#C85A32] flex items-center justify-center mx-auto border border-[#E2E2C5]">
            <Gift className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#1C1917]">No active combo offers at the moment</h3>
          <p className="text-xs text-[#57534E] max-w-md mx-auto">
            Check back soon for new project starter kits or chat with our team on WhatsApp for customized bundle pricing.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all"
          >
            Browse Individual Components
          </Link>
        </div>
      )}

      {/* Custom Bundle Callout */}
      <div className="bg-[#FFFFFF] rounded-3xl p-8 sm:p-10 border border-[#E2E2C5] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C85A32]">
            <Zap className="w-4 h-4" />
            <span>Need a Custom Bill of Materials (BOM)?</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1C1917]">
            Building a unique college project or startup prototype?
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] max-w-xl">
            Send us your component list or project circuit diagram on WhatsApp. Our hardware engineers will pack your components together and offer exclusive bundle pricing!
          </p>
        </div>

        <a
          href={customWaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA56] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md shadow-[#25D366]/25 transition-all shrink-0 active:scale-95"
        >
          <MessageCircle className="w-5 h-5 fill-white" />
          <span>Send Your BOM on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
