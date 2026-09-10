'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Upload,
  Link as LinkIcon,
  X,
} from 'lucide-react';
import api from '../../../lib/api';
import ConfirmModal from '../../../components/admin/ConfirmModal';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formImageFile, setFormImageFile] = useState(null);
  const [formInStock, setFormInStock] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formSpecs, setFormSpecs] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.getProducts({ limit: 100 }),
        api.getCategories(),
      ]);

      if (prodRes.products) setProducts(prodRes.products);
      if (catRes.categories) {
        setCategories(catRes.categories);
        if (catRes.categories.length > 0 && !formCategory) {
          setFormCategory(catRes.categories[0]._id);
        }
      }
    } catch (err) {
      console.error('Error loading products data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormName('');
    setFormDescription('');
    setFormPrice('');
    setFormCategory(categories[0]?._id || '');
    setFormImageUrl('');
    setFormImageFile(null);
    setFormInStock(true);
    setFormFeatured(false);
    setFormSpecs('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setIsEditing(true);
    setEditingId(product._id);
    setFormName(product.name);
    setFormDescription(product.description);
    setFormPrice(product.price);
    setFormCategory(product.category?._id || product.category || categories[0]?._id || '');
    setFormImageUrl(product.imageUrl || '');
    setFormImageFile(null);
    setFormInStock(product.inStock !== false);
    setFormFeatured(Boolean(product.featured));
    setFormSpecs(product.specifications ? product.specifications.join(', ') : '');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', formName);
      formData.append('description', formDescription);
      formData.append('price', formPrice);
      formData.append('category', formCategory);
      formData.append('inStock', formInStock);
      formData.append('featured', formFeatured);
      formData.append('specifications', formSpecs);

      if (formImageFile) {
        formData.append('image', formImageFile);
      } else if (formImageUrl) {
        formData.append('imageUrl', formImageUrl);
      }

      if (isEditing) {
        await api.updateProduct(editingId, formData);
      } else {
        await api.createProduct(formData);
      }

      setIsModalOpen(false);
      await fetchAllData();
    } catch (err) {
      alert(err.message || 'Error saving product');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await api.deleteProduct(productToDelete._id);
      setDeleteModalOpen(false);
      setProductToDelete(null);
      await fetchAllData();
    } catch (err) {
      alert(err.message || 'Could not delete product');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      categoryFilter === 'all' ||
      p.category?.slug === categoryFilter ||
      p.category?._id === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 text-[#1C1917]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E2C5] pb-6">
        <div>
          <h1 className="text-2xl font-black text-[#1C1917]">Manage Products</h1>
          <p className="text-xs text-[#57534E]">
            Add, edit, or remove electronics components from the live catalogue
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search and Category Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C85A32]" />
          <input
            type="text"
            placeholder="Search products by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#FFFFFF] border border-[#E2E2C5] rounded-xl text-xs sm:text-sm text-[#1C1917] placeholder-[#78716C] shadow-xs focus:outline-none focus:border-[#C85A32] focus:ring-2 focus:ring-[#C85A32]/20"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#FFFFFF] border border-[#E2E2C5] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1C1917] font-semibold focus:outline-none focus:border-[#C85A32]"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.slug || cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-[#FFFFFF] rounded-3xl border border-[#E2E2C5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF9F0] border-b border-[#E2E2C5] text-[#78716C] font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4 pl-6">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E2C5]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#78716C]">
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const fallback = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80';
                  const img = product.imageUrl && product.imageUrl.startsWith('/')
                    ? `http://localhost:5000${product.imageUrl}`
                    : (product.imageUrl || fallback);

                  return (
                    <tr key={product._id} className="hover:bg-[#FAF9F0]/60 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#FAF9F0] shrink-0 border border-[#E2E2C5]">
                            <Image src={img} alt={product.name} fill unoptimized className="object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-[#1C1917] line-clamp-1">{product.name}</p>
                            <p className="text-[11px] text-[#78716C] line-clamp-1">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="bg-[#FAF9F0] border border-[#E2E2C5] px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#C85A32]">
                          {product.category?.name || 'General'}
                        </span>
                      </td>
                      <td className="p-4 font-black text-sm text-[#1C1917] whitespace-nowrap">
                        ₹{product.price}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {product.inStock !== false ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[#78716C] font-semibold text-[11px]">
                            <XCircle className="w-3.5 h-3.5" /> Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="p-4 pr-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="p-1.5 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF9F0] transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setProductToDelete(product);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-[#78716C] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Product"
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
                    No products found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-[#FFFFFF] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E2E2C5] space-y-5 my-8 text-[#1C1917]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E2E2C5] pb-4">
              <h3 className="text-lg font-bold text-[#1C1917]">
                {isEditing ? 'Edit Electronics Component' : 'Add New Component'}
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
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Arduino Uno R3 Compatible Board"
                  className="w-full p-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-[#1C1917] focus:outline-none focus:border-[#C85A32] focus:ring-2 focus:ring-[#C85A32]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
                    Price in ₹ (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="e.g. 549"
                    className="w-full p-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-[#1C1917] focus:outline-none focus:border-[#C85A32]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
                    Category *
                  </label>
                  <select
                    required
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-[#1C1917] font-semibold focus:outline-none focus:border-[#C85A32]"
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
                  Description *
                </label>
                <textarea
                  rows="3"
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detailed component specifications and features..."
                  className="w-full p-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-[#1C1917] focus:outline-none focus:border-[#C85A32]"
                />
              </div>

              {/* Photo Upload or Direct URL */}
              <div className="space-y-2 pt-1 border-t border-[#E2E2C5]">
                <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
                  Product Image (Upload File or Direct Image URL)
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

              <div className="space-y-1">
                <label className="font-bold text-[#44403C] uppercase tracking-wider text-[10px]">
                  Specifications (comma-separated)
                </label>
                <input
                  type="text"
                  value={formSpecs}
                  onChange={(e) => setFormSpecs(e.target.value)}
                  placeholder="e.g. Voltage: 5V, Pins: 14, ATmega328P"
                  className="w-full p-2.5 bg-[#FAF9F0] border border-[#E2E2C5] rounded-xl text-[#1C1917] focus:outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formInStock}
                    onChange={(e) => setFormInStock(e.target.checked)}
                    className="w-4 h-4 text-[#C85A32] rounded border-[#E2E2C5] focus:ring-[#C85A32]"
                  />
                  <span className="font-semibold text-[#44403C]">Available In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="w-4 h-4 text-[#C85A32] rounded border-[#E2E2C5] focus:ring-[#C85A32]"
                  />
                  <span className="font-semibold text-[#44403C]">Feature on Homepage</span>
                </label>
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
                  {formSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title={`Delete "${productToDelete?.name}"?`}
        message="This will immediately remove the component from the store catalogue and clean up its photo. Customers will no longer be able to place WhatsApp orders for this item."
        confirmText="Delete Product"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
        }}
      />
    </div>
  );
}
