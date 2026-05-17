import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, ChevronDown } from 'lucide-react';
import { useTodayTasks } from '../../context/TodayTasksContext';
import { predefinedCategories, getCategoryDetails } from './taskCategories';
import CategorySelectorModal from './CategorySelectorModal';
import { DynamicIcon } from '../../utils/iconUtils';

const AddTodayTaskModal = ({ isOpen, onClose }) => {
  const { addTask } = useTodayTasks();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('');
  const [emoji, setEmoji] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    // Convert time to ISO string for today if provided
    let dueDateISO = null;
    if (dueTime) {
      const today = new Date();
      const [hours, minutes] = dueTime.split(':');
      today.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      dueDateISO = today.toISOString();
    }

    await addTask({
      title,
      description,
      priority,
      category: category || 'General',
      emoji: emoji || 'CheckCircle',
      due_date: dueDateISO
    });

    setIsSubmitting(false);
    resetForm();
    onClose();
  };

  const handleSelectCategory = (catName) => {
    setCategory(catName);
    const catDetails = getCategoryDetails(catName);
    setEmoji(catDetails.icon);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setCategory('');
    setEmoji('');
    setDueTime('');
    setIsCategoryModalOpen(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const priorityColors = {
    Low: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    Medium: 'bg-[#FF8A00]/20 text-[#FF8A00] border-[#FF8A00]/30',
    High: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  // Preview styling for selected category
  const activeCatDetails = category ? getCategoryDetails(category) : null;

  return (
    <>
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
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-[480px] bg-[#15171E] border border-white/5 rounded-3xl z-50 overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 overflow-y-auto max-h-full no-scrollbar">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#FF8A00]/10 rounded-full">
                      <Plus className="text-[#FF8A00]" size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Add Today's Task</h2>
                      <p className="text-white/40 text-sm">Plan your day with intention.</p>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="text-white" size={20} />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Task Name */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Task Name *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Read 30 minutes"
                      className="w-full p-3.5 bg-white/5 border border-white/5 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#FF8A00]/50 transition-colors"
                      required
                    />
                  </div>

                  {/* Category Selection Button */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Category
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCategoryModalOpen(true)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 ${
                        category
                          ? 'bg-[#1C1F2A] border-[#FF8A00]/30 shadow-[0_0_15px_rgba(255,138,0,0.1)]'
                          : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                      }`}
                    >
                      {category ? (
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeCatDetails.bg} ${activeCatDetails.border} border`}>
                            <DynamicIcon iconName={activeCatDetails.icon} className={activeCatDetails.color} size={16} />
                          </div>
                          <span className="text-white font-medium">{category}</span>
                        </div>
                      ) : (
                        <span className="text-white/40">Select a category...</span>
                      )}
                      <ChevronDown className="text-white/40" size={16} />
                    </button>
                  </div>

                  {/* Due Time */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Due Time
                    </label>
                    <input
                      type="time"
                      value={dueTime}
                      onChange={(e) => setDueTime(e.target.value)}
                      className="w-full p-3.5 bg-white/5 border border-white/5 rounded-xl text-white focus:outline-none focus:border-[#FF8A00]/50 transition-colors [color-scheme:dark]"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Description (optional)
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of your task"
                      className="w-full p-3.5 bg-white/5 border border-white/5 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#FF8A00]/50 transition-colors min-h-[80px] resize-none"
                    />
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Priority
                    </label>
                    <div className="flex gap-2">
                      {['Low', 'Medium', 'High'].map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`flex-1 p-3.5 text-sm font-medium rounded-xl border transition-all duration-300 ${
                            priority === p 
                              ? priorityColors[p]
                              : 'bg-white/5 border-white/5 text-white/40 hover:text-white/80 hover:bg-white/10'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 p-3.5 border border-white/10 rounded-xl text-white/70 hover:bg-white/5 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || !title.trim() || !category}
                      className="flex-1 p-3.5 bg-[#FF8A00] text-black rounded-xl font-medium hover:bg-[#FF9922] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_15px_rgba(255,138,0,0.2)]"
                      whileHover={!isSubmitting && title.trim() && category ? { scale: 1.02 } : {}}
                      whileTap={!isSubmitting && title.trim() && category ? { scale: 0.98 } : {}}
                    >
                      {isSubmitting ? 'Adding...' : 'Add Task'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CategorySelectorModal 
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        selectedCategory={category}
        onSelectCategory={handleSelectCategory}
      />
    </>
  );
};

export default AddTodayTaskModal;
