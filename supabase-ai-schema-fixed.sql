-- Updated AI coaching tables with proper policies

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.ai_daily_coaching CASCADE;
DROP TABLE IF EXISTS public.ai_missed_task_feedback CASCADE;
DROP TABLE IF EXISTS public.ai_weekly_reviews CASCADE;

-- Daily AI coaching messages
CREATE TABLE public.ai_daily_coaching (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  message TEXT NOT NULL,
  action_suggestion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- AI missed task reasoning
CREATE TABLE public.ai_missed_task_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  task_id TEXT NOT NULL,
  missed_days INTEGER NOT NULL,
  user_reason TEXT,
  ai_suggestion TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI weekly reviews
CREATE TABLE public.ai_weekly_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  week_start_date DATE NOT NULL,
  biggest_win TEXT,
  weakest_habit TEXT,
  improvement_suggestion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start_date)
);

-- Enable RLS
ALTER TABLE public.ai_daily_coaching ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_missed_task_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_weekly_reviews ENABLE ROW LEVEL SECURITY;

-- Policies for ai_daily_coaching
CREATE POLICY "Users can view own AI coaching" ON public.ai_daily_coaching
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI coaching" ON public.ai_daily_coaching
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI coaching" ON public.ai_daily_coaching
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for ai_missed_task_feedback
CREATE POLICY "Users can view own AI feedback" ON public.ai_missed_task_feedback
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI feedback" ON public.ai_missed_task_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for ai_weekly_reviews
CREATE POLICY "Users can view own AI reviews" ON public.ai_weekly_reviews
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI reviews" ON public.ai_weekly_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI reviews" ON public.ai_weekly_reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_ai_daily_coaching_user_date ON public.ai_daily_coaching(user_id, date);
CREATE INDEX idx_ai_missed_feedback_user_task ON public.ai_missed_task_feedback(user_id, task_id);
CREATE INDEX idx_ai_weekly_reviews_user_week ON public.ai_weekly_reviews(user_id, week_start_date);