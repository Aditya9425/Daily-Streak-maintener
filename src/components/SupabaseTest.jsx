import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'

const SupabaseTest = () => {
  const [status, setStatus] = useState('Testing connection...')

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true })
        if (error) {
          setStatus(`Connection successful but query failed: ${error.message}`)
        } else {
          setStatus('✅ Supabase connection successful!')
        }
      } catch (err) {
        setStatus(`❌ Connection failed: ${err.message}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm max-w-xs">
      <div className="font-semibold mb-2">Supabase Status:</div>
      <div>{status}</div>
      <div className="mt-2 text-xs text-white/60">
        URL: {import.meta.env.VITE_SUPABASE_URL}
      </div>
    </div>
  )
}

export default SupabaseTest