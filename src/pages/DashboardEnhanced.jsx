import { useState } from 'react'
import { motion } from 'framer-motion'
import { LogOut, RefreshCw, History, Plus, Calendar, TrendingUp } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTasks } from '../context/TasksContext'
import TaskCardEnhanced from '../components/TaskCardEnhanced'
import ProgressRing from '../components/ProgressRing'
import LoadingSpinner from '../components/LoadingSpinner'
import HistoryView from '../components/HistoryView'
import StreakProtection from '../components/StreakProtection'
import DailyQuote from '../components/DailyQuote'
import CustomTaskModal from '../components/CustomTaskModal'

const Dashboard = () => {
  const { user, signOut } = useAuth()
  const { tasks, loading, getDailyProgress, refreshData } = useTasks()
  const [showHistory, setShowHistory] = useState(false)
  const [showCustomTask, setShowCustomTask] = useState(false)
  const [historyDays, setHistoryDays] = useState(7)

  const dailyProgress = getDailyProgress()

  const handleSignOut = async () => {
    await signOut()
  }

  const handleRefresh = () => {
    refreshData()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size={60} />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Mobile-optimized layout */}
      <div className="pb-20 md:pb-8">
        <div className="p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-6"
            >
              <div>
                <h1 className="text-2xl md:text-4xl font-bold mb-1">
                  Daily Streaks
                </h1>
                <p className="text-white/60 text-sm md:text-base">
                  Welcome back, {user?.email?.split('@')[0]}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => setShowHistory(true)}
                  className="p-2 md:p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="View History"
                >
                  <History size={18} />
                </motion.button>
                
                <motion.button
                  onClick={() => setShowCustomTask(true)}
                  className="p-2 md:p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Add Custom Task"
                >
                  <Plus size={18} />
                </motion.button>
                
                <motion.button
                  onClick={handleRefresh}
                  className="p-2 md:p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Refresh"
                >
                  <RefreshCw size={18} />
                </motion.button>
                
                <motion.button
                  onClick={handleSignOut}
                  className="p-2 md:p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </motion.button>
              </div>
            </motion.div>

            {/* Daily Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <DailyQuote />
            </motion.div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Daily Progress */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center"
              >
                <h2 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
                  <TrendingUp size={20} />
                  Today's Progress
                </h2>
                
                <ProgressRing progress={dailyProgress} size={120} animated={true}>
                  <div className="text-center">
                    <motion.div 
                      className="text-2xl md:text-3xl font-bold"
                      key={dailyProgress}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {dailyProgress}%
                    </motion.div>
                    <div className="text-white/60 text-xs md:text-sm">Complete</div>
                  </div>
                </ProgressRing>
                
                <div className="mt-4 text-white/60 text-sm">
                  {tasks.filter(task => {
                    const { getTaskStatus } = useTasks()
                    return getTaskStatus(task.task_id)
                  }).length} of {tasks.length} tasks completed
                </div>
              </motion.div>

              {/* Streak Protection */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <StreakProtection />
              </motion.div>
            </div>

            {/* Tasks Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Tasks</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setHistoryDays(7)
                      setShowHistory(true)
                    }}
                    className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <Calendar size={14} />
                    7 days
                  </button>
                  <span className="text-white/30">|</span>
                  <button
                    onClick={() => {
                      setHistoryDays(30)
                      setShowHistory(true)
                    }}
                    className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <Calendar size={14} />
                    30 days
                  </button>
                </div>
              </div>
              
              <div className="space-y-3 md:space-y-4">
                {tasks.map((task, index) => (
                  <TaskCardEnhanced 
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
                <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
                <p className="text-white/60 mb-4">Create your first custom task to get started</p>
                <button
                  onClick={() => setShowCustomTask(true)}
                  className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Add Your First Task
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Sticky Bottom Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">Daily Progress</span>
            <span className="text-white/60">{dailyProgress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${dailyProgress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <HistoryView 
        isOpen={showHistory} 
        onClose={() => setShowHistory(false)}
        days={historyDays}
      />
      
      <CustomTaskModal 
        isOpen={showCustomTask}
        onClose={() => setShowCustomTask(false)}
      />
    </div>
  )
}

export default Dashboard