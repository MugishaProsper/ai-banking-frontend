import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DevicePhoneMobileIcon, KeyIcon } from '@heroicons/react/24/outline'
import Button from '../../components/ui/Button'
import Toast from '../../components/ui/Toast'
import useAuthStore from '../../store/authStore'

export default function TwoFactorPage() {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, type: '', message: '' })
  const [resendCooldown, setResendCooldown] = useState(0)
  const [method, setMethod] = useState('totp') // totp or sms
  
  const inputRefs = useRef([])
  const navigate = useNavigate()
  const { verifyMfa, mfaRequired } = useAuthStore()
  
  useEffect(() => {
    // Redirect if MFA is not required
    if (!mfaRequired) {
      navigate('/auth/login')
    }
  }, [mfaRequired, navigate])
  
  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])
  
  useEffect(() => {
    // Countdown for resend button
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])
  
  const handleInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return // Only allow digits
    
    const newCode = [...code]
    newCode[index] = value.slice(-1) // Only take the last digit
    setCode(newCode)
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
    
    // Auto-submit when all fields are filled
    if (newCode.every(digit => digit) && newCode.join('').length === 6) {
      handleSubmit(newCode.join(''))
    }
  }
  
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Focus previous input on backspace
      inputRefs.current[index - 1]?.focus()
    }
    
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }
  
  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    
    if (pastedData.length === 6) {
      const newCode = pastedData.split('')
      setCode(newCode)
      handleSubmit(pastedData)
    }
  }
  
  const handleSubmit = async (codeString = null) => {
    const verificationCode = codeString || code.join('')
    
    if (verificationCode.length !== 6) {
      setToast({
        show: true,
        type: 'error',
        message: 'Please enter a complete 6-digit code'
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      await verifyMfa(verificationCode)
      
      setToast({
        show: true,
        type: 'success',
        message: 'Verification successful! Redirecting...'
      })
      
      setTimeout(() => navigate('/'), 1500)
      
    } catch (error) {
      setToast({
        show: true,
        type: 'error',
        message: error.message || 'Invalid verification code. Please try again.'
      })
      
      // Clear the code on error
      setCode(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
      
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleResendCode = async () => {
    if (resendCooldown > 0) return
    
    try {
      // Mock API call - replace with actual resend API
      const response = await fetch('/api/auth/resend-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to resend code')
      }
      
      setToast({
        show: true,
        type: 'success',
        message: method === 'sms' ? 'SMS code sent!' : 'New code generated in your authenticator app'
      })
      
      setResendCooldown(60) // 60 second cooldown
      
    } catch (error) {
      setToast({
        show: true,
        type: 'error',
        message: 'Failed to resend code. Please try again.'
      })
    }
  }
  
  const switchMethod = (newMethod) => {
    setMethod(newMethod)
    setCode(['', '', '', '', '', ''])
    inputRefs.current[0]?.focus()
    
    if (newMethod === 'sms') {
      handleResendCode()
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <KeyIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Two-Factor Authentication
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {method === 'totp' 
              ? 'Enter the 6-digit code from your authenticator app'
              : 'Enter the 6-digit code sent to your phone'
            }
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700">
          {/* Method Selection */}
          <div className="mb-8">
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 p-1">
              <button
                type="button"
                onClick={() => switchMethod('totp')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  method === 'totp'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <KeyIcon className="h-4 w-4" />
                Authenticator App
              </button>
              <button
                type="button"
                onClick={() => switchMethod('sms')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  method === 'sms'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <DevicePhoneMobileIcon className="h-4 w-4" />
                SMS
              </button>
            </div>
          </div>
          
          {/* Code Input */}
          <div className="mb-8">
            <div className="flex justify-center space-x-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={isLoading}
                  className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                />
              ))}
            </div>
          </div>
          
          {/* Submit Button */}
          <Button
            fullWidth
            onClick={() => handleSubmit()}
            loading={isLoading}
            disabled={isLoading || code.some(digit => !digit)}
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </Button>
          
          {/* Resend Code */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Didn't receive a code?
            </p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendCooldown > 0}
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendCooldown > 0 
                ? `Resend code in ${resendCooldown}s`
                : method === 'sms' 
                  ? 'Resend SMS code'
                  : 'Generate new code'
              }
            </button>
          </div>
          
          {/* Help Text */}
          {method === 'totp' && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Using an authenticator app?</strong><br />
                Open your app (Google Authenticator, Authy, etc.) and enter the 6-digit code displayed for this account.
              </p>
            </div>
          )}
          
          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/auth/login"
              className="text-sm text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
            >
              ← Back to login
            </Link>
          </div>
        </div>
        
        {/* Security Notice */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <p>
            This extra layer of security helps protect your account from unauthorized access.
          </p>
        </div>
      </div>
      
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  )
}