'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronRight, Save, Eye, CheckCircle2, Flame } from 'lucide-react';
import api from '../../../lib/api';

export default function AdminDiscountsPage() {
  const [text, setText] = useState('');
  const [badgeText, setBadgeText] = useState('Special Offer');
  const [linkUrl, setLinkUrl] = useState('/products');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const res = await api.getDiscount();
        if (res.discount) {
          setText(res.discount.text || '');
          setBadgeText(res.discount.badgeText || 'Special Offer');
          setLinkUrl(res.discount.linkUrl || '/products');
          setIsActive(res.discount.isActive !== false);
        }
      } catch (err) {
        console.error('Error fetching discount banner:', err);
      }
    };

    fetchDiscount();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await api.updateDiscount({
        text,
        badgeText,
        linkUrl,
        isActive,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Error updating discount banner');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl text-[#1C1917]">
      {/* Header */}
      <div className="border-b border-[#E2E2C5] pb-6">
        <h1 className="text-2xl font-black text-[#1C1917]">Discount Announcement Banner</h1>
        <p className="text-xs text-[#57534E] mt-1">
          Customize the site-wide announcement strip shown at the very top of the storefront
        </p>
      </div>

      {/* Live Preview Box */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#78716C] uppercase tracking-wider">
          <Eye className="w-4 h-4 text-[#C85A32]" />
          <span>Real-time Live Preview (How it appears to visitors)</span>
        </div>

        {isActive ? (
          <div className="rounded-2xl overflow-hidden shadow-xs border border-[#E2E2C5]">
            <div className="relative bg-[#1C1917] text-white py-3 px-4 flex items-center justify-between gap-4 text-xs font-medium">
              <div className="flex items-center gap-2.5 flex-1 flex-wrap">
                <span className="inline-flex items-center gap-1.5 bg-[#F5F5DC] text-[#1C1917] px-2.5 py-0.5 rounded-full font-bold text-[11px] uppercase tracking-wider shadow-xs">
                  <Flame className="w-3.5 h-3.5 text-[#C85A32]" />
                  {badgeText || 'Special Offer'}
                </span>
                <span className="text-[#FAF9F0] font-medium">{text || 'Enter your announcement message below...'}</span>
                {linkUrl && (
                  <span className="inline-flex items-center gap-1 text-[#F5F5DC] font-bold underline underline-offset-4">
                    Shop Now <ChevronRight className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E2E2C5] text-xs text-[#78716C] text-center font-medium">
            Banner is currently <b>DISABLED</b> and will not be displayed on the storefront.
          </div>
        )}
      </div>

      {/* Form Card */}
      <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E2E2C5] shadow-xs space-y-6">
        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Discount banner saved successfully! Updated instantly on the storefront.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5 text-xs">
          {/* Active toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF9F0] border border-[#E2E2C5]">
            <div>
              <p className="font-bold text-sm text-[#1C1917]">Enable Discount Announcement Banner</p>
              <p className="text-[#57534E] text-[11px]">
                Toggle on or off without deleting your saved message
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#E2E2C5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#25D366]"></div>
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
              Badge Text (Pill label)
            </label>
            <input
              type="text"
              required
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              placeholder="e.g. Monsoon Sale, Student Special, Flash Deal"
              className="w-full p-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-[#C85A32] focus:ring-2 focus:ring-[#C85A32]/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
              Announcement Message *
            </label>
            <textarea
              rows="3"
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Flat 10% OFF on all sensors & Arduino components this week! Order directly on WhatsApp."
              className="w-full p-3 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-xs sm:text-sm text-[#1C1917] focus:outline-none focus:border-[#C85A32] focus:ring-2 focus:ring-[#C85A32]/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
              Optional Target Link
            </label>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="e.g. /products?category=sensors-modules or /promotions"
              className="w-full p-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-xs text-[#1C1917] focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-[#E2E2C5] flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all active:scale-98 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save & Publish Banner'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
