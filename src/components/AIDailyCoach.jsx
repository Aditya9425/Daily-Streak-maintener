import { motion } from 'framer-motion'
import { Brain, Target } from 'lucide-react'
import { useAI } from '../context/AIContext'

const AIDailyCoach = () => {
  const { dailyCoaching, loading } = useAI()

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="text-blue-400" size={20} />
          <h3 className="font-semibold text-white">AI Coach</h3>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-white/10 rounded mb-2"></div>
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (!dailyCoaching) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Brain className="text-blue-400" size={20} />
        </motion.div>
        <h3 className="font-semibold text-white">AI Coach</h3>
      </div>
      
      <div className="space-y-3">
        <p className="text-white font-medium">{dailyCoaching.message}</p>
        
        {dailyCoaching.action_suggestion && (
          <div className="flex items-start gap-2 p-3 bg-white/5 rounded-xl">
            <Target className="text-green-400 mt-0.5" size={16} />
            <p className="text-green-400 text-sm font-medium">
              {dailyCoaching.action_suggestion}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default AIDailyCoach