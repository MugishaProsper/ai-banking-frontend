import { forwardRef } from 'react'
import { clsx } from 'clsx'

const Input = forwardRef(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  type = 'text',
  disabled = false,
  required = false,
  fullWidth = false,
  size = 'md',
  ...props
}, ref) => {
  const baseClasses = 'block border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed'
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }
  
  const inputClasses = clsx(
    baseClasses,
    sizes[size],
    error 
      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-600 dark:text-red-400' 
      : 'border-gray-300 text-gray-900 placeholder-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400',
    leftIcon && 'pl-10',
    rightIcon && 'pr-10',
    fullWidth && 'w-full',
    className
  )
  
  const inputId = props.id || props.name
  
  return (
    <div className={clsx('relative', fullWidth && 'w-full')}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-sm">{leftIcon}</span>
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          required={required}
          className={inputClasses}
          id={inputId}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-sm">{rightIcon}</span>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input