import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vendorToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const sellerApi = {
  // Profile
  getProfile: () => api.get('/vendor/profile'),
  updateProfile: (data: any) => api.put('/vendor/profile', data),
  
  // Stats
  getStats: () => api.get('/vendor/stats'),
  
  // Products
  getProducts: () => api.get('/catalog/products'),
  createProduct: (data: any) => api.post('/catalog/products', data),
  updateProduct: (id: string, data: any) => api.put(`/catalog/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/catalog/products/${id}`),
  addProductImage: (productId: string, data: any) => api.post(`/catalog/products/images`, { ...data, productId }),
  
  // Orders
  getOrders: () => api.get('/vendor-orders'),
  getOrderById: (id: string) => api.get(`/vendor-orders/${id}`),
  acceptOrder: (id: string) => api.post(`/vendor-orders/${id}/accept`),
  rejectOrder: (id: string) => api.post(`/vendor-orders/${id}/reject`),
  shipOrder: (id: string, data: any) => api.post(`/vendor-orders/${id}/ship`, data),
  
  // Wallet
  getWallet: () => api.get('/wallets'),
  requestPayout: (data: any) => api.post('/payouts/request', data),
  getPayouts: () => api.get('/payouts'),
  
  // Reviews
  getReviews: () => api.get('/reviews/vendor'),
};

export default api;