import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Inject Authorization header if token is stored
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campussos_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authApi = {
  register: async (studentData) => {
    const res = await api.post('/auth/register', studentData);
    return res.data;
  },
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  adminLogin: async (credentials) => {
    const res = await api.post('/auth/admin-login', credentials);
    return res.data;
  },
  getProfile: async () => {
    const res = await api.get('/auth/profile');
    return res.data;
  },
  demoQuickLogin: async (type = 'student') => {
    const res = await api.get(`/auth/demo-login/${type}`);
    return res.data;
  },
};

export const emergencyApi = {
  trigger: async (locationPayload) => {
    const res = await api.post('/emergency', locationPayload);
    return res.data;
  },
  getAll: async () => {
    const res = await api.get('/emergencies');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/emergency/${id}`);
    return res.data;
  },
  accept: async (id) => {
    const res = await api.put(`/emergency/${id}/accept`);
    return res.data;
  },
  updateStatus: async (id, status) => {
    const res = await api.put(`/emergency/${id}/status`, { status });
    return res.data;
  },
  resolve: async (id, resolutionNotes) => {
    const res = await api.put(`/emergency/${id}/resolve`, { resolutionNotes });
    return res.data;
  },
  streamLocation: async (locationPayload) => {
    const res = await api.post('/location/update', locationPayload);
    return res.data;
  },
};

export const dashboardApi = {
  getStats: async () => {
    const res = await api.get('/dashboard/stats');
    return res.data;
  },
  getLocations: async () => {
    const res = await api.get('/dashboard/locations');
    return res.data;
  },
};

export const responderApi = {
  getAll: async () => {
    const res = await api.get('/responders');
    return res.data;
  },
  simulateMovement: async (responderId, targetLat, targetLng) => {
    const res = await api.post('/responders/simulate-movement', { responderId, targetLat, targetLng });
    return res.data;
  },
};

export const seedApi = {
  resetSeed: async () => {
    const res = await api.post('/seed');
    return res.data;
  },
};

export default api;
