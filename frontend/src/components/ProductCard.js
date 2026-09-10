'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MessageCircle, Eye, CheckCircle2, ShoppingBag, Check } from 'lucide-react';
import { getProductWhatsAppUrl } from '../lib/whatsapp';
import { useCart } from '../lib/cartContext';
import { getImageUrl } from '../lib/api';

export default function ProductCard({
  product,
  businessPhone = '+919876543210',
  onSelect,
}) {
  const waUrl = getProductWhatsAppUrl(product, businessPhone);
  const { addToCart } = useCart();
  const [addedAnim, setAddedAnim] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80';
  const displayImage = getImageUrl(product.imageUrl, fallbackImage);

  const [imgSrc, setImgSrc] = useState(displayImage);

  useEffect(() => {
    setImgSrc(displayImage);
  }, [displayImage]);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  return (
    <div className="group relative bg-[#FFFFFF] rounded-2xl border border-[#E2E2C5] hover:border-[#C85A32] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image Container */}
      <div
        onClick={() => onSelect && onSelect(product)}
        className="relative aspect-4/3 w-full bg-[#FAF9F0] overflow-hidden cursor-pointer"
      >
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          unoptimized
          onError={() => setImgSrc(fallbackImage)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Pill */}
        {product.category && (
          <div className="absolute top-3 left-3 bg-[#F5F5DC]/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-[#C85A32] border border-[#E2E2C5] shadow-xs">
            {product.category.name}
          </div>
        )}

        {/* Quick View overlay */}
        <div className="absolute inset-0 bg-[#1C1917]/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-2xs">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect && onSelect(product);
            }}
            className="flex items-center gap-1.5 bg-white text-[#1C1917] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md hover:bg-[#F5F5DC] transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#C85A32]" />
            Quick View
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Stock status */}
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 mb-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{product.inStock !== false ? 'In Stock • Ready to Dispatch' : 'Available on Request'}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect && onSelect(product)}
            className="text-base font-bold text-[#1C1917] line-clamp-2 hover:text-[#C85A32] cursor-pointer transition-colors leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Description */}
          <p className="mt-1.5 text-xs text-[#57534E] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-[#E2E2C5] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#78716C] block tracking-wider">Price</span>
            <span className="text-lg font-black text-[#C85A32]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                addedAnim
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white hover:bg-[#FAF9F0] text-[#1C1917] border-[#E2E2C5] hover:border-[#C85A32]'
              }`}
              title="Add to Shopping Cart"
            >
              {addedAnim ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-[#C85A32]" />
                  <span>Cart</span>
                </>
              )}
            </button>

            {/* Direct WhatsApp Order */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 bg-[#25D366] hover:bg-[#20BA56] text-white px-3 py-2 rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all duration-200 active:scale-95"
              title="Order directly on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>Order</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
