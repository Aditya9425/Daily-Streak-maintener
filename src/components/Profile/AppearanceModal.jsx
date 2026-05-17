import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Monitor } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const THEMES = [
  { id: 'Dark', icon: Moon, label: 'Dark', description: 'Matte cinematic' },
  { id: 'Light', icon: Sun, label: 'Light', description: 'Soft clean' },
  { id: 'System', icon: Monitor, label: 'System', description: 'Device default' }
];

const AppearanceModal = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useSettings();

  if (!isOpen) return null;

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
                <h2 className="text-xl font-bold text-white tracking-tight">Appearance</h2>
                <p className="text-sm text-white/40 mt-1">Choose your app theme.</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {THEMES.map(t => {
                const isSelected = theme === t.id;
                const Icon = t.icon;
                return (
                  <motion.button
                    key={t.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTheme(t.id)}
                    className={`relative p-3 sm:p-4 rounded-2xl flex flex-col items-center gap-2 sm:gap-3 transition-all duration-300 text-left border ${
                      isSelected 
                        ? 'bg-[#1C1F2A] border-[#FF8A00]/50 shadow-[0_0_20px_rgba(255,138,0,0.15)]' 
                        : 'bg-[#15171E] border-white/5 hover:bg-[#1A1D28] hover:border-white/10'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-b from-[#FF8A00]/10 to-transparent rounded-2xl pointer-events-none" />
                    )}
                    <div className={`p-2.5 sm:p-3 rounded-xl ${isSelected ? 'bg-[#FF8A00]/10 text-[#FF8A00]' : 'bg-white/5 text-white/40'}`}>
                      <Icon size={20} strokeWidth={isSelected ? 2.5 : 2} />
                    </div>
                    <div className="text-center">
                      <span className={`block text-xs sm:text-sm font-semibold ${isSelected ? 'text-[#FF8A00]' : 'text-white/80'}`}>
                        {t.label}
                      </span>
                      <span className="block text-[9px] sm:text-[10px] text-white/40 uppercase tracking-wider mt-0.5 font-medium">
                        {t.description}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-white/30 font-medium">
                StreakWise maintains its premium matte cinematic identity across all themes.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AppearanceModal;
