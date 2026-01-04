-- Function to safely delete a task and all related data
CREATE OR REPLACE FUNCTION public.delete_task_completely(
  p_user_id UUID,
  p_task_id TEXT
)
RETURNS VOID AS $$
BEGIN
  -- Delete all related data in correct order
  DELETE FROM public.streak_saves_used WHERE user_id = p_user_id AND task_id = p_task_id;
  DELETE FROM public.task_logs WHERE user_id = p_user_id AND task_id = p_task_id;
  DELETE FROM public.streak_data WHERE user_id = p_user_id AND task_id = p_task_id;
  DELETE FROM public.tasks WHERE user_id = p_user_id AND task_id = p_task_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;