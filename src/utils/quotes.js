const MOTIVATIONAL_QUOTES = [
  "Consistency beats motivation.",
  "Small steps daily lead to big changes yearly.",
  "Progress, not perfection.",
  "Your only competition is who you were yesterday.",
  "Discipline is choosing between what you want now and what you want most.",
  "Success is the sum of small efforts repeated day in and day out.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "Don't break the chain.",
  "Excellence is not an act, but a habit.",
  "The compound effect of small wins is extraordinary.",
  "Motivation gets you started. Habit keeps you going.",
  "Every expert was once a beginner.",
  "Focus on being productive instead of busy.",
  "The journey of a thousand miles begins with one step.",
  "What you do today can improve all your tomorrows.",
  "Success isn't always about greatness. It's about consistency.",
  "The difference between ordinary and extraordinary is that little extra.",
  "You don't have to be great to get started, but you have to get started to be great.",
  "Champions keep playing until they get it right.",
  "The only impossible journey is the one you never begin.",
  "Believe you can and you're halfway there.",
  "It always seems impossible until it's done.",
  "The future depends on what you do today.",
  "Success is walking from failure to failure with no loss of enthusiasm.",
  "The only way to do great work is to love what you do.",
  "Don't watch the clock; do what it does. Keep going.",
  "The secret of getting ahead is getting started.",
  "Quality is not an act, it is a habit.",
  "You are never too old to set another goal or to dream a new dream.",
  "The only person you are destined to become is the person you decide to be."
];

export const getDailyQuote = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const quoteIndex = dayOfYear % MOTIVATIONAL_QUOTES.length;
  return MOTIVATIONAL_QUOTES[quoteIndex];
};

export const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[randomIndex];
};