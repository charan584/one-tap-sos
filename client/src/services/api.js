import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Inject Authorization header with role-aware token routing
api.interceptors.request.use((config) => {
  let token = null;

  // If this is an emergency trigger or student action, prefer student token
  if (config.url === '/emergency' && config.method === 'post') {
    token = localStorage.getItem('campussos_student_token') || localStorage.getItem('campussos_token');
    config.headers['x-user-role'] = 'student';
  } else if (
    config.url?.startsWith('/dashboard') ||
    config.url?.includes('/accept') ||
    config.url?.includes('/resolve') ||
    config.url?.startsWith('/responders')
  ) {
    token = localStorage.getItem('campussos_admin_token') || localStorage.getItem('campussos_token');
    config.headers['x-user-role'] = 'admin';
  } else {
    token =
      localStorage.getItem('campussos_token') ||
      localStorage.getItem('campussos_student_token') ||
      localStorage.getItem('campussos_admin_token');
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authApi = {
  sendRegisterOtp: async (email, name) => {
    const res = await api.post('/auth/send-register-otp', { email, name });
    return res.data;
  },
  register: async (studentData) => {
    const res = await api.post('/auth/register', studentData);
    return res.data;
  },
  sendForgotPasswordOtp: async (email) => {
    const res = await api.post('/auth/send-forgot-password-otp', { email });
    return res.data;
  },
  verifyForgotPasswordOtp: async (data) => {
    const res = await api.post('/auth/verify-forgot-password-otp', data);
    return res.data;
  },
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  sendAdminLoginOtp: async (credentials) => {
    const res = await api.post('/auth/send-admin-login-otp', credentials);
    return res.data;
  },
  verifyAdminLoginOtp: async (data) => {
    const res = await api.post('/auth/verify-admin-login-otp', data);
    return res.data;
  },
  sendAdminRegisterOtp: async (data) => {
    const res = await api.post('/auth/send-admin-register-otp', data);
    return res.data;
  },
  verifyAdminRegisterOtp: async (data) => {
    const res = await api.post('/auth/verify-admin-register-otp', data);
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
  updateLiveLocation: async (locationPayload) => {
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
