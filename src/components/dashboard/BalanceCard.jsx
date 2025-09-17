import { useState, useEffect } from 'react'
import { 
  EyeIcon, 
  EyeSlashIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  BanknotesIcon 
} from '@heroicons/react/24/outline'
import { clsx } from 'clsx'
import useBalanceStore from '../../store/balanceStore'

export default function BalanceCard({ className = '' }) {
  const [showBalance, setShowBalance] = useState(true)
  const [selectedCurrency, setSelectedCurrency] = useState('USD')
  
  const { 
    totalBalance, 
    balances, 
    isLoading, 
    lastUpdated, 
    isConnected,
    fetchBalances 
  } = useBalanceStore()
  
  useEffect(() => {
    // Fetch balances on component mount
    fetchBalances().catch(console.error)
  }, [fetchBalances])
  
  // Calculate 24h change (mock data for demo)
  const change24h = 2.5 // This would come from your API
  const isPositive = change24h >= 0
  
  const formatBalance = (amount) => {
    if (!showBalance) return '••••••'
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0)
  }
  
  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return 'Never'
    
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString()
  }
  
  return (
    <div className={clsx(
      'bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg',
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <BanknotesIcon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-100">Total Balance</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-200">
                {isConnected ? '🟢 Live' : '🔴 Offline'}
              </span>
              {isLoading && (
                <div className="animate-spin rounded-full h-3 w-3 border border-white/30 border-t-white" />
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="bg-white/20 border border-white/30 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="BTC">BTC</option>
          </select>
          
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            title={showBalance ? 'Hide balance' : 'Show balance'}
          >
            {showBalance ? (
              <EyeSlashIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="text-3xl font-bold">
            {formatBalance(totalBalance)}
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <div className={clsx(
              'flex items-center gap-1 text-sm',
              isPositive ? 'text-green-200' : 'text-red-200'
            )}>
              {isPositive ? (
                <ArrowTrendingUpIcon className="h-4 w-4" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4" />
              )}
              <span className="font-medium">
                {isPositive ? '+' : ''}{change24h}%
              </span>
            </div>
            <span className="text-blue-200 text-sm">24h</span>
          </div>
        </div>
        
        {/* Balance Breakdown */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            {balances.slice(0, 3).map((balance) => (
              <div key={balance.currency} className="text-center">
                <div className="text-blue-100">{balance.currency}</div>
                <div className="font-medium">
                  {showBalance 
                    ? formatBalance(balance.available)
                    : '••••'
                  }
                </div>
              </div>
            ))}
            {balances.length > 3 && (
              <div className="text-blue-200">
                +{balances.length - 3} more
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-blue-200 pt-2 border-t border-white/20">
          <span>Last updated: {formatLastUpdated(lastUpdated)}</span>
          <button
            onClick={() => fetchBalances()}
            disabled={isLoading}
            className="hover:text-white transition-colors disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  )
}