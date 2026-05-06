import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, ChevronDown } from 'lucide-react'
import { useTasks } from '../context/TasksContext'
import { PREMIUM_ICONS, DynamicIcon, getIconForTask } from '../utils/iconUtils'

const CustomTaskModal = ({ isOpen, onClose }) => {
  const { addCustomTask } = useTasks()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    frequency: 'daily'
  })
  const [loading, setLoading] = useState(false)
  const [showIconPicker, setShowIconPicker] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    setLoading(true)
    try {
      // Resolve the icon automatically if the user didn't pick one
      const finalIcon = getIconForTask(formData.name, formData.icon)
      
      await addCustomTask({ ...formData, icon: finalIcon })
      
      setFormData({ name: '', description: '', icon: '', frequency: 'daily' })
      onClose()
    } catch (error) {
      console.error('Error adding custom task:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({ name: '', description: '', icon: '', frequency: 'daily' })
    setShowIconPicker(false)
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
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-[#15171E] border border-white/5 rounded-3xl z-50 overflow-hidden shadow-2xl"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#FF8A00]/10 rounded-full">
                    <Plus className="text-[#FF8A00]" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Add Custom Task</h2>
                    <p className="text-white/40 text-sm">Create your own daily habit</p>
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
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Icon (Optional)
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowIconPicker(!showIconPicker)}
                      className="w-full flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <span className="text-[#FF8A00] flex items-center justify-center">
                        {formData.icon ? <DynamicIcon iconName={formData.icon} size={20} /> : <div className="w-5 h-5 border-2 border-dashed border-white/30 rounded-full flex items-center justify-center"><span className="text-white/30 text-[10px]">?</span></div>}
                      </span>
                      <span className={formData.icon ? "text-white" : "text-white/40"}>
                        {formData.icon ? 'Icon Selected' : 'Auto-select based on name'}
                      </span>
                      <ChevronDown className="text-white/40 ml-auto" size={16} />
                    </button>
                    
                    <AnimatePresence>
                      {showIconPicker && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-2 p-4 bg-[#1C1F2A] border border-white/5 rounded-2xl grid grid-cols-6 gap-3 z-10 shadow-xl max-h-[250px] overflow-y-auto"
                        >
                          {PREMIUM_ICONS.map((iconName) => (
                            <button
                              key={iconName}
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, icon: iconName }))
                                setShowIconPicker(false)
                              }}
                              className={`p-3 rounded-xl flex items-center justify-center transition-colors ${
                                formData.icon === iconName 
                                  ? 'bg-[#FF8A00] text-black shadow-[0_0_15px_rgba(255,138,0,0.3)]' 
                                  : 'text-white/60 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              <DynamicIcon iconName={iconName} size={20} />
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Task Name */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Task Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Read 30 minutes"
                    className="w-full p-3 bg-white/5 border border-white/5 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#FF8A00]/50 transition-colors"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Description (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of your task"
                    className="w-full p-3 bg-white/5 border border-white/5 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#FF8A00]/50 transition-colors"
                  />
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Frequency
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                    className="w-full p-3 bg-white/5 border border-white/5 rounded-xl text-white focus:outline-none focus:border-[#FF8A00]/50 transition-colors [&>option]:bg-[#1C1F2A]"
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
                    className="flex-1 p-3 border border-white/10 rounded-xl text-white/70 hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={loading || !formData.name.trim()}
                    className="flex-1 p-3 bg-[#FF8A00] text-black rounded-xl font-medium hover:bg-[#FF9922] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_15px_rgba(255,138,0,0.2)]"
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