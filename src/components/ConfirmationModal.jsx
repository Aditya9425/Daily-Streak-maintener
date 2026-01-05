import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  taskName, 
  currentStreak,
  willResetStreak 
}) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-black/90 backdrop-blur-xl border border-red-500/20 rounded-2xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-red-400" size={24} />
              <h2 className="text-xl font-bold text-white">Confirm Action</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="text-white" size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-4">
              <p className="text-white mb-2">
                You're about to mark <strong>{taskName}</strong> as incomplete.
              </p>
            </div>

            {/* Warning box */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-400 mt-0.5" size={20} />
                <div className="space-y-2">
                  <p className="text-red-400 font-medium">This action will:</p>
                  <ul className="text-red-400 text-sm space-y-1">
                    <li>• Reduce your daily progress percentage</li>
                    {willResetStreak && currentStreak > 0 && (
                      <li>• Reset your {currentStreak}-day streak to 0</li>
                    )}
                    <li>• Update your completion history</li>
                    <li>• Cannot be undone automatically</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Current streak info */}
            {currentStreak > 0 && (
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{currentStreak}</div>
                  <div className="text-sm text-white/60">Current Streak Days</div>
                  {willResetStreak && (
                    <div className="text-xs text-red-400 mt-1">Will be reset to 0</div>
                  )}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 p-3 border border-white/20 rounded-xl text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 p-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                Mark Incomplete
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ConfirmationModal