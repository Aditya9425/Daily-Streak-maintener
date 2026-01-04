import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Smile } from 'lucide-react'
import { useTasks } from '../context/TasksContext'

const EMOJI_OPTIONS = [
  '📚', '💻', '🏃', '🎯', '🎨', '🎵', '📝', '🧘', 
  '🍎', '💪', '🌱', '⚡', '🔥', '🎪', '🚀', '⭐'
]

const CustomTaskModal = ({ isOpen, onClose }) => {
  const { addCustomTask } = useTasks()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📝',
    frequency: 'daily'
  })
  const [loading, setLoading] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    setLoading(true)
    try {
      await addCustomTask(formData)
      setFormData({ name: '', description: '', icon: '📝', frequency: 'daily' })
      onClose()
    } catch (error) {
      console.error('Error adding custom task:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({ name: '', description: '', icon: '📝', frequency: 'daily' })
    setShowEmojiPicker(false)
    onClose()
  }

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
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-black/90 backdrop-blur-xl border border-white/10 rounded-3xl z-50 overflow-hidden"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-full">
                    <Plus className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Add Custom Task</h2>
                    <p className="text-gray-400 text-sm">Create your own daily habit</p>
                  </div>
                </div>
                
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="text-white" size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Icon Selector */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Icon
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="w-full flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <span className="text-2xl">{formData.icon}</span>
                      <span className="text-white">Choose emoji</span>
                      <Smile className="text-gray-400 ml-auto" size={16} />
                    </button>
                    
                    <AnimatePresence>
                      {showEmojiPicker && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-2 p-3 bg-black/90 border border-white/10 rounded-xl grid grid-cols-8 gap-2 z-10"
                        >
                          {EMOJI_OPTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, icon: emoji }))
                                setShowEmojiPicker(false)
                              }}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-xl"
                            >
                              {emoji}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Task Name */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Task Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Read 30 minutes"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-colors"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Description (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of your task"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Frequency
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30 transition-colors"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 p-3 border border-white/20 rounded-xl text-white hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={loading || !formData.name.trim()}
                    className="flex-1 p-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={!loading && formData.name.trim() ? { scale: 1.02 } : {}}
                    whileTap={!loading && formData.name.trim() ? { scale: 0.98 } : {}}
                  >
                    {loading ? 'Adding...' : 'Add Task'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CustomTaskModal