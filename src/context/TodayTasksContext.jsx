import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from './AuthContext';

const TodayTasksContext = createContext({});

export const useTodayTasks = () => {
  const context = useContext(TodayTasksContext);
  if (!context) {
    throw new Error('useTodayTasks must be used within TodayTasksProvider');
  }
  return context;
};

// Helper: Format DB task (lowercase enums) for UI (capitalized strings)
const normalizeTaskForUI = (task) => {
  if (!task) return task;
  
  const formattedPriority = task.priority 
    ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1).toLowerCase() 
    : 'Medium';

  // If status is "in_progress", the UI might expect "In Progress" or "in_progress".
  // The UI currently mostly checks task.status === 'completed', so we can keep status as it is,
  // or format it. Let's keep status as it is to avoid breaking 'completed' checks in UI,
  // but ensure priority is capitalized for UI.

  return {
    ...task,
    priority: formattedPriority,
  };
};

export const TodayTasksProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      // Fetch all today tasks for the current user, ordered by created_at
      const { data, error } = await supabase
        .from('today_tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedData = (data || []).map(normalizeTaskForUI);
      setTasks(formattedData);
    } catch (err) {
      console.error('Error fetching today tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (taskData) => {
    if (!user) return null;
    
    try {
      const now = new Date().toISOString();
      const rawPriority = taskData.priority || 'Medium';
      
      const newTaskDB = {
        user_id: user.id,
        title: taskData.title,
        description: taskData.description || '',
        priority: rawPriority.toLowerCase(), // Normalize for DB constraint
        status: 'pending',
        category: taskData.category || 'General',
        emoji: taskData.emoji || '📝',
        due_date: taskData.due_date || null,
        completed: false,
        created_at: now,
        updated_at: now,
      };

      const { data, error } = await supabase
        .from('today_tasks')
        .insert([newTaskDB])
        .select()
        .single();

      if (error) throw error;

      const formattedData = normalizeTaskForUI(data);
      setTasks(prev => [formattedData, ...prev]);
      return formattedData;
    } catch (err) {
      console.error('Error adding today task:', err);
      return null;
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    if (!user) return false;
    
    try {
      const now = new Date().toISOString();
      const normalizedStatus = newStatus.toLowerCase().replace(' ', '_'); // Ensure DB safe
      const isCompleted = normalizedStatus === 'completed';
      
      const updateDataDB = {
        status: normalizedStatus,
        completed: isCompleted,
        updated_at: now,
        ...(isCompleted ? { completed_at: now } : { completed_at: null })
      };

      // Optimistic update - update the local state. Status goes to local as normalized to keep 'completed' check working.
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updateDataDB } : t));

      const { error } = await supabase
        .from('today_tasks')
        .update(updateDataDB)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        // Revert on error
        fetchTasks();
        throw error;
      }
      return true;
    } catch (err) {
      console.error('Error updating task status:', err);
      return false;
    }
  };
  
  const updateTask = async (id, updates) => {
    if (!user) return false;
    
    try {
      const now = new Date().toISOString();
      
      const updateDataDB = {
        ...updates,
        updated_at: now
      };

      // Normalize fields for DB if present
      if (updateDataDB.priority) {
        updateDataDB.priority = updateDataDB.priority.toLowerCase();
      }
      if (updateDataDB.status) {
        updateDataDB.status = updateDataDB.status.toLowerCase().replace(' ', '_');
      }

      // Optimistic update for UI (format it back for UI state)
      const uiUpdates = { ...updateDataDB };
      if (uiUpdates.priority) {
        uiUpdates.priority = uiUpdates.priority.charAt(0).toUpperCase() + uiUpdates.priority.slice(1).toLowerCase();
      }

      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...uiUpdates } : t));

      const { error } = await supabase
        .from('today_tasks')
        .update(updateDataDB)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        fetchTasks();
        throw error;
      }
      return true;
    } catch (err) {
      console.error('Error updating task:', err);
      return false;
    }
  };

  const deleteTask = async (id) => {
    if (!user) return false;
    
    try {
      // Optimistic delete
      setTasks(prev => prev.filter(t => t.id !== id));

      const { error } = await supabase
        .from('today_tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        fetchTasks();
        throw error;
      }
      return true;
    } catch (err) {
      console.error('Error deleting task:', err);
      return false;
    }
  };

  const clearCompleted = async () => {
    if (!user) return false;
    
    try {
      // Optimistic update
      setTasks(prev => prev.filter(t => !t.completed));

      const { error } = await supabase
        .from('today_tasks')
        .delete()
        .eq('completed', true)
        .eq('user_id', user.id);

      if (error) {
        fetchTasks();
        throw error;
      }
      return true;
    } catch (err) {
      console.error('Error clearing completed tasks:', err);
      return false;
    }
  };

  const value = {
    tasks,
    loading,
    addTask,
    updateTaskStatus,
    updateTask,
    deleteTask,
    clearCompleted,
    refreshTasks: fetchTasks
  };

  return (
    <TodayTasksContext.Provider value={value}>
      {children}
    </TodayTasksContext.Provider>
  );
};
