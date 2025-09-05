import { useParams, Link } from 'react-router-dom';
import InteractiveChart from "../../components/InteractiveChart"

const transactions = [
  { id: 't1', date: '2025-09-01', description: 'Coffee', amount: -4.5 },
  { id: 't2', date: '2025-09-01', description: 'Salary', amount: 3200 },
  { id: 't3', date: '2025-09-02', description: 'Ride Share', amount: -16.75 },
]

export default function AccountDetails({ id }) {
  const { accountId } = useParams();
  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Account {accountId}</h1>
          <div className="text-sm text-gray-600">**** 1023 · Checking</div>
        </div>
        <button className='rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors'>
          <Link to="/transfers" className="">Send Amount</Link>
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-4">
          <div className="text-sm text-gray-500">Available Balance</div>
          <div className="mt-1 text-2xl font-bold">$8,420.11</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-4">
          <div className="text-sm text-gray-500">Current Balance</div>
          <div className="mt-1 text-2xl font-bold">$8,590.65</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-4">
          <div className="text-sm text-gray-500">Credit Limit</div>
          <div className="mt-1 text-2xl font-bold">$2,000.00</div>
        </div>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 flex flex-row justify-center w-full">
        <div className='p-2 w-2/3'>
          <InteractiveChart title={"Account Analytics"} />
        </div>
        <div className='border p-4 m-2 rounded-lg border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700'>
          <div className="text-lg font-semibold py-2">Recent Transactions</div>
          <ul className="text-sm space-y-1">
            {transactions.map((t) => (
              <li key={t.id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600">{t.date}</span>
                <span className="flex-1 px-6">{t.description}</span>
                <span className={`font-medium ${t.amount > 0 ? 'text-emerald-600' : ''}`}>
                  {t.amount > 0 ? '+' : ''}${Math.abs(t.amount).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}


