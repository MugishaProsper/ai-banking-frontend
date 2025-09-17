import { useState, useEffect } from 'react'
import { 
  ArrowUpIcon,
  ArrowDownIcon,
  CreditCardIcon,
  BanknotesIcon,
  ShoppingCartIcon,
  BuildingLibraryIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline'
import { clsx } from 'clsx'
import { formatDistanceToNow } from 'date-fns'

// Mock activity data - replace with real API calls
const MOCK_ACTIVITIES = [
  {
    id: '1',
    type: 'transfer_received',
    title: 'Money Received',
    description: 'From John Smith',
    amount: 1250.00,
    currency: 'USD',
    status: 'completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    metadata: {
      from: 'John Smith',
      reference: 'Freelance payment'
    }
  },
  {
    id: '2',
    type: 'payment',
    title: 'Online Purchase',
    description: 'Amazon.com',
    amount: -89.99,
    currency: 'USD',
    status: 'completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    metadata: {
      merchant: 'Amazon.com',
      category: 'Shopping'
    }
  },
  {
    id: '3',
    type: 'deposit',
    title: 'Bank Deposit',
    description: 'Salary deposit',
    amount: 3200.00,
    currency: 'USD',
    status: 'completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    metadata: {
      source: 'Employer Direct Deposit'
    }
  },
  {
    id: '4',
    type: 'loan_payment',
    title: 'Loan Payment',
    description: 'Monthly installment',
    amount: -450.00,
    currency: 'USD',
    status: 'completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    metadata: {
      loanId: 'LOAN-001',
      installment: '3/12'
    }
  },
  {
    id: '5',
    type: 'transfer_sent',
    title: 'Money Sent',
    description: 'To Sarah Johnson',
    amount: -75.00,
    currency: 'USD',
    status: 'pending',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    metadata: {
      to: 'Sarah Johnson',
      reference: 'Dinner split'
    }
  },
  {
    id: '6',
    type: 'investment',
    title: 'Investment Purchase',
    description: 'S&P 500 Index Fund',
    amount: -500.00,
    currency: 'USD',
    status: 'completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    metadata: {
      symbol: 'SPY',
      shares: 1.2
    }
  }
]

const getActivityIcon = (type, status) => {
  const iconClass = "h-5 w-5"
  
  switch (type) {
    case 'transfer_received':
    case 'deposit':
      return <ArrowDownIcon className={clsx(iconClass, 'text-green-600')} />
    case 'transfer_sent':
    case 'payment':
      return <ArrowUpIcon className={clsx(iconClass, 'text-red-600')} />
    case 'loan_payment':
      return <BanknotesIcon className={clsx(iconClass, 'text-blue-600')} />
    case 'investment':
      return <BuildingLibraryIcon className={clsx(iconClass, 'text-purple-600')} />
    default:
      return <CreditCardIcon className={clsx(iconClass, 'text-gray-600')} />
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'completed':
      return <CheckCircleIcon className="h-4 w-4 text-green-500" />
    case 'pending':
      return <ClockIcon className="h-4 w-4 text-yellow-500" />
    case 'failed':
      return <XCircleIcon className="h-4 w-4 text-red-500" />
    default:
      return null
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400'
    case 'pending':
      return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'failed':
      return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
    default:
      return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

export default function ActivityFeed({ limit = 6 }) {
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  
  useEffect(() => {
    // Simulate API call
    const fetchActivities = async () => {
      setIsLoading(true)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      let filteredActivities = MOCK_ACTIVITIES
      
      if (filter !== 'all') {
        filteredActivities = MOCK_ACTIVITIES.filter(activity => 
          activity.type === filter
        )
      }
      
      setActivities(filteredActivities.slice(0, limit))
      setIsLoading(false)
    }
    
    fetchActivities()
  }, [filter, limit])
  
  const formatAmount = (amount, currency) => {
    const isPositive = amount > 0
    const absAmount = Math.abs(amount)
    
    return {
      formatted: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
      }).format(absAmount),
      isPositive,
      sign: isPositive ? '+' : '-'
    }
  }
  
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your latest transactions and updates
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Activity</option>
            <option value="transfer_received">Received</option>
            <option value="transfer_sent">Sent</option>
            <option value="payment">Payments</option>
            <option value="deposit">Deposits</option>
          </select>
          
          <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <EllipsisHorizontalIcon className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <CreditCardIcon className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              No activity found for the selected filter
            </p>
          </div>
        ) : (
          activities.map((activity) => {
            const { formatted, isPositive, sign } = formatAmount(activity.amount, activity.currency)
            
            return (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
              >
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getActivityIcon(activity.type, activity.status)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {activity.title}
                    </p>
                    {getStatusIcon(activity.status)}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {activity.description}
                    </p>
                    <span className={clsx(
                      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                      getStatusColor(activity.status)
                    )}>
                      {activity.status}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>
                
                <div className="flex-shrink-0 text-right">
                  <p className={clsx(
                    'text-sm font-semibold',
                    isPositive 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-gray-900 dark:text-white'
                  )}>
                    {sign}{formatted}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
      
      {activities.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
            View All Activity →
          </button>
        </div>
      )}
    </div>
  )
}