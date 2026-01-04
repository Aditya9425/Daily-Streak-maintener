import { motion, AnimatePresence } from 'framer-motion'
import { Check, Shield, Clock } from 'lucide-react'
import { useTasks } from '../context/TasksContext'
import StreakBadge from './StreakBadge'

const TaskCard = ({ task, index }) => {
  const { 
    toggleTask, 
    getTaskStatus, 
    getTaskStreak, 
    isTaskLockedToday,
    wasStreakSavedToday 
  } = useTasks()
  
  const isCompleted = getTaskStatus(task.task_id)
  const isLocked = isTaskLockedToday(task.task_id)
  const streakSaved = wasStreakSavedToday(task.task_id)
  const streak = getTaskStreak(task.task_id)

  const handleToggle = () => {
    if (!isLocked || isCompleted) {
      toggleTask(task.task_id)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)'
      }}
      className="relative group"
    >
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20">
        {/* Streak saved indicator */}
        <AnimatePresence>
          {streakSaved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full flex items-center gap-1"
            >
              <Shield size={12} />
              Saved
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div 
              className="text-2xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {task.icon}
            </motion.div>
            <div>
              <h3 className="font-semibold text-white text-lg">{task.name}</h3>
              {task.description && (
                <p className="text-gray-400 text-sm mt-1">{task.description}</p>
              )}
            </div>
          </div>
          
          {/* Checkbox */}
          <motion.button
            onClick={handleToggle}
            disabled={isLocked && !isCompleted}
            className={`relative w-8 h-8 rounded-full border-2 transition-all duration-300 ${
              isCompleted
                ? 'bg-white border-white'
                : 'border-white/30 hover:border-white/60'
            } ${isLocked && !isCompleted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            whileHover={!isLocked || isCompleted ? { scale: 1.1 } : {}}
            whileTap={!isLocked || isCompleted ? { scale: 0.95 } : {}}
          >
            <AnimatePresence>
              {isCompleted && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Check size={16} className="text-black" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Status and Streak */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center gap-1"
              >
                <Check size={12} />
                Completed Today
              </motion.div>
            )}
            
            {isLocked && !isCompleted && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-500/20 text-gray-400 text-xs px-2 py-1 rounded-full flex items-center gap-1"
              >
                <Clock size={12} />
                Locked Today
              </motion.div>
            )}
          </div>
          
          <StreakBadge 
            current={streak.current} 
            longest={streak.longest}
            animated={true}
          />
        </div>

        {/* Custom task indicator */}
        {task.is_custom && (
          <div className="absolute top-2 left-2 w-2 h-2 bg-blue-400 rounded-full" />
        )}
      </div>
    </motion.div>
  )
}

export default TaskCard