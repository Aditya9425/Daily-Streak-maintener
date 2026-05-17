import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, Pin, PinOff, Trash2, Brain, Moon, Target, Flame, Coffee, Sparkles } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useTodayThoughts } from '../../context/TodayThoughtsContext';

const MOODS = [
  { id: 'Calm', icon: Moon, label: 'Calm' },
  { id: 'Focused', icon: Target, label: 'Focused' },
  { id: 'Motivated', icon: Flame, label: 'Motivated' },
  { id: 'Overthinking', icon: Brain, label: 'Overthinking' },
  { id: 'Tired', icon: Coffee, label: 'Tired' },
  { id: 'Happy', icon: Sparkles, label: 'Happy' }
];

const ThoughtsHistory = () => {
  const { thoughts, deleteThought, togglePin, loading } = useTodayThoughts();
  
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Recent'); // 'Recent', 'Pinned', or Mood ID

  const filteredThoughts = useMemo(() => {
    let result = [...thoughts];

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.thought.toLowerCase().includes(q) || 
        t.mood.toLowerCase().includes(q)
      );
    }

    // Filter pills
    if (activeFilter === 'Pinned') {
      result = result.filter(t => t.pinned);
    } else if (activeFilter !== 'Recent') {
      result = result.filter(t => t.mood === activeFilter);
    }

    return result;
  }, [thoughts, searchQuery, activeFilter]);

  if (!loading && thoughts.length === 0) {
    return (
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider">Thought History</h3>
        </div>
        <div className="text-center py-16 bg-[#15171E] rounded-[30px] border border-white/5 shadow-inner">
          <div className="w-16 h-16 bg-[#1C1F2A] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5 shadow-lg">
            <Brain className="text-white/20" size={28} />
          </div>
          <h4 className="text-white/80 font-semibold mb-1">Your thoughts will appear here.</h4>
          <p className="text-white/40 text-sm">Start reflecting to build your history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* History Header & Collapse Toggle */}
      <div className="flex items-center justify-between mb-4 px-1 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider flex items-center gap-2">
          Thought History
          <span className="bg-[#1C1F2A] text-white/60 text-[10px] px-2.5 py-0.5 rounded-full border border-white/5">{thoughts.length}</span>
        </h3>
        <button className="text-white/30 hover:text-white/70 transition-colors p-1">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input 
                  type="text"
                  placeholder="Search thoughts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#15171E] border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FF8A00]/50 transition-colors"
                />
              </div>
              
              <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-1 px-1">
                {['Recent', 'Pinned', ...MOODS.map(m => m.id)].map(filter => {
                  const isSelected = activeFilter === filter;
                  return (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 flex-shrink-0 ${
                        isSelected 
                          ? 'bg-[#FF8A00] text-black shadow-[0_0_15px_rgba(255,138,0,0.3)]' 
                          : 'bg-[#15171E] text-white/40 border border-white/5 hover:text-white/80 hover:bg-[#1C1F2A]'
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* History List */}
            <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[23px] before:w-px before:bg-gradient-to-b before:from-white/10 before:to-transparent">
              <AnimatePresence mode="popLayout">
                {filteredThoughts.length > 0 ? (
                  filteredThoughts.map(thought => {
                    const moodData = MOODS.find(m => m.id === thought.mood) || MOODS[0];
                    const MoodIcon = moodData.icon;
                    const isPinned = thought.pinned;

                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={thought.id}
                        className={`group relative rounded-[24px] p-5 transition-all duration-300 ml-10 overflow-hidden ${
                          isPinned
                            ? 'bg-gradient-to-br from-[#1C1F2A] to-[#15171E] border border-[#FF8A00]/30 shadow-[0_4px_20px_rgba(255,138,0,0.05)]'
                            : 'bg-[#15171E] border border-white/5 hover:bg-[#1A1D28]'
                        }`}
                      >
                        {/* Timeline Node */}
                        <div className={`absolute top-6 -left-[28px] w-3 h-3 rounded-full border-2 ${
                          isPinned ? 'bg-[#FF8A00] border-[#FF8A00]' : 'bg-[#15171E] border-white/20'
                        } shadow-[0_0_0_4px_rgba(11,12,16,1)]`} />

                        {isPinned && (
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#FF8A00]/10 to-transparent pointer-events-none rounded-tr-[24px]" />
                        )}

                        <div className="flex items-start gap-4">
                          <div className={`mt-0.5 w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 border ${
                            isPinned ? 'bg-[#FF8A00]/10 text-[#FF8A00] border-[#FF8A00]/20' : 'bg-[#1C1F2A] text-white/40 border-white/5'
                          }`}>
                            <MoodIcon size={18} strokeWidth={2.5} />
                          </div>
                          
                          <div className="flex-1 min-w-0 pr-12">
                            <p className="text-white/90 text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                              {thought.thought}
                            </p>
                            <div className="flex items-center gap-3 mt-3 text-white/30 text-xs font-semibold uppercase tracking-wider">
                              <span>{formatDistanceToNow(parseISO(thought.created_at), { addSuffix: true })}</span>
                              <span>&bull;</span>
                              <span className={isPinned ? 'text-[#FF8A00]/70' : ''}>{moodData.label}</span>
                            </div>
                          </div>
                        </div>

                        {/* Quick Actions (Hover) */}
                        <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                          <button
                            onClick={() => togglePin(thought.id, thought.pinned)}
                            className={`p-2 rounded-xl transition-colors ${
                              isPinned ? 'text-[#FF8A00] bg-[#FF8A00]/10 hover:bg-[#FF8A00]/20' : 'text-white/30 hover:text-white hover:bg-[#1C1F2A]'
                            }`}
                            title={isPinned ? "Unpin thought" : "Pin thought"}
                          >
                            {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
                          </button>
                          <button
                            onClick={() => deleteThought(thought.id)}
                            className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                            title="Delete thought"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        {isPinned && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FFB347] to-[#FF8A00]" />
                        )}
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-10 bg-[#15171E] rounded-[24px] border border-white/5 border-dashed ml-10"
                  >
                    <Search className="text-white/20 mx-auto mb-3" size={24} />
                    <p className="text-white/40 text-sm">No thoughts match your filters.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThoughtsHistory;
