import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckSquare, Target } from 'lucide-react';
import { useState } from 'react';
import AddTodayTaskModal from './AddTodayTaskModal';

const ActionSheetModal = ({ isOpen, onClose, onOpenAddHabit }) => {
  const [showAddTask, setShowAddTask] = useState(false);

  // Close the action sheet and open add task
  const handleOpenAddTask = () => {
    setShowAddTask(true);
  };

  const handleCloseAll = () => {
    setShowAddTask(false);
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && !showAddTask && (
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
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#15171E] rounded-t-3xl border-t border-white/10 pb-10 pt-6 px-6 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-8" />
              
              <h3 className="text-xl font-semibold text-white mb-6 text-center">What would you like to add?</h3>
              
              <div className="flex flex-col gap-4">
                <button
                  onClick={onOpenAddHabit}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors w-full text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFB347]/20 to-[#FF8A00]/20 flex items-center justify-center">
                    <Target className="text-[#FF8A00]" size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-lg">Daily Habit</h4>
                    <p className="text-white/50 text-sm">Recurring task to build streaks</p>
                  </div>
                </button>

                <button
                  onClick={handleOpenAddTask}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors w-full text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400/20 to-blue-600/20 flex items-center justify-center">
                    <CheckSquare className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-lg">Today's Task</h4>
                    <p className="text-white/50 text-sm">One-time task for today only</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AddTodayTaskModal 
        isOpen={showAddTask} 
        onClose={handleCloseAll} 
      />
    </>
  );
};

export default ActionSheetModal;
