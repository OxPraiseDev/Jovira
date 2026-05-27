import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints
export const adminApi = {
  // Dashboard
  getDashboard: () => api.get('/admin/dashboard'),
  
  // KYC
  getPendingKyc: () => api.get('/admin/kyc/pending'),
  getKycById: (id: string) => api.get(`/admin/kyc/${id}`),
  approveKyc: (data: { vendorId: string; status: string; reviewedBy: string; rejectionReason?: string }) => 
    api.post('/admin/kyc/approve', data),
  
  // Product Moderation
  getModerationQueue: () => api.get('/admin/moderation/queue'),
  reviewProduct: (data: { productId: string; status: string; reviewedBy: string; reason?: string }) => 
    api.post('/admin/moderation/review', data),
  
  // Coupons
  getAllCoupons: () => api.get('/coupons'),
  createCoupon: (data: any) => api.post('/coupons', data),
  
  // Financial
  getFinancialDashboard: () => api.get('/admin/financial/dashboard'),
  getTransactions: (startDate: string, endDate: string) => 
    api.get(`/admin/financial/transactions?startDate=${startDate}&endDate=${endDate}`),
  
  // System Config
  getSystemConfig: () => api.get('/admin/system-config'),
  setSystemConfig: (data: { key: string; value: any; description?: string }) => 
    api.post('/admin/system-config', data),
  
  // Users
  getAllUsers: () => api.get('/users'),
  
  // Orders
  getAllOrders: () => api.get('/orders'),
  
  // Products
  getAllProducts: () => api.get('/catalog/products'),
  
  // Vendors
  getAllVendors: () => api.get('/vendor/profile'),
};

export default api;