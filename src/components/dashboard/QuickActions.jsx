import { useState } from 'react'
import { 
  PaperAirplaneIcon,
  ArrowDownOnSquareIcon,
  ArrowsRightLeftIcon,
  CreditCardIcon,
  BanknotesIcon,
  ChartBarIcon,
  PlusIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import Modal from '../ui/Modal'

const QUICK_ACTIONS = [
  {
    id: 'send',
    title: 'Send Money',
    description: 'Transfer to anyone',
    icon: PaperAirplaneIcon,
    color: 'from-blue-500 to-blue-600',
    route: '/transfers/send'
  },
  {
    id: 'receive',
    title: 'Receive',
    description: 'Get payment details',
    icon: ArrowDownOnSquareIcon,
    color: 'from-green-500 to-green-600',
    route: '/transfers/receive'
  },
  {
    id: 'convert',
    title: 'Convert',
    description: 'Exchange currencies',
    icon: ArrowsRightLeftIcon,
    color: 'from-purple-500 to-purple-600',
    route: '/convert'
  },
  {
    id: 'pay-bill',
    title: 'Pay Bills',
    description: 'Utilities & more',
    icon: CreditCardIcon,
    color: 'from-orange-500 to-orange-600',
    route: '/bills'
  },
  {
    id: 'borrow',
    title: 'Borrow',
    description: 'Get a loan',
    icon: BanknotesIcon,
    color: 'from-red-500 to-red-600',
    route: '/lend'
  },
  {
    id: 'invest',
    title: 'Invest',
    description: 'Grow your money',
    icon: ChartBarIcon,
    color: 'from-indigo-500 to-indigo-600',
    route: '/invest'
  },
  {
    id: 'add-account',
    title: 'Add Account',
    description: 'Link new account',
    icon: PlusIcon,
    color: 'from-gray-500 to-gray-600',
    route: '/accounts/add'
  },
  {
    id: 'deposit',
    title: 'Deposit',
    description: 'Add funds',
    icon: BuildingLibraryIcon,
    color: 'from-teal-500 to-teal-600',
    route: '/deposit'
  }
]

export default function QuickActions() {
  const [selectedAction, setSelectedAction] = useState(null)
  const navigate = useNavigate()
  
  const handleActionClick = (action) => {
    if (action.route) {
      navigate(action.route)
    } else {
      setSelectedAction(action)
    }
  }
  
  const closeModal = () => {
    setSelectedAction(null)
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Common tasks and operations
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/actions')}
        >
          View All
        </Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon
          
          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className="group relative overflow-hidden rounded-xl p-4 text-left transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-200`} />
              
              <div className="relative">
                <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${action.color} text-white mb-3 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="h-5 w-5" />
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                    {action.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                    {action.description}
                  </p>
                </div>
              </div>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-gray-200 dark:group-hover:border-gray-600 transition-colors duration-200" />
            </button>
          )
        })}
      </div>
      
      {/* Action Modal */}
      <Modal
        isOpen={!!selectedAction}
        onClose={closeModal}
        title={selectedAction?.title}
        size="md"
      >
        {selectedAction && (
          <div className="text-center py-8">
            <div className={`inline-flex p-4 rounded-full bg-gradient-to-br ${selectedAction.color} text-white mb-4`}>
              <selectedAction.icon className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {selectedAction.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This feature is coming soon! We're working hard to bring you the best banking experience.
            </p>
            <Button onClick={closeModal}>
              Got it
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}