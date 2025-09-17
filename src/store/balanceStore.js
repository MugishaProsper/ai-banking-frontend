import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

const useBalanceStore = create(
  subscribeWithSelector((set, get) => ({
    // State
    balances: [],
    totalBalance: 0,
    isLoading: false,
    lastUpdated: null,
    selectedCurrency: 'USD',
    
    // Real-time connection status
    isConnected: false,
    connectionError: null,
    
    // Actions
    setBalances: (balances) => {
      const total = balances.reduce((sum, balance) => {
        // Convert to USD for total calculation
        return sum + (balance.available * (balance.usd_rate || 1))
      }, 0)
      
      set({ 
        balances, 
        totalBalance: total,
        lastUpdated: new Date().toISOString()
      })
    },
    
    setLoading: (isLoading) => set({ isLoading }),
    
    setSelectedCurrency: (currency) => set({ selectedCurrency: currency }),
    
    setConnectionStatus: (isConnected, error = null) => set({ 
      isConnected, 
      connectionError: error 
    }),
    
    updateBalance: (currency, newBalance) => {
      const { balances } = get()
      const updatedBalances = balances.map(balance => 
        balance.currency === currency 
          ? { ...balance, ...newBalance, updated_at: new Date().toISOString() }
          : balance
      )
      
      get().setBalances(updatedBalances)
    },
    
    fetchBalances: async () => {
      set({ isLoading: true })
      try {
        const { balanceAPI } = await import('../lib/api')
        const response = await balanceAPI.getBalances()
        const data = response.data
        
        get().setBalances(data.balances)
        
        return data.balances
      } catch (error) {
        console.error('Error fetching balances:', error)
        throw new Error(error.response?.data?.error?.message || 'Failed to fetch balances')
      } finally {
        set({ isLoading: false })
      }
    },
    
    // WebSocket connection for real-time updates
    connectWebSocket: (userId) => {
      const ws = new WebSocket(`ws://localhost:5000/ws/balances/${userId}`)
      
      ws.onopen = () => {
        get().setConnectionStatus(true)
      }
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          switch (data.type) {
            case 'balance_update':
              get().updateBalance(data.currency, data.balance)
              break
            case 'balance_sync':
              get().setBalances(data.balances)
              break
            default:
              console.log('Unknown message type:', data.type)
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        get().setConnectionStatus(false, error.message)
      }
      
      ws.onclose = () => {
        get().setConnectionStatus(false)
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          if (get().isConnected === false) {
            get().connectWebSocket(userId)
          }
        }, 5000)
      }
      
      return ws
    },
    
    // Utility functions
    getBalanceBySymbol: (symbol) => {
      const { balances } = get()
      return balances.find(balance => balance.currency === symbol)
    },
    
    getTotalBalanceInCurrency: (currency = 'USD') => {
      const { balances } = get()
      return balances.reduce((sum, balance) => {
        const rate = currency === 'USD' ? (balance.usd_rate || 1) : 1 // Simplified
        return sum + (balance.available * rate)
      }, 0)
    },
    
    hasInsufficientBalance: (currency, amount) => {
      const balance = get().getBalanceBySymbol(currency)
      return !balance || balance.available < amount
    },
    
    formatBalance: (amount, currency) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD',
        minimumFractionDigits: currency === 'BTC' ? 8 : 2,
        maximumFractionDigits: currency === 'BTC' ? 8 : 2,
      }).format(amount)
    },
  }))
)

export default useBalanceStore