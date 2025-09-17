import { createContext, useContext, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import useBalanceStore from '../../store/balanceStore'
import useMarketStore from '../../store/marketStore'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default function AuthProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  
  const { 
    isAuthenticated, 
    user, 
    token, 
    refreshAccessToken,
    logout,
    isKycVerified,
    needsKyc
  } = useAuthStore()
  
  const { connectWebSocket: connectBalanceWS } = useBalanceStore()
  const { connectWebSocket: connectMarketWS } = useMarketStore()
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/auth/login',
    '/auth/signup',
    '/auth/2fa',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-email',
    '/terms',
    '/privacy',
    '/security'
  ]
  
  // Routes that require KYC verification
  const kycRequiredRoutes = [
    '/lend',
    '/loans',
    '/invest',
    '/markets',
    '/admin'
  ]
  
  const isPublicRoute = publicRoutes.includes(location.pathname)
  const requiresKyc = kycRequiredRoutes.some(route => location.pathname.startsWith(route))
  
  useEffect(() => {
    // Handle authentication state changes
    if (!isAuthenticated && !isPublicRoute) {
      // Redirect to login if not authenticated and trying to access protected route
      navigate('/auth/login', { 
        state: { from: location.pathname } 
      })
    } else if (isAuthenticated && isPublicRoute) {
      // Redirect to dashboard if authenticated and on public route
      const from = location.state?.from || '/'
      navigate(from, { replace: true })
    } else if (isAuthenticated && requiresKyc && needsKyc()) {
      // Redirect to KYC if trying to access KYC-required route without verification
      navigate('/kyc', { 
        state: { from: location.pathname } 
      })
    }
  }, [isAuthenticated, isPublicRoute, requiresKyc, navigate, location, needsKyc])
  
  useEffect(() => {
    // Set up WebSocket connections when authenticated
    if (isAuthenticated && user) {
      const balanceWS = connectBalanceWS(user.id)
      const marketWS = connectMarketWS()
      
      return () => {
        balanceWS?.close()
        marketWS?.close()
      }
    }
  }, [isAuthenticated, user, connectBalanceWS, connectMarketWS])
  
  useEffect(() => {
    // Set up token refresh interval
    if (isAuthenticated && token) {
      const refreshInterval = setInterval(async () => {
        try {
          await refreshAccessToken()
        } catch (error) {
          console.error('Token refresh failed:', error)
          logout()
          navigate('/auth/login')
        }
      }, 15 * 60 * 1000) // Refresh every 15 minutes
      
      return () => clearInterval(refreshInterval)
    }
  }, [isAuthenticated, token, refreshAccessToken, logout, navigate])
  
  // Add token to API requests
  useEffect(() => {
    if (token) {
      // Set default authorization header for axios
      const api = require('../../lib/api').api
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }, [token])
  
  const contextValue = {
    isAuthenticated,
    user,
    token,
    isKycVerified: isKycVerified(),
    needsKyc: needsKyc(),
    logout: () => {
      logout()
      navigate('/auth/login')
    }
  }
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}