import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { getDailyQuote } from '../utils/quotes'

const DailyQuote = () => {
  const quote = getDailyQuote()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full mb-4"
      >
        <Quote className="text-purple-400" size={20} />
      </motion.div>
      
      <motion.blockquote
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg font-medium text-white mb-2 italic"
      >
        "{quote}"
      </motion.blockquote>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-gray-400 text-sm"
      >
        Daily Motivation
      </motion.p>
    </motion.div>
  )
}

export default DailyQuote