'use client';

import React, { useState, useEffect } from 'react';
import {
  Cpu,
  MapPin,
  Mail,
  Clock,
  MessageCircle,
  HelpCircle,
} from 'lucide-react';
import api from '../../lib/api';
import { getGeneralWhatsAppUrl } from '../../lib/whatsapp';

export default function AboutPage() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.getSettings()
      .then((res) => {
        if (res.settings) setSettings(res.settings);
      })
      .catch((err) => console.warn('Could not load settings in About:', err));
  }, []);

  const businessPhone = settings?.businessPhone || '+919876543210';
  const waUrl = getGeneralWhatsAppUrl(businessPhone);

  const faqs = [
    {
      q: 'How does WhatsApp ordering with the Cart work?',
      a: 'Browse our components catalogue, select the parts you need, and click "+ Cart" or "Add to Cart". When you open your Cart, review quantities, enter your delivery address details (name, phone, address, pincode), and click "Place Order via WhatsApp". A complete formatted order with your items and address is instantly created on WhatsApp for fast dispatch.',
    },
    {
      q: 'Are your electronic components genuine and tested?',
      a: 'Yes! We source directly from reputed semiconductor distributors and perform quality checks on microcontrollers, sensors, and power modules before packing.',
    },
    {
      q: 'Can students and makers get discounts on project components?',
      a: 'Absolutely. We offer combo package discounts and custom starter bundle rates for university students, robotics teams, and DIY makers. You can also send your custom Bill of Materials (BOM) on WhatsApp.',
    },
    {
      q: 'Do you deliver across India, and how fast is dispatch?',
      a: 'We dispatch all standard orders quickly via reliable couriers. Tracking IDs are shared directly to your WhatsApp as soon as your parcel ships.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-[#1C1917]">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#FFFFFF] border border-[#E2E2C5] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#C85A32] shadow-xs">
          <Cpu className="w-3.5 h-3.5 text-[#C85A32]" />
          <span>About IoT Garage</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#1C1917]">
          Your Trusted Partner for Electronics Components & Maker Supplies
        </h1>
        <p className="text-sm sm:text-base text-[#57534E] leading-relaxed">
          Founded to make electronic hardware procurement completely frictionless. Whether you are an IoT developer, a college engineering student, or a hobbyist building robotics, we are here to support your innovations.
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#FFFFFF] rounded-3xl p-6 border border-[#E2E2C5] hover:border-[#25D366] transition-colors shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center">
            <MessageCircle className="w-6 h-6 fill-current" />
          </div>
          <h3 className="font-bold text-base text-[#1C1917]">WhatsApp Hotline</h3>
          <p className="text-xs text-[#57534E]">Fastest order support & component inquiries</p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#25D366] hover:underline block pt-1"
          >
            {businessPhone} →
          </a>
        </div>

        <div className="bg-[#FFFFFF] rounded-3xl p-6 border border-[#E2E2C5] hover:border-[#C85A32] transition-colors shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FBECE6] text-[#C85A32] border border-[#E27D5B]/30 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-[#1C1917]">Physical Store</h3>
          <p className="text-xs text-[#57534E] leading-relaxed">
            {settings?.address || 'Shop #14, Electronics Market Complex, Tech Road, City Center'}
          </p>
          <span className="text-[11px] font-semibold text-[#C85A32] block pt-1">
            Store Pickup Available
          </span>
        </div>

        <div className="bg-[#FFFFFF] rounded-3xl p-6 border border-[#E2E2C5] hover:border-[#C85A32] transition-colors shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FBECE6] text-[#C85A32] border border-[#E27D5B]/30 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-[#1C1917]">Working Hours</h3>
          <p className="text-xs text-[#57534E]">
            Monday - Saturday<br />
            9:00 AM - 8:00 PM (IST)
          </p>
          <span className="text-[11px] font-semibold text-emerald-700 block pt-1">
            Sunday: WhatsApp Support Active
          </span>
        </div>

        <div className="bg-[#FFFFFF] rounded-3xl p-6 border border-[#E2E2C5] hover:border-[#C85A32] transition-colors shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FBECE6] text-[#C85A32] border border-[#E27D5B]/30 flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-[#1C1917]">Email Support</h3>
          <p className="text-xs text-[#57534E]">For institutional tenders & corporate orders</p>
          <a
            href={`mailto:${settings?.email || 'orders@corexprojects.com'}`}
            className="text-xs font-bold text-[#C85A32] hover:underline block pt-1 truncate"
          >
            {settings?.email || 'orders@corexprojects.com'}
          </a>
        </div>
      </div>

      {/* Direct Chat CTA Banner */}
      <div className="bg-[#ECECD0]/70 rounded-3xl p-8 sm:p-12 border border-[#E2E2C5] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl font-black text-[#1C1917]">Have a question about a component?</h2>
          <p className="text-xs sm:text-sm text-[#57534E] max-w-xl">
            Our hardware support team is online right now to guide you on pinouts, datasheets, compatibility, and availability.
          </p>
        </div>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA56] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md shadow-[#25D366]/25 transition-all shrink-0 active:scale-95"
        >
          <MessageCircle className="w-5 h-5 fill-white" />
          <span>Chat with Hardware Engineer</span>
        </a>
      </div>

      {/* FAQs */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-black text-[#1C1917]">Frequently Asked Questions</h2>
          <p className="text-xs text-[#57534E]">Everything you need to know about our ordering process</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E2E2C5] shadow-xs space-y-2"
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-[#C85A32] shrink-0 mt-0.5" />
                <h3 className="font-bold text-sm text-[#1C1917]">{faq.q}</h3>
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed pl-8">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
