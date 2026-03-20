import axios from 'axios';

// The base API client configured for the Go backend
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// We can attach JWT interceptors here when auth is fully implemented
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dinevra_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
