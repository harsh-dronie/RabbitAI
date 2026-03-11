'use client'

import { useState, FormEvent } from 'react'
import axios from 'axios'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validate inputs
    if (!file) {
      setStatus('error')
      setMessage('Please select a file')
      return
    }

    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    // Create FormData
    const formData = new FormData()
    formData.append('file', file)
    formData.append('email', email)

    // Set loading state
    setStatus('loading')
    setMessage('')

    try {
      // POST request to backend
      const API_URL = 'https://rabbitt-ai-backend-t1u8.onrender.com'
      console.log('Using API URL:', API_URL) // Debug log
      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 35000,
      })

      // Display success
      setStatus('success')
      setMessage(response.data.message || 'Sales summary sent successfully!')
      setFile(null)
      setEmail('')
    } catch (error: any) {
      // Display error
      setStatus('error')
      setMessage(
        error.response?.data?.message || 
        error.message || 
        'Failed to process file. Please try again.'
      )
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    if (status !== 'loading') {
      setStatus('idle')
      setMessage('')
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (status !== 'loading') {
      setStatus('idle')
      setMessage('')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div>
          <label htmlFor="file" className="block text-sm font-semibold text-gray-700 mb-2">
            Upload CSV or XLSX File
          </label>
          <input
            type="file"
            id="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            disabled={status === 'loading'}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: <span className="font-medium">{file.name}</span> ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">Maximum file size: 5MB</p>
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Recipient Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            disabled={status === 'loading'}
            placeholder="recipient@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === 'loading' || !file || !email}
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 shadow-md hover:shadow-lg"
        >
          {status === 'loading' ? 'Processing...' : 'Analyze & Send Summary'}
        </button>

        {/* Loading Spinner */}
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
            <p className="mt-4 text-sm font-medium text-gray-700">Analyzing your sales data...</p>
            <p className="text-xs text-gray-500 mt-1">This usually takes less than 30 seconds</p>
          </div>
        )}

        {/* Success Message */}
        {status === 'success' && message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-green-800">Success!</h3>
                <p className="text-sm text-green-700 mt-1">{message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {status === 'error' && message && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{message}</p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
