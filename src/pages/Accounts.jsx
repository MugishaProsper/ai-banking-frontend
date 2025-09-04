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
]

const getAccountIcon = (type) => {
  switch (type) {
    case 'checking':
      return (
        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
          <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
      )
    case 'savings':
      return (
        <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
          <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
      )
    case 'credit':
      return (
        <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
          <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
          <p className="mt-1 text-gray-600">Manage your accounts and view balances</p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-sm bg-gray-200 px-4 py-2 dark:text-black flex flex-row items-center justify-between">
            <svg className="h-4 w-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </button>
          <button className="rounded-sm bg-blue-600 px-4 py-2 text-white flex flex-row items-center justify-between">
            <svg className="h-4 w-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Open Account
          </button>
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
                className="flex-1 text-center rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
              >
                View Details
              </Link>
              <button className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">3</p>
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
    </div>
  )
}


