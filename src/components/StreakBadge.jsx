import { motion } from 'framer-motion'

const StreakBadge = ({ current, longest, compact = false, animated = false }) => {
  if (compact) {
    return (
      <motion.div 
        className="flex items-center gap-2 text-sm"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-1">
          <motion.span 
            className="text-white/60"
            animate={animated && current > 0 ? { 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            } : {}}
            transition={{ duration: 0.5, repeat: current > 0 ? Infinity : 0, repeatDelay: 2 }}
          >
            🔥
          </motion.span>
          <motion.span 
            className="font-medium"
            key={current}
            initial={animated ? { scale: 1.5, color: '#fbbf24' } : { scale: 1 }}
            animate={{ scale: 1, color: '#ffffff' }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
          >
            {current}
          </motion.span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-1">
          <span className="text-white/60">👑</span>
          <motion.span 
            className="font-medium text-white/80"
            key={longest}
            initial={animated ? { scale: 1.3, color: '#fbbf24' } : { scale: 1 }}
            animate={{ scale: 1, color: 'rgba(255, 255, 255, 0.8)' }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
          >
            {longest}
          </motion.span>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className="glass-card flex items-center justify-between"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <motion.div 
          className="text-3xl font-bold mb-1"
          key={current}
          initial={animated ? { scale: 1.5, color: '#fbbf24' } : { scale: 1.2 }}
          animate={{ scale: 1, color: '#ffffff' }}
          transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
        >
          {current}
        </motion.div>
        <div className="text-white/60 text-sm">Current Streak</div>
        <motion.div 
          className="text-2xl mt-2"
          animate={animated && current > 0 ? { 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          } : {}}
          transition={{ duration: 0.5, repeat: current > 0 ? Infinity : 0, repeatDelay: 2 }}
        >
          🔥
        </motion.div>
      </div>
      
      <div className="w-px h-16 bg-white/20" />
      
      <div className="text-center">
        <motion.div 
          className="text-3xl font-bold mb-1"
          key={longest}
          initial={animated ? { scale: 1.3, color: '#fbbf24' } : { scale: 1 }}
          animate={{ scale: 1, color: '#ffffff' }}
          transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
        >
          {longest}
        </motion.div>
        <div className="text-white/60 text-sm">Best Streak</div>
        <div className="text-2xl mt-2">👑</div>
      </div>
    </motion.div>
  )
}

export default StreakBadge