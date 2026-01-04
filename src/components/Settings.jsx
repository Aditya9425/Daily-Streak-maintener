import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Trash2, AlertTriangle } from 'lucide-react'
import { useTasks } from '../context/TasksContext'

const EMOJI_OPTIONS = [
  '📚', '💻', '🏃', '🎯', '🎨', '🎵', '📝', '🧘', 
  '🍎', '💪', '🌱', '⚡', '🔥', '🎪', '🚀', '⭐'
]

const Settings = ({ isOpen, onClose }) => {
  const { tasks, addCustomTask, deleteTask } = useTasks()
  const [activeTab, setActiveTab] = useState('manage')
  const [showAddTask, setShowAddTask] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    icon: '📝'
  })

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTask.name.trim()) return

    try {
      await addCustomTask(newTask)
      setNewTask({ name: '', description: '', icon: '📝' })
      setShowAddTask(false)
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (deleteConfirmText !== 'delete this task') return

    try {
      await deleteTask(taskId)
      setShowDeleteConfirm(null)
      setDeleteConfirmText('')
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="text-white" size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* Manage Tasks Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Manage Tasks</h3>
                <button
                  onClick={() => setShowAddTask(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <Plus size={16} />
                  Add Task
                </button>
              </div>

              {/* Task List */}
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.task_id}
                    className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{task.icon}</span>
                      <div>
                        <h4 className="font-medium text-white">{task.name}</h4>
                        {task.description && (
                          <p className="text-sm text-white/60">{task.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setShowDeleteConfirm(task)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {tasks.length === 0 && (
                  <div className="text-center py-8 text-white/60">
                    <div className="text-4xl mb-2">📝</div>
                    <p>No tasks yet. Add your first task to get started!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Add Task Modal */}
          <AnimatePresence>
            {showAddTask && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 overflow-y-auto"
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="bg-black border border-white/10 rounded-2xl p-6 w-full max-w-md my-8 max-h-[90vh] overflow-y-auto"
                >
                  <h3 className="text-xl font-bold text-white mb-4">Add New Task</h3>
                  
                  <form onSubmit={handleAddTask} className="space-y-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Icon</label>
                      <div className="grid grid-cols-8 gap-2">
                        {EMOJI_OPTIONS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setNewTask(prev => ({ ...prev, icon: emoji }))}
                            className={`p-2 rounded-lg text-xl transition-colors ${
                              newTask.icon === emoji ? 'bg-white/20' : 'hover:bg-white/10'
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Task Name *</label>
                      <input
                        type="text"
                        value={newTask.name}
                        onChange={(e) => setNewTask(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Read 30 minutes"
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/30"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Description</label>
                      <input
                        type="text"
                        value={newTask.description}
                        onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Optional description"
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/30"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowAddTask(false)}
                        className="flex-1 p-3 border border-white/20 rounded-xl text-white hover:bg-white/5 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!newTask.name.trim()}
                        className="flex-1 p-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        Add Task
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="bg-black border border-red-500/20 rounded-2xl p-6 w-full max-w-md"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="text-red-400" size={24} />
                    <h3 className="text-xl font-bold text-white">Delete Task</h3>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-white mb-2">
                      You are about to delete <strong>{showDeleteConfirm.name}</strong>
                    </p>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
                      <p>⚠️ This will permanently remove:</p>
                      <ul className="list-disc list-inside mt-1">
                        <li>All streak history</li>
                        <li>All completion logs</li>
                        <li>This action cannot be undone</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-white text-sm font-medium mb-2">
                      Type "delete this task" to confirm:
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="delete this task"
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(null)
                        setDeleteConfirmText('')
                      }}
                      className="flex-1 p-3 border border-white/20 rounded-xl text-white hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteTask(showDeleteConfirm.task_id)}
                      disabled={deleteConfirmText !== 'delete this task'}
                      className="flex-1 p-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Delete Forever
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Settings