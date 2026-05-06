import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, TrendingUp, Calendar as CalendarIcon, ChevronDown, ChevronUp } from 'lucide-react'
import { useTasks } from '../../context/TasksContext'
import CalendarModal from '../../components/CalendarModal'
import { DynamicIcon } from '../../utils/iconUtils'

const StatsView = () => {
  const { taskLogs, analyticsService, tasks } = useTasks()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('Overview')
  const [showWeeklyReview, setShowWeeklyReview] = useState(false)

  // -- Insights & Data --
  const insights = useMemo(() => {
    if (!analyticsService) return null
    return {
      coach: analyticsService.generateCoachingInsights(),
      review: analyticsService.generateWeeklyReviewInsights()
    }
  }, [analyticsService, taskLogs])

  const calendarData30 = useMemo(() => {
    if (!analyticsService) return []
    // Get last 30 days and reverse to go from oldest to newest for the chart
    return analyticsService.getCalendarData(30).reverse() 
  }, [analyticsService, taskLogs])

  const weeklyStats = useMemo(() => {
    if (!analyticsService) return null
    return analyticsService.getWeeklyStats()
  }, [analyticsService, taskLogs])

  // -- Overview Calculations --
  const overviewStats = useMemo(() => {
    if (!calendarData30.length) return { successRate: 0, totalCompletions: 0, longestStreak: 0, currentStreak: 0 }
    
    let totalCompletions = 0
    let totalPossible = 0
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    calendarData30.forEach(day => {
      totalCompletions += day.completedCount
      totalPossible += day.totalTasks
      if (day.completedCount > 0) {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 0
      }
    })

    // Check current streak reading backwards from today (end of array)
    let activeStreak = 0
    for (let i = calendarData30.length - 1; i >= 0; i--) {
      if (calendarData30[i].completedCount > 0) {
        activeStreak++
      } else {
        break
      }
    }

    const successRate = totalPossible > 0 ? Math.round((totalCompletions / totalPossible) * 100) : 0

    return { successRate, totalCompletions, longestStreak, currentStreak: activeStreak }
  }, [calendarData30])

  // Chart path calculation
  const trendPath = useMemo(() => {
    if (calendarData30.length === 0) return ''
    const width = 300
    const height = 100
    const points = calendarData30.map((day, i) => {
      const x = (i / (calendarData30.length - 1)) * width
      const y = height - (day.completionPercentage / 100) * height
      return `${x},${y}`
    })
    return `M ${points.join(' L ')}`
  }, [calendarData30])
  
  // -- Render --
  const renderTabContent = () => {
    if (activeTab === 'Overview') {
      return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          
          {/* Overall Progress */}
          <div className="bg-[#1C1F2A] border border-white/5 rounded-[32px] p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-6">Overall Progress</h2>
            <div className="flex items-center justify-between gap-6">
              {/* Circular Ring */}
              <div className="relative w-32 h-32 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#2A2D3A" strokeWidth="8" fill="none" />
                  <circle 
                    cx="50" cy="50" r="40" 
                    stroke="url(#orange-gradient)" 
                    strokeWidth="8" 
                    fill="none" 
                    strokeLinecap="round"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * overviewStats.successRate) / 100}
                    className="transition-all duration-1000 ease-out drop-shadow-[0_0_10px_rgba(255,138,0,0.5)]"
                  />
                  <defs>
                    <linearGradient id="orange-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFB347" />
                      <stop offset="100%" stopColor="#FF8A00" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                  <span className="text-3xl font-bold text-white leading-none mb-1">{overviewStats.successRate}%</span>
                  <span className="text-[10px] text-white/50 uppercase tracking-wider">Success</span>
                </div>
              </div>
              
              {/* Metrics Column */}
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-white/40 font-semibold mb-0.5">Total Completions</p>
                  <p className="text-xl font-bold text-white">{overviewStats.totalCompletions}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-white/40 font-semibold mb-0.5">Longest Streak</p>
                  <p className="text-lg font-semibold text-[#FF8A00]">{overviewStats.longestStreak} days</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-white/40 font-semibold mb-0.5">Current Streak</p>
                  <p className="text-lg font-semibold text-white/90">{overviewStats.currentStreak} days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Completion Trend */}
          <div className="bg-[#1C1F2A] border border-white/5 rounded-[32px] p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-6">Completion Trend</h2>
            <div className="relative w-full h-[120px]">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chart-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FF8A00" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#FF8A00" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Y-Axis Minimal Grid Lines */}
                <line x1="0" y1="0" x2="300" y2="0" stroke="white" strokeOpacity="0.05" />
                <line x1="0" y1="50" x2="300" y2="50" stroke="white" strokeOpacity="0.05" />
                <line x1="0" y1="100" x2="300" y2="100" stroke="white" strokeOpacity="0.05" />
                
                {/* Area Fill */}
                <path d={`${trendPath} L 300,100 L 0,100 Z`} fill="url(#chart-fill)" />
                {/* Line Stroke */}
                <path d={trendPath} fill="none" stroke="#FF8A00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(255,138,0,0.5)]" />
              </svg>
            </div>
          </div>

          {/* Habit Strength */}
          <div className="bg-[#1C1F2A] border border-white/5 rounded-[32px] p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-6">Habit Strength</h2>
            <div className="space-y-6">
              {weeklyStats?.taskStats.map(task => (
                <div key={task.taskId} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#15171E] flex items-center justify-center border border-white/5 text-[#FF8A00]">
                    <DynamicIcon iconName={tasks.find(t => t.task_id === task.taskId)?.icon} size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-white/90 truncate">{task.taskName}</span>
                      <span className="text-xs font-semibold text-white/50">{task.completionRate}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#15171E] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${task.completionRate}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#FFB347] to-[#FF8A00] rounded-full drop-shadow-[0_0_5px_rgba(255,138,0,0.4)]"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {(!weeklyStats || weeklyStats.taskStats.length === 0) && (
                <p className="text-white/40 text-sm text-center py-4">No habit data available.</p>
              )}
            </div>
          </div>
        </motion.div>
      )
    }

    if (activeTab === 'Habits') {
      return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-8 text-center text-white/40">
          <p>Habit-specific insights coming soon.</p>
        </motion.div>
      )
    }

    if (activeTab === 'Streaks') {
      return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-8 text-center text-white/40">
          <p>Advanced streak analysis coming soon.</p>
        </motion.div>
      )
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-xl mx-auto pb-32">
      {/* Premium Header */}
      <div className="flex items-center justify-between mb-8 mt-2">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <button 
          onClick={() => setIsCalendarOpen(true)}
          className="p-3 rounded-2xl bg-[#1C1F2A] border border-white/5 text-[#FF8A00] hover:bg-white/5 transition-all shadow-lg drop-shadow-[0_0_10px_rgba(255,138,0,0.2)]"
        >
          <CalendarIcon size={20} />
        </button>
      </div>

      {/* AI Insights Block (Always visible at top) */}
      {insights && (
        <div className="mb-8 space-y-4">
          <div className="bg-[#1C1F2A] border border-white/5 rounded-3xl p-5 flex items-start gap-4 shadow-2xl">
            <div className="p-2.5 bg-[#FF8A00]/10 rounded-xl text-[#FF8A00] mt-0.5">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-[13px] uppercase tracking-wider font-bold text-[#FF8A00] mb-1">Daily Coach</h3>
              <p className="text-sm text-white/80 leading-relaxed">{insights.coach.actionSuggestion}</p>
            </div>
          </div>

          <div className="bg-[#1C1F2A] border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
            <button 
              onClick={() => setShowWeeklyReview(!showWeeklyReview)}
              className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400">
                  <TrendingUp size={20} />
                </div>
                <h3 className="text-sm font-semibold text-white/90">Weekly Review</h3>
              </div>
              {showWeeklyReview ? <ChevronUp size={20} className="text-white/40"/> : <ChevronDown size={20} className="text-white/40"/>}
            </button>
            <AnimatePresence>
              {showWeeklyReview && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-5"
                >
                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <div className="bg-[#15171E] p-4 rounded-2xl border border-white/5">
                      <span className="text-[10px] uppercase tracking-wider text-[#FF8A00] font-semibold block mb-1">Biggest Win</span>
                      <p className="text-sm text-white/90">{insights.review.biggestWin}</p>
                    </div>
                    <div className="bg-[#15171E] p-4 rounded-2xl border border-white/5">
                      <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold block mb-1">Focus Area</span>
                      <p className="text-sm text-white/60">{insights.review.improvementSuggestion}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Segmented Tabs */}
      <div className="flex gap-8 mb-8 border-b border-white/5 px-2">
        {['Overview', 'Habits', 'Streaks'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-medium relative transition-colors ${
              activeTab === tab ? 'text-white' : 'text-white/40 hover:text-white/70'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="analyticsTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF8A00] drop-shadow-[0_0_8px_rgba(255,138,0,0.8)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      <CalendarModal isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} />
    </div>
  )
}

export default StatsView
