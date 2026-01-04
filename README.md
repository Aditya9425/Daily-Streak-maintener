# Daily Streak Tracker

A premium-looking daily streak maintainer web app built with React, Supabase, and Tailwind CSS. Track your daily habits, maintain streaks, and visualize your consistency with a beautiful glass morphism design.

## ✨ Features

- **Daily Task Tracking**: Check/uncheck 7 predefined daily tasks
- **Streak Management**: Individual streaks per task with auto-reset on missed days
- **Progress Visualization**: Daily completion percentage with animated progress rings
- **Glass Morphism UI**: Premium black & white design with frosted glass effects
- **Smooth Animations**: Framer Motion powered micro-interactions
- **Mobile-First**: Responsive design optimized for all devices
- **Secure Authentication**: Email/password auth with Supabase

## 🎯 Predefined Tasks

1. LeetCode
2. Google Skills
3. DSA Practice
4. Project Work
5. Communication Skills (1 video shoot/day)
6. Gym
7. 15 min Typing Practice

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Supabase (Database + Auth)
- **Icons**: Lucide React
- **Date Utils**: date-fns

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd daily-streak-tracker
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. In the SQL Editor, run the schema from `supabase-schema.sql`

### 3. Environment Variables

```bash
cp .env.example .env
```

Update `.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## 📱 Usage

1. **Sign Up/Login**: Create account or login with email/password
2. **Daily Check-ins**: Click tasks to mark as complete
3. **Track Streaks**: View current and longest streaks for each task
4. **Monitor Progress**: See daily completion percentage
5. **Stay Consistent**: Tasks auto-reset every new day

## 🗄️ Database Schema

### Tables

- **users**: User profiles (extends Supabase auth)
- **tasks**: User's task definitions
- **task_logs**: Daily completion records

### Key Features

- Row Level Security (RLS) enabled
- Automatic user profile creation
- Optimized indexes for performance
- Unique constraints for data integrity

## 🎨 Design System

### Theme
- Pure black & white palette
- Glass morphism effects
- Subtle animations and transitions

### Components
- `TaskCard`: Individual task with streak info
- `ProgressRing`: Animated circular progress
- `StreakBadge`: Current/longest streak display
- `LoadingSpinner`: Elegant loading states

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Deploy to Vercel

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

See [DEPLOY.md](DEPLOY.md) for detailed deployment instructions.

## 🔮 Future Enhancements

- Custom task creation
- Weekly/monthly analytics
- Streak recovery options
- Social sharing
- Dark/light theme toggle
- Export data functionality

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Supabase for the backend infrastructure
- Framer Motion for smooth animations
- Tailwind CSS for the styling system
- Lucide for the beautiful icons