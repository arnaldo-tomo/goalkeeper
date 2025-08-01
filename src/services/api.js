import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = __DEV__ 
  ? 'http://localhost:8000/api/v1' 
  : 'https://your-domain.com/api/v1';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor para adicionar token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor para tratar erros
    this.api.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('auth_token');
          await AsyncStorage.removeItem('user_data');
          // Redirecionar para login se necessário
        }
        return Promise.reject(error);
      }
    );
  }

  // 🔐 Auth endpoints
  auth = {
    login: (credentials) => this.api.post('/auth/login', credentials),
    register: (userData) => this.api.post('/auth/register', userData),
    logout: () => this.api.post('/auth/logout'),
    getUser: () => this.api.get('/auth/user'),
    updateProfile: (data) => this.api.put('/auth/profile', data),
  };

  // 🎯 Goals endpoints
  goals = {
    getAll: (params = {}) => this.api.get('/goals', { params }),
    getById: (id) => this.api.get(`/goals/${id}`),
    create: (data) => this.api.post('/goals', data),
    update: (id, data) => this.api.put(`/goals/${id}`, data),
    delete: (id) => this.api.delete(`/goals/${id}`),
    complete: (id) => this.api.post(`/goals/${id}/complete`),
    getAnalytics: (id) => this.api.get(`/goals/${id}/analytics`),
  };

  // 📋 Tasks endpoints
  tasks = {
    getAll: (params = {}) => this.api.get('/tasks', { params }),
    getById: (id) => this.api.get(`/tasks/${id}`),
    create: (data) => this.api.post('/tasks', data),
    update: (id, data) => this.api.put(`/tasks/${id}`, data),
    delete: (id) => this.api.delete(`/tasks/${id}`),
    complete: (id) => this.api.post(`/tasks/${id}/complete`),
    startTimer: (id) => this.api.post(`/tasks/${id}/start-timer`),
    stopTimer: (id) => this.api.post(`/tasks/${id}/stop-timer`),
  };

  // 🔔 Reminders endpoints
  reminders = {
    getAll: (params = {}) => this.api.get('/reminders', { params }),
    create: (data) => this.api.post('/reminders', data),
    update: (id, data) => this.api.put(`/reminders/${id}`, data),
    delete: (id) => this.api.delete(`/reminders/${id}`),
    toggle: (id) => this.api.post(`/reminders/${id}/toggle`),
    getUpcoming: () => this.api.get('/reminders/upcoming'),
  };

  // 📝 Notes endpoints
  notes = {
    getAll: (params = {}) => this.api.get('/notes', { params }),
    getById: (id) => this.api.get(`/notes/${id}`),
    create: (data) => this.api.post('/notes', data),
    update: (id, data) => this.api.put(`/notes/${id}`, data),
    delete: (id) => this.api.delete(`/notes/${id}`),
    toggleFavorite: (id) => this.api.post(`/notes/${id}/favorite`),
    search: (query) => this.api.get('/notes/search', { params: { q: query } }),
  };

  // 📊 Analytics endpoints
  analytics = {
    getDashboard: (period = 30) => this.api.get('/analytics/dashboard', { params: { period } }),
    getProductivity: (period = 30) => this.api.get('/analytics/productivity', { params: { period } }),
    getCategories: () => this.api.get('/analytics/categories'),
    getMood: (period = 30) => this.api.get('/analytics/mood', { params: { period } }),
  };
}

export default new ApiService();