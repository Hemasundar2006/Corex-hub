const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Universal fetch wrapper with authorization headers
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = options.headers || {};

  // Attach token if present in browser localStorage
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('corex_admin_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Handle FormData vs JSON
  const isFormData = options.body instanceof FormData;
  if (!isFormData && options.body && typeof options.body === 'object') {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (netErr) {
    console.warn(`[API Network Error] Unable to connect to backend at ${url}:`, netErr.message);
    if (options.throwOnError) {
      throw netErr;
    }
    return {
      success: false,
      error: `Network error: Unable to reach backend server (${netErr.message})`,
      products: [],
      categories: [],
      promotions: [],
      settings: null,
      discount: null,
    };
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  getMe: () => request('/auth/me'),

  // Products
  getProducts: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.category) searchParams.set('category', params.category);
    if (params.search) searchParams.set('search', params.search);
    if (params.featured) searchParams.set('featured', params.featured);
    if (params.limit) searchParams.set('limit', params.limit);
    if (params.page) searchParams.set('page', params.page);
    const query = searchParams.toString();
    return request(`/products${query ? `?${query}` : ''}`);
  },
  getProduct: (id) => request(`/products/${id}`),
  createProduct: (formDataOrData) => request('/admin/products', { method: 'POST', body: formDataOrData }),
  updateProduct: (id, formDataOrData) => request(`/admin/products/${id}`, { method: 'PUT', body: formDataOrData }),
  deleteProduct: (id) => request(`/admin/products/${id}`, { method: 'DELETE' }),

  // Categories
  getCategories: () => request('/categories'),
  createCategory: (data) => request('/admin/categories', { method: 'POST', body: data }),
  updateCategory: (id, data) => request(`/admin/categories/${id}`, { method: 'PUT', body: data }),
  deleteCategory: (id) => request(`/admin/categories/${id}`, { method: 'DELETE' }),

  // Promotions / Combo Offers
  getPromotions: (all = false) => request(`/promotions${all ? '?all=true' : ''}`),
  getPromotion: (id) => request(`/promotions/${id}`),
  createPromotion: (formDataOrData) => request('/admin/promotions', { method: 'POST', body: formDataOrData }),
  updatePromotion: (id, formDataOrData) => request(`/admin/promotions/${id}`, { method: 'PUT', body: formDataOrData }),
  togglePromotionPublish: (id) => request(`/admin/promotions/${id}/toggle`, { method: 'PATCH' }),
  deletePromotion: (id) => request(`/admin/promotions/${id}`, { method: 'DELETE' }),

  // Discount Banner
  getDiscount: () => request('/discount'),
  updateDiscount: (data) => request('/admin/discount', { method: 'PUT', body: data }),

  // Settings
  getSettings: () => request('/settings'),
  updateSettings: (data) => request('/admin/settings', { method: 'PUT', body: data }),
};

export default api;
