import { Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    console.log('Initial theme check:', { savedTheme, prefersDark })
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-mode', 'dark')
    } else {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute('data-mode', 'light')
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDark
    
    setIsDark(newMode)
    
    if (newMode) {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-mode', 'dark')
      localStorage.setItem('theme', 'dark')
      console.log('Dark theme applied, classes:', document.documentElement.classList.toString())
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute('data-mode', 'light')
      localStorage.setItem('theme', 'light')
      console.log('Light theme applied, classes:', document.documentElement.classList.toString())
    }
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="relative inline-flex items-center h-10 w-20 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300"
      aria-label="Toggle dark mode"
    >
      <span
        className={`flex items-center justify-center h-6 w-6 transform rounded-full transition-transform duration-300 ${
          isDark ? 'translate-x-10' : 'translate-x-1'
        }`}
      >
        {isDark ? (
          <Sun className='w-7 h-7'/>
        ) : (
          <Moon className='w-7 h-7'/>
        )}
      </span>
    </button>
  )
}
