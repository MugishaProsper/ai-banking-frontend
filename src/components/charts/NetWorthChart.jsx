import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { 
  CalendarDaysIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'
import { clsx } from 'clsx'
import { format, subDays, subMonths, subYears } from 'date-fns'

// Mock data generator
const generateNetWorthData = (period) => {
  const now = new Date()
  let data = []
  let baseValue = 45000
  
  const periods = {
    '7d': { days: 7, interval: 1, format: 'MMM dd' },
    '30d': { days: 30, interval: 1, format: 'MMM dd' },
    '90d': { days: 90, interval: 3, format: 'MMM dd' },
    '1y': { days: 365, interval: 7, format: 'MMM yyyy' },
    'all': { days: 365 * 2, interval: 14, format: 'MMM yyyy' }
  }
  
  const config = periods[period] || periods['30d']
  
  for (let i = config.days; i >= 0; i -= config.interval) {
    const date = subDays(now, i)
    const randomChange = (Math.random() - 0.5) * 1000
    baseValue += randomChange
    
    // Add some trend
    if (period === '1y' || period === 'all') {
      baseValue += 50 // Slight upward trend
    }
    
    data.push({
      date: format(date, config.format),
      fullDate: date,
      netWorth: Math.max(baseValue, 10000), // Minimum value
      assets: Math.max(baseValue * 1.2, 12000),
      liabilities: Math.max(baseValue * 0.2, 2000),
      cash: Math.max(baseValue * 0.3, 3000),
      investments: Math.max(baseValue * 0.5, 5000),
      crypto: Math.max(baseValue * 0.1, 1000)
    })
  }
  
  return data
}

const TIME_PERIODS = [
  { key: '7d', label: '7D', fullLabel: '7 Days' },
  { key: '30d', label: '1M', fullLabel: '1 Month' },
  { key: '90d', label: '3M', fullLabel: '3 Months' },
  { key: '1y', label: '1Y', fullLabel: '1 Year' },
  { key: 'all', label: 'All', fullLabel: 'All Time' }
]

const CHART_TYPES = [
  { key: 'area', label: 'Area', icon: ChartBarIcon },
  { key: 'line', label: 'Line', icon: ArrowTrendingUpIcon }
]

export default function NetWorthChart() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [chartType, setChartType] = useState('area')
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showBreakdown, setShowBreakdown] = useState(false)
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newData = generateNetWorthData(selectedPeriod)
      setData(newData)
      setIsLoading(false)
    }
    
    fetchData()
  }, [selectedPeriod])
  
  const calculateChange = () => {
    if (data.length < 2) return { amount: 0, percentage: 0, isPositive: true }
    
    const current = data[data.length - 1]?.netWorth || 0
    const previous = data[0]?.netWorth || 0
    const amount = current - previous
    const percentage = previous > 0 ? (amount / previous) * 100 : 0
    
    return {
      amount: Math.abs(amount),
      percentage: Math.abs(percentage),
      isPositive: amount >= 0
    }
  }
  
  const change = calculateChange()
  const currentValue = data[data.length - 1]?.netWorth || 0
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {label}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 dark:text-gray-400 capitalize">
                {entry.dataKey.replace(/([A-Z])/g, ' $1').trim()}:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }
  
  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    }
    
    if (chartType === 'area') {
      return (
        <AreaChart {...commonProps}>
          <defs>
            <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
            {showBreakdown && (
              <>
                <linearGradient id="assetsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="liabilitiesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                </linearGradient>
              </>
            )}
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            className="text-xs text-gray-500 dark:text-gray-400"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            className="text-xs text-gray-500 dark:text-gray-400"
            tick={{ fontSize: 12 }}
            tickFormatter={formatCurrency}
          />
          <Tooltip content={<CustomTooltip />} />
          {showBreakdown && <Legend />}
          
          <Area
            type="monotone"
            dataKey="netWorth"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#netWorthGradient)"
            name="Net Worth"
          />
          
          {showBreakdown && (
            <>
              <Area
                type="monotone"
                dataKey="assets"
                stroke="#10B981"
                strokeWidth={1}
                fill="url(#assetsGradient)"
                name="Assets"
              />
              <Area
                type="monotone"
                dataKey="liabilities"
                stroke="#EF4444"
                strokeWidth={1}
                fill="url(#liabilitiesGradient)"
                name="Liabilities"
              />
            </>
          )}
        </AreaChart>
      )
    }
    
    return (
      <LineChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis 
          dataKey="date" 
          className="text-xs text-gray-500 dark:text-gray-400"
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          className="text-xs text-gray-500 dark:text-gray-400"
          tick={{ fontSize: 12 }}
          tickFormatter={formatCurrency}
        />
        <Tooltip content={<CustomTooltip />} />
        {showBreakdown && <Legend />}
        
        <Line
          type="monotone"
          dataKey="netWorth"
          stroke="#3B82F6"
          strokeWidth={3}
          dot={false}
          name="Net Worth"
        />
        
        {showBreakdown && (
          <>
            <Line
              type="monotone"
              dataKey="assets"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
              name="Assets"
            />
            <Line
              type="monotone"
              dataKey="liabilities"
              stroke="#EF4444"
              strokeWidth={2}
              dot={false}
              name="Liabilities"
            />
          </>
        )}
      </LineChart>
    )
  }
  
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Net Worth
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(currentValue)}
            </span>
            <div className={clsx(
              'flex items-center gap-1 text-sm font-medium',
              change.isPositive 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            )}>
              {change.isPositive ? (
                <ArrowTrendingUpIcon className="h-4 w-4" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4" />
              )}
              <span>
                {change.isPositive ? '+' : '-'}{formatCurrency(change.amount)}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                ({change.percentage.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className={clsx(
              'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
              showBreakdown
                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            )}
          >
            Breakdown
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        {/* Time Period Selector */}
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 p-1">
          {TIME_PERIODS.map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key)}
              className={clsx(
                'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                selectedPeriod === period.key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              {period.label}
            </button>
          ))}
        </div>
        
        {/* Chart Type Selector */}
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 p-1">
          {CHART_TYPES.map((type) => {
            const Icon = type.icon
            return (
              <button
                key={type.key}
                onClick={() => setChartType(type.key)}
                className={clsx(
                  'flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-colors',
                  chartType === type.key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                <Icon className="h-3 w-3" />
                {type.label}
              </button>
            )
          })}
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
      
      {showBreakdown && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-500 dark:text-gray-400">Cash</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(data[data.length - 1]?.cash || 0)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 dark:text-gray-400">Investments</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(data[data.length - 1]?.investments || 0)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 dark:text-gray-400">Crypto</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(data[data.length - 1]?.crypto || 0)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 dark:text-gray-400">Liabilities</div>
              <div className="font-semibold text-red-600 dark:text-red-400">
                -{formatCurrency(data[data.length - 1]?.liabilities || 0)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}