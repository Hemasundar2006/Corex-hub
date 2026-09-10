'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Cpu, AlertCircle, X } from 'lucide-react';
import api from '../../../lib/api';
import ConfirmModal from '../../../components/admin/ConfirmModal';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIcon, setFormIcon] = useState('Cpu');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Delete State & Error Alert
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.getCategories();
      if (res.categories) setCategories(res.categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormName('');
    setFormSlug('');
    setFormDescription('');
    setFormIcon('Cpu');
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setIsEditing(true);
    setEditingId(category._id);
    setFormName(category.name);
    setFormSlug(category.slug);
    setFormDescription(category.description || '');
    setFormIcon(category.icon || 'Cpu');
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setErrorMessage('');

    try {
      if (isEditing) {
        await api.updateCategory(editingId, {
          name: formName,
          slug: formSlug,
          description: formDescription,
          icon: formIcon,
        });
      } else {
        await api.createCategory({
          name: formName,
          slug: formSlug,
          description: formDescription,
          icon: formIcon,
        });
      }

      setIsModalOpen(false);
      await fetchCategories();
    } catch (err) {
      setErrorMessage(err.data?.message || err.message || 'Failed to save category');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await api.deleteCategory(categoryToDelete._id);
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
      await fetchCategories();
    } catch (err) {
      setDeleteModalOpen(false);
      setErrorMessage(
        err.data?.message || err.message || 'Cannot delete category because products are assigned to it.'
      );
    }
  };

  return (
    <div className="space-y-6 text-[#1C1917]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E2C5] pb-6">
        <div>
          <h1 className="text-2xl font-black text-[#1C1917]">Manage Categories</h1>
          <p className="text-xs text-[#57534E]">
            Organize electronics components by department and filter tabs
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-start justify-between gap-3 text-rose-800 text-xs font-medium">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="text-rose-600 hover:text-rose-950">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-[#FFFFFF] rounded-3xl border border-[#E2E2C5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF9F0] border-b border-[#E2E2C5] text-[#78716C] font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4 pl-6">Category Name</th>
                <th className="p-4">URL Slug</th>
                <th className="p-4">Description</th>
                <th className="p-4">Assigned Products</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E2C5]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#78716C]">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length > 0 ? (
                categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-[#FAF9F0]/60 transition-colors">
                    <td className="p-4 pl-6 font-bold text-[#1C1917] whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#FAF9F0] text-[#C85A32] border border-[#E2E2C5] flex items-center justify-center">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <span>{cat.name}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-[#78716C]">
                      /{cat.slug}
                    </td>
                    <td className="p-4 text-[#57534E] max-w-xs truncate">
                      {cat.description || '—'}
                    </td>
                    <td className="p-4">
                      <span className="bg-[#FAF9F0] border border-[#E2E2C5] px-2.5 py-1 rounded-full text-[11px] font-bold text-[#C85A32]">
                        {cat.productCount || 0} active products
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF9F0] transition-colors"
                          title="Edit Category"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setErrorMessage('');
                            setCategoryToDelete(cat);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-[#78716C] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#78716C]">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-[#FFFFFF] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E2E2C5] space-y-5 text-[#1C1917]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E2E2C5] pb-4">
              <h3 className="text-base font-bold text-[#1C1917]">
                {isEditing ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#78716C] hover:text-[#1C1917]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Microcontrollers & Dev Boards"
                  className="w-full p-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-[#1C1917] focus:outline-none focus:border-[#C85A32] focus:ring-2 focus:ring-[#C85A32]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
                  URL Slug (Optional, auto-generated)
                </label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="e.g. microcontrollers"
                  className="w-full p-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-[#1C1917] font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Brief summary of components in this category..."
                  className="w-full p-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-[#1C1917] focus:outline-none"
                />
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
                  {formSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title={`Delete Category "${categoryToDelete?.name}"?`}
        message={
          categoryToDelete?.productCount > 0
            ? `Warning: This category currently has ${categoryToDelete.productCount} assigned products. You must reassign or remove those products before this category can be deleted.`
            : 'Are you sure you want to delete this category? It will no longer appear on the storefront filter tabs.'
        }
        confirmText="Delete Category"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setCategoryToDelete(null);
        }}
      />
    </div>
  );
}
