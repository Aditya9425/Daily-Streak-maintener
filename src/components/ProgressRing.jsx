import { motion } from 'framer-motion'

const ProgressRing = ({ progress, size = 120, strokeWidth = 8, children, animated = true }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress / 100) * circumference

  // Color based on progress
  const getProgressColor = () => {
    if (progress >= 80) return '#10b981' // green
    if (progress >= 60) return '#f59e0b' // yellow
    if (progress >= 40) return '#f97316' // orange
    return '#ef4444' // red
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getProgressColor()}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset }}
          animate={{ strokeDashoffset }}
          transition={{
            duration: animated ? 1.5 : 0,
            ease: "easeInOut",
            delay: animated ? 0.3 : 0
          }}
          style={{
            filter: progress > 0 ? `drop-shadow(0 0 8px ${getProgressColor()}40)` : 'none'
          }}
        />
        
        {/* Glow effect for high progress */}
        {progress >= 80 && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={getProgressColor()}
            strokeWidth={strokeWidth / 2}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            opacity={0.3}
            animate={{
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}

export default ProgressRing