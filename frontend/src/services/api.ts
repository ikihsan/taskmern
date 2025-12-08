import axios from 'axios';
import { AUTH_STORAGE } from '../context/AuthContext';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
});

api.interceptors.request.use((config) => {
  if (typeof window === 'undefined') {
    return config;
  }

  try {
    const stored = localStorage.getItem(AUTH_STORAGE);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }
  } catch (error) {
    console.warn('Auth token parse failed', error);
  }
  return config;
});

export default api;
