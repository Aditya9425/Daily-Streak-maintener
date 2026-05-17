import { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { Flame, CalendarDays, Check } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTasks } from '../../context/TasksContext'
import TaskCardClean from '../../components/TaskCardClean'
import TodayTasksSection from '../../components/TodayTasks/TodayTasksSection'
import TodayThoughtsSection from '../../components/TodayThoughts/TodayThoughtsSection'
import CalendarModal from '../../components/CalendarModal'
import { getTodayString, getDateRange, calculateStreak } from '../../utils/dateUtils'

const GreetingHeader = ({ username, isViewingToday, selectedDate }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update every minute just to keep greeting accurate
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = (hour) => {
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Good night';
  };

  const hour = time.getHours();
  const greeting = getGreeting(hour);

  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2 flex-wrap tracking-tight">
        {greeting}, <span className="text-white/90">{username}</span>
        <span className="inline-block origin-bottom-right animate-wave text-2xl">👋</span>
      </h1>
      
      <div className="mt-1">
        {isViewingToday ? (
          <p className="text-white/50 text-sm font-medium">Let's keep your streak alive.</p>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-medium w-fit shadow-sm">
            <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Viewing activity from {format(parseISO(selectedDate), 'MMMM d')}
          </div>
        )}
      </div>
    </div>
  );
};

const HeroDateDisplay = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = format(time, 'EEEE, d MMM');
  const formattedTime = format(time, 'h:mm a');

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={formattedTime}
        initial={{ opacity: 0, filter: 'blur(2px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-white/40 text-sm tracking-wide font-medium flex items-center gap-2 mb-2"
      >
        <span>{formattedDate}</span>
        <span>&bull;</span>
        <span>{formattedTime}</span>
      </motion.div>
    </AnimatePresence>
  );
};

const HomeView = () => {
  const { user } = useAuth()
  const { tasks, taskLogs, selectedDate } = useTasks()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  
  const today = getTodayString()
  const isViewingToday = selectedDate === today

  const overallStreak = useMemo(() => {
    if (!taskLogs) return { current: 0, longest: 0 }
    const uniqueDates = [...new Set(taskLogs.filter(log => log.completed).map(log => log.date))]
    const uniqueLogs = uniqueDates.map(date => ({ date, completed: true }))
    return calculateStreak(uniqueLogs)
  }, [taskLogs])

  const weeklyTracker = useMemo(() => {
    if (!taskLogs) return []
    // Remove .reverse() to maintain proper chronological order (T-6 to Today)
    const dates = getDateRange(7)
    return dates.map(date => {
      const isToday = date === today
      const isSelected = date === selectedDate
      const completed = taskLogs.some(log => log.date === date && log.completed)
      return { 
        date, 
        dayName: format(parseISO(date), 'EEE'),
        completed,
        isToday,
        isSelected
      }
    })
  }, [taskLogs, selectedDate, today])

  const completedCount = taskLogs?.filter(log => log.date === selectedDate && log.completed).length || 0
  const totalTasks = tasks?.length || 0
  const completionPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

  const username = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'

  return (
    <div className="p-4 md:p-8 max-w-xl mx-auto">
      {/* Cleaned Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 mt-2"
      >
        <GreetingHeader username={username} isViewingToday={isViewingToday} selectedDate={selectedDate} />
      </motion.div>

      {/* Redesigned Hero Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-[#1C1F2A] border border-white/5 rounded-[32px] p-6 sm:p-8 mb-8 overflow-hidden shadow-2xl"
      >
        {/* Background Enhancements */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div 
            className="absolute right-[-10%] bottom-[-5%] w-[90%] md:w-[75%] h-[130%] md:h-[120%] bg-no-repeat opacity-40 md:opacity-50 transition-all duration-700 mix-blend-screen"
            style={{
              backgroundImage: `url('/mountain.png')`,
              backgroundPosition: 'bottom right',
              backgroundSize: 'contain',
              WebkitMaskImage: 'radial-gradient(ellipse at 85% 85%, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 80%)',
              maskImage: 'radial-gradient(ellipse at 85% 85%, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 80%)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1F2A] via-[#1C1F2A]/90 to-transparent w-[85%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1F2A] via-[#1C1F2A]/60 to-transparent h-[60%] top-auto bottom-0" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF8A00]/5 blur-[100px] rounded-full pointer-events-none" />
        </div>

        {/* Integrated Calendar Button */}
        <div className="absolute top-5 sm:top-6 right-5 sm:right-6 z-20">
          <motion.button
            onClick={() => setIsCalendarOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:bg-white/10 hover:border-[#FF8A00]/30 hover:shadow-[0_0_20px_rgba(255,138,0,0.15)] transition-all duration-300 group"
          >
            <CalendarDays size={20} className="text-white/60 group-hover:text-[#FF8A00] transition-colors" />
          </motion.button>
        </div>

        <div className="relative z-10">
          {/* Integrated Clock */}
          <HeroDateDisplay />
          
          <h2 className="text-white/60 font-semibold mb-1 uppercase tracking-wide text-[11px]">Current Streak</h2>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-6xl sm:text-7xl font-bold bg-gradient-to-br from-[#FFB347] to-[#FF8A00] text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(255,138,0,0.2)]">
              {overallStreak.current}
            </span>
            <span className="text-3xl"><Flame className="inline text-[#FF8A00] mb-2" fill="currentColor" size={36}/></span>
            <span className="text-xl font-medium text-white/90">days</span>
          </div>
          <p className="text-white/40 text-sm mb-10">
            Best Streak: <span className="text-[#FF8A00]/80 font-medium">{overallStreak.longest} days</span>
          </p>

          {/* Chronological Week Tracker */}
          <div className="flex justify-between items-center mt-8">
            {weeklyTracker.map((day, i) => {
              const isToday = day.isToday;
              
              return (
                <div key={i} className="flex flex-col items-center gap-3">
                  <span className={`text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                    isToday ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-white/30'
                  }`}>
                    {day.dayName}
                  </span>
                  
                  <div className={`rounded-full flex items-center justify-center transition-all duration-500 ${
                    isToday 
                      ? 'w-10 h-10 shadow-[0_0_20px_rgba(255,138,0,0.2)]' // Larger footprint for today
                      : 'w-8 h-8 opacity-70 hover:opacity-100'
                  } ${
                    day.completed 
                      ? isToday
                        ? 'bg-gradient-to-br from-[#FFB347] to-[#FF8A00] text-black shadow-[0_0_15px_rgba(255,138,0,0.4)] scale-110' 
                        : 'bg-white/10 text-[#FF8A00] border border-[#FF8A00]/30'
                      : isToday
                        ? 'bg-[#15171E] border-2 border-[#FF8A00] shadow-[inset_0_0_10px_rgba(255,138,0,0.2)] scale-110'
                        : 'border-2 border-white/10 bg-transparent'
                  }`}>
                    {day.completed && (
                      <Check size={isToday ? 20 : 16} strokeWidth={3} className={isToday ? 'text-black' : 'text-[#FF8A00]'} />
                    )}
                    {!day.completed && isToday && (
                      <div className="w-2 h-2 rounded-full bg-[#FF8A00] opacity-50 animate-pulse" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Habits Progress Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-4"
      >
        <div className="flex justify-between items-end mb-3 px-1">
          <h2 className="text-xl font-bold text-white tracking-tight">Today's Habits</h2>
          <span className="text-sm font-semibold text-white/50">{completedCount}/{totalTasks} completed</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#FF8A00] to-[#FFB347]"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Task List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-3 mb-8"
      >
        {tasks.map((task, index) => (
          <TaskCardClean 
            key={task.task_id} 
            task={task} 
            index={index}
          />
        ))}
      </motion.div>

      {tasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-[#15171E] rounded-3xl border border-white/5 mb-8"
        >
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="text-lg font-medium text-white mb-1">No tasks yet</h3>
          <p className="text-white/40 text-sm">Create your first task to start tracking streaks</p>
        </motion.div>
      )}

      {/* NEW: Today's Tasks Section */}
      <TodayTasksSection />

      {/* NEW: Today's Thoughts Section */}
      <TodayThoughtsSection />

      <CalendarModal isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} />
    </div>
  )
}

export default HomeView
