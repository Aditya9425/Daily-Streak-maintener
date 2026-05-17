import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { getCategoryDetails } from './taskCategories';
import { DynamicIcon } from '../../utils/iconUtils';

const TodayTaskCard = ({ task, onClick, onToggleStatus }) => {
  const isCompleted = task.status === 'completed';
  const categoryDetails = getCategoryDetails(task.category);

  const priorityColors = {
    Low: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    Medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    High: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const handleToggle = (e) => {
    e.stopPropagation(); // Prevent opening modal
    onToggleStatus(task);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ 
        scale: 1.01,
        boxShadow: '0 8px 32px rgba(255, 255, 255, 0.05)'
      }}
      onClick={onClick}
      className={`relative group cursor-pointer transition-all duration-300 ${
        isCompleted ? 'opacity-60' : 'opacity-100'
      }`}
    >
      <div className={`backdrop-blur-md border rounded-2xl p-5 transition-all duration-300 ${
        isCompleted 
          ? 'bg-[#15171E]/50 border-white/5' 
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-4 flex-1 min-w-0 pr-4">
            <motion.div 
              className={`mt-0.5 flex-shrink-0 drop-shadow-lg ${isCompleted ? 'text-white/40' : categoryDetails.color || 'text-[#FF8A00]'}`}
              whileHover={!isCompleted ? { scale: 1.1, rotate: 5 } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <DynamicIcon iconName={task.emoji || 'CheckCircle'} size={28} />
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-lg truncate transition-colors duration-300 ${
                isCompleted ? 'text-white/40 line-through' : 'text-white/90'
              }`}>
                {task.title}
              </h3>
              
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className={`text-[11px] font-medium flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all ${
                  isCompleted 
                    ? 'text-white/30 border-white/5 bg-transparent grayscale opacity-50' 
                    : `${categoryDetails.bg} ${categoryDetails.border} ${categoryDetails.color}`
                }`}>
                  <span><DynamicIcon iconName={categoryDetails.icon} size={12} /></span>
                  {task.category}
                </span>
                
                {task.due_date && (
                  <span className={`text-[11px] flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                    isCompleted 
                      ? 'text-white/30 border-white/5 bg-transparent' 
                      : 'text-white/50 border-white/10 bg-black/20'
                  }`}>
                    <Clock size={12} className={!isCompleted ? 'text-[#FFB347]' : ''} />
                    {format(parseISO(task.due_date), 'h:mm a')}
                  </span>
                )}
                
                {!isCompleted && task.priority !== 'Low' && (
                  <span className={`text-[10px] px-2.5 py-1 rounded-full border ${priorityColors[task.priority]}`}>
                    {task.priority} Priority
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Checkbox */}
          <motion.button
            onClick={handleToggle}
            className={`flex-shrink-0 relative w-8 h-8 rounded-full border-[2.5px] transition-all duration-300 flex items-center justify-center overflow-hidden ${
              isCompleted
                ? 'bg-gradient-to-r from-[#FFB347] to-[#FF8A00] border-transparent shadow-[0_0_15px_rgba(255,138,0,0.3)]'
                : 'border-white/20 group-hover:border-white/50 bg-black/20'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence>
              {isCompleted && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                >
                  <Check size={16} strokeWidth={3} className="text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TodayTaskCard;
