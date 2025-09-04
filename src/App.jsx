import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Accounts from './pages/Accounts'
import AccountDetails from './pages/AccountDetails'
import Transactions from './pages/Transactions'
import Transfers from './pages/Transfers'
import NotFound from './pages/NotFound'

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
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
