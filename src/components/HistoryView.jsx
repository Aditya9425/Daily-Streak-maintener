import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, TrendingUp } from 'lucide-react'
import { useTasks } from '../context/TasksContext'
import { formatDisplayDate, getDayName } from '../utils/dateUtils'

const HistoryView = ({ isOpen, onClose, days = 7 }) => {
  const { tasks, getHistoryData } = useTasks()
  const historyData = getHistoryData(days)

  const getCompletionRate = (taskData) => {
    const completed = taskData.filter(day => day.completed).length
    return Math.round((completed / taskData.length) * 100)
  }

  const getOverallStats = () => {
    const totalTasks = tasks.length * days
    let completedTasks = 0
    
    Object.values(historyData.tasks).forEach(taskData => {
      completedTasks += taskData.filter(day => day.completed).length
    })
    
    return {
      totalTasks,
      completedTasks,
      completionRate: Math.round((completedTasks / totalTasks) * 100)
    }
  }

  const stats = getOverallStats()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-black/90 backdrop-blur-xl border border-white/10 rounded-3xl z-50 overflow-hidden"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Calendar className="text-white" size={24} />
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {days === 7 ? 'Last 7 Days' : `Last ${days} Days`}
                    </h2>
                    <p className="text-gray-400">Your consistency journey</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                    <TrendingUp size={16} className="text-green-400" />
                    <span className="text-white font-medium">{stats.completionRate}%</span>
                  </div>
                  
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="text-white" size={20} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto p-6">
                {/* Overall Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-white/5 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">{stats.completedTasks}</div>
                    <div className="text-gray-400 text-sm">Completed</div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-white">{stats.totalTasks - stats.completedTasks}</div>
                    <div className="text-gray-400 text-sm">Missed</div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">{stats.completionRate}%</div>
                    <div className="text-gray-400 text-sm">Success Rate</div>
                  </div>
                </div>

                {/* Task History Grid */}
                <div className="space-y-6">
                  {tasks.map((task, taskIndex) => {
                    const taskData = historyData.tasks[task.task_id] || []
                    const completionRate = getCompletionRate(taskData)
                    
                    return (
                      <motion.div
                        key={task.task_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: taskIndex * 0.1 }}
                        className="bg-white/5 rounded-2xl p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{task.icon}</span>
                            <div>
                              <h3 className="font-semibold text-white">{task.name}</h3>
                              <p className="text-gray-400 text-sm">{completionRate}% completion rate</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Day Grid */}
                        <div className="grid grid-cols-7 gap-2">
                          {taskData.map((day, dayIndex) => (
                            <motion.div
                              key={day.date}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: (taskIndex * 0.1) + (dayIndex * 0.05) }}
                              className="text-center"
                            >
                              <div className="text-xs text-gray-400 mb-1">
                                {getDayName(day.date)}
                              </div>
                              <motion.div
                                className={`w-8 h-8 rounded-lg border transition-all duration-300 ${
                                  day.completed
                                    ? 'bg-green-500 border-green-400 shadow-lg shadow-green-500/25'
                                    : 'bg-white/5 border-white/20 hover:border-white/40'
                                }`}
                                whileHover={{ scale: 1.1 }}
                                title={`${formatDisplayDate(day.date)} - ${day.completed ? 'Completed' : 'Missed'}`}
                              >
                                {day.completed && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-full h-full flex items-center justify-center text-white text-xs"
                                  >
                                    ✓
                                  </motion.div>
                                )}
                              </motion.div>
                              <div className="text-xs text-gray-500 mt-1">
                                {formatDisplayDate(day.date).split(' ')[1]}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default HistoryView