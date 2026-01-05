import { motion } from 'framer-motion'
import { useTasks } from '../context/TasksContext'
import { formatDisplayDate, getDayName, getTodayString } from '../utils/dateUtils'

const Calendar = () => {
  const { analyticsService, loading, selectedDate, setSelectedDate } = useTasks()
  
  if (loading || !analyticsService) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Activity Calendar</h3>
        <div className="animate-pulse">
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="w-8 h-8 bg-white/10 rounded-sm"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  // Get calendar data from analytics service
  const calendarData = analyticsService.getCalendarData(35) // 5 weeks
  const todayStats = analyticsService.getTodayStats()
  const weeklyStats = analyticsService.getWeeklyStats()
  const today = getTodayString()

  const handleDateClick = (date) => {
    setSelectedDate(date)
  }

  const getCompletionColor = (status, isToday, isSelected) => {
    if (isSelected && !isToday) {
      // Selected past date - blue highlight
      switch (status) {
        case 'full': return 'bg-blue-500 ring-2 ring-blue-300'
        case 'partial': return 'bg-blue-400 ring-2 ring-blue-300'
        case 'none': return 'bg-blue-600 ring-2 ring-blue-300'
        case 'no-tasks': return 'bg-blue-700 ring-2 ring-blue-300'
        default: return 'bg-blue-700 ring-2 ring-blue-300'
      }
    }
    
    if (isToday) {
      // Today - white ring
      switch (status) {
        case 'full': return 'bg-green-500 ring-2 ring-white'
        case 'partial': return 'bg-yellow-500 ring-2 ring-white'
        case 'none': return 'bg-gray-700 ring-2 ring-white'
        case 'no-tasks': return 'bg-gray-800 ring-2 ring-white'
        default: return 'bg-gray-800 ring-2 ring-white'
      }
    }
    
    // Normal days
    switch (status) {
      case 'full': return 'bg-green-500 hover:bg-green-400'
      case 'partial': return 'bg-yellow-500 hover:bg-yellow-400'
      case 'none': return 'bg-gray-700 hover:bg-gray-600'
      case 'no-tasks': return 'bg-gray-800 hover:bg-gray-700'
      default: return 'bg-gray-800 hover:bg-gray-700'
    }
  }

  // Calculate summary stats
  const perfectDays = calendarData.filter(day => day.status === 'full').length
  const partialDays = calendarData.filter(day => day.status === 'partial').length
  const avgCompletion = Math.round(
    calendarData.reduce((sum, day) => sum + day.completionPercentage, 0) / calendarData.length
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Activity Calendar</h3>
        <div className="flex items-center gap-3 text-xs text-white/60">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-sm"></div>
            <span>Complete</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-sm"></div>
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gray-700 rounded-sm"></div>
            <span>None</span>
          </div>
        </div>
      </div>
      
      {/* Calendar Grid - Mobile Optimized */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={index} className="text-center text-xs text-white/40 font-medium p-1 w-8 sm:w-10">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days - Mobile optimized like the reference image */}
          <div className="grid grid-cols-7 gap-1">
            {calendarData.map((dayData, index) => {
              const dayName = getDayName(dayData.date)
              const displayDate = formatDisplayDate(dayData.date)
              const isToday = dayData.date === today
              const isSelected = dayData.date === selectedDate
              const dayNumber = new Date(dayData.date).getDate()
              
              return (
                <motion.div
                  key={dayData.date}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01 }}
                  className="group relative"
                >
                  <button
                    onClick={() => handleDateClick(dayData.date)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${getCompletionColor(dayData.status, isToday, isSelected)} 
                      transition-all duration-200 cursor-pointer flex items-center justify-center
                      text-xs sm:text-sm font-medium text-white hover:scale-110 active:scale-95
                      focus:outline-none focus:ring-2 focus:ring-white/50`}
                    title={`${displayDate} (${dayName}) - ${dayData.completionPercentage}% complete`}
                  >
                    {dayNumber}
                  </button>
                  
                  {/* Mobile-friendly tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none
                    hidden sm:block">
                    <div className="bg-black/90 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap border border-white/10">
                      <div className="font-medium">{displayDate}</div>
                      <div className="text-white/80">{dayData.completionPercentage}% complete</div>
                      {dayData.totalTasks > 0 && (
                        <div className="text-white/60">
                          {dayData.completedCount} of {dayData.totalTasks} tasks
                        </div>
                      )}
                      {dayData.completedTasks.length > 0 && (
                        <div className="text-green-400 text-xs mt-1 max-w-48 truncate">
                          {dayData.completedTasks.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{perfectDays}</div>
          <div className="text-sm text-white/60">Perfect Days</div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{partialDays}</div>
          <div className="text-sm text-white/60">Partial Days</div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{avgCompletion}%</div>
          <div className="text-sm text-white/60">Avg Completion</div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{weeklyStats.completionRate}%</div>
          <div className="text-sm text-white/60">This Week</div>
        </div>
      </div>
    </div>
  )
}

export default Calendar