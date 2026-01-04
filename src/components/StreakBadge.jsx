import { motion } from 'framer-motion'

const StreakBadge = ({ current, longest, compact = false }) => {
  if (compact) {
    return (
      <motion.div 
        className="flex items-center gap-2 text-sm"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-1">
          <span className="text-white/60">🔥</span>
          <span className="font-medium">{current}</span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-1">
          <span className="text-white/60">👑</span>
          <span className="font-medium text-white/80">{longest}</span>
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
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {current}
        </motion.div>
        <div className="text-white/60 text-sm">Current Streak</div>
        <div className="text-2xl mt-2">🔥</div>
      </div>
      
      <div className="w-px h-16 bg-white/20" />
      
      <div className="text-center">
        <div className="text-3xl font-bold mb-1">{longest}</div>
        <div className="text-white/60 text-sm">Best Streak</div>
        <div className="text-2xl mt-2">👑</div>
      </div>
    </motion.div>
  )
}

export default StreakBadge