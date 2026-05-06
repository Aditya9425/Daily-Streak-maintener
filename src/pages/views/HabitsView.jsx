import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Flame } from 'lucide-react'
import { useTasks } from '../../context/TasksContext'
import { DynamicIcon } from '../../utils/iconUtils'
import HabitManagementSheet from '../../components/HabitManagementSheet'
import HabitDetailView from '../../components/HabitDetailView'
import { useOutletContext } from 'react-router-dom'

const HabitsView = () => {
  const { tasks, getTaskStreak } = useTasks()
  const { setIsCustomTaskModalOpen } = useOutletContext() || { setIsCustomTaskModalOpen: () => {} }
  const [isManageSheetOpen, setIsManageSheetOpen] = useState(false)
  const [selectedHabit, setSelectedHabit] = useState(null)

  return (
    <div className="p-4 md:p-8 max-w-xl mx-auto space-y-8 pb-32">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between mt-2"
      >
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Habits</h1>
          <p className="text-white/40 text-sm">Track your consistency</p>
        </div>
        <button 
          onClick={() => setIsManageSheetOpen(true)}
          className="p-2.5 rounded-xl text-white/50 bg-[#1C1F2A] border border-white/5 hover:text-white hover:bg-white/5 transition-all shadow-sm"
        >
          <Settings size={20} />
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="space-y-3">
          {tasks.map((task) => {
            const streak = getTaskStreak(task.task_id)
            return (
              <button
                key={task.task_id}
                onClick={() => setSelectedHabit(task)}
                className="w-full flex items-center justify-between p-4 bg-[#1C1F2A] border border-white/5 rounded-2xl hover:bg-white/5 transition-all shadow-lg active:scale-[0.98]"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 flex-shrink-0 bg-[#15171E] rounded-xl flex items-center justify-center text-white/80 border border-white/5">
                    <DynamicIcon iconName={task.icon} size={22} />
                  </div>
                  <div className="min-w-0 text-left">
                    <h4 className="font-medium text-white/90 truncate">{task.name}</h4>
                    {task.description && <p className="text-[11px] text-white/40 truncate mt-0.5">{task.description}</p>}
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 bg-[#15171E] px-3 py-1.5 rounded-lg border border-white/5 ml-2 flex-shrink-0">
                  <Flame size={14} className="text-[#FF8A00]" />
                  <span className="text-sm font-bold text-white/90">{streak.current}</span>
                </div>
              </button>
            )
          })}
          
          {tasks.length === 0 && (
            <div className="text-center py-10 text-white/40 bg-[#1C1F2A] rounded-3xl border border-white/5">
              <p>No tasks to track yet.</p>
            </div>
          )}
        </div>
      </motion.div>

      <HabitManagementSheet 
        isOpen={isManageSheetOpen} 
        onClose={() => setIsManageSheetOpen(false)} 
        onAddCustom={() => setIsCustomTaskModalOpen(true)}
      />

      <HabitDetailView 
        isOpen={!!selectedHabit}
        onClose={() => setSelectedHabit(null)}
        task={selectedHabit}
      />
    </div>
  )
}

export default HabitsView
