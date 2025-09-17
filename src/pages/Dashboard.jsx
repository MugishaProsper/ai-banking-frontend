import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  DocumentArrowDownIcon,
  PlusIcon,
  BellIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import Button from '../components/ui/Button'
import BalanceCard from '../components/dashboard/BalanceCard'
import QuickActions from '../components/dashboard/QuickActions'
import ActivityFeed from '../components/dashboard/ActivityFeed'
import NetWorthChart from '../components/charts/NetWorthChart'
import InteractiveChart from '../components/InteractiveChart'
import useAuthStore from '../store/authStore'
import useBalanceStore from '../store/balanceStore'

export default function Dashboard() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  
  const { user, isKycVerified, needsKyc } = useAuthStore()
  const { totalBalance, isConnected } = useBalanceStore()
  
  // Mock notifications - replace with real data
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'kyc',
        title: 'Complete Identity Verification',
        message: 'Complete KYC to unlock all features',
        priority: 'high',
        show: needsKyc()
      },
      {
        id: 2,
        type: 'promotion',
        title: 'New Investment Options Available',
        message: 'Explore our new crypto investment products',
        priority: 'medium',
        show: isKycVerified()
      }
    ].filter(n => n.show)
    
    setNotifications(mockNotifications)
  }, [needsKyc, isKycVerified])
  
  return (
    <div className="min-h-screen w-full space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Here's your financial overview for today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
            onClick={() => navigate('/reports')}
          >
            Export
          </Button>
          <Button
            leftIcon={<PlusIcon className="h-4 w-4" />}
            onClick={() => navigate('/transfers/send')}
          >
            New Transaction
          </Button>
        </div>
      </div>
      
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border-l-4 ${
                notification.priority === 'high'
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600'
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex">
                  <BellIcon className={`h-5 w-5 mt-0.5 mr-3 ${
                    notification.priority === 'high' 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-blue-600 dark:text-blue-400'
                  }`} />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {notification.message}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Balance Card */}
      <BalanceCard />
      
      {/* Net Worth Chart */}
      <NetWorthChart />
      
      {/* Quick Actions */}
      <QuickActions />
      
      {/* Activity Feed and Additional Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ActivityFeed limit={6} />
        
        <div className="space-y-6">
          <InteractiveChart
            title="Spending Breakdown"
            type="bar"
            height={300}
          />
          
          <InteractiveChart
            title="Account Distribution"
            type="pie"
            height={300}
            showLegend={true}
          />
        </div>
      </div>
    </div>
  )
}


