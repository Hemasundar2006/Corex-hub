'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  Cpu,
  Search,
  RefreshCw,
  X,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Package,
  MessageCircle,
  Home,
} from 'lucide-react';
import api from '../../../../lib/api';
import CategoryTabs from '../../../../components/CategoryTabs';
import ProductCard from '../../../../components/ProductCard';
import ProductModal from '../../../../components/ProductModal';
import PromoSidebar from '../../../../components/PromoSidebar';
import SearchAutocomplete from '../../../../components/SearchAutocomplete';
import { getGeneralWhatsAppUrl } from '../../../../lib/whatsapp';

export default function DedicatedCategoryPage({ params }) {
  // In Next.js 15/16, params is a Promise that can be unwrapped with React.use()
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug || '';

  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Pagination for "More Components"
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // 1. Fetch categories and settings
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [catRes, setRes] = await Promise.all([
          api.getCategories().catch(() => ({ categories: [] })),
          api.getSettings().catch(() => ({ settings: null })),
        ]);
        if (catRes.categories) {
          setCategories(catRes.categories);
          const found = catRes.categories.find((c) => c.slug === slug);
          if (found) setCategory(found);
        }
        if (setRes.settings) setSettings(setRes.settings);
      } catch (err) {
        console.error('Error fetching category metadata:', err);
      }
    };
    fetchMeta();
  }, [slug]);

  // 2. Fetch products for this specific category
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setCurrentPage(1);
        const res = await api.getProducts({
          category: slug,
          search: searchTerm ? searchTerm.trim() : undefined,
          limit: 24,
          page: 1,
        });

        if (res.success && res.products) {
          setProducts(res.products);
          setTotalCount(res.total || res.products.length);
          setTotalPages(res.totalPages || 1);
        }
      } catch (err) {
        console.error('Error loading category products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [slug, searchTerm]);

  // 3. Load More handler
  const handleLoadMore = async () => {
    if (currentPage >= totalPages || loadingMore) return;
    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const res = await api.getProducts({
        category: slug,
        search: searchTerm ? searchTerm.trim() : undefined,
        limit: 24,
        page: nextPage,
      });

      if (res.success && res.products) {
        setProducts((prev) => [...prev, ...res.products]);
        setCurrentPage(nextPage);
      }
    } catch (err) {
      console.error('Error loading more category components:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const businessPhone = settings?.businessPhone || '+919573464809';
  const categoryName = category?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const categoryDescription = category?.description || `Explore tested and genuine ${categoryName} for electronics, robotics, and embedded IoT systems.`;

  // Calculate Previous and Next category for quick routing
  const currentIndex = categories.findIndex((c) => c.slug === slug);
  const prevCat =
    currentIndex > 0
      ? categories[currentIndex - 1]
      : categories.length > 0
      ? categories[categories.length - 1]
      : null;
  const nextCat =
    currentIndex >= 0 && currentIndex < categories.length - 1
      ? categories[currentIndex + 1]
      : categories.length > 0
      ? categories[0]
      : null;

  const generalWaUrl = getGeneralWhatsAppUrl(
    businessPhone,
    `Hello Corex Projects Hub! 👋 I am browsing the *${categoryName}* category and would like to inquire about component availability and pricing.`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 text-[#1C1917] overflow-x-hidden max-w-[100vw] w-full">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#78716C]">
        <Link href="/" className="hover:text-[#C85A32] flex items-center gap-1 transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-[#E2E2C5]" />
        <Link href="/products" className="hover:text-[#C85A32] transition-colors">
          Products Catalogue
        </Link>
        <ChevronRight className="w-3 h-3 text-[#E2E2C5]" />
        <span className="text-[#C85A32] font-bold truncate max-w-[200px] sm:max-w-none">
          {categoryName}
        </span>
      </nav>

      {/* Dedicated Category Header Banner */}
      <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E2E2C5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FBECE6] text-[#C85A32] border border-[#E27D5B]/30 flex items-center justify-center shadow-xs">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-[#1C1917] tracking-tight">
                {categoryName}
              </h1>
              <span className="text-xs uppercase tracking-wider font-extrabold bg-[#FAF9F0] text-[#C85A32] px-3 py-1 rounded-full border border-[#E2E2C5]">
                {totalCount} Components
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            {categoryDescription}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <a
            href={generalWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA56] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Inquire on WhatsApp</span>
          </a>

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-1.5 bg-[#1C1917] hover:bg-[#292524] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all"
          >
            <span>All Categories</span>
          </Link>
        </div>
      </div>

      {/* Category Tabs with Next/Previous Category Buttons */}
      <div className="bg-[#FFFFFF] rounded-2xl p-4 border border-[#E2E2C5] shadow-xs">
        <CategoryTabs
          categories={categories}
          selectedCategory={slug}
          totalProductCount={totalCount}
          enablePageRouting={true}
        />
      </div>

      {/* Main Grid + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Products Column */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* In-Category Search and Count Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E2E2C5]">
            <div className="text-xs font-semibold text-[#57534E]">
              Showing <b className="text-[#1C1917]">{products.length}</b> of{' '}
              <b className="text-[#1C1917]">{totalCount}</b> items in {categoryName}
            </div>

            {/* In-Category Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#C85A32]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search in ${categoryName.split(' ')[0]}...`}
                className="w-full pl-9 pr-8 py-1.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-xs text-[#1C1917] placeholder-[#78716C] focus:outline-none focus:border-[#C85A32]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-80 rounded-3xl bg-[#ECECD0]/40 animate-pulse border border-[#E2E2C5]"
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    businessPhone={businessPhone}
                    onSelect={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>

              {/* Load More Components Button */}
              {currentPage < totalPages && (
                <div className="pt-6 text-center space-y-2">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-white px-8 py-3.5 rounded-2xl font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
                  >
                    {loadingMore ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#C85A32]" />
                        <span>Loading More Components...</span>
                      </>
                    ) : (
                      <>
                        <Package className="w-4 h-4 text-[#C85A32]" />
                        <span>Load More {categoryName} ({products.length} of {totalCount})</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-[#78716C]">
                    Click to load the next batch of components in this category
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-[#FFFFFF] rounded-3xl border border-[#E2E2C5] p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF9F0] text-[#78716C] flex items-center justify-center mx-auto border border-[#E2E2C5]">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#1C1917]">No components found</h3>
              <p className="text-xs text-[#57534E] max-w-sm mx-auto">
                {searchTerm
                  ? `No components matched "${searchTerm}" in this category.`
                  : `Currently updating stock for this category.`}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-[#C85A32] text-white px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Clear Search Filter
                </button>
              )}
            </div>
          )}

          {/* Quick Previous & Next Category Navigation Bar at Bottom */}
          <div className="flex items-center justify-between gap-4 pt-6 border-t border-[#E2E2C5]">
            {prevCat ? (
              <Link
                href={`/products/category/${prevCat.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-[#FAF9F0] border border-[#E2E2C5] text-[#1C1917] hover:text-[#C85A32] text-xs font-bold transition-all shadow-xs group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#C85A32]" />
                <div className="text-left">
                  <span className="block text-[10px] text-[#78716C] font-normal uppercase tracking-wider">
                    Previous Category
                  </span>
                  <span>{prevCat.name}</span>
                </div>
              </Link>
            ) : <div />}

            {nextCat ? (
              <Link
                href={`/products/category/${nextCat.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-[#FAF9F0] border border-[#E2E2C5] text-[#1C1917] hover:text-[#C85A32] text-xs font-bold transition-all shadow-xs group text-right"
              >
                <div className="text-right">
                  <span className="block text-[10px] text-[#78716C] font-normal uppercase tracking-wider">
                    Next Category
                  </span>
                  <span>{nextCat.name}</span>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#C85A32]" />
              </Link>
            ) : <div />}
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <PromoSidebar businessPhone={businessPhone} />
        </div>
      </div>

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
