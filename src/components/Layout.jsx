import { NavLink, Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import AIAssistant from './AIAssistant'
import DarkModeToggle from './DarkModeToggle'
import { BanknoteIcon, Bot, CircleDollarSign, LayoutDashboard, LogIn, PersonStanding, SendToBack, Settings } from 'lucide-react';

const sidebarData = [
  { name : "Dashboard", href : "/", icon : <LayoutDashboard/> }
]

function Sidebar() {
  const linkClass = ({ isActive }) =>
    `block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
    }`

  return (
    <aside className="sticky inset-0 w-full min-h-screen bg-gray-200 dark:border-red-700 dark:bg-gray-800 flex flex-col items-center justify-between">
      <div className='w-full'>
        <nav className="px-3 py-2 space-y-1">
          <div className='w-full px-3 py-4'>
            <h1>XNEC</h1>
          </div>
          <NavLink to="/" className={linkClass}>
            <div className="flex items-center gap-3">
              <LayoutDashboard/>
              Dashboard
            </div>
          </NavLink>
          <NavLink to="/accounts" className={linkClass}>
            <div className="flex items-center gap-3">
              <BanknoteIcon/>
              Accounts
            </div>
          </NavLink>
          <NavLink to="/transactions" className={linkClass}>
            <div className="flex items-center gap-3">
              <CircleDollarSign/>
              Transactions
            </div>
          </NavLink>
          <NavLink to="/transfers" className={linkClass}>
            <div className="flex items-center gap-3">
              <SendToBack/>
              Transfers
            </div>
          </NavLink>
        </nav>
      </div>
      <div className='w-full pb-4 px-3'>
        <NavLink to="/settings" className={linkClass}>
          <div className="flex items-center gap-3">
            <Settings />
            Settings
          </div>
        </NavLink>
        <NavLink to="/help" className={linkClass}>
          <div className="flex items-center gap-3">
            <PersonStanding/>
            Profile
          </div>
        </NavLink>
        <NavLink to="/login" className={linkClass}>
          <div className="flex items-center gap-3">
            <LogIn className='w-5 h-5' />
            Logout
          </div>
        </NavLink>
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
            <Bot/>
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
        <main className="mx-auto flex px-6 py-8 w-full">
          <Outlet />
        </main>
      </div>
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  )
}


