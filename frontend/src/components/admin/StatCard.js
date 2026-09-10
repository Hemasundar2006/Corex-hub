'use client';

import React from 'react';

export default function StatCard({ title, value, icon: Icon, subtitle, highlightColor = '#C85A32' }) {
  return (
    <div className="bg-[#FFFFFF] rounded-3xl p-6 border border-[#E2E2C5] shadow-xs flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
          {title}
        </p>
        <p className="text-2xl sm:text-3xl font-black text-[#1C1917]">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-[#57534E] font-medium">
            {subtitle}
          </p>
        )}
      </div>

      <div
        className="w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 border border-[#E2E2C5]"
        style={{ backgroundColor: `${highlightColor}15`, color: highlightColor }}
      >
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}
