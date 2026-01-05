import { useState } from 'react'
import { motion } from 'framer-motion'
import { LogOut, RefreshCw, Settings as SettingsIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTasks } from '../context/TasksContext'
import { AIProvider } from '../context/AIContext'
import TaskCardClean from '../components/TaskCardClean'
import ProgressRing from '../components/ProgressRing'
import LoadingSpinner from '../components/LoadingSpinner'
import Settings from '../components/Settings'
import AIDailyCoach from '../components/AIDailyCoach'
import AIWeeklyReview from '../components/AIWeeklyReview'
import { getDailyQuote } from '../utils/quotes'
import { getTodayString, formatDisplayDate } from '../utils/dateUtils'

const DashboardContent = () => {
  const { user, signOut } = useAuth()
  const { tasks, loading, analyticsService, selectedDate, refreshData } = useTasks()
  const [showSettings, setShowSettings] = useState(false)
  
  // Use analytics service for consistent data
  const todayStats = analyticsService ? analyticsService.getTodayStats() : { completionPercentage: 0, completedCount: 0, totalTasks: 0 }
  const quote = getDailyQuote()
  const today = getTodayString()
  const isViewingToday = selectedDate === today

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={60} />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {isViewingToday ? 'Daily Streaks' : `Daily Streaks - ${formatDisplayDate(selectedDate)}`}
            </h1>
            <p className="text-white/60">
              {isViewingToday 
                ? `Welcome back, ${user?.email?.split('@')[0]}` 
                : `Viewing ${formatDisplayDate(selectedDate)} (Read-only)`
              }
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowSettings(true)}
              className="p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <SettingsIcon size={20} className="text-white" />
            </button>
            <button 
              onClick={refreshData}
              className="p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <RefreshCw size={20} className="text-white" />
            </button>
            <button 
              onClick={signOut}
              className="p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <LogOut size={20} className="text-white" />
            </button>
          </div>
        </motion.div>

        {/* Top Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Daily Progress */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center"
          >
            <h2 className="text-xl font-semibold text-white mb-6">
              {isViewingToday ? "Today's Progress" : `Progress for ${formatDisplayDate(selectedDate)}`}
            </h2>
            
            <ProgressRing progress={todayStats.completionPercentage} size={120}>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{todayStats.completionPercentage}%</div>
                <div className="text-white/60 text-sm">Complete</div>
              </div>
            </ProgressRing>
            
            <div className="mt-6 text-white/60">
              {todayStats.completedCount} of {todayStats.totalTasks} tasks completed
            </div>
          </motion.div>

          {/* AI Daily Coach */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <AIDailyCoach />
          </motion.div>

          {/* Daily Quote */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col justify-center"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">💭</div>
              <blockquote className="text-lg font-medium text-white mb-4 italic">
                "{quote}"
              </blockquote>
              <p className="text-white/60 text-sm">Daily Motivation</p>
            </div>
          </motion.div>
        </div>

        {/* Weekly Review */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <AIWeeklyReview />
        </motion.div>

        {/* Tasks Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Your Tasks</h2>
          
          <div className="space-y-4">
            {tasks.map((task, index) => (
              <TaskCardClean 
                key={task.task_id} 
                task={task} 
                index={index}
              />
            ))}
          </div>
        </motion.div>

        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-2">No tasks yet</h3>
            <p className="text-white/60 mb-4">Create your first task to start tracking streaks</p>
            <button
              onClick={() => setShowSettings(true)}
              className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Add Your First Task
            </button>
          </motion.div>
        )}
      </div>
      
      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}

const Dashboard = () => {
  return (
    <AIProvider>
      <DashboardContent />
    </AIProvider>
  )
}

export default Dashboard