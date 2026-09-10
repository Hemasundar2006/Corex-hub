'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, MessageCircle, CheckCircle2, Share2, Tag, ShoppingBag, Plus, Minus, Check } from 'lucide-react';
import { getProductWhatsAppUrl } from '../lib/whatsapp';
import { useCart } from '../lib/cartContext';
import { getImageUrl } from '../lib/api';

export default function ProductModal({
  product,
  onClose,
  businessPhone = '+919876543210',
}) {
  const { addToCart, openCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const waUrl = getProductWhatsAppUrl(product, businessPhone);

  const fallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80';
  const displayImage = getImageUrl(product.imageUrl, fallbackImage);

  const [imgSrc, setImgSrc] = useState(displayImage);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/products?id=${product._id}`;
      navigator.clipboard.writeText(url);
      alert('Product link copied to clipboard!');
    }
  };

  const handleAddToCart = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
      openCart();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E2E2C5] my-8 animate-in zoom-in-95 duration-200 text-[#1C1917]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-[#F5F5DC] hover:bg-white text-[#1C1917] rounded-full flex items-center justify-center shadow-md border border-[#E2E2C5] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Product Image Area */}
          <div className="relative aspect-square sm:aspect-auto sm:h-full bg-[#FAF9F0] min-h-[280px]">
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              unoptimized
              onError={() => setImgSrc(fallbackImage)}
              className="object-cover"
            />
            {product.category && (
              <div className="absolute top-4 left-4 bg-[#F5F5DC]/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#C85A32] border border-[#E2E2C5] shadow-xs flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                {product.category.name}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="p-6 sm:p-7 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Stock Status */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{product.inStock !== false ? 'In Stock • Ready to Dispatch' : 'Backorder Available'}</span>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-[#1C1917] leading-snug">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#C85A32]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-[#78716C]">Inclusive of all taxes</span>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
                  Description
                </h4>
                <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed max-h-32 overflow-y-auto pr-1">
                  {product.description}
                </p>
              </div>

              {/* Specifications */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
                    Specifications
                  </h4>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                    {product.specifications.map((spec, idx) => (
                      <span
                        key={idx}
                        className="bg-[#FAF9F0] border border-[#E2E2C5] text-[#1C1917] px-2.5 py-1 rounded-lg text-xs font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="pt-2 flex items-center justify-between border-t border-[#E2E2C5]">
                <span className="text-xs font-bold text-[#44403C]">Quantity:</span>
                <div className="flex items-center gap-2 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl p-1">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-7 h-7 flex items-center justify-center bg-white rounded-lg text-[#1C1917] hover:bg-[#F5F5DC] border border-[#E2E2C5] transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-black text-[#1C1917]">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-7 h-7 flex items-center justify-center bg-white rounded-lg text-[#1C1917] hover:bg-[#F5F5DC] border border-[#E2E2C5] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-[#E2E2C5] space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className={`flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                    added
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-[#1C1917] hover:bg-[#292524] text-white border-[#1C1917] shadow-xs'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#C85A32]" />
                      <span>Add to Cart ({qty})</span>
                    </>
                  )}
                </button>

                {/* Instant WhatsApp Order */}
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20BA56] text-white py-3 px-3 rounded-xl font-bold text-xs shadow-xs hover:shadow-md transition-all active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Order Now</span>
                </a>
              </div>

              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 w-full bg-[#FAF9F0] hover:bg-[#F5F5DC] text-[#57534E] hover:text-[#1C1917] py-2 px-4 rounded-xl font-semibold text-xs border border-[#E2E2C5] transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Product Link</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
