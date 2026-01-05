import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useState } from 'react'
import StreakBadge from './StreakBadge'
import ConfirmationModal from './ConfirmationModal'
import { useTasks } from '../context/TasksContext'

const TaskCard = ({ task, index }) => {
  const { toggleTask, getTaskStatus, getTaskStreak } = useTasks()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const isCompleted = getTaskStatus(task.task_id)
  const streak = getTaskStreak(task.task_id)

  const handleToggle = () => {
    if (isCompleted) {
      // Show confirmation modal for unchecking
      setShowConfirmation(true)
    } else {
      // Direct toggle for checking
      toggleTask(task.task_id)
    }
  }

  const handleConfirmUncheck = () => {
    toggleTask(task.task_id)
    setShowConfirmation(false)
  }

  const willResetStreak = isCompleted && streak.current > 0

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="glass-card glass-hover cursor-pointer group"
        onClick={handleToggle}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{task.icon}</div>
            <div>
              <h3 className="font-semibold text-lg">{task.name}</h3>
              <p className="text-white/60 text-sm">{task.description}</p>
            </div>
          </div>
          
          <motion.div
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              isCompleted
                ? 'bg-white text-black border-white'
                : 'border-white/30 group-hover:border-white/60'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              initial={false}
              animate={{
                scale: isCompleted ? 1 : 0,
                opacity: isCompleted ? 1 : 0
              }}
              transition={{ duration: 0.2 }}
            >
              <Check size={16} />
            </motion.div>
          </motion.div>
        </div>
        
        <div className="flex items-center justify-between">
          <StreakBadge 
            current={streak.current} 
            longest={streak.longest} 
            compact 
          />
          
          <motion.div
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
              isCompleted
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-white/60'
            }`}
            animate={{
              backgroundColor: isCompleted ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'
            }}
          >
            {isCompleted ? 'Completed' : 'Pending'}
          </motion.div>
        </div>
      </motion.div>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmUncheck}
        taskName={task.name}
        currentStreak={streak.current}
        willResetStreak={willResetStreak}
      />
    </>
  )
}

export default TaskCard