import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthProvider from './components/auth/AuthProvider'
import Layout from './components/layout/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Accounts from './pages/account/Accounts'
import AccountDetails from './pages/account/AccountDetails'
import Transactions from './pages/Transactions'
import Transfers from './pages/Transfers'
import Settings from './pages/Settings'
import Support from './pages/Support'
import NotFound from './pages/NotFound'

// Auth pages
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import TwoFactorPage from './pages/auth/TwoFactorPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route path="/auth/2fa" element={<TwoFactorPage />} />
          
          {/* Protected App Routes */}
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="accounts/:accountId" element={<AccountDetails />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="transfers" element={<Transfers />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Support />} />
          </Route>
          
          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
