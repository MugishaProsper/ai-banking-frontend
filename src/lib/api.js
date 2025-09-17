import axios from 'axios'

// Create axios instance with default config
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await axios.post('/api/auth/refresh', {
            refresh_token: refreshToken
          })
          
          const { access_token } = response.data
          localStorage.setItem('token', access_token)
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/auth/login'
        return Promise.reject(refreshError)
      }
    }
    
    // Handle rate limiting
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after']
      if (retryAfter && !originalRequest._rateLimitRetry) {
        originalRequest._rateLimitRetry = true
        
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(api(originalRequest))
          }, parseInt(retryAfter) * 1000)
        })
      }
    }
    
    return Promise.reject(error)
  }
)

// API service functions
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  verifyMFA: (code) => api.post('/auth/verify-mfa', { code }),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refresh_token: refreshToken }),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  resendMFA: (method) => api.post('/auth/resend-mfa', { method }),
}

export const balanceAPI = {
  getBalances: () => api.get('/v1/accounts/balances'),
  getBalance: (currency) => api.get(`/v1/accounts/balances/${currency}`),
  getTransactions: (params) => api.get('/v1/accounts/transactions', { params }),
}

export const transferAPI = {
  send: (transferData) => api.post('/v1/transfers/send', transferData),
  estimate: (transferData) => api.post('/v1/transfers/estimate', transferData),
  getHistory: (params) => api.get('/v1/transfers', { params }),
  getTransfer: (id) => api.get(`/v1/transfers/${id}`),
}

export const marketAPI = {
  getPrices: (symbols) => api.get('/v1/markets/prices', { params: { symbols: symbols?.join(',') } }),
  getCandles: (symbol, resolution, limit) => api.get(`/v1/markets/${symbol}/candles`, {
    params: { resolution, limit }
  }),
  getOrderBook: (symbol, depth) => api.get(`/v1/markets/${symbol}/orderbook`, {
    params: { depth }
  }),
  getStats: () => api.get('/v1/markets/stats'),
  getTrades: (symbol, limit) => api.get(`/v1/markets/${symbol}/trades`, {
    params: { limit }
  }),
}

export const loanAPI = {
  getProducts: () => api.get('/v1/loans/products'),
  create: (loanData) => api.post('/v1/loans', loanData),
  get: (id) => api.get(`/v1/loans/${id}`),
  getAll: (params) => api.get('/v1/loans', { params }),
  repay: (id, amount) => api.post(`/v1/loans/${id}/repay`, { amount }),
  liquidate: (id) => api.post(`/v1/loans/${id}/liquidate`),
}

export const kycAPI = {
  submit: (formData) => api.post('/kyc/submit', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getStatus: () => api.get('/kyc/status'),
  uploadDocument: (type, file) => {
    const formData = new FormData()
    formData.append('type', type)
    formData.append('file', file)
    return api.post('/kyc/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
}

export const adminAPI = {
  getKYCQueue: (params) => api.get('/admin/kyc/queue', { params }),
  approveKYC: (userId) => api.post(`/admin/kyc/${userId}/approve`),
  rejectKYC: (userId, reason) => api.post(`/admin/kyc/${userId}/reject`, { reason }),
  getAuditLog: (params) => api.get('/admin/audit', { params }),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserDetails: (userId) => api.get(`/admin/users/${userId}`),
}

export default api