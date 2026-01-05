import { motion } from 'framer-motion'
import { TrendingUp, AlertCircle, Target, Calendar } from 'lucide-react'
import { useTasks } from '../context/TasksContext'

const AIWeeklyReview = () => {
  const { analyticsService, loading } = useTasks()

  if (loading || !analyticsService) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center"
      >
        <h3 className="font-semibold text-white mb-4">Weekly Review</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-white/10 rounded mb-2"></div>
          <div className="h-4 bg-white/10 rounded w-3/4 mx-auto"></div>
        </div>
      </motion.div>
    )
  }

  // Get real-time weekly insights
  const insights = analyticsService.generateWeeklyReviewInsights()
  const weeklyStats = insights.weeklyStats

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <TrendingUp size={20} />
          Weekly Review
        </h3>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Calendar size={16} />
          {weeklyStats.completionRate}% this week
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Biggest Win */}
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
          <div className="flex-1">
            <p className="text-green-400 text-sm font-medium">Biggest Win</p>
            <p className="text-white">{insights.biggestWin}</p>
          </div>
        </div>
        
        {/* Needs Work */}
        <div className="flex items-start gap-3">
          <AlertCircle className="text-orange-400 mt-0.5" size={16} />
          <div className="flex-1">
            <p className="text-orange-400 text-sm font-medium">Needs Work</p>
            <p className="text-white">{insights.weakestHabit}</p>
          </div>
        </div>
        
        {/* Next Week Focus */}
        <div className="flex items-start gap-3">
          <Target className="text-blue-400 mt-0.5" size={16} />
          <div className="flex-1">
            <p className="text-blue-400 text-sm font-medium">Next Week Focus</p>
            <p className="text-white">{insights.improvementSuggestion}</p>
          </div>
        </div>
        
        {/* Weekly Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <div className="text-lg font-bold text-white">{weeklyStats.totalCompleted}</div>
            <div className="text-xs text-white/60">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">{weeklyStats.averageDailyCompletion}</div>
            <div className="text-xs text-white/60">Daily Avg</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">{weeklyStats.taskStats.length}</div>
            <div className="text-xs text-white/60">Total Tasks</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AIWeeklyReview