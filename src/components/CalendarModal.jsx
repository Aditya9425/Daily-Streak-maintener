import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Calendar from './Calendar'

const CalendarModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[60]"
          />
          
          {/* Bottom Sheet Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed bottom-0 left-0 right-0 z-[70] bg-[#15171E] rounded-t-3xl border-t border-white/5 p-6 max-h-[85vh] overflow-y-auto shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:max-w-xl md:mx-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:rounded-3xl md:border"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Activity Calendar</h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-[#1C1F2A] border border-white/5 hover:bg-white/5 transition-colors text-white/50 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="bg-[#0B0C10] rounded-2xl p-4 border border-white/5">
              <Calendar />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CalendarModal
