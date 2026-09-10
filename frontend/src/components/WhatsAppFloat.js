'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { getGeneralWhatsAppUrl } from '../lib/whatsapp';

export default function WhatsAppFloat({ businessPhone = '+919876543210' }) {
  const [showTooltip, setShowTooltip] = useState(true);
  const waUrl = getGeneralWhatsAppUrl(businessPhone);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3 group">
      {/* Tooltip Card */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2.5 bg-[#FFFFFF] px-4 py-2.5 rounded-2xl shadow-xl border border-[#E2E2C5] text-xs text-[#1C1917] animate-bounce duration-1000">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
          <span className="font-semibold text-[#1C1917]">Need project parts? Order via WhatsApp!</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-[#78716C] hover:text-[#1C1917] ml-1 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-14 h-14 bg-[#25D366] hover:bg-[#20BA56] text-white rounded-full flex items-center justify-center shadow-xl shadow-[#25D366]/35 hover:shadow-2xl hover:shadow-[#25D366]/50 hover:scale-110 active:scale-95 transition-all duration-300"
        aria-label="Direct WhatsApp Ordering Support"
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C85A32] rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black text-white shadow-xs">
          1
        </span>
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </div>
  );
}
