import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTodayTasks } from '../../context/TodayTasksContext';
import TodayTaskCard from './TodayTaskCard';
import TaskDetailModal from './TaskDetailModal';
import AddTodayTaskModal from './AddTodayTaskModal';
import { Target, CheckCircle2, Plus } from 'lucide-react';

const TodayTasksSection = () => {
  const { tasks, loading, updateTaskStatus } = useTodayTasks();
  const [filter, setFilter] = useState('All'); // All, Pending, Completed
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  
  const filteredTasks = tasks.filter(t => {
    if (filter === 'Pending') return !t.completed;
    if (filter === 'Completed') return t.completed;
    return true;
  });

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateTaskStatus(task.id, newStatus);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-white/5 rounded-lg w-1/3"></div>
          <div className="h-8 bg-white/5 rounded-full w-24"></div>
        </div>
        <div className="h-[88px] bg-white/5 rounded-2xl w-full"></div>
        <div className="h-[88px] bg-white/5 rounded-2xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight whitespace-nowrap">
              <div className="p-2 bg-gradient-to-br from-[#FFB347]/20 to-[#FF8A00]/20 rounded-xl border border-[#FFB347]/20 shadow-[0_0_15px_rgba(255,138,0,0.1)]">
                <Target className="text-[#FFB347]" size={20} strokeWidth={2.5} />
              </div>
              Today's Focus
            </h2>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors border border-white/5 hover:border-white/10 flex-shrink-0"
              title="Add Task"
            >
              <Plus size={18} strokeWidth={2.5} />
            </button>
          </div>
          <p className="text-white/40 text-sm mt-1.5 ml-1">
            {completedTasks.length} of {tasks.length} tasks completed
          </p>
        </div>

        {tasks.length > 0 && (
          <div className="flex bg-black/20 rounded-xl p-1 border border-white/5 shadow-inner">
            {['All', 'Pending'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-300 ${
                  filter === f 
                    ? 'bg-white/10 text-white border border-white/10 shadow-sm' 
                    : 'text-white/30 hover:text-white/60 hover:bg-white/5'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TodayTaskCard
                key={task.id}
                task={task}
                onClick={() => setSelectedTask(task)}
                onToggleStatus={handleToggleStatus}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-10 bg-[#15171E]/50 rounded-3xl border border-white/5 backdrop-blur-md"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-inner">
                <CheckCircle2 className="text-white/20" size={28} />
              </div>
              <h3 className="text-white/80 font-medium text-lg mb-1">
                {filter === 'Pending' 
                  ? "All caught up!" 
                  : "No tasks yet"}
              </h3>
              <p className="text-white/40 text-sm">
                {filter === 'Pending' 
                  ? "You've completed all your focused tasks for today." 
                  : "Tap the + button to plan your day."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <TaskDetailModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
      />
      
      <AddTodayTaskModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
};

export default TodayTasksSection;
