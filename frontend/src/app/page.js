'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Cpu,
  Sparkles,
  Gift,
  ChevronRight,
  Zap,
  ArrowRight,
  Package,
  MessageCircle,
} from 'lucide-react';
import api from '../lib/api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import PromoCard from '../components/PromoCard';
import SearchAutocomplete from '../components/SearchAutocomplete';
import { getGeneralWhatsAppUrl } from '../lib/whatsapp';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [settings, setSettings] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);

        const [catRes, prodRes, promoRes, setRes] = await Promise.all([
          api.getCategories().catch(() => ({ categories: [] })),
          api.getProducts({ featured: 'true', limit: 4 }).catch(() => ({ products: [] })),
          api.getPromotions(false).catch(() => ({ promotions: [] })),
          api.getSettings().catch(() => ({ settings: null })),
        ]);

        if (catRes.categories) setCategories(catRes.categories);
        if (prodRes.products) setFeaturedProducts(prodRes.products);
        if (promoRes.promotions) setPromotions(promoRes.promotions);
        if (setRes.settings) setSettings(setRes.settings);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const businessPhone = settings?.businessPhone || '+919573464809';
  const storeName = settings?.storeName || 'Corex Projects Hub';
  const tagline = settings?.tagline || 'Electronics Components & WhatsApp Ordering';
  const generalWaUrl = getGeneralWhatsAppUrl(businessPhone);

  const quickTags = ['Arduino', 'ESP32', 'Raspberry Pi', 'Sensors', 'Relays', 'Motors', 'Displays'];

  return (
    <div className="space-y-12 sm:space-y-16 pb-20 text-[#1C1917] bg-[#F5F5DC] overflow-x-hidden max-w-[100vw] w-full">
      {/* Clean, Focused Hero Section with Live Search Autocomplete */}
      <section className="relative overflow-hidden pt-10 pb-12 lg:pt-14 lg:pb-16 border-b border-[#E2E2C5] bg-gradient-to-b from-[#FAF9F0] to-[#F5F5DC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 bg-[#FFFFFF] border border-[#E2E2C5] px-4 py-1.5 rounded-full text-xs font-bold text-[#C85A32] shadow-xs">
            <Cpu className="w-3.5 h-3.5 text-[#C85A32]" />
            <span>{tagline}</span>
          </div>

          {/* Store Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#1C1917] tracking-tight leading-tight">
            {storeName.split(' ')[0]}{' '}
            <span className="text-[#C85A32]">
              {storeName.split(' ').slice(1).join(' ')}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#57534E] leading-relaxed max-w-2xl mx-auto">
            Procure genuine microcontrollers, sensors, ICs, and project hardware with zero friction. Build your cart and confirm orders directly through WhatsApp.
          </p>

          {/* Live Search Autocomplete (Recommends as you type) */}
          <div className="max-w-xl mx-auto">
            <SearchAutocomplete
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
              categories={categories}
              autoNavigate={true}
              placeholder="Search components (e.g., Arduino Uno, ESP32, DHT11)..."
              inputClassName="py-3 shadow-md border-[#E2E2C5]"
            />
          </div>

          {/* Popular Tag Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-[#78716C]">
            <span className="font-semibold text-[#1C1917] mr-1">Popular:</span>
            {quickTags.map((tag) => (
              <Link
                key={tag}
                href={`/products?search=${encodeURIComponent(tag)}`}
                className="bg-white/80 hover:bg-white text-[#57534E] hover:text-[#C85A32] border border-[#E2E2C5] px-2.5 py-0.5 rounded-full transition-all text-[11px] font-medium"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Categories Section (Browse Hardware by Category) */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C85A32] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Browse by Category</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1C1917]">
                Explore by Component Family
              </h2>
            </div>

            <Link
              href="/products"
              className="text-xs font-bold text-[#C85A32] hover:text-[#B04923] flex items-center gap-1 group"
            >
              <span>View All {categories.length} Categories</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.slice(0, 12).map((cat) => (
              <Link
                key={cat._id || cat.slug}
                href={`/products/category/${cat.slug}`}
                className="group bg-[#FFFFFF] rounded-2xl p-4 border border-[#E2E2C5] hover:border-[#C85A32] shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center justify-between gap-2.5"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FAF9F0] group-hover:bg-[#FBECE6] text-[#C85A32] flex items-center justify-center transition-colors border border-[#E2E2C5]">
                  <Cpu className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="text-xs font-bold text-[#1C1917] group-hover:text-[#C85A32] transition-colors line-clamp-2">
                    {cat.name}
                  </h3>
                  {cat.productCount !== undefined && (
                    <span className="text-[10px] text-[#78716C] mt-0.5 block">
                      {cat.productCount} items
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Best Sellers Section (Curated 4 Items Only) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C85A32] mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Project Best Sellers</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1C1917]">
              Featured Components
            </h2>
          </div>

          <Link
            href="/products"
            className="text-xs font-bold text-[#C85A32] hover:text-[#B04923] flex items-center gap-1 group"
          >
            <span>Open Full 560+ Catalogue</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-72 rounded-3xl bg-[#ECECD0]/40 animate-pulse border border-[#E2E2C5]"
              />
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                businessPhone={businessPhone}
                onSelect={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        ) : null}
      </section>

      {/* Active Combo Offers Section */}
      {promotions.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#ECECD0]/60 rounded-3xl p-6 sm:p-8 border border-[#E2E2C5] shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C85A32] mb-1">
                  <Gift className="w-3.5 h-3.5" />
                  <span>Curated Project Bundles</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#1C1917]">
                  Popular Combo Deals & Kits
                </h2>
              </div>

              <Link
                href="/promotions"
                className="bg-[#1C1917] hover:bg-[#292524] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all shrink-0"
              >
                View All {promotions.length} Combos
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {promotions.slice(0, 3).map((promo) => (
                <PromoCard
                  key={promo._id}
                  promotion={promo}
                  businessPhone={businessPhone}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Professional Call-to-Action Catalogue Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#1C1917] to-[#292524] text-[#F5F5DC] rounded-3xl p-8 sm:p-12 border border-[#E2E2C5] shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-[#E2E2C5]">
              <Package className="w-3.5 h-3.5 text-[#C85A32]" />
              <span>Full Engineering Stock</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Looking for Specific Resistors, ICs, or Sensors?
            </h3>
            <p className="text-xs sm:text-sm text-[#E2E2C5]/80 leading-relaxed">
              Our catalogue features 560+ tested electronics components across 35 categories for academic projects, robotics competitions, and commercial IoT development.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#C85A32] hover:bg-[#B04923] text-white px-6 py-3.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <span>Explore 560+ Component Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={generalWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA56] text-white px-5 py-3.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Send BOM List</span>
            </a>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          businessPhone={businessPhone}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
