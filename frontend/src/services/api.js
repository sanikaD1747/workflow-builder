import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Workflows
export const workflowAPI = {
  create: (data) => api.post('/workflows', data),
  getAll: () => api.get('/workflows'),
  getById: (id) => api.get(`/workflows/${id}`),
  delete: (id) => api.delete(`/workflows/${id}`),
};

// Runs
export const runAPI = {
  execute: (data) => api.post('/runs', data),
  getAll: () => api.get('/runs'),
  getById: (id) => api.get(`/runs/${id}`),
};

// Health
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
