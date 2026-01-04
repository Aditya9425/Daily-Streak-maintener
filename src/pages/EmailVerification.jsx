import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import LoadingSpinner from '../components/LoadingSpinner'

const EmailVerification = () => {
  const [status, setStatus] = useState('verifying')
  const navigate = useNavigate()

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Verification error:', error)
          setStatus('error')
          return
        }

        if (data.session) {
          setStatus('success')
          setTimeout(() => navigate('/dashboard'), 2000)
        } else {
          setStatus('error')
        }
      } catch (err) {
        console.error('Verification error:', err)
        setStatus('error')
      }
    }

    handleEmailVerification()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        {status === 'verifying' && (
          <>
            <LoadingSpinner size={60} />
            <p className="mt-4 text-white">Verifying your email...</p>
          </>
        )}
        
        {status === 'success' && (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
            <p className="text-gray-300">Redirecting to dashboard...</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
            <p className="text-gray-300 mb-4">There was an issue verifying your email.</p>
            <button 
              onClick={() => navigate('/auth')}
              className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmailVerification