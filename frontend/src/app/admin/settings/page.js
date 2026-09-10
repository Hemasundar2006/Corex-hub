'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Save, CheckCircle2, Phone } from 'lucide-react';
import api from '../../../lib/api';

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState('Corex Projects Hub');
  const [tagline, setTagline] = useState('Your One-Stop Electronics Components & Project Supplies Hub');
  const [businessPhone, setBusinessPhone] = useState('+919876543210');
  const [email, setEmail] = useState('orders@corexprojects.com');
  const [address, setAddress] = useState('Shop #14, Electronics Market Complex, Tech Road, City Center');
  const [currencySymbol, setCurrencySymbol] = useState('₹');
  const [orderMessageTemplate, setOrderMessageTemplate] = useState('');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.getSettings();
        if (res.settings) {
          setStoreName(res.settings.storeName || 'Corex Projects Hub');
          setTagline(res.settings.tagline || '');
          setBusinessPhone(res.settings.businessPhone || '+919876543210');
          setEmail(res.settings.email || 'orders@corexprojects.com');
          setAddress(res.settings.address || '');
          setCurrencySymbol(res.settings.currencySymbol || '₹');
          setOrderMessageTemplate(res.settings.orderMessageTemplate || '');
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await api.updateSettings({
        storeName,
        tagline,
        businessPhone,
        email,
        address,
        currencySymbol,
        orderMessageTemplate,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl text-[#1C1917]">
      {/* Header */}
      <div className="border-b border-[#E2E2C5] pb-6">
        <h1 className="text-2xl font-black text-[#1C1917]">Store & WhatsApp Settings</h1>
        <p className="text-xs text-[#57534E] mt-1">
          Configure the business phone number where customer WhatsApp orders are routed, plus store contact info.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully! All WhatsApp ordering links updated immediately.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E2E2C5] shadow-xs space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Critical WhatsApp Number Section */}
          <div className="p-5 rounded-2xl bg-[#FAF9F0] border border-[#25D366]/40 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#1C1917]">
              <MessageCircle className="w-5 h-5 text-[#25D366] fill-current" />
              <span>Business WhatsApp Phone Number (Ordering Channel)</span>
            </div>
            <p className="text-[#57534E] text-[11px] leading-relaxed">
              Every &ldquo;Order on WhatsApp&rdquo; click site-wide sends a pre-filled message directly to this number. Include country code (e.g. <b>+91</b> for India).
            </p>
            <div className="relative max-w-md">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#25D366]" />
              <input
                type="text"
                required
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                placeholder="+919876543210"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFFFFF] border border-[#25D366]/60 rounded-xl text-sm font-bold text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#25D366]/30"
              />
            </div>
          </div>

          {/* Store Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
                Store Name
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full p-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-[#C85A32] focus:ring-2 focus:ring-[#C85A32]/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
                Currency Symbol
              </label>
              <input
                type="text"
                required
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full p-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-xs text-[#1C1917] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
              Store Tagline / Subtitle
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full p-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-xs text-[#1C1917] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
                Contact Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-xs text-[#1C1917] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
                Store Physical Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-xs text-[#1C1917] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E2C5] flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all active:scale-98 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
