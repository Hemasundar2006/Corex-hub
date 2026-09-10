'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className="bg-[#FFFFFF] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E2E2C5] space-y-4 animate-in zoom-in-95 duration-150 text-[#1C1917]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isDestructive ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-[#FBECE6] text-[#C85A32]'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="space-y-1 flex-1">
            <h3 className="text-base font-bold text-[#1C1917]">{title}</h3>
            <p className="text-xs text-[#57534E] leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF9F0] transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-[#1C1917] hover:bg-[#292524]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
