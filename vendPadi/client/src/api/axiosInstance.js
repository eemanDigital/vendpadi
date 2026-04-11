import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('vendpadi_admin_token');
  const vendorToken = localStorage.getItem('vendpadi_token');
  const token = adminToken || vendorToken;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  changePassword: (currentPassword, newPassword) => api.put('/auth/change-password', { currentPassword, newPassword })
};

export const vendorAPI = {
  getMe: () => api.get('/vendor/me'),
  updateMe: (data) => api.put('/vendor/me', data),
  updateLogo: (formData) => api.put('/vendor/me/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateCover: (formData) => api.post('/vendor/me/cover', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateCustomLink: (customLink) => api.put('/vendor/me/custom-link', { customLink })
};

export const productAPI = {
  getAll: () => api.get('/products'),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  uploadImages: (id, formData) => api.post(`/products/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

export const storeAPI = {
  getStore: (slug) => api.get(`/store/${slug}`),
  getStoreByCustomLink: (customLink) => api.get(`/store/custom/${customLink}`),
  createOrder: (slug, data) => api.post(`/store/${slug}/order`, data),
  createOrderByCustomLink: (customLink, data) => api.post(`/store/custom/${customLink}/order`, data)
};

export const orderAPI = {
  getAll: () => api.get('/orders'),
  getStats: () => api.get('/orders/stats'),
  getOne: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status })
};

export const planAPI = {
  getPlans: () => api.get('/plans'),
  requestUpgrade: (requestedPlan) => api.post('/plans/upgrade', { requestedPlan }),
  getMyRequests: () => api.get('/plans/my-requests'),
  cancelRequest: (id) => api.delete('/plans/request/${id}'),
  uploadProof: (id, formData) => api.post(`/plans/upload-proof/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAdminRequests: () => api.get('/plans/admin/requests'),
  getAdminStats: () => api.get('/plans/admin/stats'),
  getSubscribers: (plan) => api.get('/plans/admin/subscribers', { params: { plan } }),
  approveRequest: (id) => api.put(`/plans/admin/approve/${id}`),
  rejectRequest: (id, reason) => api.put(`/plans/admin/reject/${id}`, { reason })
};

export const adminAPI = {
  getVendors: () => api.get('/admin/vendors'),
  getVendor: (id) => api.get(`/admin/vendors/${id}`),
  getStats: () => api.get('/admin/stats'),
  approvePlan: (vendorId, planType) => api.put(`/admin/vendors/${vendorId}/approve-plan`, { planType }),
  rejectPlan: (vendorId, reason) => api.put(`/admin/vendors/${vendorId}/reject-plan`, { vendorId, reason }),
  sendGreeting: (greetingType, vendorIds) => api.post('/admin/send-greeting', { greetingType, vendorIds })
};

export const analyticsAPI = {
  getAnalytics: () => api.get('/analytics')
};

const publicAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const trackingAPI = {
  trackView: (slug) => publicAPI.post(`/track/view/${slug}`),
  trackWhatsAppClick: (slug, productIds) => publicAPI.post(`/track/whatsapp-click/${slug}`, { productIds }),
  trackProductView: (slug, productId) => publicAPI.post(`/track/product-view/${slug}/${productId}`)
};

export default api;
