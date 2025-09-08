import axios from 'axios';

// ✅ Your deployed backend URL
const API_BASE_URL = 'https://backend-render-l8re.onrender.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Bearer token if present
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
  login: (email, password) => api.post('/admin/login', { email, password }),
  getAdminItems: () => api.get('/admin/items'),
  addItem: (itemData) => api.post('/admin/add-item', itemData),
  claimItem: (id, claimData) => api.put(`/admin/items/${id}/claim`, claimData),
  getReportedItems: () => api.get('/admin/reported-items'),
  approveReportedItem: (id) => api.post(`/admin/approve-reported-item/${id}`),
};

// ✅ Helper to return full URL for images/static assets
export const assetUrl = (maybePath) => {
  // If no path, return placeholder
  if (!maybePath) return 'https://via.placeholder.com/400x300?text=No+Image';

  // Already a full URL? Return as is
  if (maybePath.startsWith('http://') || maybePath.startsWith('https://')) return maybePath;

  // Normalize path slashes
  let normalized = String(maybePath).replace(/\\/g, '/');
  if (!normalized.startsWith('/')) normalized = '/' + normalized;

  // Return full URL pointing to deployed backend
  return `${API_BASE_URL}${normalized}`;
};
