import React from 'react';
import * as LucideIcons from 'lucide-react';

export const EMOJI_TO_LUCIDE = {
  '📚': 'BookOpen',
  '💻': 'Laptop',
  '🏃': 'Activity',
  '🎯': 'Target',
  '🎨': 'Palette',
  '🎵': 'Music',
  '📝': 'ClipboardList',
  '🧘': 'Wind',
  '🍎': 'Apple',
  '💪': 'Dumbbell',
  '🌱': 'Leaf',
  '⚡': 'Zap',
  '🔥': 'Flame',
  '🎪': 'Tent',
  '🚀': 'Rocket',
  '⭐': 'Star',
  '💧': 'Droplets',
  '☀️': 'Sun',
  '🌙': 'Moon',
  '📝': 'FileText',
  '🎧': 'Headphones',
  '💸': 'Wallet',
}

const KEYWORD_MAP = [
  { keywords: ['read', 'book', 'study', 'learn'], icon: 'BookOpen' },
  { keywords: ['work', 'code', 'laptop', 'computer', 'email'], icon: 'Laptop' },
  { keywords: ['run', 'walk', 'exercise', 'cardio', 'jog', 'steps'], icon: 'Activity' },
  { keywords: ['gym', 'workout', 'lift', 'weight', 'muscle', 'train'], icon: 'Dumbbell' },
  { keywords: ['water', 'drink', 'hydrate', 'bottle'], icon: 'Droplets' },
  { keywords: ['meditate', 'breathe', 'relax', 'yoga', 'mindful'], icon: 'Wind' },
  { keywords: ['eat', 'food', 'diet', 'meal', 'fruit', 'veg', 'sugar', 'healthy'], icon: 'Apple' },
  { keywords: ['sleep', 'rest', 'bed', 'night', 'early'], icon: 'Moon' },
  { keywords: ['morning', 'wake', 'routine'], icon: 'Sun' },
  { keywords: ['write', 'journal', 'notes', 'plan'], icon: 'FileText' },
  { keywords: ['music', 'listen', 'podcast'], icon: 'Headphones' },
  { keywords: ['save', 'money', 'budget', 'finance'], icon: 'Wallet' },
]

export const PREMIUM_ICONS = [
  'Activity', 'Apple', 'BookOpen', 'Briefcase', 'Camera', 'CheckCircle', 
  'ClipboardList', 'Coffee', 'Compass', 'Droplets', 'Dumbbell', 'FileText',
  'Flame', 'Headphones', 'Heart', 'Laptop', 'Leaf', 'Lightbulb', 'Moon', 
  'Music', 'Palette', 'Rocket', 'Smile', 'Star', 'Sun', 'Target', 'Wallet', 
  'Wind', 'Zap'
]

export const getIconForTask = (name, providedIcon) => {
  // If user provided a specific Lucide icon name from our list
  if (providedIcon && PREMIUM_ICONS.includes(providedIcon)) {
    return providedIcon;
  }
  
  // If user provided an emoji, map it directly
  if (providedIcon && EMOJI_TO_LUCIDE[providedIcon]) {
    return EMOJI_TO_LUCIDE[providedIcon];
  }

  // If no mapped provided icon, try keyword mapping
  if (name) {
    const lowerName = name.toLowerCase();
    for (const mapping of KEYWORD_MAP) {
      if (mapping.keywords.some(kw => lowerName.includes(kw))) {
        return mapping.icon;
      }
    }
  }

  // Fallback
  return 'CheckCircle';
}

export const DynamicIcon = ({ iconName, size = 24, className = "" }) => {
  let nameToRender = iconName;
  
  // If it's a string but NOT a valid Lucide component name, it might be an emoji
  if (typeof iconName === 'string' && !LucideIcons[iconName]) {
    nameToRender = EMOJI_TO_LUCIDE[iconName] || 'CheckCircle';
  }

  const IconComponent = LucideIcons[nameToRender] || LucideIcons.CheckCircle;
  return <IconComponent size={size} className={className} strokeWidth={2} />;
}
