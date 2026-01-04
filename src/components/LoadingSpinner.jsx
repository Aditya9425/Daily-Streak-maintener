import { motion } from 'framer-motion'

const LoadingSpinner = ({ size = 40 }) => {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="border-2 border-white/20 border-t-white rounded-full"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  )
}

export default LoadingSpinner