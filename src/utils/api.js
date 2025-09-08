import axios from 'axios';

// Your deployed backend URL
const API_BASE_URL = 'https://backend-render-l8re.onrender.com';

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token if present
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const { token } = JSON.parse(user);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  // Ensure correct Content-Type: for FormData let the browser set it
  if (config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers['Content-Type'];
    }
  } else {
    if (config.headers) {
      config.headers['Content-Type'] = 'application/json';
    } else {
      config.headers = { 'Content-Type': 'application/json' };
    }
  }
  return config;
});

// API Endpoints
export const itemsAPI = {
  getAllItems: () => api.get('/items'),
  reportItem: (itemData) => api.post('/report-item', itemData),
  login: (email, password) => api.post('/admin/login', { email, password }),
  getAdminItems: () => api.get('/admin/items'),
  addItem: (itemData) => api.post('/admin/add-item', itemData),
  claimItem: (id, claimData) => api.put(`/admin/items/${id}/claim`, claimData),
  getReportedItems: () => api.get('/admin/reported-items'),
  approveReportedItem: (id) => api.post(`/admin/approve-reported-item/${id}`),
};

// Generate full URL for uploaded images
export const assetUrl = (maybePath) => {
  // Return your own backend-hosted default image if no path provided
  if (!maybePath) return `${API_BASE_URL}/uploads/default.svg`;

  // If already fully qualified URL, return as is
  if (maybePath.startsWith('http://') || maybePath.startsWith('https://'))
    return maybePath;

  // Normalize slashes
  let normalized = String(maybePath).replace(/\\/g, '/');

  // Ensure path starts with /uploads/
  if (!normalized.startsWith('/uploads/')) {
    normalized = '/uploads/' + normalized.replace(/^\/+/, '');
  }

  return `${API_BASE_URL}${normalized}`;
};
