import { useState, useRef } from 'react'
import { 
  DocumentTextIcon, 
  CameraIcon, 
  UserIcon, 
  MapPinIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'
import Toast from '../ui/Toast'
import useAuthStore from '../../store/authStore'

const KYC_STEPS = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Basic personal details',
    icon: UserIcon
  },
  {
    id: 'identity',
    title: 'Identity Verification',
    description: 'Photo ID upload',
    icon: DocumentTextIcon
  },
  {
    id: 'selfie',
    title: 'Selfie Verification',
    description: 'Take a selfie for verification',
    icon: CameraIcon
  },
  {
    id: 'address',
    title: 'Address Verification',
    description: 'Proof of address document',
    icon: MapPinIcon
  }
]

export default function KYCFlow({ isOpen, onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Personal info
    dateOfBirth: '',
    nationality: '',
    occupation: '',
    sourceOfIncome: '',
    // Identity
    idType: 'passport',
    idNumber: '',
    idFile: null,
    // Selfie
    selfieFile: null,
    // Address
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    addressProofFile: null
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, type: '', message: '' })
  const [uploadProgress, setUploadProgress] = useState({})
  
  const fileInputRef = useRef()
  const cameraInputRef = useRef()
  const { setKycStatus } = useAuthStore()
  
  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  
  const handleFileUpload = async (file, fieldName) => {
    if (!file) return
    
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      setToast({
        show: true,
        type: 'error',
        message: 'File size must be less than 10MB'
      })
      return
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      setToast({
        show: true,
        type: 'error',
        message: 'Please upload JPG, PNG, or PDF files only'
      })
      return
    }
    
    // Simulate upload progress
    setUploadProgress(prev => ({ ...prev, [fieldName]: 0 }))
    
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = Math.min((prev[fieldName] || 0) + 10, 100)
        if (newProgress === 100) {
          clearInterval(uploadInterval)
          setTimeout(() => {
            setUploadProgress(prev => ({ ...prev, [fieldName]: undefined }))
          }, 1000)
        }
        return { ...prev, [fieldName]: newProgress }
      })
    }, 100)
    
    handleInputChange(fieldName, file)
  }
  
  const validateStep = (step) => {
    const newErrors = {}
    
    switch (step) {
      case 0: // Personal info
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
        if (!formData.nationality) newErrors.nationality = 'Nationality is required'
        if (!formData.occupation) newErrors.occupation = 'Occupation is required'
        if (!formData.sourceOfIncome) newErrors.sourceOfIncome = 'Source of income is required'
        break
        
      case 1: // Identity
        if (!formData.idNumber) newErrors.idNumber = 'ID number is required'
        if (!formData.idFile) newErrors.idFile = 'ID document is required'
        break
        
      case 2: // Selfie
        if (!formData.selfieFile) newErrors.selfieFile = 'Selfie is required'
        break
        
      case 3: // Address
        if (!formData.addressLine1) newErrors.addressLine1 = 'Address is required'
        if (!formData.city) newErrors.city = 'City is required'
        if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required'
        if (!formData.country) newErrors.country = 'Country is required'
        if (!formData.addressProofFile) newErrors.addressProofFile = 'Address proof is required'
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < KYC_STEPS.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        handleSubmit()
      }
    }
  }
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  const handleSubmit = async () => {
    setIsLoading(true)
    
    try {
      // Create FormData for file uploads
      const submitData = new FormData()
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] && key.includes('File')) {
          submitData.append(key, formData[key])
        } else if (formData[key]) {
          submitData.append(key, formData[key])
        }
      })
      
      // Mock API call - replace with actual KYC submission
      const response = await fetch('/api/kyc/submit', {
        method: 'POST',
        body: submitData,
      })
      
      if (!response.ok) {
        throw new Error('KYC submission failed')
      }
      
      const result = await response.json()
      
      setKycStatus('pending')
      
      setToast({
        show: true,
        type: 'success',
        message: 'KYC documents submitted successfully! Review typically takes 1-2 business days.'
      })
      
      setTimeout(() => {
        onComplete && onComplete(result)
        onClose()
      }, 2000)
      
    } catch (error) {
      setToast({
        show: true,
        type: 'error',
        message: error.message || 'Failed to submit KYC documents. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const takeSelfie = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click()
    }
  }
  
  const renderPersonalInfoStep = () => (
    <div className="space-y-6">
      <Input
        label="Date of Birth"
        name="dateOfBirth"
        type="date"
        value={formData.dateOfBirth}
        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
        error={errors.dateOfBirth}
        required
        fullWidth
      />
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nationality *
          </label>
          <select
            value={formData.nationality}
            onChange={(e) => handleInputChange('nationality', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Select nationality</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            {/* Add more countries */}
          </select>
          {errors.nationality && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.nationality}</p>
          )}
        </div>
        
        <Input
          label="Occupation"
          name="occupation"
          value={formData.occupation}
          onChange={(e) => handleInputChange('occupation', e.target.value)}
          error={errors.occupation}
          required
          fullWidth
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Source of Income *
        </label>
        <select
          value={formData.sourceOfIncome}
          onChange={(e) => handleInputChange('sourceOfIncome', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Select source of income</option>
          <option value="employment">Employment</option>
          <option value="business">Business/Self-employed</option>
          <option value="investments">Investments</option>
          <option value="inheritance">Inheritance</option>
          <option value="other">Other</option>
        </select>
        {errors.sourceOfIncome && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.sourceOfIncome}</p>
        )}
      </div>
    </div>
  )
  
  const renderIdentityStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          ID Type *
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'passport', label: 'Passport' },
            { value: 'license', label: 'Driver\'s License' },
            { value: 'national_id', label: 'National ID' }
          ].map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleInputChange('idType', option.value)}
              className={`p-3 rounded-lg border-2 transition-colors ${
                formData.idType === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {option.label}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <Input
        label="ID Number"
        name="idNumber"
        value={formData.idNumber}
        onChange={(e) => handleInputChange('idNumber', e.target.value)}
        error={errors.idNumber}
        required
        fullWidth
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Upload ID Document *
        </label>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
          {formData.idFile ? (
            <div className="text-center">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-green-500" />
              <p className="mt-2 text-sm text-gray-900 dark:text-white">{formData.idFile.name}</p>
              <p className="text-xs text-gray-500">
                {(formData.idFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              {uploadProgress.idFile !== undefined && (
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress.idFile}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">JPG, PNG or PDF up to 10MB</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleFileUpload(e.target.files[0], 'idFile')}
            className="hidden"
          />
          <Button
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4"
          >
            Choose File
          </Button>
        </div>
        {errors.idFile && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.idFile}</p>
        )}
      </div>
    </div>
  )
  
  const renderSelfieStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CameraIcon className="mx-auto h-16 w-16 text-blue-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Take a Selfie
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Take a clear photo of yourself to verify your identity matches your ID document.
        </p>
      </div>
      
      {formData.selfieFile ? (
        <div className="text-center">
          <img
            src={URL.createObjectURL(formData.selfieFile)}
            alt="Selfie preview"
            className="mx-auto w-48 h-48 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
          />
          <p className="mt-2 text-sm text-gray-900 dark:text-white">{formData.selfieFile.name}</p>
          {uploadProgress.selfieFile !== undefined && (
            <div className="mt-2 max-w-xs mx-auto">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.selfieFile}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <div className="w-48 h-48 mx-auto border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
            <CameraIcon className="h-16 w-16 text-gray-400" />
          </div>
        </div>
      )}
      
      <div className="text-center space-y-3">
        <Button onClick={takeSelfie} leftIcon={<CameraIcon className="h-5 w-5" />}>
          {formData.selfieFile ? 'Retake Selfie' : 'Take Selfie'}
        </Button>
        
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="user"
          onChange={(e) => handleFileUpload(e.target.files[0], 'selfieFile')}
          className="hidden"
        />
      </div>
      
      {errors.selfieFile && (
        <p className="text-center text-sm text-red-600 dark:text-red-400">{errors.selfieFile}</p>
      )}
      
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            <p className="font-medium mb-1">Photo Guidelines:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Face clearly visible and well-lit</li>
              <li>Remove glasses, hats, or face coverings</li>
              <li>Look directly at the camera</li>
              <li>Ensure background is plain and uncluttered</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
  
  const renderAddressStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <Input
          label="Address Line 1"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={(e) => handleInputChange('addressLine1', e.target.value)}
          error={errors.addressLine1}
          required
          fullWidth
        />
        
        <Input
          label="Address Line 2 (Optional)"
          name="addressLine2"
          value={formData.addressLine2}
          onChange={(e) => handleInputChange('addressLine2', e.target.value)}
          fullWidth
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            error={errors.city}
            required
            fullWidth
          />
          
          <Input
            label="State/Province"
            name="state"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            fullWidth
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="ZIP/Postal Code"
            name="zipCode"
            value={formData.zipCode}
            onChange={(e) => handleInputChange('zipCode', e.target.value)}
            error={errors.zipCode}
            required
            fullWidth
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Country *
            </label>
            <select
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
            </select>
            {errors.country && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.country}</p>
            )}
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Address Proof Document *
        </label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Upload a utility bill, bank statement, or government document dated within the last 3 months
        </p>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
          {formData.addressProofFile ? (
            <div className="text-center">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-green-500" />
              <p className="mt-2 text-sm text-gray-900 dark:text-white">{formData.addressProofFile.name}</p>
              <p className="text-xs text-gray-500">
                {(formData.addressProofFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              {uploadProgress.addressProofFile !== undefined && (
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress.addressProofFile}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">JPG, PNG or PDF up to 10MB</p>
            </div>
          )}
          <Button
            variant="secondary"
            onClick={() => document.getElementById('addressProofInput').click()}
            className="mt-4"
          >
            Choose File
          </Button>
          <input
            id="addressProofInput"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleFileUpload(e.target.files[0], 'addressProofFile')}
            className="hidden"
          />
        </div>
        {errors.addressProofFile && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.addressProofFile}</p>
        )}
      </div>
    </div>
  )
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderPersonalInfoStep()
      case 1: return renderIdentityStep()
      case 2: return renderSelfieStep()
      case 3: return renderAddressStep()
      default: return null
    }
  }
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Identity Verification (KYC)"
      size="lg"
      closeOnOverlayClick={false}
    >
      <div className="space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {KYC_STEPS.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isCompleted 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : isActive 
                      ? 'border-blue-500 text-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-300 dark:border-gray-600 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400">{step.description}</p>
                </div>
                {index < KYC_STEPS.length - 1 && (
                  <div className={`ml-6 w-16 h-0.5 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-600'
                  }`} />
                )}
              </div>
            )
          })}
        </div>
        
        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            loading={isLoading}
            disabled={isLoading}
          >
            {currentStep === KYC_STEPS.length - 1 ? 'Submit Documents' : 'Next'}
          </Button>
        </div>
      </div>
      
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </Modal>
  )
}