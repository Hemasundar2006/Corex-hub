'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

/**
 * Centered Loading Progress Bar for Corex Projects Hub
 * Displays an animated brand badge, progress bar, percentage indicator,
 * and dynamic status updates before gracefully fading out to reveal the homepage.
 */
export default function PageLoader({ isReady = false, onFinished }) {
  const [progress, setProgress] = useState(12);
  const [statusText, setStatusText] = useState('Connecting to IoT Garage...');
  const [isFading, setIsFading] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  // Smooth simulated progress that ramps up and finishes when isReady is true
  useEffect(() => {
    let current = 12;
    const interval = setInterval(() => {
      if (!isReady) {
        // Slow down as it approaches 92% if data is still fetching
        if (current < 40) {
          current += Math.floor(Math.random() * 8) + 5;
          setStatusText('Loading components & categories...');
        } else if (current < 75) {
          current += Math.floor(Math.random() * 6) + 3;
          setStatusText('Syncing live stock & combo offers...');
        } else if (current < 90) {
          current += Math.floor(Math.random() * 3) + 1;
          setStatusText('Preparing hardware catalog...');
        }
        setProgress(Math.min(current, 92));
      } else {
        // Data is ready, swiftly reach 100%
        current = 100;
        setProgress(100);
        setStatusText('Welcome to IoT Garage!');
        clearInterval(interval);

        // Hold 100% briefly for visual satisfaction, then fade out
        const fadeTimer = setTimeout(() => {
          setIsFading(true);
          const finishTimer = setTimeout(() => {
            setIsMounted(false);
            if (onFinished) onFinished();
          }, 500);
          return () => clearTimeout(finishTimer);
        }, 320);

        return () => clearTimeout(fadeTimer);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [isReady, onFinished]);

  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F5F5DC] px-4 transition-all duration-500 ease-out ${
        isFading ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 50%, rgba(200, 90, 50, 0.08) 0%, rgba(245, 245, 220, 0.96) 65%, #F5F5DC 100%)',
      }}
      aria-label="Loading IoT Garage"
      role="status"
    >
      <div className="flex flex-col items-center text-center max-w-sm w-full space-y-6">
        {/* Animated Brand Logo Icon */}
        <div className="relative">
          {/* Subtle Ambient Glow Ring */}
          <div className="absolute -inset-2 bg-gradient-to-tr from-[#C85A32]/25 to-[#D96F4C]/15 rounded-3xl blur-md animate-pulse" />
          
          <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-white border-2 border-[#E2E2C5] shadow-xl flex items-center justify-center">
            <Cpu className="w-9 h-9 sm:w-10 sm:h-10 text-[#C85A32] animate-pulse" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#25D366] rounded-full border-2 border-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
        </div>

        {/* Brand Title & Tagline */}
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#1C1917]">
            IoT <span className="text-[#C85A32]">Garage</span>
          </h1>
          <p className="text-xs text-[#78716C] font-medium tracking-wide uppercase">
            Electronics Components & WhatsApp Ordering
          </p>
        </div>

        {/* Center Progress Bar Box */}
        <div className="w-full space-y-2.5 pt-2">
          {/* Progress Track */}
          <div className="relative w-full h-3 bg-[#E2E2C5] rounded-full p-0.5 shadow-inner overflow-hidden border border-[#D4D4B0]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#D96F4C] via-[#C85A32] to-[#B04923] relative transition-all duration-200 ease-out shadow-xs"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer light bar running across active fill */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-progress-shimmer" />
            </div>
          </div>

          {/* Progress Percentage & Dynamic Status Text */}
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-[#57534E] font-medium transition-all duration-200">
              {statusText}
            </span>
            <span className="font-bold font-mono text-[#C85A32] tracking-wider">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-[#78716C]">
          <span className="inline-flex items-center gap-1 bg-white/70 border border-[#E2E2C5] px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-[#25D366]" />
            Verified Hardware
          </span>
          <span className="inline-flex items-center gap-1 bg-white/70 border border-[#E2E2C5] px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-[#C85A32]" />
            Direct WhatsApp Cart
          </span>
        </div>
      </div>
    </div>
  );
}
