import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageSquare, Lightbulb } from 'lucide-react'
import { useAI } from '../context/AIContext'

const REASON_OPTIONS = [
  'Too busy',
  'Forgot',
  'Not motivated',
  'Too difficult',
  'Sick/tired',
  'Other priorities'
]

const AIMissedTaskFeedback = ({ isOpen, onClose, task, missedDays }) => {
  const { handleMissedTaskFeedback } = useAI()
  const [selectedReason, setSelectedReason] = useState('')
  const [customReason, setCustomReason] = useState('')
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    const reason = selectedReason === 'Other' ? customReason : selectedReason
    if (!reason.trim()) return

    setLoading(true)
    try {
      const suggestion = await handleMissedTaskFeedback(task.task_id, missedDays, reason)
      setAiSuggestion(suggestion)
    } catch (error) {
      console.error('Error getting AI feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedReason('')
    setCustomReason('')
    setAiSuggestion('')
    onClose()
  }

  if (!isOpen || !task) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="text-orange-400" size={20} />
                <h3 className="text-xl font-bold text-white">Task Feedback</h3>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="text-white" size={20} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-white mb-2">
                You've missed <strong>{task.name}</strong> for {missedDays} days.
              </p>
              <p className="text-white/60 text-sm">
                Help us understand why so we can suggest improvements.
              </p>
            </div>

            {!aiSuggestion ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-3">
                    What's the main reason?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {REASON_OPTIONS.map((reason) => (
                      <button
                        key={reason}
                        onClick={() => setSelectedReason(reason)}
                        className={`p-3 text-sm rounded-xl transition-colors ${
                          selectedReason === reason
                            ? 'bg-white/20 text-white'
                            : 'bg-white/5 text-white/80 hover:bg-white/10'
                        }`}
                      >
                        {reason}
                      </button>
                    ))}
                    <button
                      onClick={() => setSelectedReason('Other')}
                      className={`p-3 text-sm rounded-xl transition-colors ${
                        selectedReason === 'Other'
                          ? 'bg-white/20 text-white'
                          : 'bg-white/5 text-white/80 hover:bg-white/10'
                      }`}
                    >
                      Other
                    </button>
                  </div>
                </div>

                {selectedReason === 'Other' && (
                  <div>
                    <input
                      type="text"
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="Describe your reason..."
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/30"
                    />
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading || !selectedReason || (selectedReason === 'Other' && !customReason.trim())}
                  className="w-full p-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Getting AI Suggestion...' : 'Get AI Suggestion'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <Lightbulb className="text-blue-400 mt-0.5" size={20} />
                  <div>
                    <p className="text-blue-400 text-sm font-medium mb-1">AI Suggestion</p>
                    <p className="text-white">{aiSuggestion}</p>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full p-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Got it, thanks!
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default AIMissedTaskFeedback