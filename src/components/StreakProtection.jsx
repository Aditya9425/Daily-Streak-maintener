import { motion } from 'framer-motion'
import { Shield, Clock } from 'lucide-react'
import { useTasks } from '../context/TasksContext'

const StreakProtection = () => {
  const { getStreakSavesRemaining, streakProtection } = useTasks()
  const savesRemaining = getStreakSavesRemaining()
  
  const getDaysUntilReset = () => {
    if (!streakProtection?.last_reset_date) return 7
    
    const lastReset = new Date(streakProtection.last_reset_date)
    const nextReset = new Date(lastReset.getTime() + 7 * 24 * 60 * 60 * 1000)
    const now = new Date()
    const daysLeft = Math.ceil((nextReset - now) / (24 * 60 * 60 * 1000))
    
    return Math.max(0, daysLeft)
  }

  const daysUntilReset = getDaysUntilReset()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="p-2 bg-yellow-500/20 rounded-full"
          >
            <Shield className="text-yellow-400" size={20} />
          </motion.div>
          
          <div>
            <h3 className="font-semibold text-white">Streak Protection</h3>
            <p className="text-gray-400 text-sm">
              Auto-saves your streak when you miss a day
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <motion.div 
            className="text-2xl font-bold text-yellow-400"
            key={savesRemaining}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {savesRemaining}
          </motion.div>
          <div className="text-gray-400 text-sm">saves left</div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock size={14} />
          <span>Resets in {daysUntilReset} day{daysUntilReset !== 1 ? 's' : ''}</span>
        </div>
        
        <div className="flex items-center gap-1">
          {[...Array(1)].map((_, i) => (
            <motion.div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < savesRemaining ? 'bg-yellow-400' : 'bg-gray-600'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>
      
      {savesRemaining === 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
        >
          <p className="text-red-400 text-sm">
            ⚠️ No streak saves remaining. Missing a task will reset your streak!
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default StreakProtection