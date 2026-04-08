import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vendpadi_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
};

export const vendorAPI = {
  getMe: () => api.get('/vendor/me'),
  updateMe: (data) => api.put('/vendor/me', data),
  updateLogo: (formData) => api.put('/vendor/me/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
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
  createOrder: (slug, data) => api.post(`/store/${slug}/order`, data)
};

export const orderAPI = {
  getAll: () => api.get('/orders'),
  getStats: () => api.get('/orders/stats'),
  getOne: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status })
};

export default api;
