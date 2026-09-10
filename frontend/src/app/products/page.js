'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Cpu, RefreshCw, X, ChevronRight } from 'lucide-react';
import api from '../../lib/api';
import CategoryTabs from '../../components/CategoryTabs';
import ProductCard from '../../components/ProductCard';
import ProductModal from '../../components/ProductModal';
import PromoSidebar from '../../components/PromoSidebar';
import SearchAutocomplete from '../../components/SearchAutocomplete';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Sync category param if URL changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get('search');
    if (q !== null) setSearchTerm(q);
    setCurrentPage(1);
  }, [searchParams]);

  // Load categories & settings
  useEffect(() => {
    const initData = async () => {
      try {
        const [catRes, setRes] = await Promise.all([
          api.getCategories().catch(() => ({ categories: [] })),
          api.getSettings().catch(() => ({ settings: null })),
        ]);
        if (catRes.categories) setCategories(catRes.categories);
        if (setRes.settings) setSettings(setRes.settings);
      } catch (err) {
        console.error('Error initializing products page:', err);
      }
    };
    initData();
  }, []);

  // Fetch products based on category and search
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        setLoading(true);
        setCurrentPage(1);
        const res = await api.getProducts({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchTerm ? searchTerm.trim() : undefined,
          limit: 100,
          page: 1,
        });

        if (res.success && res.products) {
          setProducts(res.products);
          setTotalCount(res.total || res.products.length);
          setTotalPages(res.totalPages || 1);
        }
      } catch (err) {
        console.error('Error fetching filtered products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [selectedCategory, searchTerm]);

  // Load more handler
  const handleLoadMore = async () => {
    if (currentPage >= totalPages || loadingMore) return;
    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const res = await api.getProducts({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchTerm ? searchTerm.trim() : undefined,
        limit: 100,
        page: nextPage,
      });

      if (res.success && res.products) {
        setProducts((prev) => [...prev, ...res.products]);
        setCurrentPage(nextPage);
      }
    } catch (err) {
      console.error('Error loading more products:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const businessPhone = settings?.businessPhone || '+919876543210';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-[#1C1917] overflow-x-hidden max-w-[100vw] w-full">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E2C5] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1C1917]">
            Electronics Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] mt-1">
            Browse genuine components, dev boards, sensors & tools. Order instantly via WhatsApp.
          </p>
        </div>

        {/* Search Bar with Live Recommendations */}
        <div className="w-full md:w-88">
          <SearchAutocomplete
            value={searchTerm}
            onChange={(val) => setSearchTerm(val)}
            categories={categories}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onSelectCategory={(catSlug) => setSelectedCategory(catSlug)}
            onSubmit={(val) => setSearchTerm(val)}
            placeholder="Search components (e.g. Arduino, ESP32)..."
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="bg-[#FFFFFF] rounded-2xl p-3 border border-[#E2E2C5] shadow-xs">
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(slug) => setSelectedCategory(slug)}
          totalProductCount={totalCount}
        />
      </div>

      {/* Main Grid + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Products Grid */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* Active Filter status indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#57534E]">
            <span>
              Showing <b className="text-[#1C1917]">{products.length}</b> {products.length === 1 ? 'component' : 'components'}
              {selectedCategory !== 'all' && (
                <span> in <b className="text-[#C85A32]">{categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}</b></span>
              )}
              {searchTerm && <span> matching &ldquo;<b className="text-[#1C1917]">{searchTerm}</b>&rdquo;</span>}
            </span>

            <div className="flex items-center gap-3 flex-wrap">
              {selectedCategory !== 'all' && (
                <Link
                  href={`/products/category/${selectedCategory}`}
                  className="text-xs font-bold text-[#C85A32] hover:text-[#B04923] hover:underline inline-flex items-center gap-1"
                >
                  <span>Open Dedicated Category Page</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              )}

              {(selectedCategory !== 'all' || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchTerm('');
                  }}
                  className="text-[#78716C] hover:text-[#1C1917] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-[#FFFFFF] rounded-2xl border border-[#E2E2C5] h-80 animate-pulse p-4 space-y-4"
                >
                  <div className="aspect-4/3 bg-[#FAF9F0] rounded-xl w-full" />
                  <div className="h-4 bg-[#FAF9F0] rounded w-3/4" />
                  <div className="h-3 bg-[#FAF9F0] rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    businessPhone={businessPhone}
                    onSelect={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {currentPage < totalPages && (
                <div className="flex flex-col items-center justify-center pt-4 pb-2 space-y-2">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-white px-6 py-3 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {loadingMore ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#C85A32]" />
                        <span>Loading Components...</span>
                      </>
                    ) : (
                      <>
                        <span>Load More Components ({products.length} of {totalCount})</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-[#78716C]">
                    Showing {products.length} of {totalCount} total verified components
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#FFFFFF] rounded-3xl p-12 text-center border border-[#E2E2C5] space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#FAF9F0] text-[#C85A32] flex items-center justify-center mx-auto border border-[#E2E2C5]">
                <Cpu className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#1C1917]">No components found</h3>
              <p className="text-xs text-[#57534E] max-w-md mx-auto">
                We couldn&apos;t find any components matching your filter criteria. Try clearing your search or switching categories.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchTerm('');
                }}
                className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Sticky Combo Offers Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3">
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

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm font-semibold text-[#C85A32]">
          Loading catalogue components...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
