import { motion } from 'framer-motion'
import { LogOut, RefreshCw, Settings } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTasks } from '../context/TasksContext'
import TaskCard from '../components/TaskCard'
import ProgressRing from '../components/ProgressRing'
import LoadingSpinner from '../components/LoadingSpinner'
import SettingsModal from '../components/Settings'
import AIDailyCoach from '../components/AIDailyCoach'

const Dashboard = () => {
  const { user, signOut } = useAuth()
  const { tasks, loading, getDailyProgress, refreshData } = useTasks()
  const [showSettings, setShowSettings] = useState(false)

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
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Daily Streaks
            </h1>
            <p className="text-white/60">
              Welcome back, {user?.email?.split('@')[0]}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setShowSettings(true)}
              className="p-3 glass rounded-xl glass-hover"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings size={20} />
            </motion.button>
            
            <motion.button
              onClick={handleRefresh}
              className="p-3 glass rounded-xl glass-hover"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw size={20} />
            </motion.button>
            
            <motion.button
              onClick={handleSignOut}
              className="p-3 glass rounded-xl glass-hover"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={20} />
            </motion.button>
          </div>
        </motion.div>

        {/* Daily Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card text-center mb-8"
        >
          <h2 className="text-xl font-semibold mb-6">Today's Progress</h2>
          
          <ProgressRing progress={dailyProgress} size={150}>
            <div className="text-center">
              <div className="text-3xl font-bold">{dailyProgress}%</div>
              <div className="text-white/60 text-sm">Complete</div>
            </div>
          </ProgressRing>
          
          <div className="mt-6 text-white/60">
            {tasks.filter(task => useTasks().getTaskStatus(task.task_id)).length} of {tasks.length} tasks completed
          </div>
        </motion.div>

        {/* AI Coach */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <AIDailyCoach />
        </motion.div>

        {/* Tasks Grid */}
        <div className="grid gap-4 md:gap-6">
          {tasks.map((task, index) => (
            <TaskCard 
              key={task.task_id} 
              task={task} 
              index={index}
            />
          ))}
        </div>

        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
            <p className="text-white/60">Your daily tasks will appear here</p>
          </motion.div>
        )}
      </div>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  )
}

export default Dashboard