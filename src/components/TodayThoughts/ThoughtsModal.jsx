import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Moon, Target, Flame, Brain, Coffee, Sparkles, Send, Loader2, CheckCircle2, X, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useTodayThoughts } from '../../context/TodayThoughtsContext';
import ThoughtsHistory from './ThoughtsHistory';

const MOODS = [
  { id: 'Calm', icon: Moon, label: 'Calm' },
  { id: 'Focused', icon: Target, label: 'Focused' },
  { id: 'Motivated', icon: Flame, label: 'Motivated' },
  { id: 'Overthinking', icon: Brain, label: 'Overthinking' },
  { id: 'Tired', icon: Coffee, label: 'Tired' },
  { id: 'Happy', icon: Sparkles, label: 'Happy' }
];

const ThoughtsModal = ({ isOpen, onClose }) => {
  const { addThought } = useTodayThoughts();
  
  // Local draft persistence
  const [thoughtText, setThoughtText] = useState('');
  const [selectedMood, setSelectedMood] = useState('Calm');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [now, setNow] = useState(new Date());
  const textareaRef = useRef(null);

  // Initialize draft only once when modal opens
  useEffect(() => {
    if (isOpen) {
      setThoughtText(localStorage.getItem('streakwise_thought_draft') || '');
    }
  }, [isOpen]);

  // Sync draft to localStorage on change
  useEffect(() => {
    localStorage.setItem('streakwise_thought_draft', thoughtText);
  }, [thoughtText]);

  // Live clock
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleInput = (e) => {
    setThoughtText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleClearDraft = () => {
    setThoughtText('');
    localStorage.removeItem('streakwise_thought_draft');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleSave = async () => {
    if (!thoughtText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    
    await addThought({ thought: thoughtText.trim(), mood: selectedMood });
    
    setThoughtText('');
    localStorage.removeItem('streakwise_thought_draft');
    setIsSubmitting(false);
    setShowSuccess(true);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, y: '100%', scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: '100%', scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-3xl max-h-[90vh] sm:max-h-[85vh] bg-[#0B0C10] sm:rounded-[40px] rounded-t-[32px] rounded-b-none border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex-shrink-0 p-6 sm:p-8 border-b border-white/5 bg-[#15171E]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-[#FFB347]/10 to-[#FF8A00]/10 rounded-2xl border border-[#FF8A00]/20 shadow-[0_0_20px_rgba(255,138,0,0.1)]">
                  <Lightbulb className="text-[#FF8A00]" size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Today's Thoughts</h2>
                  <p className="text-sm text-white/40 mt-0.5">Capture what's on your mind before the day gets noisy.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="hidden sm:block text-right">
                  <p className="text-white/80 font-medium">{format(now, 'EEEE, MMM d')}</p>
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">{format(now, 'h:mm a')}</p>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 sm:p-8 scrollbar-hide">
            
            {/* Input Section */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF8A00]/0 via-[#FF8A00]/10 to-[#FF8A00]/0 rounded-[32px] blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-[#15171E] rounded-[32px] p-6 sm:p-8 border border-white/5 shadow-inner">
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-white/30 uppercase tracking-wider">
                    {thoughtText.length} characters
                  </span>
                  <div className="flex items-center gap-2">
                    {thoughtText.length > 0 && (
                      <span className="text-[10px] text-[#FF8A00]/60 font-semibold bg-[#FF8A00]/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 size={10} /> Auto-saved draft
                      </span>
                    )}
                  </div>
                </div>

                <textarea
                  ref={textareaRef}
                  value={thoughtText}
                  onChange={handleInput}
                  placeholder="What's on your mind today?"
                  autoFocus
                  className="w-full bg-transparent text-white text-lg sm:text-xl leading-relaxed placeholder-white/20 focus:outline-none min-h-[150px] resize-none overflow-hidden selection:bg-[#FF8A00]/30"
                />

                <div className="mt-8 pt-6 border-t border-white/5">
                  <p className="text-xs font-bold text-white/30 uppercase tracking-wider mb-3">How are you feeling?</p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {MOODS.map(mood => {
                      const isSelected = selectedMood === mood.id;
                      const Icon = mood.icon;
                      return (
                        <button
                          key={mood.id}
                          onClick={() => setSelectedMood(mood.id)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                            isSelected 
                              ? 'bg-[#FF8A00]/10 border border-[#FF8A00]/30 text-[#FF8A00] shadow-[0_0_20px_rgba(255,138,0,0.15)] -translate-y-0.5' 
                              : 'bg-[#1C1F2A] border border-white/5 text-white/40 hover:text-white/80 hover:bg-white/5'
                          }`}
                        >
                          <Icon size={16} strokeWidth={isSelected ? 3 : 2} />
                          {mood.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* History Section */}
            <ThoughtsHistory />
            
            {/* Bottom Padding for scroll space above sticky footer */}
            <div className="h-24"></div>
          </div>

          {/* Sticky Action Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10] to-transparent pointer-events-none">
            <div className="max-w-3xl mx-auto flex items-center justify-between gap-4 pointer-events-auto bg-[#1C1F2A]/90 backdrop-blur-xl p-3 px-4 rounded-full border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearDraft}
                  disabled={!thoughtText.trim()}
                  className="p-2.5 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Clear Draft"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <motion.button
                onClick={handleSave}
                disabled={!thoughtText.trim() || isSubmitting || showSuccess}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative flex items-center gap-2 bg-gradient-to-r from-[#FFB347] to-[#FF8A00] text-black px-8 py-3 rounded-full font-bold text-sm shadow-[0_4px_20px_rgba(255,138,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all overflow-hidden"
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : showSuccess ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <Send size={16} className="ml-1" />
                )}
                <span>{isSubmitting ? 'Saving...' : showSuccess ? 'Saved successfully!' : 'Save Thought'}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ThoughtsModal;
