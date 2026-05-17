import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, ChevronRight } from 'lucide-react';
import { useTodayThoughts } from '../../context/TodayThoughtsContext';
import ThoughtsModal from './ThoughtsModal';

const TodayThoughtsSection = () => {
  const { thoughts } = useTodayThoughts();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div 
        layout
        onClick={() => setIsModalOpen(true)}
        className="mb-12 mt-10 relative max-w-xl mx-auto bg-[#15171E] border border-white/5 rounded-[28px] overflow-hidden transition-all duration-300 hover:bg-[#1A1D28] hover:border-[#FF8A00]/20 cursor-pointer shadow-lg group"
      >
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="flex-shrink-0 mt-0.5 p-2.5 bg-gradient-to-br from-[#FFB347]/10 to-[#FF8A00]/10 rounded-2xl border border-[#FF8A00]/20 group-hover:shadow-[0_0_15px_rgba(255,138,0,0.2)] transition-shadow">
              <Lightbulb className="text-[#FF8A00]" size={20} strokeWidth={2.5} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[17px] font-bold text-white tracking-tight leading-tight">Today's Thoughts</h2>
              <p className="text-[13px] text-white/40 mt-1 truncate">
                {thoughts.length > 0 
                  ? thoughts[0].thought 
                  : "Capture what's on your mind."}
              </p>
            </div>
          </div>
          
          <div className="flex-shrink-0 ml-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/30 group-hover:text-[#FF8A00] group-hover:bg-[#FF8A00]/10 transition-colors">
            <ChevronRight size={18} strokeWidth={2.5} />
          </div>
        </div>
      </motion.div>

      <ThoughtsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default TodayThoughtsSection;
