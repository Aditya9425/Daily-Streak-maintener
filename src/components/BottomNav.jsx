import { NavLink } from 'react-router-dom'
import { Home, BarChart2, Heart, User, Plus } from 'lucide-react'
import { motion } from 'framer-motion'

const NavItem = ({ item }) => {
  return (
    <NavLink
      to={item.path}
      end={item.end}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center gap-1 transition-all duration-300 w-14 ${
          isActive 
            ? 'text-[#FF8A00]' 
            : 'text-white/40 hover:text-white/60'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <motion.div
            animate={{ 
              scale: isActive ? 1.05 : 1,
              y: isActive ? -2 : 0
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <item.icon 
              size={22} 
              strokeWidth={isActive ? 2.5 : 2} 
            />
          </motion.div>
          <span className={`text-[10px] font-medium transition-colors whitespace-nowrap ${isActive ? 'text-[#FF8A00]' : 'text-white/40'}`}>
            {item.name}
          </span>
        </>
      )}
    </NavLink>
  )
}

const BottomNav = ({ onOpenAddTask }) => {
  const navItems = [
    { name: 'Home', path: '/dashboard', icon: Home, end: true },
    { name: 'Stats', path: '/dashboard/stats', icon: BarChart2 },
    { name: 'Habits', path: '/dashboard/habits', icon: Heart },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:pb-6 flex justify-center pointer-events-none w-full max-w-[100vw]">
      <div className="bg-[#15171E]/95 backdrop-blur-md border-t border-white/5 md:border md:rounded-3xl w-full max-w-[420px] flex items-center px-2 pt-3 pb-8 md:pb-3 shadow-[0_-5px_30px_rgba(0,0,0,0.3)] pointer-events-auto relative mx-auto">
        
        {/* Navigation Items Wrapper */}
        <div className="flex items-center justify-between w-full relative z-10 px-2 sm:px-4">
          <NavItem item={navItems[0]} />
          <NavItem item={navItems[1]} />
          
          {/* Spacer for FAB */}
          <div className="w-14 flex-shrink-0" />
          
          <NavItem item={navItems[2]} />
          <NavItem item={navItems[3]} />
        </div>

        {/* Center FAB */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-5 z-20 pointer-events-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenAddTask}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFB347] to-[#FF8A00] flex items-center justify-center text-[#1C1F2A] shadow-[0_4px_15px_rgba(255,138,0,0.25)] border-[4px] border-[#15171E] outline-none"
          >
            <motion.div
              animate={{ rotate: 0 }}
              whileHover={{ rotate: 90 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <Plus size={24} strokeWidth={2.5} />
            </motion.div>
          </motion.button>
        </div>

      </div>
    </div>
  )
}

export default BottomNav
