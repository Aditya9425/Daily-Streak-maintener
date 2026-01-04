import { motion } from 'framer-motion'
import { TrendingUp, AlertCircle, Target } from 'lucide-react'
import { useAI } from '../context/AIContext'

const AIWeeklyReview = () => {
  const { weeklyReview, generateWeeklyReview } = useAI()

  if (!weeklyReview) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center"
      >
        <h3 className="font-semibold text-white mb-4">Weekly AI Review</h3>
        <p className="text-white/60 mb-4">Generate your weekly performance review</p>
        <button
          onClick={generateWeeklyReview}
          className="px-4 py-2 bg-white text-black rounded-xl hover:bg-gray-200 transition-colors"
        >
          Generate Review
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-2xl p-6"
    >
      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
        <TrendingUp size={20} />
        Weekly Review
      </h3>
      
      <div className="space-y-4">
        {weeklyReview.biggest_win && (
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
            <div>
              <p className="text-green-400 text-sm font-medium">Biggest Win</p>
              <p className="text-white">{weeklyReview.biggest_win}</p>
            </div>
          </div>
        )}
        
        {weeklyReview.weakest_habit && (
          <div className="flex items-start gap-3">
            <AlertCircle className="text-orange-400 mt-0.5" size={16} />
            <div>
              <p className="text-orange-400 text-sm font-medium">Needs Work</p>
              <p className="text-white">{weeklyReview.weakest_habit}</p>
            </div>
          </div>
        )}
        
        {weeklyReview.improvement_suggestion && (
          <div className="flex items-start gap-3">
            <Target className="text-blue-400 mt-0.5" size={16} />
            <div>
              <p className="text-blue-400 text-sm font-medium">Next Week Focus</p>
              <p className="text-white">{weeklyReview.improvement_suggestion}</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default AIWeeklyReview