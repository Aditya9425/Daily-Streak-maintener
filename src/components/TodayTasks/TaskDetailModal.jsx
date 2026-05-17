import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Flag, AlignLeft, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { useTodayTasks } from '../../context/TodayTasksContext';
import { format, parseISO } from 'date-fns';
import { getCategoryDetails } from './taskCategories';
import { DynamicIcon } from '../../utils/iconUtils';

const TaskDetailModal = ({ isOpen, onClose, task }) => {
  const { updateTaskStatus, updateTask, deleteTask } = useTodayTasks();
  
  // Local state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'Medium');
      setIsEditing(false);
    }
  }, [task]);

  if (!task) return null;

  const handleStatusToggle = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateTaskStatus(task.id, newStatus);
    setIsSubmitting(false);
    if (newStatus === 'completed') onClose();
  };

  const handleSave = async () => {
    if (isSubmitting || !title.trim()) return;
    setIsSubmitting(true);
    await updateTask(task.id, { title, description, priority });
    setIsSubmitting(false);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    await deleteTask(task.id);
    setIsSubmitting(false);
    onClose();
  };

  const priorityColors = {
    Low: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    Medium: 'bg-[#FF8A00]/20 text-[#FF8A00] border-[#FF8A00]/30',
    High: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const categoryDetails = getCategoryDetails(task.category);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#15171E] rounded-t-[32px] border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-[#15171E] z-10 px-6 pt-6 pb-4 border-b border-white/5">
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className={`drop-shadow-md ${categoryDetails.color || 'text-[#FF8A00]'}`}>
                    <DynamicIcon iconName={task.emoji || 'CheckCircle'} size={36} />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <span className={`text-[11px] font-medium flex items-center gap-1.5 px-2.5 py-1 rounded-full border w-fit ${categoryDetails.bg} ${categoryDetails.border} ${categoryDetails.color}`}>
                      <span><DynamicIcon iconName={categoryDetails.icon} size={12} /></span>
                      {task.category}
                    </span>
                    {task.due_date && (
                      <span className="text-white/40 text-xs flex items-center gap-1">
                        <Clock size={12} /> 
                        {format(parseISO(task.due_date), 'h:mm a')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDelete}
                    className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Title & Description */}
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xl font-semibold focus:outline-none focus:border-[#FF8A00]/50"
                  />
                  <div className="relative">
                    <div className="absolute top-3 left-4 text-white/40">
                      <AlignLeft size={20} />
                    </div>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FF8A00]/50 min-h-[100px] resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/50 text-sm font-medium mb-2 flex items-center gap-2">
                      <Flag size={16} /> Priority
                    </label>
                    <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10">
                      {['Low', 'Medium', 'High'].map(p => (
                        <button
                          key={p}
                          onClick={() => setPriority(p)}
                          className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
                            priority === p 
                              ? priorityColors[p] + ' border shadow-lg' 
                              : 'text-white/40 hover:text-white/60'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSubmitting || !title.trim()}
                      className="flex-1 py-3 rounded-xl bg-[#FF8A00] hover:bg-[#FF9922] text-black transition-colors font-medium disabled:opacity-50"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div 
                    onClick={() => setIsEditing(true)}
                    className="group cursor-pointer rounded-2xl p-4 -mx-4 hover:bg-white/5 transition-colors"
                  >
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#FF8A00] transition-colors">{task.title}</h3>
                    {task.description && (
                      <p className="text-white/60 whitespace-pre-wrap flex items-start gap-2">
                        <AlignLeft size={16} className="mt-1 flex-shrink-0" />
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 mt-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority] || priorityColors.Medium}`}>
                        {task.priority} Priority
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleStatusToggle}
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-all ${
                      task.status === 'completed'
                        ? 'bg-white/5 text-white/50 border border-white/10'
                        : 'bg-gradient-to-r from-[#FFB347] to-[#FF8A00] text-white shadow-[0_0_20px_rgba(255,138,0,0.3)]'
                    }`}
                  >
                    {task.status === 'completed' ? (
                      <>
                        <CheckCircle2 size={24} /> Mark as Pending
                      </>
                    ) : (
                      <>
                        <Circle size={24} /> Complete Task
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskDetailModal;
