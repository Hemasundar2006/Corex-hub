'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  Link as LinkIcon,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';
import api, { getImageUrl } from '../../../lib/api';
import ConfirmModal from '../../../components/admin/ConfirmModal';

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formImageFile, setFormImageFile] = useState(null);
  const [formPriority, setFormPriority] = useState('0');
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [formItems, setFormItems] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState(null);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const res = await api.getPromotions(true);
      if (res.promotions) setPromotions(res.promotions);
    } catch (err) {
      console.error('Error fetching promotions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormTitle('');
    setFormDescription('');
    setFormPrice('');
    setFormOriginalPrice('');
    setFormImageUrl('');
    setFormImageFile(null);
    setFormPriority('0');
    setFormIsPublished(true);
    setFormItems('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (promo) => {
    setIsEditing(true);
    setEditingId(promo._id);
    setFormTitle(promo.title);
    setFormDescription(promo.description || '');
    setFormPrice(promo.price);
    setFormOriginalPrice(promo.originalPrice || '');
    setFormImageUrl(promo.imageUrl || '');
    setFormImageFile(null);
    setFormPriority(promo.priority || '0');
    setFormIsPublished(promo.isPublished !== false);
    setFormItems(promo.items ? promo.items.join('\n') : '');
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (promo) => {
    try {
      await api.togglePromotionPublish(promo._id);
      await fetchPromotions();
    } catch (err) {
      alert(err.message || 'Could not toggle published state');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', formTitle);
      formData.append('description', formDescription);
      formData.append('price', formPrice);
      formData.append('originalPrice', formOriginalPrice || '0');
      formData.append('priority', formPriority);
      formData.append('isPublished', formIsPublished);

      const itemsArr = formItems.split('\n').map((s) => s.trim()).filter(Boolean);
      formData.append('items', JSON.stringify(itemsArr));

      if (formImageFile) {
        formData.append('image', formImageFile);
      } else if (formImageUrl) {
        formData.append('imageUrl', formImageUrl);
      }

      if (isEditing) {
        await api.updatePromotion(editingId, formData);
      } else {
        await api.createPromotion(formData);
      }

      setIsModalOpen(false);
      await fetchPromotions();
    } catch (err) {
      alert(err.message || 'Error saving combo offer');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!promoToDelete) return;
    try {
      await api.deletePromotion(promoToDelete._id);
      setDeleteModalOpen(false);
      setPromoToDelete(null);
      await fetchPromotions();
    } catch (err) {
      alert(err.message || 'Could not delete combo offer');
    }
  };

  return (
    <div className="space-y-6 text-[#1C1917]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E2C5] pb-6">
        <div>
          <h1 className="text-2xl font-black text-[#1C1917]">Manage Combo Offers</h1>
          <p className="text-xs text-[#57534E]">
            Configure high-value bundles, student packs, and sidebar deals with direct WhatsApp order links
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Combo Offer</span>
        </button>
      </div>

      {/* Promotions Table */}
      <div className="bg-[#FFFFFF] rounded-3xl border border-[#E2E2C5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF9F0] border-b border-[#E2E2C5] text-[#78716C] font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4 pl-6">Combo Offer</th>
                <th className="p-4">Combo Price</th>
                <th className="p-4">Savings</th>
                <th className="p-4">Visibility</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E2C5]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#78716C]">
                    Loading combo offers...
                  </td>
                </tr>
              ) : promotions.length > 0 ? (
                promotions.map((promo) => {
                  const fallback = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80';
                  const img = getImageUrl(promo.imageUrl, fallback);
                  const savings = promo.originalPrice > promo.price ? promo.originalPrice - promo.price : 0;

                  return (
                    <tr key={promo._id} className="hover:bg-[#FAF9F0]/60 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#FAF9F0] shrink-0 border border-[#E2E2C5]">
                            <Image src={img} alt={promo.title} fill unoptimized className="object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-[#1C1917] line-clamp-1">{promo.title}</p>
                            <p className="text-[11px] text-[#78716C] line-clamp-1">{promo.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-black text-sm text-[#1C1917] whitespace-nowrap">
                        ₹{promo.price}
                        {promo.originalPrice > promo.price && (
                          <span className="text-[11px] font-normal text-[#78716C] line-through ml-2">
                            ₹{promo.originalPrice}
                          </span>
                        )}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {savings > 0 ? (
                          <span className="text-emerald-700 font-bold text-[11px]">
                            Save ₹{savings}
                          </span>
                        ) : (
                          <span className="text-[#78716C] text-[11px]">—</span>
                        )}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <button
                          onClick={() => handleTogglePublish(promo)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                            promo.isPublished
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-[#FAF9F0] text-[#78716C] border border-[#E2E2C5]'
                          }`}
                          title="Click to toggle publish on storefront"
                        >
                          {promo.isPublished ? (
                            <>
                              <Eye className="w-3 h-3" /> Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" /> Draft
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-4 pr-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(promo)}
                            className="p-1.5 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF9F0] transition-colors"
                            title="Edit Combo"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setPromoToDelete(promo);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-[#78716C] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Combo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#78716C]">
                    No combo offers created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Combo Offer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-[#FFFFFF] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E2E2C5] space-y-5 my-8 text-[#1C1917]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E2E2C5] pb-4">
              <h3 className="text-lg font-bold text-[#1C1917]">
                {isEditing ? 'Edit Combo Offer' : 'Create New Combo Offer'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#78716C] hover:text-[#1C1917]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
                  Combo Offer Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. IoT Developer Starter Bundle (ESP32 + 5 Sensors)"
                  className="w-full p-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-[#1C1917] focus:outline-none focus:border-[#C85A32] focus:ring-2 focus:ring-[#C85A32]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
                    Discounted Combo Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="e.g. 899"
                    className="w-full p-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-[#1C1917] focus:outline-none focus:border-[#C85A32]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
                    Original Package Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    placeholder="e.g. 1180"
                    className="w-full p-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-[#1C1917] focus:outline-none focus:border-[#C85A32]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Overview of the bundle pack..."
                  className="w-full p-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-[#1C1917] focus:outline-none focus:border-[#C85A32]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
                  Included Components (one item per line)
                </label>
                <textarea
                  rows="3"
                  value={formItems}
                  onChange={(e) => setFormItems(e.target.value)}
                  placeholder="ESP32 WiFi+BLE Board&#10;DHT11 Temp Sensor&#10;HC-SR04 Ultrasonic&#10;40-pin Dupont Cables"
                  className="w-full p-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-[#1C1917] focus:outline-none font-mono"
                />
              </div>

              {/* Photo Upload or URL */}
              <div className="space-y-2 pt-1 border-t border-[#E2E2C5]">
                <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
                  Combo Photo (Upload File or Direct Image URL)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer bg-[#FAF9F0] hover:bg-[#F5F5DC] border border-[#E2E2C5] border-dashed rounded-xl p-3 text-center transition-colors">
                    <Upload className="w-4 h-4 text-[#C85A32] mx-auto mb-1" />
                    <span className="text-[11px] font-semibold text-[#57534E]">
                      {formImageFile ? formImageFile.name : 'Upload File from Device'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormImageFile(e.target.files[0] || null)}
                      className="hidden"
                    />
                  </label>

                  <span className="text-[10px] text-[#78716C] font-bold">OR</span>

                  <div className="flex-1 relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#78716C]" />
                    <input
                      type="url"
                      placeholder="Paste Image URL..."
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-[11px] text-[#1C1917] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Visibility and Priority */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E2E2C5]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsPublished}
                    onChange={(e) => setFormIsPublished(e.target.checked)}
                    className="w-4 h-4 text-[#C85A32] rounded border-[#E2E2C5] focus:ring-[#C85A32]"
                  />
                  <span className="font-semibold text-[#44403C]">Publish on Public Storefront</span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="font-bold text-[#78716C] text-[11px]">Priority Order:</label>
                  <input
                    type="number"
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value)}
                    className="w-16 p-1.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-lg text-center font-bold text-[#1C1917]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2E2C5] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#78716C] hover:bg-[#FAF9F0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#1C1917] hover:bg-[#292524] shadow-xs disabled:opacity-60"
                >
                  {formSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Combo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title={`Delete Combo Offer "${promoToDelete?.title}"?`}
        message="This will remove the combo offer bundle from the storefront and WhatsApp catalog."
        confirmText="Delete Combo"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setPromoToDelete(null);
        }}
      />
    </div>
  );
}
