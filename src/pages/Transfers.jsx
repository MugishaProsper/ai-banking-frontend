import { useState } from 'react'

export default function Transfers() {
  const [formData, setFormData] = useState({
    fromAccount: 'chk-001',
    toAccount: 'sav-002',
    amount: '',
    memo: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const accounts = [
    { id: 'chk-001', name: 'Checking', number: '**** 1023', balance: 8420.11 },
    { id: 'sav-002', name: 'Savings', number: '**** 5591', balance: 32800.92 }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.amount || parseFloat(formData.amount) <= 0) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      alert('Transfer submitted successfully!')
      setFormData({ ...formData, amount: '', memo: '' })
    }, 2000)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getAccountDisplay = (accountId) => {
    const account = accounts.find(acc => acc.id === accountId)
    return account ? `${account.name} (${account.number})` : ''
  }

  const getAccountBalance = (accountId) => {
    const account = accounts.find(acc => acc.id === accountId)
    return account ? account.balance : 0
  }

  const isValidAmount = formData.amount && parseFloat(formData.amount) > 0 && parseFloat(formData.amount) <= getAccountBalance(formData.fromAccount)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transfers</h1>
          <p className="mt-1 text-gray-600">Move money between your accounts</p>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          <svg className="h-4 w-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Transfer History
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Transfer Form */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">New Transfer</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    From Account
                  </label>
                  <select
                    value={formData.fromAccount}
                    onChange={(e) => handleInputChange('fromAccount', e.target.value)}
                    className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    {accounts.map(account => (
                      <option key={account.id} value={account.id}>
                        {account.name} (${account.balance.toLocaleString()})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500">
                    Available: ${getAccountBalance(formData.fromAccount).toLocaleString()}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    To Account
                  </label>
                  <select
                    value={formData.toAccount}
                    onChange={(e) => handleInputChange('toAccount', e.target.value)}
                    className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    {accounts.map(account => (
                      <option key={account.id} value={account.id}>
                        {account.name} (${account.balance.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="w-full h-11 rounded-lg border border-gray-200 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    step="0.01"
                    min="0.01"
                    max={getAccountBalance(formData.fromAccount)}
                  />
                </div>
                {formData.amount && !isValidAmount && (
                  <p className="text-xs text-red-600">
                    Amount must be greater than 0 and not exceed available balance
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Memo (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Monthly savings transfer"
                  value={formData.memo}
                  onChange={(e) => handleInputChange('memo', e.target.value)}
                  className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={!isValidAmount || isSubmitting}
                className="w-full h-11 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Submit Transfer'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Transfer Summary */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transfer Summary</h3>

            {formData.amount && isValidAmount ? (
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">From:</span>
                  <span className="font-medium">{getAccountDisplay(formData.fromAccount)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium">{getAccountDisplay(formData.toAccount)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium text-lg text-gray-900">${parseFloat(formData.amount).toLocaleString()}</span>
                </div>

                {formData.memo && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Memo:</span>
                    <span className="font-medium">{formData.memo}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">New Balance:</span>
                    <span className="font-medium text-green-600">
                      ${(getAccountBalance(formData.fromAccount) - parseFloat(formData.amount)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Enter transfer details to see summary</p>
            )}
          </div>

          {/* Quick Transfer Options */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Transfers</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleInputChange('amount', '100')}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-gray-900">$100 to Savings</div>
                <div className="text-sm text-gray-500">Monthly savings goal</div>
              </button>

              <button
                onClick={() => handleInputChange('amount', '500')}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-gray-900">$500 to Savings</div>
                <div className="text-sm text-gray-500">Emergency fund</div>
              </button>

              <button
                onClick={() => handleInputChange('amount', '1000')}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-gray-900">$1,000 to Savings</div>
                <div className="text-sm text-gray-500">Investment deposit</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


