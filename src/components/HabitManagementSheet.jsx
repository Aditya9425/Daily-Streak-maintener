import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, AlertTriangle, Plus } from 'lucide-react'
import { useTasks } from '../context/TasksContext'
import { DynamicIcon } from '../utils/iconUtils'

const HabitManagementSheet = ({ isOpen, onClose, onAddCustom }) => {
  const { tasks, deleteTask } = useTasks()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  const handleDeleteTask = async (taskId) => {
    if (deleteConfirmText !== 'delete this task') return
    try {
      await deleteTask(taskId)
      setShowDeleteConfirm(null)
      setDeleteConfirmText('')
      if (tasks.length === 1) onClose()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[60]"
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed bottom-0 left-0 right-0 z-[70] bg-[#15171E] rounded-t-3xl border-t border-white/5 p-6 max-h-[85vh] overflow-y-auto shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:max-w-xl md:mx-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:rounded-3xl md:border"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Manage Habits</h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-[#1C1F2A] border border-white/5 hover:bg-white/5 transition-colors text-white/50 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.task_id} className="flex items-center justify-between p-3 bg-[#1C1F2A] border border-white/5 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex-shrink-0 bg-[#15171E] rounded-xl flex items-center justify-center text-white/80 border border-white/5">
                      <DynamicIcon iconName={task.icon} size={18} />
                    </div>
                    <span className="font-medium text-white/90">{task.name}</span>
                  </div>
                  <button
                    onClick={() => setShowDeleteConfirm(task)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              <button
                onClick={() => {
                  onClose()
                  onAddCustom()
                }}
                className="w-full flex items-center justify-center gap-2 p-4 bg-[#1C1F2A] border border-white/5 rounded-2xl text-white/60 hover:text-white hover:bg-white/5 transition-colors mt-4"
              >
                <Plus size={18} />
                <span className="font-medium">Add New Habit</span>
              </button>
            </div>
          </motion.div>

          {/* Delete Confirmation Modal Overlay */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-[#15171E] border border-white/5 rounded-[32px] p-6 w-full max-w-md shadow-2xl"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-red-500/10 rounded-2xl text-red-400">
                      <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white">Delete Habit</h3>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-white/80 mb-4 text-sm">
                      You are about to delete <strong>{showDeleteConfirm.name}</strong>.
                    </p>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-xs text-red-400">
                      <p className="font-semibold mb-2">⚠️ This will permanently remove:</p>
                      <ul className="list-disc list-inside space-y-1 opacity-80">
                        <li>All streak history</li>
                        <li>All completion logs</li>
                        <li>This action cannot be undone</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-white/60 text-xs font-medium mb-2">
                      Type "delete this task" to confirm:
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="delete this task"
                      className="w-full p-3 bg-[#1C1F2A] border border-white/5 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 transition-colors text-sm"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(null)
                        setDeleteConfirmText('')
                      }}
                      className="flex-1 p-3 border border-white/10 rounded-xl text-white/70 hover:bg-white/5 transition-colors font-medium text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteTask(showDeleteConfirm.task_id)}
                      disabled={deleteConfirmText !== 'delete this task'}
                      className="flex-1 p-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_15px_rgba(239,68,68,0.3)] text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  )
}

export default HabitManagementSheet
