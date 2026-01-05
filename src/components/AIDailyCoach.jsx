import { motion } from 'framer-motion'
import { Brain, Target, RefreshCw } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTasks } from '../context/TasksContext'

const AIDailyCoach = () => {
  const { user } = useAuth()
  const { analyticsService, loading } = useTasks()

  // Always render if user is logged in
  if (!user) return null

  if (loading || !analyticsService) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="text-blue-400" size={20} />
          </motion.div>
          <h3 className="font-semibold text-white">AI Coach</h3>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-white/10 rounded mb-2"></div>
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  // Get real-time coaching insights
  const insights = analyticsService.generateCoachingInsights()
  const todayStats = insights.todayStats

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Brain className="text-blue-400" size={20} />
          </motion.div>
          <h3 className="font-semibold text-white">AI Coach</h3>
        </div>
        
        {/* Real-time stats indicator */}
        <div className="text-xs text-white/60">
          {todayStats.completedCount}/{todayStats.totalTasks} today
        </div>
      </div>
      
      <div className="space-y-3">
        <p className="text-white font-medium">{insights.message}</p>
        
        {insights.actionSuggestion && (
          <div className="flex items-start gap-2 p-3 bg-white/5 rounded-xl">
            <Target className="text-green-400 mt-0.5" size={16} />
            <p className="text-green-400 text-sm font-medium">
              {insights.actionSuggestion}
            </p>
          </div>
        )}
        
        {/* Progress indicator */}
        <div className="flex items-center gap-2 text-sm text-white/60">
          <div className="flex-1 bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${todayStats.completionPercentage}%` }}
            />
          </div>
          <span>{todayStats.completionPercentage}%</span>
        </div>
      </div>
    </motion.div>
  )
}

export default AIDailyCoach