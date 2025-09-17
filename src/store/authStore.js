import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      mfaRequired: false,
      kycStatus: 'PENDING', // pending, verified, rejected, expired
      
      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setTokens: (token, refreshToken) => set({ 
        token, 
        refreshToken,
        isAuthenticated: !!token 
      }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setMfaRequired: (mfaRequired) => set({ mfaRequired }),
      
      setKycStatus: (kycStatus) => set({ kycStatus }),
      
      login: async (credentials) => {
        set({ isLoading: true })
        try {
          const { authAPI } = await import('../lib/api')
          const response = await authAPI.login(credentials)
          const data = response.data
          
          if (data.mfa_required) {
            set({ mfaRequired: true, isLoading: false })
            return { mfaRequired: true }
          }
          
          set({
            user: data.user,
            token: data.access_token,
            refreshToken: data.refresh_token,
            isAuthenticated: true,
            isLoading: false,
            kycStatus: data.user.kyc_status || 'pending'
          })
          
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          throw new Error(error.response?.data?.error?.message || 'Login failed')
        }
      },
      
      verifyMfa: async (code) => {
        set({ isLoading: true })
        try {
          const { authAPI } = await import('../lib/api')
          const response = await authAPI.verifyMFA(code)
          const data = response.data
          
          set({
            user: data.user,
            token: data.access_token,
            refreshToken: data.refresh_token,
            isAuthenticated: true,
            mfaRequired: false,
            isLoading: false,
            kycStatus: data.user.kyc_status || 'PENDING'
          })
          
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          throw new Error(error.response?.data?.error?.message || 'MFA verification failed')
        }
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          mfaRequired: false,
          kycStatus: 'PENDING'
        })
      },
      
      refreshAccessToken: async () => {
        const { refreshToken } = get()
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }
        
        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
          })
          
          if (!response.ok) {
            throw new Error('Token refresh failed')
          }
          
          const data = await response.json()
          
          set({
            token: data.access_token,
            refreshToken: data.refresh_token || refreshToken,
          })
          
          return data.access_token
        } catch (error) {
          // If refresh fails, logout user
          get().logout()
          throw error
        }
      },
      
      updateProfile: (updates) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, ...updates } })
        }
      },
      
      // Utility functions
      hasRole: (role) => {
        const { user } = get()
        return user?.roles?.includes(role) || false
      },
      
      isKycVerified: () => {
        const { kycStatus } = get()
        return kycStatus === 'VERIFIED'
      },
      
      needsKyc: () => {
        const { kycStatus } = get()
        return ['PENDING', 'REJECTED', 'EXPIRED'].includes(kycStatus)
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        kycStatus: state.kycStatus,
      }),
    }
  )
)

export default useAuthStore