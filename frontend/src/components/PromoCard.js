'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MessageCircle, Gift, Check, Sparkles, ShoppingBag } from 'lucide-react';
import { getPromotionWhatsAppUrl } from '../lib/whatsapp';
import { useCart } from '../lib/cartContext';

export default function PromoCard({ promotion, businessPhone = '+919876543210' }) {
  const waUrl = getPromotionWhatsAppUrl(promotion, businessPhone);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80';
  const displayImage = promotion.imageUrl && promotion.imageUrl.startsWith('/')
    ? `http://localhost:5000${promotion.imageUrl}`
    : (promotion.imageUrl || fallbackImage);

  const [imgSrc, setImgSrc] = useState(displayImage);

  useEffect(() => {
    setImgSrc(displayImage);
  }, [displayImage]);

  const savings = promotion.originalPrice && promotion.originalPrice > promotion.price
    ? promotion.originalPrice - promotion.price
    : 0;

  const discountPercent = promotion.originalPrice && promotion.originalPrice > promotion.price
    ? Math.round(((promotion.originalPrice - promotion.price) / promotion.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    addToCart(
      {
        _id: promotion._id,
        name: promotion.title,
        price: promotion.price,
        imageUrl: displayImage,
      },
      1,
      true
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-[#FFFFFF] rounded-3xl border border-[#E2E2C5] hover:border-[#C85A32] shadow-sm hover:shadow-[0_16px_36px_-6px_rgba(44,41,35,0.12)] transition-all duration-300 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Top Image Banner */}
        <div className="relative aspect-16/9 w-full bg-[#FAF9F0] overflow-hidden">
          <Image
            src={imgSrc}
            alt={promotion.title}
            fill
            unoptimized
            onError={() => setImgSrc(fallbackImage)}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Savings Badge */}
          {discountPercent && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-[#C85A32] to-[#E27D5B] text-white px-3 py-1 rounded-full text-xs font-black tracking-wide shadow-md shadow-[#C85A32]/30 flex items-center gap-1 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              <span>{discountPercent}% OFF</span>
            </div>
          )}

          <div className="absolute top-3 right-3 bg-[#FFFFFF]/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-[#C85A32] border border-[#E2E2C5] shadow-xs flex items-center gap-1">
            <Gift className="w-3.5 h-3.5 text-[#C85A32]" />
            <span>Combo Deal</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-3">
          <h3 className="text-lg font-bold text-[#1C1917] group-hover:text-[#C85A32] transition-colors line-clamp-2 leading-snug">
            {promotion.title}
          </h3>

          <p className="text-xs text-[#57534E] leading-relaxed line-clamp-3">
            {promotion.description}
          </p>

          {/* Included Items Checklist */}
          {promotion.items && promotion.items.length > 0 && (
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C85A32] block mb-1.5">
                Bundle Package Includes:
              </span>
              <ul className="space-y-1.5">
                {promotion.items.slice(0, 4).map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-[#44403C]">
                    <span className="w-4 h-4 rounded-full bg-[#FBECE6] text-[#C85A32] border border-[#E27D5B]/30 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                    <span className="truncate">{item}</span>
                  </li>
                ))}
                {promotion.items.length > 4 && (
                  <li className="text-[11px] text-[#78716C] font-medium pl-6">
                    + {promotion.items.length - 4} more components
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="p-5 sm:p-6 pt-0 space-y-2.5">
        <div className="p-3.5 rounded-2xl bg-[#FAF9F0] border border-[#E2E2C5] flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-[#1C1917]">
                ₹{promotion.price.toLocaleString('en-IN')}
              </span>
              {promotion.originalPrice > promotion.price && (
                <span className="text-xs text-[#78716C] line-through">
                  ₹{promotion.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {savings > 0 && (
              <span className="text-[11px] font-bold text-emerald-700 block">
                You Save ₹{savings.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20BA56] text-white px-3.5 py-2.5 rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95 shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Order Combo</span>
          </a>
        </div>

        {/* Add Combo to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
            added
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-white hover:bg-[#FAF9F0] text-[#1C1917] border-[#E2E2C5] hover:border-[#C85A32]'
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              <span>Combo Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 text-[#C85A32]" />
              <span>Add Combo to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
