import { NavLink, Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import AIAssistant from './AIAssistant'
import DarkModeToggle from './DarkModeToggle'

function Sidebar() {
  const linkClass = ({ isActive }) =>
    `block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
    }`

  return (
    <aside className="sticky inset-0 w-full min-h-screen bg-gray-200 dark:border-red-700 dark:bg-gray-800 flex flex-col items-center justify-between">
      <div className='w-full'>
        <div className="px-4 py-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">xnec</span>
          </div>
        </div>
        <nav className="px-3 py-2 space-y-1">
          <NavLink to="/" end className={linkClass}>
            <div className="flex items-center gap-3">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              Dashboard
            </div>
          </NavLink>
          <NavLink to="/accounts" className={linkClass}>
            <div className="flex items-center gap-3">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Accounts
            </div>
          </NavLink>
          <NavLink to="/transactions" className={linkClass}>
            <div className="flex items-center gap-3">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Transactions
            </div>
          </NavLink>
          <NavLink to="/transfers" className={linkClass}>
            <div className="flex items-center gap-3">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Transfers
            </div>
          </NavLink>
        </nav>
      </div>
      <div className='border w-full'>
        <NavLink to="/settings" className={linkClass}>
          <div className="flex items-center gap-3">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Settings
          </div>
        </NavLink>
        <NavLink to="/help" className={linkClass}>
          <div className="flex items-center gap-3">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Help & Support
          </div>
        </NavLink>
        <div>
          <NavLink to="/login" className={linkClass}>
            <div className="flex items-center gap-3">
              Logout
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
          </NavLink>
        </div>
      </div>
    </aside>
  )
}

function Header({ onOpenAI }) {
  const [currentTheme, setCurrentTheme] = useState('light')

  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-mode') === 'dark'
      setCurrentTheme(isDark ? 'dark' : 'light')
    }

    checkTheme()

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-mode']
    })

    return () => observer.disconnect()
  }, [])

  return (
    <header className="sticky inset-0 border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-800/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="text-lg font-medium text-gray-900 dark:text-white">Welcome back, John</div>
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenAI}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            AI Assistant
          </button>
          <DarkModeToggle />
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-medium">
            JD
          </div>
        </div>
      </div>
    </header>
  )
}

export default function Layout() {
  const [isAIOpen, setIsAIOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-row items-top w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className='w-72'>
        <Sidebar />
      </div>
      <div className="flex flex-col w-full border-r border-gray-200">
        <Header onOpenAI={() => setIsAIOpen(true)} />
        <main className="mx-auto flex px-6 py-8">
          <Outlet />
        </main>
      </div>
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  )
}


