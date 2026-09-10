'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Layers,
  Gift,
  Tag,
  Plus,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import api, { getImageUrl } from '../../lib/api';
import StatCard from '../../components/admin/StatCard';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    productsCount: 0,
    categoriesCount: 0,
    promosCount: 0,
    discountActive: false,
    discountText: '',
    businessPhone: '',
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes, promoRes, discRes, setRes] = await Promise.all([
          api.getProducts({ limit: 5 }),
          api.getCategories(),
          api.getPromotions(true),
          api.getDiscount(),
          api.getSettings(),
        ]);

        setStats({
          productsCount: prodRes.total || prodRes.products?.length || 0,
          categoriesCount: catRes.categories?.length || 0,
          promosCount: promoRes.promotions?.length || 0,
          discountActive: discRes.discount?.isActive || false,
          discountText: discRes.discount?.text || '',
          businessPhone: setRes.settings?.businessPhone || '+919876543210',
        });

        if (prodRes.products) {
          setRecentProducts(prodRes.products);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 text-[#1C1917]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E2C5] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1C1917]">
            Store Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] mt-1">
            Overview of Corex Projects Hub components catalogue and live WhatsApp settings.
          </p>
        </div>

        {/* Live WhatsApp number pill */}
        <div className="flex items-center gap-2.5 bg-[#FFFFFF] border border-[#E2E2C5] px-4 py-2 rounded-2xl shadow-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
          <div className="text-xs">
            <span className="text-[#78716C] block text-[10px] uppercase font-bold">Active WhatsApp Number</span>
            <span className="font-bold text-[#1C1917]">{stats.businessPhone}</span>
          </div>
          <Link
            href="/admin/settings"
            className="ml-2 text-xs font-bold text-[#C85A32] hover:underline"
          >
            Change
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.productsCount}
          icon={Package}
          subtitle="Catalogue components"
          highlightColor="#C85A32"
        />
        <StatCard
          title="Categories"
          value={stats.categoriesCount}
          icon={Layers}
          subtitle="Component groupings"
          highlightColor="#B45309"
        />
        <StatCard
          title="Combo Offers"
          value={stats.promosCount}
          icon={Gift}
          subtitle="Bundle project packs"
          highlightColor="#25D366"
        />
        <StatCard
          title="Discount Banner"
          value={stats.discountActive ? 'ACTIVE' : 'DISABLED'}
          icon={Tag}
          subtitle="Storefront announcement"
          highlightColor={stats.discountActive ? '#25D366' : '#78716C'}
        />
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E2E2C5] shadow-xs space-y-4">
        <h2 className="text-base font-bold text-[#1C1917]">
          Quick Catalogue Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/products"
            className="flex items-center gap-3 p-4 rounded-2xl bg-[#FAF9F0] hover:bg-[#F5F5DC] border border-[#E2E2C5] hover:border-[#C85A32] text-[#1C1917] font-semibold text-xs transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#C85A32] text-white flex items-center justify-center shadow-xs">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold">Add New Product</p>
              <p className="text-[10px] text-[#78716C]">Upload photo & price</p>
            </div>
          </Link>

          <Link
            href="/admin/categories"
            className="flex items-center gap-3 p-4 rounded-2xl bg-[#FAF9F0] hover:bg-[#F5F5DC] border border-[#E2E2C5] hover:border-[#C85A32] text-[#1C1917] font-semibold text-xs transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#B45309] text-white flex items-center justify-center shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold">Manage Categories</p>
              <p className="text-[10px] text-[#78716C]">Add or rename categories</p>
            </div>
          </Link>

          <Link
            href="/admin/promotions"
            className="flex items-center gap-3 p-4 rounded-2xl bg-[#FAF9F0] hover:bg-[#F5F5DC] border border-[#E2E2C5] hover:border-[#25D366] text-[#1C1917] font-semibold text-xs transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-xs">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold">Create Combo Offer</p>
              <p className="text-[10px] text-[#78716C]">Bundle packages & deals</p>
            </div>
          </Link>

          <Link
            href="/admin/discounts"
            className="flex items-center gap-3 p-4 rounded-2xl bg-[#FAF9F0] hover:bg-[#F5F5DC] border border-[#E2E2C5] hover:border-[#C85A32] text-[#1C1917] font-semibold text-xs transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#C85A32] text-white flex items-center justify-center shadow-xs">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold">Edit Discount Banner</p>
              <p className="text-[10px] text-[#78716C]">Toggle top notice</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Products Preview Table */}
      <div className="bg-[#FFFFFF] rounded-3xl border border-[#E2E2C5] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#E2E2C5] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#1C1917]">
              Recently Added Components
            </h2>
            <p className="text-xs text-[#57534E]">
              Latest products available for WhatsApp ordering on the storefront
            </p>
          </div>

          <Link
            href="/admin/products"
            className="text-xs font-bold text-[#C85A32] hover:underline flex items-center gap-1"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF9F0] border-b border-[#E2E2C5] text-[#78716C] font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4 pl-6">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E2C5]">
              {recentProducts.map((p) => {
                const fallback = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80';
                const img = getImageUrl(p.imageUrl, fallback);
                return (
                  <tr key={p._id} className="hover:bg-[#FAF9F0]/60 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#FAF9F0] shrink-0 border border-[#E2E2C5]">
                          <Image src={img} alt={p.name} fill unoptimized className="object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-[#1C1917] line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-[#78716C] line-clamp-1">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[#57534E]">
                      {p.category?.name || 'General'}
                    </td>
                    <td className="p-4 font-bold text-[#1C1917]">
                      ₹{p.price}
                    </td>
                    <td className="p-4">
                      {p.inStock ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#78716C] font-semibold text-[11px]">
                          <XCircle className="w-3.5 h-3.5" /> Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <Link
                        href="/admin/products"
                        className="text-[#C85A32] hover:underline font-bold text-xs"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
