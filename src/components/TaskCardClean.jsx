import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useTasks } from '../context/TasksContext'

const TaskCard = ({ task, index }) => {
  const { toggleTask, getTaskStatus, getTaskStreak } = useTasks()
  
  const isCompleted = getTaskStatus(task.task_id)
  const streak = getTaskStreak(task.task_id)

  const handleToggle = () => {
    toggleTask(task.task_id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        {/* Left: Task Info */}
        <div className="flex items-center gap-4 flex-1">
          <div className="text-2xl">{task.icon}</div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">{task.name}</h3>
            {task.description && (
              <p className="text-sm text-white/60">{task.description}</p>
            )}
          </div>
        </div>

        {/* Center: Streak Info */}
        <div className="flex items-center gap-6 mx-6">
          <div className="text-center">
            <div className="text-xl font-bold text-white">{streak.current}</div>
            <div className="text-xs text-white/60">Current</div>
          </div>
          
          <div className="w-px h-8 bg-white/20"></div>
          
          <div className="text-center">
            <div className="text-xl font-bold text-white/80">{streak.longest}</div>
            <div className="text-xs text-white/60">Best</div>
          </div>
        </div>

        {/* Right: Checkbox */}
        <motion.button
          onClick={handleToggle}
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
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
  )
}

export default TaskCard