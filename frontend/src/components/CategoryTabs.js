'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import {
  Cpu,
  Activity,
  Zap,
  Tv,
  BatteryCharging,
  Wrench,
  Grid,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

const iconMap = {
  Cpu,
  Activity,
  Zap,
  Tv,
  BatteryCharging,
  Wrench,
};

export default function CategoryTabs({
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
  totalProductCount = 0,
  enablePageRouting = false,
}) {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  // Determine current, previous, and next categories
  const currentIndex = categories.findIndex((c) => c.slug === selectedCategory);
  const prevCategory =
    selectedCategory === 'all'
      ? categories[categories.length - 1]
      : currentIndex === 0
      ? { slug: 'all', name: 'All Components' }
      : categories[currentIndex - 1];

  const nextCategory =
    selectedCategory === 'all'
      ? categories[0]
      : currentIndex === categories.length - 1
      ? { slug: 'all', name: 'All Components' }
      : categories[currentIndex + 1];

  const handleCategoryClick = (slug) => {
    if (onSelectCategory) {
      onSelectCategory(slug);
    }
  };

  return (
    <div className="space-y-3">
      {/* Category Pills Bar with Smooth Scroll Next & Prev Buttons */}
      <div className="relative flex items-center group overflow-hidden max-w-full">
        {/* Left Scroll Chevron */}
        <button
          onClick={scrollLeft}
          className="hidden sm:flex absolute left-0 z-10 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-[#1C1917] hover:text-[#C85A32] shadow-md border border-[#E2E2C5] items-center justify-center transition-all cursor-pointer"
          aria-label="Scroll categories left"
          title="Previous categories"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto pb-1 scrollbar-none scroll-smooth px-1 sm:px-6"
        >
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-max py-1">
            {/* All Products Tab */}
            <button
              onClick={() => handleCategoryClick('all')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#C85A32] text-white shadow-sm border border-[#C85A32]'
                  : 'bg-[#FFFFFF] hover:bg-[#FAF9F0] text-[#1C1917] hover:text-[#C85A32] border border-[#E2E2C5]'
              }`}
            >
              <Grid className="w-3.5 h-3.5 shrink-0" />
              <span>All Components</span>
              {totalProductCount > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    selectedCategory === 'all'
                      ? 'bg-white/25 text-white'
                      : 'bg-[#FAF9F0] text-[#C85A32] border border-[#E2E2C5]'
                  }`}
                >
                  {totalProductCount}
                </span>
              )}
            </button>

            {/* Dynamic Category Tabs */}
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              const IconComponent = iconMap[cat.icon] || Cpu;

              return (
                <button
                  key={cat._id || cat.slug}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer ${
                    isSelected
                      ? 'bg-[#C85A32] text-white shadow-sm border border-[#C85A32]'
                      : 'bg-[#FFFFFF] hover:bg-[#FAF9F0] text-[#1C1917] hover:text-[#C85A32] border border-[#E2E2C5]'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5 shrink-0" />
                  <span>{cat.name}</span>
                  {cat.productCount !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isSelected
                          ? 'bg-white/25 text-white'
                          : 'bg-[#FAF9F0] text-[#C85A32] border border-[#E2E2C5]'
                      }`}
                    >
                      {cat.productCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Scroll Chevron */}
        <button
          onClick={scrollRight}
          className="hidden sm:flex absolute right-0 z-10 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-[#1C1917] hover:text-[#C85A32] shadow-md border border-[#E2E2C5] items-center justify-center transition-all cursor-pointer"
          aria-label="Scroll categories right"
          title="Next categories"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Better Next & Previous Category Navigation Row */}
      {categories.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2 border-t border-[#E2E2C5]/60 text-xs overflow-hidden max-w-full">
          {prevCategory ? (
            enablePageRouting ? (
              <Link
                href={
                  prevCategory.slug === 'all'
                    ? '/products'
                    : `/products/category/${prevCategory.slug}`
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF9F0] border border-[#E2E2C5] text-[#1C1917] hover:text-[#C85A32] font-semibold transition-all group max-w-full overflow-hidden"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-[#C85A32] shrink-0" />
                <span className="text-[#78716C] shrink-0">Prev Category:</span>
                <span className="font-bold truncate">
                  {prevCategory.name}
                </span>
              </Link>
            ) : (
              <button
                onClick={() => handleCategoryClick(prevCategory.slug)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF9F0] border border-[#E2E2C5] text-[#1C1917] hover:text-[#C85A32] font-semibold transition-all group cursor-pointer max-w-full overflow-hidden"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-[#C85A32] shrink-0" />
                <span className="text-[#78716C] shrink-0">Prev Category:</span>
                <span className="font-bold truncate">
                  {prevCategory.name}
                </span>
              </button>
            )
          ) : (
            <div />
          )}

          {nextCategory ? (
            enablePageRouting ? (
              <Link
                href={
                  nextCategory.slug === 'all'
                    ? '/products'
                    : `/products/category/${nextCategory.slug}`
                }
                className="inline-flex items-center justify-end gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF9F0] border border-[#E2E2C5] text-[#1C1917] hover:text-[#C85A32] font-semibold transition-all group max-w-full overflow-hidden"
              >
                <span className="text-[#78716C] shrink-0">Next Category:</span>
                <span className="font-bold truncate">
                  {nextCategory.name}
                </span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-[#C85A32] shrink-0" />
              </Link>
            ) : (
              <button
                onClick={() => handleCategoryClick(nextCategory.slug)}
                className="inline-flex items-center justify-end gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF9F0] border border-[#E2E2C5] text-[#1C1917] hover:text-[#C85A32] font-semibold transition-all group cursor-pointer max-w-full overflow-hidden"
              >
                <span className="text-[#78716C] shrink-0">Next Category:</span>
                <span className="font-bold truncate">
                  {nextCategory.name}
                </span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-[#C85A32] shrink-0" />
              </button>
            )
          ) : (
            <div />
          )}
        </div>
      )}
    </div>
  );
}
