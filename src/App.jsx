import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Accounts from './pages/account/Accounts'
import AccountDetails from './pages/account/AccountDetails'
import Transactions from './pages/Transactions'
import Transfers from './pages/Transfers'
import NotFound from './pages/NotFound'
import Settings from './pages/Settings'
import Support from './pages/Support'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="accounts/:accountId" element={<AccountDetails />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="transfers" element={<Transfers />} />
          <Route path='settings' element={<Settings />} />
          <Route path='help' element={<Support />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
