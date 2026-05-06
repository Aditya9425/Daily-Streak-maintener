import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { useTasks } from '../context/TasksContext'
import ConfirmationModal from './ConfirmationModal'
import { DynamicIcon } from '../utils/iconUtils'

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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-[#15171E] border border-white/5 rounded-[20px] p-4 hover:bg-[#1A1C24] transition-colors duration-300 shadow-lg"
      >
        <div className="flex items-center justify-between gap-4">
          {/* Left: Task Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Icon Container */}
            <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-[#2A2D3A] to-[#1C1F2A] rounded-2xl flex items-center justify-center text-[#FF8A00] shadow-inner border border-white/5 shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
              <DynamicIcon iconName={task.icon} size={22} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-[17px] font-semibold text-white/90 mb-0.5 truncate">{task.name}</h3>
              {task.description && (
                <p className="text-[13px] text-white/40 truncate">{task.description}</p>
              )}
            </div>
          </div>

          {/* Right: Premium Checkbox */}
          <button
            onClick={handleToggle}
            className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              isCompleted
                ? 'bg-[#FF8A00] border-[#FF8A00] text-black shadow-[0_0_15px_rgba(255,138,0,0.3)]'
                : 'border-white/10 hover:border-white/30 bg-transparent'
            }`}
          >
            {isCompleted && <Check size={18} strokeWidth={3} />}
          </button>
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