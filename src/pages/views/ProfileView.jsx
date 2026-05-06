import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  LogOut, Shield, Settings2, Bell, 
  Palette, MessageSquare, Info, ChevronRight,
  Flame, Trophy, Target, Activity
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTasks } from '../../context/TasksContext'
import { calculateStreak } from '../../utils/dateUtils'

const ProfileView = () => {
  const { user, signOut } = useAuth()
  const { tasks, taskLogs, analyticsService } = useTasks()

  const stats = useMemo(() => {
    let current = 0
    let longest = 0
    let total = tasks?.length || 0
    let rate = 0

    if (taskLogs && taskLogs.length > 0) {
      const uniqueDates = [...new Set(taskLogs.filter(log => log.completed).map(log => log.date))]
      const uniqueLogs = uniqueDates.map(date => ({ date, completed: true }))
      const streak = calculateStreak(uniqueLogs)
      current = streak.current
      longest = streak.longest
    }

    if (analyticsService) {
      rate = analyticsService.getWeeklyStats()?.completionRate || 0
    }

    return { current, longest, total, rate }
  }, [taskLogs, tasks, analyticsService])

  const username = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const initial = username.charAt(0).toUpperCase()
  const avatarUrl = user?.user_metadata?.avatar_url

  const SettingRow = ({ icon: Icon, title, subtitle, colorClass = "text-white/60", onClick }) => (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-[#1C1F2A] border border-white/5 rounded-2xl hover:bg-white/5 transition-all group active:scale-[0.98]"
    >
      <div className="flex items-center gap-4">
        <div className={`p-2.5 bg-[#15171E] rounded-xl border border-white/5 transition-colors ${colorClass}`}>
          <Icon size={20} />
        </div>
        <div className="text-left">
          <span className="font-medium text-white/90 block">{title}</span>
          {subtitle && <span className="text-[11px] text-white/40 block mt-0.5">{subtitle}</span>}
        </div>
      </div>
      <ChevronRight size={18} className="text-white/20 group-hover:text-white/50 transition-colors" />
    </button>
  )

  const SectionLabel = ({ text }) => (
    <h3 className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-3 px-2 ml-1">
      {text}
    </h3>
  )

  return (
    <div className="p-4 md:p-8 max-w-xl mx-auto pb-32 space-y-8">
      
      {/* Header Profile Identity */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mt-2"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-[#FF8A00] blur-xl opacity-20 rounded-full" />
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={username} 
                className="relative w-16 h-16 rounded-full border border-white/10 shadow-xl object-cover"
              />
            ) : (
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#2A2D3A] to-[#1C1F2A] border border-white/10 flex items-center justify-center text-xl font-bold text-white shadow-xl">
                {initial}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white mb-0.5">{username}</h1>
            <p className="text-sm text-white/40">{user?.email}</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-2"
      >
        <div className="bg-[#1C1F2A] border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 bg-[#FF8A00]/10 blur-xl rounded-full" />
          <Flame size={16} className="text-[#FF8A00] mb-1.5" />
          <span className="text-lg font-bold text-white block leading-none mb-1">{stats.current}</span>
          <span className="text-[9px] text-white/40 uppercase tracking-wider font-medium">Streak</span>
        </div>
        <div className="bg-[#1C1F2A] border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center">
          <Trophy size={16} className="text-[#FFB347]/80 mb-1.5" />
          <span className="text-lg font-bold text-white block leading-none mb-1">{stats.longest}</span>
          <span className="text-[9px] text-white/40 uppercase tracking-wider font-medium">Best</span>
        </div>
        <div className="bg-[#1C1F2A] border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center">
          <Target size={16} className="text-green-500/80 mb-1.5" />
          <span className="text-lg font-bold text-white block leading-none mb-1">{stats.total}</span>
          <span className="text-[9px] text-white/40 uppercase tracking-wider font-medium">Habits</span>
        </div>
        <div className="bg-[#1C1F2A] border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center">
          <Activity size={16} className="text-blue-500/80 mb-1.5" />
          <span className="text-lg font-bold text-white block leading-none mb-1">{stats.rate}%</span>
          <span className="text-[9px] text-white/40 uppercase tracking-wider font-medium">Success</span>
        </div>
      </motion.div>

      {/* Grouped Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-8"
      >
        {/* App Experience */}
        <div>
          <SectionLabel text="App Experience" />
          <div className="space-y-2">
            <SettingRow 
              icon={Settings2} 
              title="Theme & Display" 
              subtitle="Dark mode, compact view" 
              colorClass="text-purple-400"
            />
            <SettingRow 
              icon={Palette} 
              title="Accent Color" 
              subtitle="Choose your primary color" 
              colorClass="text-pink-400"
            />
            <SettingRow 
              icon={Bell} 
              title="Notifications" 
              subtitle="Reminders, streak alerts" 
              colorClass="text-[#FF8A00]"
            />
          </div>
        </div>

        {/* Account */}
        <div>
          <SectionLabel text="Account" />
          <div className="space-y-2">
            <SettingRow 
              icon={Shield} 
              title="Privacy & Security" 
              subtitle="Password, active sessions" 
              colorClass="text-green-400"
            />
          </div>
        </div>

        {/* Support */}
        <div>
          <SectionLabel text="Support" />
          <div className="space-y-2">
            <SettingRow 
              icon={MessageSquare} 
              title="Feedback" 
              subtitle="Share your thoughts with us" 
              colorClass="text-blue-400"
            />
            <SettingRow 
              icon={Info} 
              title="About the App" 
              subtitle="Version, terms and more" 
              colorClass="text-white/60"
            />
          </div>
        </div>

        {/* Logout */}
        <div className="pt-4 pb-12">
          <button 
            onClick={signOut}
            className="w-full flex items-center justify-center gap-3 p-4 bg-[#1C1F2A] border border-red-500/10 rounded-2xl hover:bg-red-500/5 transition-all group active:scale-[0.98] shadow-lg"
          >
            <LogOut size={18} className="text-red-500/80 group-hover:text-red-400 transition-colors" />
            <span className="font-semibold text-red-500/80 group-hover:text-red-400 transition-colors">Log Out</span>
          </button>
        </div>
      </motion.div>

    </div>
  )
}

export default ProfileView
