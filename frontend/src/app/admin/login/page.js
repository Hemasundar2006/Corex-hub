'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Cpu, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../lib/authContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@corex.com');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      router.push('/admin');
    } else {
      setErrorMsg(result.message || 'Invalid credentials provided');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F5F5DC] text-[#1C1917]">
      <div className="max-w-md w-full space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-[#C85A32] flex items-center justify-center text-white shadow-md shadow-[#C85A32]/25 group-hover:scale-105 transition-transform">
              <Cpu className="w-7 h-7" />
            </div>
          </Link>
          <h1 className="text-2xl font-black text-[#1C1917]">
            IoT Garage Admin Portal
          </h1>
          <p className="text-xs text-[#57534E]">
            Sign in to manage products, categories, combos, and store settings
          </p>
        </div>

        {/* Credentials Reminder Box */}
        <div className="bg-[#FFFFFF] border border-[#E2E2C5] rounded-2xl p-4 text-xs space-y-1 shadow-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#C85A32]">
            <ShieldCheck className="w-4 h-4 text-[#C85A32]" />
            <span>Default Administrator Credentials:</span>
          </div>
          <p className="font-mono text-[11px] text-[#57534E]">
            Email: <b className="text-[#1C1917]">admin@corex.com</b><br />
            Password: <b className="text-[#1C1917]">admin123</b>
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#FFFFFF] rounded-3xl p-8 border border-[#E2E2C5] shadow-lg space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#44403C]">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716C]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-xs sm:text-sm text-[#1C1917] focus:outline-none focus:border-[#C85A32] focus:ring-2 focus:ring-[#C85A32]/20"
                  placeholder="admin@corex.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#44403C]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716C]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-xs sm:text-sm text-[#1C1917] focus:outline-none focus:border-[#C85A32] focus:ring-2 focus:ring-[#C85A32]/20"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 w-full bg-[#1C1917] hover:bg-[#292524] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-98 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs font-semibold text-[#78716C] hover:text-[#1C1917] transition-colors"
            >
              ← Back to Public Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
