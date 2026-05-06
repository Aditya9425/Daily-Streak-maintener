import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react'
import { useTasks } from '../context/TasksContext'
import { getTodayString } from '../utils/dateUtils'
import { 
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, format, addMonths, subMonths, 
  isSameMonth, parseISO 
} from 'date-fns'
import { DynamicIcon } from '../utils/iconUtils'

const Calendar = () => {
  const { analyticsService, loading, selectedDate, setSelectedDate, tasks, taskLogs } = useTasks()
  
  // Use today as parsed date for baseline
  const todayStr = getTodayString()
  const [viewDate, setViewDate] = useState(parseISO(todayStr))
  
  if (loading || !analyticsService) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="w-32 h-6 bg-white/10 rounded mb-4 mx-auto"></div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="aspect-square bg-white/10 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  const weeklyStats = analyticsService.getWeeklyStats()

  // Generate calendar grid
  const { gridDays, monthStats, selectedDayStats } = useMemo(() => {
    const monthStart = startOfMonth(viewDate)
    const monthEnd = endOfMonth(viewDate)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate })

    let perfectDays = 0
    let partialDays = 0
    let totalCompletionScore = 0
    let validDaysCount = 0

    let selectedStats = null

    const days = dateRange.map(dateObj => {
      const dateStr = format(dateObj, 'yyyy-MM-dd')
      const isCurrentMonth = isSameMonth(dateObj, viewDate)
      
      const dayLogs = taskLogs.filter(log => log.date === dateStr)
      const completedLogs = dayLogs.filter(log => log.completed)
      const totalTasksCount = tasks.length
      
      const completedCount = completedLogs.length
      const completionPercentage = totalTasksCount > 0 ? Math.round((completedCount / totalTasksCount) * 100) : 0
      
      let status = 'none'
      if (totalTasksCount > 0) {
        if (completionPercentage === 100) status = 'full'
        else if (completionPercentage > 0) status = 'partial'
      }

      // Calculate stats for current month up to today
      if (isCurrentMonth && dateStr <= todayStr && totalTasksCount > 0) {
        if (status === 'full') perfectDays++
        if (status === 'partial') partialDays++
        totalCompletionScore += completionPercentage
        validDaysCount++
      }

      const dayData = {
        dateStr,
        dateObj,
        isCurrentMonth,
        status,
        completionPercentage,
        completedCount,
        totalTasksCount,
        completedTaskIds: completedLogs.map(l => l.task_id)
      }

      if (dateStr === selectedDate) {
        selectedStats = dayData
      }

      return dayData
    })

    const avgCompletion = validDaysCount > 0 ? Math.round(totalCompletionScore / validDaysCount) : 0

    return { 
      gridDays: days, 
      monthStats: { perfectDays, partialDays, avgCompletion },
      selectedDayStats: selectedStats
    }
  }, [viewDate, taskLogs, tasks, selectedDate, todayStr])

  const handlePrevMonth = () => setViewDate(subMonths(viewDate, 1))
  const handleNextMonth = () => setViewDate(addMonths(viewDate, 1))

  const getRingColor = (status, isToday, isSelected) => {
    let classes = "flex items-center justify-center transition-all duration-300 rounded-full "
    
    // Status styles
    if (status === 'full') {
      classes += "border-2 border-[#FF8A00] text-white font-bold bg-[#FF8A00]/10 shadow-[0_0_12px_rgba(255,138,0,0.3)] "
    } else if (status === 'partial') {
      classes += "border border-[#FFB347]/60 text-white/80 font-medium bg-[#FFB347]/5 shadow-[0_0_8px_rgba(255,179,71,0.15)] "
    } else {
      // Inactive day
      classes += "border border-white/5 font-medium "
      if (isToday) {
        classes += "bg-white/10 text-white/90 "
      } else {
        classes += "bg-[#15171E] text-white/30 "
      }
    }

    // Today highlight for active days
    if (isToday && status !== 'none') {
      classes += "ring-1 ring-white/30 "
    }

    // Selected highlight
    if (isSelected) {
      classes += "ring-2 ring-white/50 scale-110 z-10 shadow-[0_0_20px_rgba(255,255,255,0.2)] "
    }

    return classes
  }

  return (
    <div className="space-y-6">
      
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-2 px-2">
        <button 
          onClick={handlePrevMonth}
          className="p-2 rounded-full hover:bg-white/5 transition-colors text-white/50 hover:text-white"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
        <h3 className="text-lg font-bold text-white tracking-wide">
          {format(viewDate, 'MMMM yyyy')}
        </h3>
        <button 
          onClick={handleNextMonth}
          className="p-2 rounded-full hover:bg-white/5 transition-colors text-white/50 hover:text-white"
        >
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>
      </div>
      
      {/* Calendar Grid */}
      <div className="w-full px-2">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={index} className="text-center text-[10px] uppercase tracking-wider text-white/40 font-semibold">
              {day}
            </div>
          ))}
        </div>
        
        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {gridDays.map((dayData, index) => {
            const isToday = dayData.dateStr === todayStr
            const isSelected = dayData.dateStr === selectedDate
            const isMuted = !dayData.isCurrentMonth
            
            return (
              <motion.div 
                key={dayData.dateStr} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.005 }}
                className="flex justify-center aspect-square"
              >
                <button
                  onClick={() => setSelectedDate(dayData.dateStr)}
                  className={`w-full h-full rounded-full text-xs sm:text-sm ${
                    getRingColor(dayData.status, isToday, isSelected)
                  } ${isMuted ? 'opacity-20' : 'opacity-100'} hover:scale-105 active:scale-95`}
                >
                  {format(dayData.dateObj, 'd')}
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Selected Day Details */}
      {selectedDayStats && tasks.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-6 border-t border-white/5 mt-4"
        >
          <div className="flex items-end justify-between mb-4 px-2">
            <div>
              <h4 className="text-white font-semibold text-sm">{format(parseISO(selectedDate), 'MMMM d, yyyy')}</h4>
              {selectedDate === todayStr && <span className="text-[10px] uppercase tracking-wider text-[#FF8A00] font-semibold">Today</span>}
            </div>
            <span className="text-xs font-medium text-white/50">
              {selectedDayStats.completedCount}/{selectedDayStats.totalTasksCount} completed
            </span>
          </div>
          
          <div className="space-y-2">
            {tasks.map(task => {
              const isCompleted = selectedDayStats.completedTaskIds.includes(task.task_id)
              return (
                <div key={task.task_id} className="flex items-center justify-between bg-[#1C1F2A] border border-white/5 p-3 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                      isCompleted ? 'bg-[#FF8A00]/10 border-[#FF8A00]/30 text-[#FF8A00]' : 'bg-[#15171E] border-white/5 text-white/40'
                    }`}>
                      <DynamicIcon iconName={task.icon} size={16} />
                    </div>
                    <span className={`text-sm font-medium ${isCompleted ? 'text-white' : 'text-white/40'}`}>
                      {task.name}
                    </span>
                  </div>
                  <div className={`${isCompleted ? 'text-[#FF8A00]' : 'text-white/5'}`}>
                    {isCompleted ? <CheckCircle2 size={20} fill="currentColor" className="text-[#1C1F2A]" /> : <Circle size={20} />}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
      
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 pt-6 border-t border-white/5 mt-4">
        <div className="bg-[#1C1F2A] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center">
          <div className="text-xl font-bold text-white mb-1">{monthStats.perfectDays}</div>
          <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">Perfect Days</div>
        </div>
        
        <div className="bg-[#1C1F2A] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center">
          <div className="text-xl font-bold text-white mb-1">{monthStats.partialDays}</div>
          <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">Partial Days</div>
        </div>
        
        <div className="bg-[#1C1F2A] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center">
          <div className="text-xl font-bold text-white mb-1">{monthStats.avgCompletion}%</div>
          <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">Avg Completion</div>
        </div>
        
        <div className="bg-[#1C1F2A] border border-[#FF8A00]/10 rounded-2xl p-4 flex flex-col items-center justify-center">
          <div className="text-xl font-bold text-[#FF8A00] mb-1">{weeklyStats.completionRate}%</div>
          <div className="text-[10px] uppercase tracking-wider text-[#FF8A00]/60 font-semibold">This Week</div>
        </div>
      </div>

    </div>
  )
}

export default Calendar