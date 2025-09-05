import { ArrowRightLeft, Bitcoin, Blocks, Building2, CheckCircle, CheckCircle2, CheckLine, CreditCard, Currency, Download, Expand, LucideBlocks, PiggyBank, Plus, SendHorizonal, SendToBack, ServerCog, TerminalSquare, Users, Users2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const sampleAccounts = [
  {
    id: 'chk-001',
    name: 'Checking',
    number: '**** 1023',
    balance: 8420.11,
    type: 'checking',
    status: 'active',
    lastActivity: '2 hours ago'
  },
  {
    id: 'sav-002',
    name: 'Savings',
    number: '**** 5591',
    balance: 32800.92,
    type: 'savings',
    status: 'active',
    lastActivity: '1 day ago'
  },
  {
    id: 'cc-003',
    name: 'Credit Card',
    number: '**** 7710',
    balance: -740.55,
    type: 'credit',
    status: 'active',
    lastActivity: '3 hours ago'
  },
  {
    id: 'cr-003',
    name: 'Crypto Wallet',
    number: '**** 7710',
    balance: -740.55,
    type: 'crypto',
    status: 'active',
    lastActivity: '3 hours ago'
  },
  {
    id: 'fam-003',
    name: 'Family Account',
    number: '**** 7710',
    balance: 742.43,
    type: 'family',
    status: 'active',
    lastActivity: '3 hours ago'
  },
  {
    id: 'bus-003',
    name: 'Business Account',
    number: '**** 7710',
    balance: 74209890.43,
    type: 'business',
    status: 'active',
    lastActivity: '3 hours ago'
  },
]

const getAccountIcon = (type) => {
  switch (type) {
    case 'checking':
      return (
        <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-800 dark:bg-transparent flex items-center justify-center">
          <CheckCircle />
        </div>
      )
    case 'savings':
      return (
        <div className="h-10 w-10 rounded-lg bg-green-100 text-green-800 dark:bg-transparent flex items-center justify-center">
          <PiggyBank />
        </div>
      )
    case 'credit':
      return (
        <div className="h-10 w-10 rounded-lg bg-purple-100 text-purple-800 dark:bg-transparent flex items-center justify-center">
          <CreditCard />
        </div>
      )
    case 'crypto':
      return (
        <div className="h-10 w-10 rounded-lg bg-indigo-100 text-indigo-800 dark:bg-transparent flex items-center justify-center">
          <Bitcoin />
        </div>
      )
    case 'family':
      return (
        <div className="h-10 w-10 rounded-lg bg-indigo-100 text-yellow-800 dark:bg-transparent flex items-center justify-center">
          <Users />
        </div>
      )
    case 'business':
      return (
        <div className="h-10 w-10 rounded-lg bg-pink-100 text-pink-800 dark:bg-transparent flex items-center justify-center">
          <Building2 />
        </div>
      )
    default:
      return null
  }
}

const getStatusBadge = (status) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800'
      }`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'active' ? 'bg-green-400' : 'bg-gray-400'
        }`}></span>
      {status === 'active' ? 'Active' : 'Inactive'}
    </span>
  )
}

export default function Accounts() {
  return (
    <div className="w-full min-h-screen space-y-8">
      <div className="flex items-center justify-between">
        <div className='flex flex-col'>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Accounts</h1>
          <p className="mt-1 text-gray-600">Manage your accounts and view balances</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <button className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Export
          </button>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            New Account
          </button>
        </div>
      </div>
      {/* Summary Stats */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-500">3</p>
            <p className="text-sm text-gray-600">Total Accounts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">$41,280.48</p>
            <p className="text-sm text-gray-600">Net Worth</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">$32,800.92</p>
            <p className="text-sm text-gray-600">Total Savings</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">$740.55</p>
            <p className="text-sm text-gray-600">Credit Used</p>
          </div>
        </div>
      </div>
      {/* Account Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sampleAccounts.map((account) => (
          <div key={account.id} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              {getAccountIcon(account.type)}
              {getStatusBadge(account.status)}
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{account.name}</h3>
              <p className="text-sm text-gray-500">{account.number}</p>
            </div>

            <div className="mb-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${account.balance.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Last activity: {account.lastActivity}</p>
            </div>

            <div className="flex gap-2">
              <Link
                to={`/accounts/${account.id}`}
                className="flex-1 text-center rounded-lg  border-gray-200 px-3 py-2 text-sm font-semibold dark:bg-blue-700 text-blue-700 dark:text-white transition-colors"
              >
                View Details
              </Link>
              <button className="rounded-lg px-3 py-2 text-sm font-medium text-gray-200 hover:bg-gray-50 hover:text-gray-700 transition-colors">
                <ArrowRightLeft />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


