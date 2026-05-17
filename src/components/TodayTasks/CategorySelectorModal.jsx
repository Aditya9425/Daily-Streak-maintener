import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Check, Plus } from 'lucide-react';
import { predefinedCategories } from './taskCategories';
import { DynamicIcon } from '../../utils/iconUtils';

const CategorySelectorModal = ({ isOpen, onClose, selectedCategory, onSelectCategory }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = predefinedCategories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelect = (categoryName) => {
    onSelectCategory(categoryName);
    onClose();
  };

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:w-full md:max-w-md z-[70] bg-[#15171E] rounded-t-[32px] md:rounded-3xl border border-white/5 shadow-[0_-10px_50px_rgba(0,0,0,0.8)] h-[85vh] md:h-auto md:max-h-[85vh] flex flex-col overflow-hidden"
          >
            {/* Header & Search (Sticky) */}
            <div className="bg-[#15171E]/95 backdrop-blur-md z-10 px-6 pt-5 pb-4 border-b border-white/5 flex-shrink-0">
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-5 md:hidden" />
              
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Select Category</h2>
                  <p className="text-white/40 text-sm mt-0.5">Choose a category for your task</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 hover:text-white text-white/60 transition-all duration-300"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search Input */}
              <div className="relative group">
                <div className="absolute top-1/2 -translate-y-1/2 left-4 text-white/40 group-focus-within:text-[#FF8A00] transition-colors">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full bg-white/5 border border-white/5 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF8A00]/50 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Scrollable Category List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5 no-scrollbar scroll-smooth">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => {
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <motion.button
                      key={cat.name}
                      onClick={() => handleSelect(cat.name)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center p-4 rounded-2xl border transition-all duration-300 text-left ${
                        isSelected
                          ? `bg-white/10 border-[#FF8A00]/50 shadow-[0_0_20px_rgba(255,138,0,0.15)]`
                          : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                      }`}
                    >
                      {/* Icon Container */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mr-4 ${cat.bg} ${cat.border} border`}>
                        <DynamicIcon iconName={cat.icon} className={cat.color} size={24} />
                      </div>
                      
                      {/* Text Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-base truncate ${isSelected ? 'text-white' : 'text-white/90'}`}>
                          {cat.name}
                        </h3>
                        <p className="text-white/40 text-xs truncate mt-0.5">
                          {cat.description}
                        </p>
                      </div>

                      {/* Active Indicator */}
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#FF8A00]/20 flex items-center justify-center ml-3 flex-shrink-0">
                          <Check size={14} className="text-[#FF8A00]" strokeWidth={3} />
                        </div>
                      )}
                    </motion.button>
                  );
                })
              ) : (
                <div className="text-center py-10">
                  <p className="text-white/40">No categories found matching "{searchQuery}"</p>
                </div>
              )}
              
              {/* Bottom padding for mobile scrolling clearance */}
              <div className="h-6" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CategorySelectorModal;
