import axios from 'axios';

// ✅ Use your deployed backend API
const API_BASE_URL = 'https://backend-render-l8re.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Attach Bearer token if present
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

// ✅ API Endpoints
export const itemsAPI = {
  // Public
  getAllItems: () => api.get('/items'),
  reportItem: (itemData) => api.post('/report-item', itemData),

  // Admin (protected)
  login: (email, password) =>
    api.post('/admin/login', { email, password }), // ✅ added login
  getAdminItems: () => api.get('/admin/items'),
  addItem: (itemData) => api.post('/admin/add-item', itemData),
  claimItem: (id, claimData) => api.put(`/admin/items/${id}/claim`, claimData),
  getReportedItems: () => api.get('/admin/reported-items'),
  approveReportedItem: (id) => api.post(`/admin/approve-reported-item/${id}`),
};

// ✅ Handle static assets (images)
export const assetUrl = (maybePath) => {
  if (!maybePath) return '';
  if (maybePath.startsWith('http://') || maybePath.startsWith('https://')) return maybePath;
  let normalized = String(maybePath).replace(/\\/g, '/');
  if (!normalized.startsWith('/')) normalized = '/' + normalized;
  return `${API_BASE_URL}${normalized}`;
};
