import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2 } from 'lucide-react'
import { useTasks } from '../context/TasksContext'
import { DynamicIcon } from '../utils/iconUtils'
import { getTodayString } from '../utils/dateUtils'
import { subDays, format, parseISO } from 'date-fns'

const HabitDetailView = ({ isOpen, onClose, task }) => {
  const { taskLogs, getTaskStreak, toggleTask } = useTasks()
  const todayStr = getTodayString()

  if (!task) return null

  const isCompletedToday = useMemo(() => {
    return taskLogs.some(log => log.task_id === task.task_id && log.date === todayStr && log.completed)
  }, [taskLogs, task.task_id, todayStr])

  const stats = useMemo(() => {
    const streak = getTaskStreak(task.task_id)
    const completions = taskLogs.filter(log => log.task_id === task.task_id && log.completed).length
    return { currentStreak: streak.current, bestStreak: streak.longest, completions }
  }, [taskLogs, task.task_id, getTaskStreak])

  const { timeline, graphPoints, currentStrength } = useMemo(() => {
    // 7 day timeline
    const recent7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = format(subDays(parseISO(todayStr), i), 'yyyy-MM-dd')
      const isCompleted = taskLogs.some(l => l.task_id === task.task_id && l.date === date && l.completed)
      recent7Days.push({ date, isCompleted })
    }

    // 30 day graph (simplistic rolling completion)
    const graphData = []
    let rollingCount = 0
    for (let i = 29; i >= 0; i--) {
      const date = format(subDays(parseISO(todayStr), i), 'yyyy-MM-dd')
      const isCompleted = taskLogs.some(l => l.task_id === task.task_id && l.date === date && l.completed)
      if (isCompleted) rollingCount++
      
      // to make the line chart smooth, we use a 7-day moving average
      let movingAvg = 0
      for(let j = 0; j < 7; j++) {
        const d = format(subDays(parseISO(todayStr), i + j), 'yyyy-MM-dd')
        if (taskLogs.some(l => l.task_id === task.task_id && l.date === d && l.completed)) {
          movingAvg++
        }
      }
      graphData.push(movingAvg)
    }

    const maxVal = Math.max(...graphData, 1) // prevent div by zero
    const w = 300
    const h = 60
    const points = graphData.map((val, idx) => {
      const x = (idx / 29) * w
      const y = h - (val / maxVal) * h
      return `${x},${y}`
    })
    
    const strengthPercentage = Math.round((rollingCount / 30) * 100)

    return { timeline: recent7Days, graphPoints: `M ${points.join(' L ')}`, currentStrength: strengthPercentage }
  }, [taskLogs, task.task_id, todayStr])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-[80]"
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="fixed bottom-0 left-0 right-0 top-0 sm:top-10 md:top-1/2 md:-translate-y-1/2 md:bottom-auto z-[90] bg-[#0B0C10] rounded-t-3xl md:rounded-3xl border-t md:border border-white/5 p-6 md:p-8 max-h-[100dvh] overflow-y-auto shadow-2xl md:max-w-sm md:mx-auto flex flex-col"
          >
            {/* Header / Nav */}
            <div className="flex justify-between items-start mb-4">
              <button onClick={onClose} className="p-2 text-white/50 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 space-y-6">
              {/* Top Hero */}
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                  <DynamicIcon iconName={task.icon} size={40} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">{task.name}</h2>
                <p className="text-sm text-white/40 max-w-[250px]">{task.description || 'Consistent habits build momentum.'}</p>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#1C1F2A] border border-white/5 rounded-2xl p-3 text-center">
                  <span className="text-[9px] text-white/40 uppercase tracking-wider block mb-1">Current Streak</span>
                  <span className="text-lg font-bold text-white block">{stats.currentStreak}</span>
                  <span className="text-[9px] text-white/30 uppercase tracking-wider">days</span>
                </div>
                <div className="bg-[#1C1F2A] border border-white/5 rounded-2xl p-3 text-center">
                  <span className="text-[9px] text-white/40 uppercase tracking-wider block mb-1">Best Streak</span>
                  <span className="text-lg font-bold text-[#FF8A00] block">{stats.bestStreak}</span>
                  <span className="text-[9px] text-white/30 uppercase tracking-wider">days</span>
                </div>
                <div className="bg-[#1C1F2A] border border-white/5 rounded-2xl p-3 text-center">
                  <span className="text-[9px] text-white/40 uppercase tracking-wider block mb-1">Total Comps</span>
                  <span className="text-lg font-bold text-white block">{stats.completions}</span>
                  <span className="text-[9px] text-white/30 uppercase tracking-wider">times</span>
                </div>
              </div>

              {/* Streak History */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-semibold text-white/90">Streak History</h3>
                <div className="flex justify-between items-center px-1">
                  {timeline.map((day, i) => (
                    <div key={day.date} className="flex flex-col items-center gap-1.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-[1.5px] ${
                        day.isCompleted 
                          ? 'border-[#FF8A00] bg-[#FF8A00]/10 text-[#FF8A00] shadow-[0_0_10px_rgba(255,138,0,0.3)]' 
                          : 'border-white/10 text-transparent'
                      }`}>
                        {day.isCompleted && <DynamicIcon iconName="flame" size={14} />}
                      </div>
                      <span className="text-[9px] text-white/40 font-medium">{format(parseISO(day.date), 'MMM d')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Habit Strength Graph */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-semibold text-white/90">Habit Strength</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-green-500/70 font-semibold">{currentStrength >= 70 ? 'Strong' : currentStrength >= 40 ? 'Good' : 'Needs Work'}</span>
                    <span className="text-sm font-bold text-white">{currentStrength}%</span>
                  </div>
                </div>
                <div className="h-14 relative w-full pt-1">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 60" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="strength-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d={`${graphPoints} L 300,60 L 0,60 Z`} fill="url(#strength-fill)" />
                    <path d={graphPoints} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* About */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-white/90">About this habit</h3>
                <p className="text-xs text-white/40 leading-relaxed max-w-[90%]">
                  Building a consistent streak helps rewire your brain and establishes strong momentum toward your long-term goals.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6 pt-4 border-t border-white/5 pb-safe">
              {isCompletedToday ? (
                <div className="w-full py-3.5 rounded-2xl bg-[#1C1F2A] border border-white/5 text-white/60 flex items-center justify-center gap-2 font-medium text-sm">
                  <CheckCircle2 size={18} />
                  Completed Today
                </div>
              ) : (
                <button
                  onClick={() => toggleTask(task.task_id)}
                  className="w-full py-3.5 rounded-2xl bg-[#1C1F2A] border border-white/10 text-white font-medium flex items-center justify-center gap-2 shadow-lg hover:bg-white/5 active:scale-[0.98] transition-all text-sm"
                >
                  <CheckCircle2 size={18} className="text-[#FF8A00]" />
                  Mark as Completed
                </button>
              )}
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default HabitDetailView
