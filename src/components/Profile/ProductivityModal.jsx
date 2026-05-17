import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Clock } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const RESET_TIMES = [
  '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM'
];

const ProductivityModal = ({ isOpen, onClose }) => {
  const { productivity, updateProductivity } = useSettings();

  if (!isOpen) return null;

  const Toggle = ({ checked, onChange }) => (
    <button 
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        checked ? 'bg-[#FF8A00]' : 'bg-white/10'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, y: '100%', scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: '100%', scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-lg bg-[#0B0C10] sm:rounded-[32px] rounded-t-[32px] rounded-b-none border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Productivity</h2>
                <p className="text-sm text-white/40 mt-1">Configure your tracking environment.</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              {/* Focus Mode */}
              <div className="bg-[#1C1F2A] border border-white/5 rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="mt-0.5 p-2.5 bg-[#15171E] rounded-xl border border-white/5 text-purple-400">
                    <Target size={20} />
                  </div>
                  <div>
                    <h3 className="text-white/90 font-semibold mb-1">Focus Mode</h3>
                    <p className="text-sm text-white/40 leading-relaxed">
                      Reduces visual distractions and minimizes animations to keep you locked in.
                    </p>
                  </div>
                </div>
                <Toggle 
                  checked={productivity.focusMode} 
                  onChange={() => updateProductivity({ focusMode: !productivity.focusMode })}
                />
              </div>

              {/* Day Reset Time */}
              <div className="bg-[#1C1F2A] border border-white/5 rounded-2xl p-4 sm:p-5">
                <div className="flex gap-4">
                  <div className="mt-0.5 p-2.5 bg-[#15171E] rounded-xl border border-white/5 text-[#FF8A00]">
                    <Clock size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white/90 font-semibold mb-1">Day Reset Time</h3>
                    <p className="text-sm text-white/40 leading-relaxed mb-4">
                      When does your day actually end? Useful for night owls tracking consistency.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {RESET_TIMES.map(time => {
                        const isSelected = productivity.dayResetTime === time;
                        return (
                          <button
                            key={time}
                            onClick={() => updateProductivity({ dayResetTime: time })}
                            className={`px-3 py-2 text-xs font-semibold rounded-xl transition-all border ${
                              isSelected 
                                ? 'bg-[#FF8A00]/10 border-[#FF8A00]/30 text-[#FF8A00]' 
                                : 'bg-[#15171E] border-white/5 text-white/40 hover:text-white/80 hover:bg-white/5'
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductivityModal;
