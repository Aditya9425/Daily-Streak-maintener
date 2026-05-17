import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from './AuthContext';

const TodayThoughtsContext = createContext({});

export const useTodayThoughts = () => {
  const context = useContext(TodayThoughtsContext);
  if (!context) {
    throw new Error('useTodayThoughts must be used within TodayThoughtsProvider');
  }
  return context;
};

export const TodayThoughtsProvider = ({ children }) => {
  const { user } = useAuth();
  const [thoughts, setThoughts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchThoughts = useCallback(async () => {
    if (!user) {
      setThoughts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('today_thoughts')
        .select('*')
        .eq('user_id', user.id)
        .order('pinned', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setThoughts(data || []);
    } catch (error) {
      console.error('Error fetching today thoughts:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchThoughts();
  }, [fetchThoughts]);

  const addThought = async ({ thought, mood }) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('today_thoughts')
        .insert([
          { 
            user_id: user.id, 
            thought, 
            mood: mood || 'Calm',
            pinned: false
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setThoughts(prev => [data, ...prev]);
      return { success: true, data };
    } catch (error) {
      console.error('Error adding thought:', error);
      return { success: false, error };
    }
  };

  const updateThought = async (id, updates) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('today_thoughts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setThoughts(prev => {
        // Replace updated item
        let next = prev.map(t => t.id === id ? data : t);
        // Re-sort because pinned status might have changed
        next.sort((a, b) => {
          if (a.pinned === b.pinned) {
            return new Date(b.created_at) - new Date(a.created_at);
          }
          return a.pinned ? -1 : 1;
        });
        return next;
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error updating thought:', error);
      return { success: false, error };
    }
  };

  const deleteThought = async (id) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('today_thoughts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setThoughts(prev => prev.filter(t => t.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting thought:', error);
      return { success: false, error };
    }
  };

  const togglePin = async (id, currentPinnedStatus) => {
    return await updateThought(id, { pinned: !currentPinnedStatus });
  };

  return (
    <TodayThoughtsContext.Provider 
      value={{ 
        thoughts, 
        loading, 
        addThought, 
        updateThought, 
        deleteThought,
        togglePin,
        refreshThoughts: fetchThoughts
      }}
    >
      {children}
    </TodayThoughtsContext.Provider>
  );
};
