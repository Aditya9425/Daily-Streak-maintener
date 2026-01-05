import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { useTasks } from '../context/TasksContext'
import ConfirmationModal from './ConfirmationModal'

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
        transition={{ delay: index * 0.1 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
      >
        <div className="flex items-center justify-between gap-4">
          {/* Left: Task Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="text-2xl flex-shrink-0">{task.icon}</div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white mb-1 truncate">{task.name}</h3>
              {task.description && (
                <p className="text-sm text-white/60 truncate">{task.description}</p>
              )}
            </div>
          </div>

          {/* Right: Checkbox Only */}
          <motion.button
            onClick={handleToggle}
            className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              isCompleted
                ? 'bg-white border-white text-black'
                : 'border-white/30 hover:border-white/60'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isCompleted && <Check size={16} />}
          </motion.button>
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