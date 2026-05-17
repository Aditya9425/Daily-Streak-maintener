import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Flame, Moon } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const NotificationsModal = ({ isOpen, onClose }) => {
  const { notifications, updateNotifications } = useSettings();

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
                <h2 className="text-xl font-bold text-white tracking-tight">Notifications</h2>
                <p className="text-sm text-white/40 mt-1">Manage your productivity reminders.</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              {/* Daily Reminder */}
              <div className="bg-[#1C1F2A] border border-white/5 rounded-2xl p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="mt-0.5 p-2.5 bg-[#15171E] rounded-xl border border-white/5 text-[#FF8A00]">
                      <Bell size={20} />
                    </div>
                    <div>
                      <h3 className="text-white/90 font-semibold mb-1">Daily Reminder</h3>
                      <p className="text-sm text-white/40 leading-relaxed mb-4">
                        A gentle push to maintain your consistency.
                      </p>
                      <input 
                        type="time" 
                        value={notifications.reminderTime}
                        onChange={(e) => updateNotifications({ reminderTime: e.target.value })}
                        disabled={!notifications.dailyReminder}
                        className="bg-[#15171E] border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white/80 focus:outline-none focus:border-[#FF8A00]/50 disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <Toggle 
                    checked={notifications.dailyReminder} 
                    onChange={() => updateNotifications({ dailyReminder: !notifications.dailyReminder })}
                  />
                </div>
              </div>

              {/* Streak Warning */}
              <div className="bg-[#1C1F2A] border border-white/5 rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="mt-0.5 p-2.5 bg-[#15171E] rounded-xl border border-white/5 text-red-400">
                    <Flame size={20} />
                  </div>
                  <div>
                    <h3 className="text-white/90 font-semibold mb-1">Streak Warning</h3>
                    <p className="text-sm text-white/40 leading-relaxed">
                      Alert me if I'm about to lose my current streak.
                    </p>
                  </div>
                </div>
                <Toggle 
                  checked={notifications.streakWarning} 
                  onChange={() => updateNotifications({ streakWarning: !notifications.streakWarning })}
                />
              </div>

              {/* Evening Reminder */}
              <div className="bg-[#1C1F2A] border border-white/5 rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="mt-0.5 p-2.5 bg-[#15171E] rounded-xl border border-white/5 text-blue-400">
                    <Moon size={20} />
                  </div>
                  <div>
                    <h3 className="text-white/90 font-semibold mb-1">Evening Review</h3>
                    <p className="text-sm text-white/40 leading-relaxed">
                      Remind me to complete any unfinished tasks before bed.
                    </p>
                  </div>
                </div>
                <Toggle 
                  checked={notifications.eveningReminder} 
                  onChange={() => updateNotifications({ eveningReminder: !notifications.eveningReminder })}
                />
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default NotificationsModal;
