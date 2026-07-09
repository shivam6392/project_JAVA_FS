import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle unauthorized access
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      // Redirect to login if on a protected page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (username, password) => api.post('/auth/register', { username, password }),
  login: (username, password) => api.post('/auth/login', { username, password }),
};

export const accountAPI = {
  createAccount: (accountType) => api.post('/accounts', { accountType }),
  getMyAccounts: () => api.get('/accounts'),
  getBalance: (accountNumber) => api.get(`/accounts/${accountNumber}/balance`),
  deposit: (accountNumber, amount, description) => 
    api.post(`/accounts/${accountNumber}/deposit`, { amount: parseFloat(amount), description }),
  withdraw: (accountNumber, amount, description) => 
    api.post(`/accounts/${accountNumber}/withdraw`, { amount: parseFloat(amount), description }),
  getTransactions: (accountNumber) => api.get(`/accounts/${accountNumber}/transactions`),
};

export default api;
