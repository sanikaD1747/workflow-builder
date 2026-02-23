import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
