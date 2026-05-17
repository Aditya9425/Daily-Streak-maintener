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
      purple: 'text-purple-400',
      amber: 'text-[#FF8A00]',
      emerald: 'text-emerald-400',
      red: 'text-red-500',
    }
    const iconClass = themes[colorTheme] || themes.purple;

    return (
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 bg-[#1C1F2A] border border-white/5 rounded-2xl hover:bg-[#232736] transition-all group shadow-sm mb-3"
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl bg-[#15171E] flex items-center justify-center border border-white/5 ${iconClass}`}>
            <Icon size={20} strokeWidth={2} />
          </div>
          <div className="text-left">
            <span className={`font-semibold tracking-wide ${colorTheme === 'red' ? 'text-red-400' : 'text-white/90'}`}>{title}</span>
            {subtitle && <span className="text-[11px] font-medium text-white/40 block mt-0.5">{subtitle}</span>}
          </div>
        </div>
        <ChevronRight size={18} className="text-white/20 group-hover:text-white/40 transition-colors" />
      </motion.button>
    )
  }

  const SectionLabel = ({ text }) => (
    <h3 className="text-[11px] uppercase tracking-widest text-white/40 font-bold mb-3 px-1">
      {text}
    </h3>
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
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
      className="p-4 md:p-8 max-w-xl mx-auto pb-0 space-y-8"
    >

      {/* Minimal Profile Hero (No Card Background) */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-5 pt-2 px-1"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-[#FF8A00] blur-xl opacity-20 rounded-full animate-pulse" />
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={username}
              className="relative w-20 h-20 rounded-full border border-white/10 shadow-lg object-cover"
            />
          ) : (
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#2A2D3A] to-[#1C1F2A] border border-white/10 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              {initial}
            </div>
          )}
        </div>
        
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-white mb-0.5 tracking-tight">{username}</h1>
          <p className="text-[13px] font-medium text-white/40 mb-2">{user?.email}</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">
              Member since {memberSince}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Premium Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-4 gap-2 sm:gap-3"
      >
        <div className="bg-[#1C1F2A] border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm">
          <Flame size={18} className="text-[#FF8A00] mb-1.5 drop-shadow-[0_0_8px_rgba(255,138,0,0.5)]" />
          <span className="text-xl font-bold text-white block leading-none mb-1">{stats.current}</span>
          <span className="text-[9px] text-white/40 uppercase tracking-widest font-semibold">Streak</span>
        </div>

        <div className="bg-[#1C1F2A] border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm">
          <Trophy size={18} className="text-[#FFD700] mb-1.5 drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]" />
          <span className="text-xl font-bold text-white block leading-none mb-1">{stats.longest}</span>
          <span className="text-[9px] text-white/40 uppercase tracking-widest font-semibold">Best</span>
        </div>

        <div className="bg-[#1C1F2A] border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm">
          <Target size={18} className="text-emerald-400 mb-1.5 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
          <span className="text-xl font-bold text-white block leading-none mb-1">{stats.total}</span>
          <span className="text-[9px] text-white/40 uppercase tracking-widest font-semibold">Habits</span>
        </div>

        <div className="bg-[#1C1F2A] border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center shadow-sm">
          <Activity size={18} className="text-blue-400 mb-1.5 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
          <span className="text-xl font-bold text-white block leading-none mb-1">{stats.rate}%</span>
          <span className="text-[9px] text-white/40 uppercase tracking-widest font-semibold">Success</span>
        </div>
      </motion.div>

      {/* Colorful Functional Settings */}
      <motion.div variants={itemVariants} className="space-y-6 pt-2">
        <div>
          <SectionLabel text="App Experience" />
          <div>
            <SettingRow
              icon={Settings2}
              title="Theme & Display"
              subtitle="Dark mode, compact view"
              colorTheme="purple"
              onClick={() => setActiveModal('appearance')}
            />
            <SettingRow
              icon={Bell}
              title="Notifications"
              subtitle="Reminders, streak alerts"
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
          <div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={signOut}
              className="w-full flex items-center justify-between p-4 bg-[#1C1F2A] border border-white/5 rounded-2xl hover:bg-[#232736] transition-all group shadow-sm mb-3"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#15171E] flex items-center justify-center border border-white/5 text-red-500">
                  <LogOut size={20} strokeWidth={2} />
                </div>
                <div className="text-left">
                  <span className="font-semibold tracking-wide text-red-400">Log Out</span>
                  <span className="text-[11px] font-medium text-white/40 block mt-0.5">Sign out of your account</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/20 group-hover:text-white/40 transition-colors" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Minimal Footer */}
      <motion.div 
        variants={itemVariants}
        className="text-center pt-4 pb-12"
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
