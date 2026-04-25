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
  changePassword: (currentPassword, newPassword) => api.put('/auth/change-password', { currentPassword, newPassword }),
  requestDeleteAccount: (password, reason) => api.post('/auth/request-delete', { password, reason }),
  cancelDeleteAccount: (password) => api.post('/auth/cancel-delete', { password }),
  getDeletionStatus: () => api.get('/auth/deletion-status'),
  exportAccountData: () => api.get('/auth/export-data')
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
  updateCustomLink: (customLink) => api.put('/vendor/me/custom-link', { customLink }),
  getTrialStatus: () => api.get('/vendor/trial-status'),
  submitVerification: (documentType, formData) => api.post('/vendor/me/verify', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateDeliveryZones: (data) => api.put('/vendor/me/delivery-zones', data),
  getDeliveryZones: () => api.get('/vendor/me/delivery-zones')
};

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  uploadImages: (id, formData) => api.post(`/products/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  setFlashSale: (id, data) => api.post(`/products/${id}/flash-sale`, data),
  getFlashSaleProducts: () => api.get('/products/flash-sales')
};

export const orderAPI = {
  getAll: (params) => api.get('/orders', { params }),
  getStats: () => api.get('/orders/stats'),
  getOne: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status })
};

export const planAPI = {
  getPlans: () => api.get('/plans'),
  requestUpgrade: (requestedPlan, billingCycle = 'monthly', isTrial = false) => 
    api.post('/plans/upgrade', { requestedPlan, billingCycle, isTrial }),
  getMyRequests: () => api.get('/plans/my-requests'),
  cancelRequest: (id) => api.delete(`/plans/request/${id}`),
  uploadProof: (id, formData) => api.post(`/plans/upload-proof/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAdminRequests: () => api.get('/plans/admin/requests'),
  getAdminStats: () => api.get('/plans/admin/stats'),
  getSubscribers: (plan = 'all', format = 'list', billingCycle = 'all') => api.get('/plans/admin/subscribers', { params: { plan, format, billingCycle } }),
  approveRequest: (id) => api.put(`/plans/admin/approve/${id}`),
  rejectRequest: (id, reason) => api.put(`/plans/admin/reject/${id}`, { reason }),
  startTrial: () => api.post('/plans/trial')
};

export const adminAPI = {
  getVendors: () => api.get('/admin/vendors'),
  getVendor: (id) => api.get(`/admin/vendors/${id}`),
  getStats: () => api.get('/admin/stats'),
  approvePlan: (vendorId, planType) => api.put(`/admin/vendors/${vendorId}/approve-plan`, { planType }),
  rejectPlan: (vendorId, reason) => api.put(`/admin/vendors/${vendorId}/reject-plan`, { vendorId, reason }),
  sendGreeting: (greetingType, vendorIds) => api.post('/admin/send-greeting', { greetingType, vendorIds }),
  getPendingVerifications: () => api.get('/admin/verifications/pending'),
  approveVerification: (vendorId) => api.put(`/admin/vendors/${vendorId}/approve-verification`),
  rejectVerification: (vendorId, reason) => api.put(`/admin/vendors/${vendorId}/reject-verification`, { reason })
};

export const analyticsAPI = {
  getAnalytics: () => api.get('/analytics')
};

export const storeAPI = {
  getStore: (slug, params) => api.get(`/store/${slug}`, { params }),
  createOrder: (slug, data) => api.post(`/store/${slug}/order`, data)
};

export const bundleAPI = {
  getAll: () => api.get('/bundles'),
  create: (data) => api.post('/bundles', data),
  update: (id, data) => api.put(`/bundles/${id}`, data),
  delete: (id) => api.delete(`/bundles/${id}`),
  toggleDeal: (id) => api.post(`/bundles/${id}/toggle-deal`)
};

export const invoiceAPI = {
  getAll: (params) => api.get('/invoices', { params }),
  getStats: () => api.get('/invoices/stats'),
  getOne: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post('/invoices', data),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  delete: (id) => api.delete(`/invoices/${id}`),
  markSent: (id) => api.post(`/invoices/${id}/sent`),
  recordPayment: (id, data) => api.post(`/invoices/${id}/payment`, data)
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
