import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

const useMarketStore = create(
  subscribeWithSelector((set, get) => ({
    // Market data state
    prices: {},
    candles: {},
    orderBook: {},
    trades: [],
    marketStats: {},
    
    // UI state
    selectedSymbol: 'BTC-USD',
    selectedTimeframe: '1h',
    isLoading: false,
    
    // WebSocket connection
    wsConnection: null,
    isConnected: false,
    
    // Actions
    setPrices: (prices) => set({ prices }),
    
    setCandles: (symbol, timeframe, candles) => set(state => ({
      candles: {
        ...state.candles,
        [`${symbol}-${timeframe}`]: candles
      }
    })),
    
    setOrderBook: (symbol, orderBook) => set(state => ({
      orderBook: {
        ...state.orderBook,
        [symbol]: orderBook
      }
    })),
    
    addTrade: (trade) => set(state => ({
      trades: [trade, ...state.trades.slice(0, 99)] // Keep last 100 trades
    })),
    
    setMarketStats: (stats) => set({ marketStats: stats }),
    
    setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
    
    setSelectedTimeframe: (timeframe) => set({ selectedTimeframe: timeframe }),
    
    setLoading: (isLoading) => set({ isLoading }),
    
    // Fetch market data
    fetchPrices: async (symbols = []) => {
      try {
        const symbolsQuery = symbols.length > 0 ? `?symbols=${symbols.join(',')}` : ''
        const response = await fetch(`/api/v1/markets/prices${symbolsQuery}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch prices')
        }
        
        const data = await response.json()
        get().setPrices(data.prices)
        
        return data.prices
      } catch (error) {
        console.error('Error fetching prices:', error)
        throw error
      }
    },
    
    fetchCandles: async (symbol, timeframe = '1h', limit = 100) => {
      set({ isLoading: true })
      try {
        const response = await fetch(
          `/api/v1/markets/${symbol}/candles?resolution=${timeframe}&limit=${limit}`
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch candles')
        }
        
        const data = await response.json()
        get().setCandles(symbol, timeframe, data.candles)
        
        return data.candles
      } catch (error) {
        console.error('Error fetching candles:', error)
        throw error
      } finally {
        set({ isLoading: false })
      }
    },
    
    fetchOrderBook: async (symbol, depth = 20) => {
      try {
        const response = await fetch(`/api/v1/markets/${symbol}/orderbook?depth=${depth}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch order book')
        }
        
        const data = await response.json()
        get().setOrderBook(symbol, data)
        
        return data
      } catch (error) {
        console.error('Error fetching order book:', error)
        throw error
      }
    },
    
    fetchMarketStats: async () => {
      try {
        const response = await fetch('/api/v1/markets/stats')
        
        if (!response.ok) {
          throw new Error('Failed to fetch market stats')
        }
        
        const data = await response.json()
        get().setMarketStats(data)
        
        return data
      } catch (error) {
        console.error('Error fetching market stats:', error)
        throw error
      }
    },
    
    // WebSocket connection for real-time updates
    connectWebSocket: () => {
      if (get().wsConnection) {
        get().wsConnection.close()
      }
      
      const ws = new WebSocket('ws://localhost:5000/ws/markets')
      
      ws.onopen = () => {
        set({ isConnected: true, wsConnection: ws })
        
        // Subscribe to price updates
        ws.send(JSON.stringify({
          type: 'subscribe',
          channels: ['prices', 'trades', 'orderbook']
        }))
      }
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          switch (data.type) {
            case 'price_update':
              get().setPrices(prevPrices => ({
                ...prevPrices,
                [data.symbol]: data.price
              }))
              break
              
            case 'trade':
              get().addTrade(data.trade)
              break
              
            case 'orderbook_update':
              get().setOrderBook(data.symbol, data.orderbook)
              break
              
            case 'candle_update':
              // Update the latest candle
              const { symbol, timeframe, candle } = data
              const key = `${symbol}-${timeframe}`
              const currentCandles = get().candles[key] || []
              
              if (currentCandles.length > 0) {
                const updatedCandles = [...currentCandles]
                updatedCandles[updatedCandles.length - 1] = candle
                get().setCandles(symbol, timeframe, updatedCandles)
              }
              break
              
            default:
              console.log('Unknown market message type:', data.type)
          }
        } catch (error) {
          console.error('Error parsing market WebSocket message:', error)
        }
      }
      
      ws.onerror = (error) => {
        console.error('Market WebSocket error:', error)
        set({ isConnected: false })
      }
      
      ws.onclose = () => {
        set({ isConnected: false, wsConnection: null })
        
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          if (!get().isConnected) {
            get().connectWebSocket()
          }
        }, 5000)
      }
      
      return ws
    },
    
    disconnectWebSocket: () => {
      const { wsConnection } = get()
      if (wsConnection) {
        wsConnection.close()
        set({ wsConnection: null, isConnected: false })
      }
    },
    
    // Utility functions
    getCurrentPrice: (symbol) => {
      const { prices } = get()
      return prices[symbol] || null
    },
    
    getPriceChange: (symbol, timeframe = '24h') => {
      const { marketStats } = get()
      return marketStats[symbol]?.[`change_${timeframe}`] || 0
    },
    
    formatPrice: (price, symbol) => {
      if (!price) return 'N/A'
      
      const decimals = symbol.includes('BTC') ? 8 : 2
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(price)
    },
    
    getMarketCap: () => {
      const { marketStats } = get()
      return marketStats.total_market_cap || 0
    },
    
    get24hVolume: () => {
      const { marketStats } = get()
      return marketStats.total_volume_24h || 0
    },
  }))
)

export default useMarketStore