import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  LogOut, Settings2, Bell, Target, Flame, Trophy, Activity, ChevronRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTasks } from '../../context/TasksContext'
import { calculateStreak } from '../../utils/dateUtils'

import AppearanceModal from '../../components/Profile/AppearanceModal'
import NotificationsModal from '../../components/Profile/NotificationsModal'
import ProductivityModal from '../../components/Profile/ProductivityModal'

const ProfileView = () => {
  const { user, signOut } = useAuth()
  const { tasks, taskLogs } = useTasks()

  const [activeModal, setActiveModal] = useState(null)

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

      // Simple completion rate logic for UI richness (completed tasks / total logged tasks instances)
      const completedTasks = taskLogs.filter(log => log.completed).length;
      rate = taskLogs.length > 0 ? Math.round((completedTasks / taskLogs.length) * 100) : 0;
    }

    return { current, longest, total, rate }
  }, [taskLogs, tasks])

  const username = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const initial = username.charAt(0).toUpperCase()
  const avatarUrl = user?.user_metadata?.avatar_url
  
  const memberSince = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently'

  const SettingRow = ({ icon: Icon, title, subtitle, colorTheme, onClick }) => {
    const themes = {
      purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]',
      amber: 'text-[#FF8A00] bg-[#FF8A00]/10 border-[#FF8A00]/20 group-hover:shadow-[0_0_15px_rgba(255,138,0,0.15)]',
      emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]',
      red: 'text-red-500 bg-red-500/10 border-red-500/20 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]',
    }
    const iconClass = themes[colorTheme] || themes.purple;

    return (
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 sm:p-5 bg-[#1C1F2A] border border-white/5 rounded-2xl hover:bg-[#1E222E] hover:border-white/10 transition-all group shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className={`p-3 rounded-xl border transition-all duration-300 ${iconClass}`}>
            <Icon size={20} strokeWidth={2.5} />
          </div>
          <div className="text-left">
            <span className={`font-semibold tracking-wide ${colorTheme === 'red' ? 'text-red-400' : 'text-white/90'}`}>{title}</span>
            {subtitle && <span className="text-[11px] font-medium text-white/40 block mt-0.5">{subtitle}</span>}
          </div>
        </div>
        <ChevronRight size={18} className="text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-300 relative z-10" />
      </motion.button>
    )
  }

  const SectionLabel = ({ text }) => (
    <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/30 font-bold mb-4 px-2">
      {text}
    </h3>
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-4 md:p-8 max-w-xl mx-auto pb-32 space-y-10"
    >

      {/* Atmospheric Profile Hero */}
      <motion.div
        variants={itemVariants}
        className="relative bg-[#1C1F2A] border border-white/5 rounded-[32px] p-6 sm:p-8 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)] mt-2"
      >
        {/* Cinematic Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF8A00]/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-[#FF8A00] blur-2xl opacity-40 rounded-full animate-pulse" />
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={username}
                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-white/10 shadow-2xl object-cover"
              />
            ) : (
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#2A2D3A] to-[#1C1F2A] border-2 border-white/10 flex items-center justify-center text-4xl font-bold text-white shadow-2xl">
                {initial}
              </div>
            )}
          </div>
          
          <div className="text-center sm:text-left pt-2 sm:pt-4">
            <h1 className="text-3xl font-black text-white mb-1 tracking-tight drop-shadow-md">{username}</h1>
            <p className="text-[13px] font-medium text-white/40 mb-4">{user?.email}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider bg-white/5 px-3 py-1.5 rounded-full border border-white/5 shadow-inner backdrop-blur-sm">
                Member since {memberSince}
              </span>
              {stats.current > 0 && (
                <span className="text-[11px] font-bold text-[#FF8A00] uppercase tracking-wider bg-[#FF8A00]/10 px-3 py-1.5 rounded-full border border-[#FF8A00]/20 flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,138,0,0.2)]">
                  🔥 {stats.current} day streak
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Premium Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        <motion.div whileHover={{ y: -2 }} className="bg-[#1C1F2A] border border-white/5 rounded-3xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-shadow group">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-12 h-12 bg-[#FF8A00]/10 blur-xl rounded-full group-hover:bg-[#FF8A00]/20 transition-colors" />
          <Flame size={20} className="text-[#FF8A00] mb-2 drop-shadow-[0_0_8px_rgba(255,138,0,0.5)]" />
          <span className="text-2xl font-bold text-white block leading-none mb-1.5">{stats.current}</span>
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Current</span>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-[#1C1F2A] border border-white/5 rounded-3xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-shadow group">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-12 h-12 bg-[#FFD700]/5 blur-xl rounded-full group-hover:bg-[#FFD700]/10 transition-colors" />
          <Trophy size={20} className="text-[#FFD700] mb-2 drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]" />
          <span className="text-2xl font-bold text-white block leading-none mb-1.5">{stats.longest}</span>
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Best</span>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-[#1C1F2A] border border-white/5 rounded-3xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-shadow group">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/5 blur-xl rounded-full group-hover:bg-emerald-500/10 transition-colors" />
          <Target size={20} className="text-emerald-400 mb-2 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
          <span className="text-2xl font-bold text-white block leading-none mb-1.5">{stats.total}</span>
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Habits</span>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-[#1C1F2A] border border-white/5 rounded-3xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-shadow group">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/5 blur-xl rounded-full group-hover:bg-blue-500/10 transition-colors" />
          <Activity size={20} className="text-blue-400 mb-2 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
          <span className="text-2xl font-bold text-white block leading-none mb-1.5">{stats.rate}%</span>
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Success</span>
        </motion.div>
      </motion.div>

      {/* Colorful Functional Settings */}
      <motion.div variants={itemVariants} className="space-y-10">
        <div>
          <SectionLabel text="App Experience" />
          <div className="space-y-3">
            <SettingRow
              icon={Settings2}
              title="Appearance"
              subtitle="Theme selection"
              colorTheme="purple"
              onClick={() => setActiveModal('appearance')}
            />
            <SettingRow
              icon={Bell}
              title="Notifications"
              subtitle="Daily reminders"
              colorTheme="amber"
              onClick={() => setActiveModal('notifications')}
            />
            <SettingRow
              icon={Target}
              title="Productivity"
              subtitle="Focus mode, Day reset"
              colorTheme="emerald"
              onClick={() => setActiveModal('productivity')}
            />
          </div>
        </div>

        <div>
          <SectionLabel text="Account" />
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={signOut}
              className="w-full flex items-center justify-between p-4 sm:p-5 bg-[#1C1F2A] border border-white/5 rounded-2xl hover:bg-[#1E222E] hover:border-white/10 transition-all group shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.15)] transition-all duration-300">
                  <LogOut size={20} strokeWidth={2.5} />
                </div>
                <span className="font-semibold tracking-wide text-red-400 block">Log Out</span>
              </div>
              <ChevronRight size={18} className="text-white/20 group-hover:text-red-400/50 group-hover:translate-x-1 transition-all duration-300 relative z-10" />
            </motion.button>

          </div>
        </div>
      </motion.div>

      {/* Minimal Footer */}
      <motion.div 
        variants={itemVariants}
        className="text-center pt-8"
      >
        <p className="text-white/20 text-[11px] font-semibold uppercase tracking-[0.2em]">
          StreakWise v1.0
        </p>
        <p className="text-white/10 text-[10px] mt-1.5 tracking-wider font-medium">
          Built for consistency ⚡
        </p>
      </motion.div>

      {/* Modals */}
      <AppearanceModal isOpen={activeModal === 'appearance'} onClose={() => setActiveModal(null)} />
      <NotificationsModal isOpen={activeModal === 'notifications'} onClose={() => setActiveModal(null)} />
      <ProductivityModal isOpen={activeModal === 'productivity'} onClose={() => setActiveModal(null)} />

    </motion.div>
  )
}

export default ProfileView
