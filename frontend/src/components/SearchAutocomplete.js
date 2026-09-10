'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Cpu,
  Layers,
  ChevronRight,
  Loader2,
  Sparkles,
} from 'lucide-react';
import api from '../lib/api';

export default function SearchAutocomplete({
  value = '',
  onChange,
  onSelectProduct,
  onSelectCategory,
  onSubmit,
  placeholder = 'Search components (e.g., Arduino, ESP32, Sensors)...',
  categories = [],
  className = '',
  inputClassName = '',
  autoNavigate = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [matchingCategories, setMatchingCategories] = useState([]);
  const containerRef = useRef(null);
  const router = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch recommendations with debounce
  useEffect(() => {
    const trimmed = value.trim();
    if (trimmed.length < 1) {
      setRecommendedProducts([]);
      setMatchingCategories([]);
      setLoading(false);
      return;
    }

    // 1. Instant local filter for matching categories
    const lowerQuery = trimmed.toLowerCase();
    const matchedCats = (categories || [])
      .filter((cat) => cat.name.toLowerCase().includes(lowerQuery))
      .slice(0, 4);
    setMatchingCategories(matchedCats);

    // 2. Debounced API fetch for recommended products
    setLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const res = await api.getProducts({
          search: trimmed,
          limit: 6,
        });
        if (res.success && res.products) {
          setRecommendedProducts(res.products);
        }
      } catch (err) {
        console.warn('Autocomplete fetch error:', err);
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => clearTimeout(timeoutId);
  }, [value, categories]);

  const handleClear = () => {
    if (onChange) onChange('');
    setIsOpen(false);
    setRecommendedProducts([]);
    setMatchingCategories([]);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsOpen(false);
    if (onSubmit) {
      onSubmit(value);
    } else if (autoNavigate && value.trim()) {
      router.push(`/products?search=${encodeURIComponent(value.trim())}`);
    }
  };

  const handleProductClick = (product) => {
    setIsOpen(false);
    if (onSelectProduct) {
      onSelectProduct(product);
    } else if (autoNavigate) {
      if (onChange) onChange(product.name);
      router.push(`/products?search=${encodeURIComponent(product.name)}`);
    } else if (onChange) {
      onChange(product.name);
    }
  };

  const handleCategoryClick = (cat) => {
    setIsOpen(false);
    if (onSelectCategory) {
      onSelectCategory(cat.slug);
    } else {
      router.push(`/products/category/${cat.slug}`);
    }
  };

  const hasSuggestions =
    value.trim().length >= 1 &&
    (matchingCategories.length > 0 || recommendedProducts.length > 0 || loading);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleFormSubmit} className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C85A32] pointer-events-none" />
        
        <input
          type="text"
          value={value}
          onChange={(e) => {
            if (onChange) onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-9 py-2.5 bg-white border border-[#E2E2C5] rounded-2xl text-xs sm:text-sm text-[#1C1917] placeholder-[#78716C] shadow-xs focus:outline-none focus:border-[#C85A32] focus:ring-2 focus:ring-[#C85A32]/20 transition-all ${inputClassName}`}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {loading && (
            <Loader2 className="w-4 h-4 animate-spin text-[#C85A32]" />
          )}
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF9F0] transition-colors cursor-pointer"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Floating Recommendations Dropdown */}
      {isOpen && hasSuggestions && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white/98 backdrop-blur-xl border border-[#E2E2C5] rounded-3xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-[380px] overflow-y-auto divide-y divide-[#E2E2C5]/50">
            {/* Section 1: Related Categories */}
            {matchingCategories.length > 0 && (
              <div className="p-3 space-y-1.5 bg-[#FAF9F0]/60">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-[#C85A32] px-2">
                  <Layers className="w-3 h-3 text-[#C85A32]" />
                  <span>Related Categories</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {matchingCategories.map((cat) => (
                    <button
                      key={cat._id || cat.slug}
                      type="button"
                      onClick={() => handleCategoryClick(cat)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF9F0] border border-[#E2E2C5] hover:border-[#C85A32] text-xs font-semibold text-[#1C1917] hover:text-[#C85A32] transition-all shadow-2xs group cursor-pointer"
                    >
                      <Cpu className="w-3 h-3 text-[#C85A32]" />
                      <span>{cat.name}</span>
                      {cat.productCount !== undefined && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#FAF9F0] text-[#78716C] border border-[#E2E2C5]">
                          {cat.productCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Section 2: Recommended Products */}
            {recommendedProducts.length > 0 && (
              <div className="p-2 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-[#78716C] px-3 pt-2 pb-1">
                  <Sparkles className="w-3 h-3 text-[#C85A32]" />
                  <span>Recommended Components</span>
                </div>
                {recommendedProducts.map((product) => {
                  const fallbackImg =
                    'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=300&auto=format&fit=crop&q=80';
                  const prodImg =
                    product.imageUrl && product.imageUrl.startsWith('/')
                      ? `http://localhost:5000${product.imageUrl}`
                      : product.imageUrl || fallbackImg;

                  return (
                    <button
                      key={product._id}
                      type="button"
                      onClick={() => handleProductClick(product)}
                      className="w-full flex items-center justify-between gap-3 p-2.5 rounded-2xl hover:bg-[#FAF9F0] text-left transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white border border-[#E2E2C5] shrink-0">
                          <Image
                            src={prodImg}
                            alt={product.name}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#1C1917] group-hover:text-[#C85A32] truncate">
                            {product.name}
                          </p>
                          <span className="text-[10px] text-[#78716C] truncate block">
                            {product.category?.name || 'Electronics'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-black text-[#1C1917]">
                          ₹{product.price}
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#78716C] group-hover:text-[#C85A32] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* If no products match */}
            {!loading && recommendedProducts.length === 0 && matchingCategories.length === 0 && (
              <div className="p-6 text-center text-xs text-[#78716C] space-y-1">
                <p className="font-semibold text-[#1C1917]">No instant matches found</p>
                <p className="text-[11px]">
                  Press Enter to search the entire 560+ component catalogue
                </p>
              </div>
            )}

            {/* Section 3: Footer search action */}
            <div className="p-2.5 bg-[#FAF9F0]/40 flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#78716C]">
                Press <b>Enter ↵</b> to search all
              </span>
              <button
                type="button"
                onClick={handleFormSubmit}
                className="font-bold text-[#C85A32] hover:text-[#B04923] hover:underline flex items-center gap-0.5 cursor-pointer text-xs"
              >
                <span>Search catalogue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
