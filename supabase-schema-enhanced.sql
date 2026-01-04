-- Enhanced schema for new features

-- Add columns to existing tables
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS frequency TEXT DEFAULT 'daily';
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS is_custom BOOLEAN DEFAULT FALSE;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Create streak_data table for accurate streak tracking
CREATE TABLE IF NOT EXISTS public.streak_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  task_id TEXT NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_completed_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, task_id)
);

-- Create streak_protection table
CREATE TABLE IF NOT EXISTS public.streak_protection (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  saves_remaining INTEGER DEFAULT 1,
  last_reset_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create streak_saves_used table to track usage
CREATE TABLE IF NOT EXISTS public.streak_saves_used (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  task_id TEXT NOT NULL,
  date_saved DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add timezone column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';

-- Enable RLS for new tables
ALTER TABLE public.streak_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streak_protection ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streak_saves_used ENABLE ROW LEVEL SECURITY;

-- Create policies for streak_data
CREATE POLICY "Users can view own streak data" ON public.streak_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streak data" ON public.streak_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streak data" ON public.streak_data
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for streak_protection
CREATE POLICY "Users can view own streak protection" ON public.streak_protection
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streak protection" ON public.streak_protection
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streak protection" ON public.streak_protection
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for streak_saves_used
CREATE POLICY "Users can view own streak saves used" ON public.streak_saves_used
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streak saves used" ON public.streak_saves_used
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_streak_data_user_task ON public.streak_data(user_id, task_id);
CREATE INDEX IF NOT EXISTS idx_streak_protection_user ON public.streak_protection(user_id);
CREATE INDEX IF NOT EXISTS idx_streak_saves_used_user ON public.streak_saves_used(user_id);

-- Function to update streak data
CREATE OR REPLACE FUNCTION public.update_streak_data(
  p_user_id UUID,
  p_task_id TEXT,
  p_completed BOOLEAN,
  p_date DATE
)
RETURNS VOID AS $$
DECLARE
  v_current_streak INTEGER := 0;
  v_longest_streak INTEGER := 0;
  v_last_completed DATE;
  v_yesterday DATE := p_date - INTERVAL '1 day';
  v_streak_protection_used BOOLEAN := FALSE;
BEGIN
  -- Get current streak data
  SELECT current_streak, longest_streak, last_completed_date
  INTO v_current_streak, v_longest_streak, v_last_completed
  FROM public.streak_data
  WHERE user_id = p_user_id AND task_id = p_task_id;

  -- If no streak data exists, create it
  IF NOT FOUND THEN
    v_current_streak := 0;
    v_longest_streak := 0;
    v_last_completed := NULL;
  END IF;

  IF p_completed THEN
    -- Task completed
    IF v_last_completed = v_yesterday THEN
      -- Consecutive day
      v_current_streak := v_current_streak + 1;
    ELSE
      -- New streak starts
      v_current_streak := 1;
    END IF;
    
    v_longest_streak := GREATEST(v_longest_streak, v_current_streak);
    v_last_completed := p_date;
  ELSE
    -- Task not completed - check for streak protection
    IF v_current_streak > 0 AND v_last_completed = v_yesterday THEN
      -- Try to use streak protection
      UPDATE public.streak_protection 
      SET saves_remaining = saves_remaining - 1,
          updated_at = NOW()
      WHERE user_id = p_user_id AND saves_remaining > 0;
      
      IF FOUND THEN
        -- Streak protection used
        INSERT INTO public.streak_saves_used (user_id, task_id, date_saved)
        VALUES (p_user_id, p_task_id, p_date);
        v_streak_protection_used := TRUE;
      ELSE
        -- No protection available, reset streak
        v_current_streak := 0;
      END IF;
    END IF;
  END IF;

  -- Update or insert streak data
  INSERT INTO public.streak_data (user_id, task_id, current_streak, longest_streak, last_completed_date)
  VALUES (p_user_id, p_task_id, v_current_streak, v_longest_streak, v_last_completed)
  ON CONFLICT (user_id, task_id)
  DO UPDATE SET
    current_streak = v_current_streak,
    longest_streak = v_longest_streak,
    last_completed_date = v_last_completed,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset weekly streak protection
CREATE OR REPLACE FUNCTION public.reset_weekly_streak_protection()
RETURNS VOID AS $$
BEGIN
  UPDATE public.streak_protection
  SET saves_remaining = 1,
      last_reset_date = CURRENT_DATE,
      updated_at = NOW()
  WHERE last_reset_date <= CURRENT_DATE - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;