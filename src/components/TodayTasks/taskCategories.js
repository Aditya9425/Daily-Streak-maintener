export const predefinedCategories = [
  {
    name: 'Work',
    icon: 'Briefcase',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
    description: 'Professional tasks & projects'
  },
  {
    name: 'Study',
    icon: 'BookOpen',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]',
    description: 'Learning & academic goals'
  },
  {
    name: 'Fitness',
    icon: 'Dumbbell',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    glow: 'shadow-[0_0_15px_rgba(34,197,94,0.15)]',
    description: 'Workouts & physical activity'
  },
  {
    name: 'Health',
    icon: 'Heart',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    glow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]',
    description: 'Wellness & medical'
  },
  {
    name: 'Coding',
    icon: 'Laptop',
    color: 'text-[#FF8A00]',
    bg: 'bg-[#FF8A00]/10',
    border: 'border-[#FF8A00]/30',
    glow: 'shadow-[0_0_15px_rgba(255,138,0,0.15)]',
    description: 'Programming & development'
  },
  {
    name: 'Reading',
    icon: 'Book',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    glow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]',
    description: 'Books & articles'
  },
  {
    name: 'Meetings',
    icon: 'Users',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    glow: 'shadow-[0_0_15px_rgba(234,179,8,0.15)]',
    description: 'Calls & appointments'
  },
  {
    name: 'Personal',
    icon: 'User',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
    glow: 'shadow-[0_0_15px_rgba(236,72,153,0.15)]',
    description: 'Life & self-care'
  },
  {
    name: 'Shopping',
    icon: 'ShoppingCart',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    glow: 'shadow-[0_0_15px_rgba(249,115,22,0.15)]',
    description: 'Groceries & purchases'
  },
  {
    name: 'Finance',
    icon: 'Wallet',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    description: 'Bills & budgeting'
  },
  {
    name: 'Content Creation',
    icon: 'Video',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    glow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]',
    description: 'Videos, writing, & media'
  },
  {
    name: 'Deep Work',
    icon: 'Zap',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    glow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]',
    description: 'High-focus intense blocks'
  },
  {
    name: 'Miscellaneous',
    icon: 'Package',
    color: 'text-slate-400',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
    glow: 'shadow-[0_0_15px_rgba(100,116,139,0.15)]',
    description: 'Other random tasks'
  }
];

export const getCategoryDetails = (categoryName) => {
  const category = predefinedCategories.find(
    c => c.name.toLowerCase() === (categoryName || '').toLowerCase()
  );
  
  if (category) return category;

  // Fallback for custom or unknown categories
  return {
    name: categoryName || 'Task',
    icon: 'CheckCircle', // Lucide generic fallback
    color: 'text-white/70',
    bg: 'bg-white/5',
    border: 'border-white/10',
    glow: ''
  };
};
