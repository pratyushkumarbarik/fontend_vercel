import axios from 'axios';

// Use your actual backend API domain with https://
const API_BASE_URL = 'https://vercel-frontend-lostfound-pz52-pdrol74d0.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const { token } = JSON.parse(user);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const itemsAPI = {
  getAllItems: () => api.get('/items'),
  getAdminItems: () => api.get('/admin/items'),
  addItem: (itemData) => api.post('/admin/add-item', itemData),
  claimItem: (id, claimData) => api.put(`/admin/items/${id}/claim`, claimData),
  reportItem: (itemData) => api.post('/report-item', itemData),
  getReportedItems: () => api.get('/admin/reported-items'),
  approveReportedItem: (id) => api.post(`/admin/approve-reported-item/${id}`),
};

// assetUrl correctly handles absolute and relative image URLs
export const assetUrl = (maybePath) => {
  if (!maybePath) return '';
  if (maybePath.startsWith('http://') || maybePath.startsWith('https://')) return maybePath;
  let normalized = String(maybePath).replace(/\\/g, '/');
  if (!normalized.startsWith('/')) normalized = '/' + normalized;
  return `${API_BASE_URL}${normalized}`;
};
