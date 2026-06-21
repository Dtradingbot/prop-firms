import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE}/api/auth/refresh`, { refreshToken });
          localStorage.setItem('token', data.token);
          error.config.headers.Authorization = `Bearer ${data.token}`;
          return api(error.config);
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const firmsApi = {
  getAll: (params?: Record<string, any>) => api.get('/firms', { params }),
  getFeatured: () => api.get('/firms/featured'),
  getTrending: () => api.get('/firms/trending'),
  getTopRated: () => api.get('/firms/top-rated'),
  getBySlug: (slug: string) => api.get(`/firms/${slug}`),
  compare: (slugs: string[]) => api.get(`/firms/compare/all`, { params: { slugs: slugs.join(',') } }),
};

export const reviewsApi = {
  getByFirm: (firmId: string, params?: Record<string, any>) => api.get(`/reviews/firm/${firmId}`, { params }),
  create: (data: FormData) => api.post('/reviews', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: any) => api.put(`/reviews/${id}`, data),
  updateStatus: (id: string, status: string) => api.patch(`/reviews/${id}/status`, { status }),
};

export const offersApi = {
  getAll: () => api.get('/offers'),
  click: (id: string) => api.post(`/offers/${id}/click`),
};

export const brokersApi = {
  getAll: () => api.get('/brokers'),
  getBySlug: (slug: string) => api.get(`/brokers/${slug}`),
};

export const blogApi = {
  getAll: (params?: Record<string, any>) => api.get('/blog', { params }),
  getBySlug: (slug: string) => api.get(`/blog/${slug}`),
};

export const searchApi = {
  search: (q: string) => api.get('/search', { params: { q } }),
};

export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (data: { name: string; email: string; password: string }) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
};

export const adminApi = {
  dashboard: () => api.get('/analytics/dashboard'),
  getFirms: (params?: Record<string, any>) => api.get('/admin/firms', { params }),
  createFirm: (data: FormData) => api.post('/admin/firms', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateFirm: (id: string, data: FormData) => api.put(`/admin/firms/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteFirm: (id: string) => api.delete(`/admin/firms/${id}`),
  getBrokers: () => api.get('/admin/brokers'),
  createBroker: (data: FormData) => api.post('/admin/brokers', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateBroker: (id: string, data: FormData) => api.put(`/admin/brokers/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteBroker: (id: string) => api.delete(`/admin/brokers/${id}`),
  getOffers: () => api.get('/admin/offers'),
  createOffer: (data: any) => api.post('/admin/offers', data),
  updateOffer: (id: string, data: any) => api.put(`/admin/offers/${id}`, data),
  deleteOffer: (id: string) => api.delete(`/admin/offers/${id}`),
  getReviews: (status?: string) => api.get('/admin/reviews', { params: { status } }),
  updateReviewStatus: (id: string, status: string) => api.patch(`/reviews/${id}/status`, { status }),
  getBlog: () => api.get('/admin/blog'),
  createPost: (data: FormData) => api.post('/admin/blog', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updatePost: (id: string, data: FormData) => api.put(`/admin/blog/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deletePost: (id: string) => api.delete(`/admin/blog/${id}`),
  getPages: () => api.get('/admin/pages'),
  updatePage: (id: string, data: any) => api.put(`/admin/pages/${id}`, data),
  getMenus: () => api.get('/admin/menus'),
  updateMenu: (location: string, items: any[]) => api.put(`/admin/menus/${location}`, { items }),
  getSettings: () => api.get('/admin/settings'),
  updateSetting: (key: string, value: string) => api.put(`/admin/settings/${key}`, { value }),
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (id: string, role: string) => api.put(`/admin/users/${id}/role`, { role }),
};
