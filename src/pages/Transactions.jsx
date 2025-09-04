const sample = [
  { id: 't1', date: '2025-09-01', description: 'Grocery', amount: -84.12, account: 'Checking' },
  { id: 't2', date: '2025-09-02', description: 'Electricity', amount: -120.55, account: 'Checking' },
  { id: 't3', date: '2025-09-03', description: 'Salary', amount: 3200.0, account: 'Savings' },
]

export default function Transactions() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Transactions</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <input className="h-9 w-56 rounded border border-gray-200 px-3 text-sm outline-none focus:ring-2 focus:ring-gray-200" placeholder="Search description" />
          <select className="h-9 rounded border border-gray-200 px-3 text-sm outline-none">
            <option>All Accounts</option>
            <option>Checking</option>
            <option>Savings</option>
          </select>
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Account</th>
                <th className="px-4 py-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {sample.map((t) => (
                <tr key={t.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-600">{t.date}</td>
                  <td className="px-4 py-3">{t.description}</td>
                  <td className="px-4 py-3">{t.account}</td>
                  <td className={`px-4 py-3 font-medium ${t.amount > 0 ? 'text-emerald-600' : ''}`}>
                    {t.amount > 0 ? '+' : ''}${Math.abs(t.amount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


