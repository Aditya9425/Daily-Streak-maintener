import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Rocket, Flame, CheckCircle2, ArrowRight } from 'lucide-react'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { signIn, signUp, signInWithGoogle } = useAuth()

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const { error } = await signInWithGoogle()
      if (error) throw error
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password)

      if (error) throw error

      if (!isLogin) {
        setError('Check your email for the confirmation link!')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 bg-[#0A0B10] overflow-hidden selection:bg-[#FF8A00]/30 selection:text-white">
      
      {/* 1. Immersive Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div 
          className="absolute right-[-10%] top-[-5%] w-[120%] md:w-[100%] h-[120%] bg-no-repeat opacity-40 md:opacity-50 transition-all duration-1000 mix-blend-screen"
          style={{
            backgroundImage: `url('/mountain.png')`,
            backgroundPosition: 'top right',
            backgroundSize: 'cover',
            WebkitMaskImage: 'radial-gradient(circle at 70% 30%, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 80%)',
            maskImage: 'radial-gradient(circle at 70% 30%, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 80%)'
          }}
        />
        {/* Subtle top-right ambient glow */}
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#FF8A00]/10 rounded-full blur-[100px]" />
        
        {/* Gradients to fade out mountain smoothly */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0B10]/80 to-[#0A0B10] h-[80%] bottom-0 top-auto" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0B10] via-[#0A0B10]/40 to-transparent w-[50%]" />
      </div>

      <div className="w-full max-w-[420px] relative z-10 flex flex-col items-center">
        
        {/* 2. Hero Header */}
        <motion.div 
          className="text-center mb-10 flex flex-col items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Logo icon */}
          <div className="relative w-16 h-16 rounded-2xl bg-[#15171E] border border-white/5 flex items-center justify-center shadow-xl mb-4 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CheckCircle2 size={32} className="text-[#FF8A00]" strokeWidth={2.5} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-1">
            Streak<span className="text-[#FF8A00]">Wise</span>
          </h1>
          <p className="text-white/50 text-sm md:text-base mt-2 font-medium">
            Build consistency, one day at a time.
          </p>
        </motion.div>

        {/* 3. Premium Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-[#15171E]/90 backdrop-blur-2xl border border-white/5 rounded-[32px] p-6 md:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-white/40 text-sm">
              Track your habits. Protect your streak.<br/>Improve every day.
            </p>
          </div>

          {/* 5. Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full relative group flex items-center justify-center gap-3 py-3.5 px-4 bg-white text-black rounded-2xl font-semibold transition-all duration-300 disabled:opacity-50 hover:bg-white/90 active:scale-[0.98] mb-6 shadow-[0_4px_14px_rgba(255,255,255,0.1)]"
          >
            <svg className="w-5 h-5 transition-transform group-hover:scale-110 duration-300" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* 6. Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10"></div>
            <span className="text-[11px] font-medium text-white/30 uppercase tracking-widest">OR</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 7. Input Fields */}
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-[#FF8A00] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-[#1C1F2A] border border-white/5 rounded-2xl focus:outline-none focus:border-[#FF8A00]/50 focus:bg-[#1C1F2A]/80 text-white placeholder:text-white/30 transition-all duration-300"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-[#FF8A00] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-[#1C1F2A] border border-white/5 rounded-2xl focus:outline-none focus:border-[#FF8A00]/50 focus:bg-[#1C1F2A]/80 text-white placeholder:text-white/30 transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Options */}
            {isLogin && (
              <div className="flex justify-end items-center px-1 pt-1">
                <button type="button" className="text-xs text-[#FF8A00]/80 hover:text-[#FF8A00] transition-colors font-medium">
                  Forgot password?
                </button>
              </div>
            )}

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400/90 text-sm text-center bg-red-500/10 py-2 rounded-xl border border-red-500/20"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 8. Primary CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 relative overflow-hidden group py-3.5 px-4 bg-gradient-to-br from-[#FFB347] to-[#FF8A00] text-[#1C1F2A] rounded-2xl font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,138,0,0.3)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <LoadingSpinner size={20} />
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* 9. Toggle Sign Up/In */}
          <div className="text-center mt-8">
            <span className="text-white/40 text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="text-[#FF8A00] text-sm font-medium hover:text-[#FFB347] transition-colors"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default Auth