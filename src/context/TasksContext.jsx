import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'
import { useAuth } from './AuthContext'
import { PREDEFINED_TASKS } from '../utils/tasks'
import { getTodayString, calculateStreak, isNewDay, getDateRange } from '../utils/dateUtils'

const TasksContext = createContext({})

export const useTasks = () => {
  const context = useContext(TasksContext)
  if (!context) {
    throw new Error('useTasks must be used within TasksProvider')
  }
  return context
}

export const TasksProvider = ({ children }) => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [taskLogs, setTaskLogs] = useState([])
  const [streakData, setStreakData] = useState([])
  const [streakProtection, setStreakProtection] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastCheckDate, setLastCheckDate] = useState(null)

  useEffect(() => {
    if (user) {
      initializeUserData()
    } else {
      resetState()
    }
  }, [user])

  // Check for new day and reset daily states
  useEffect(() => {
    if (user && isNewDay(lastCheckDate)) {
      setLastCheckDate(getTodayString())
      // Reset weekly streak protection if needed
      resetWeeklyStreakProtection()
    }
  }, [user, lastCheckDate])

  const resetState = () => {
    setTasks([])
    setTaskLogs([])
    setStreakData([])
    setStreakProtection(null)
    setLoading(false)
    setLastCheckDate(null)
  }

  const initializeUserData = async () => {
    try {
      await Promise.all([
        initializeTasks(),
        fetchTaskLogs(),
        fetchStreakData(),
        initializeStreakProtection()
      ])
    } catch (error) {
      console.error('Error initializing user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const initializeTasks = async () => {
    try {
      const { data: existingTasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('order_index')

      setTasks(existingTasks || [])
    } catch (error) {
      console.error('Error initializing tasks:', error)
    }
  }

  const fetchTaskLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('task_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) throw error
      setTaskLogs(data || [])
    } catch (error) {
      console.error('Error fetching task logs:', error)
    }
  }

  const fetchStreakData = async () => {
    try {
      const { data, error } = await supabase
        .from('streak_data')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error
      setStreakData(data || [])
    } catch (error) {
      console.error('Error fetching streak data:', error)
    }
  }

  const initializeStreakProtection = async () => {
    try {
      let { data, error } = await supabase
        .from('streak_protection')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code === 'PGRST116') {
        // No streak protection record exists, create one
        const { data: newProtection, error: insertError } = await supabase
          .from('streak_protection')
          .insert({
            user_id: user.id,
            saves_remaining: 1,
            last_reset_date: getTodayString()
          })
          .select()
          .single()

        if (insertError) throw insertError
        data = newProtection
      } else if (error) {
        throw error
      }

      setStreakProtection(data)
    } catch (error) {
      console.error('Error initializing streak protection:', error)
    }
  }

  const resetWeeklyStreakProtection = async () => {
    try {
      const { error } = await supabase.rpc('reset_weekly_streak_protection')
      if (error) throw error
      
      // Refresh streak protection data
      await initializeStreakProtection()
    } catch (error) {
      console.error('Error resetting weekly streak protection:', error)
    }
  }

  const toggleTask = async (taskId) => {
    const today = getTodayString()
    
    try {
      // Check if task is already completed today
      const existingLog = taskLogs.find(
        log => log.task_id === taskId && log.date === today
      )

      let newCompleted = true
      if (existingLog) {
        // Toggle completion status
        newCompleted = !existingLog.completed
        const { error } = await supabase
          .from('task_logs')
          .update({ completed: newCompleted })
          .eq('id', existingLog.id)

        if (error) throw error

        setTaskLogs(prev => prev.map(log => 
          log.id === existingLog.id 
            ? { ...log, completed: newCompleted }
            : log
        ))
      } else {
        // Create new log entry
        const { data, error } = await supabase
          .from('task_logs')
          .insert({
            user_id: user.id,
            task_id: taskId,
            date: today,
            completed: true
          })
          .select()

        if (error) throw error
        setTaskLogs(prev => [data[0], ...prev])
      }

      // Update streak data
      await updateStreakData(taskId, newCompleted, today)
      
    } catch (error) {
      console.error('Error toggling task:', error)
    }
  }

  const updateStreakData = async (taskId, completed, date) => {
    try {
      const { error } = await supabase.rpc('update_streak_data', {
        p_user_id: user.id,
        p_task_id: taskId,
        p_completed: completed,
        p_date: date
      })

      if (error) throw error
      
      // Refresh streak data and protection
      await Promise.all([
        fetchStreakData(),
        initializeStreakProtection()
      ])
    } catch (error) {
      console.error('Error updating streak data:', error)
    }
  }

  const addCustomTask = async (taskData) => {
    try {
      const maxOrder = Math.max(...tasks.map(t => t.order_index), -1)
      
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          task_id: `custom_${Date.now()}`,
          name: taskData.name,
          icon: taskData.icon || '📝',
          description: taskData.description || '',
          frequency: taskData.frequency || 'daily',
          is_custom: true,
          order_index: maxOrder + 1
        })
        .select()
        .single()

      if (error) throw error
      
      setTasks(prev => [...prev, data])
      return data
    } catch (error) {
      console.error('Error adding custom task:', error)
      throw error
    }
  }

  const deleteTask = async (taskId) => {
    try {
      const { error } = await supabase.rpc('delete_task_completely', {
        p_user_id: user.id,
        p_task_id: taskId
      })

      if (error) throw error
      
      setTasks(prev => prev.filter(task => task.task_id !== taskId))
      await fetchTaskLogs()
      await fetchStreakData()
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }

  const getTaskStatus = (taskId) => {
    const today = getTodayString()
    const todayLog = taskLogs.find(
      log => log.task_id === taskId && log.date === today
    )
    return todayLog?.completed || false
  }

  const getTaskStreak = (taskId) => {
    const taskStreakData = streakData.find(s => s.task_id === taskId)
    if (taskStreakData) {
      return {
        current: taskStreakData.current_streak,
        longest: taskStreakData.longest_streak
      }
    }
    
    // Fallback to calculation from logs
    const logs = taskLogs.filter(log => log.task_id === taskId)
    return calculateStreak(logs)
  }

  const getDailyProgress = () => {
    const today = getTodayString()
    const todayLogs = taskLogs.filter(log => log.date === today && log.completed)
    return Math.round((todayLogs.length / tasks.length) * 100) || 0
  }

  const getHistoryData = (days = 7) => {
    const dateRange = getDateRange(days)
    const historyData = {}
    
    tasks.forEach(task => {
      historyData[task.task_id] = dateRange.map(date => {
        const log = taskLogs.find(l => l.task_id === task.task_id && l.date === date)
        return {
          date,
          completed: log?.completed || false
        }
      })
    })
    
    return { dates: dateRange, tasks: historyData }
  }

  const isTaskLockedToday = (taskId) => {
    const today = getTodayString()
    const todayLog = taskLogs.find(
      log => log.task_id === taskId && log.date === today
    )
    return todayLog?.completed || false
  }

  const getStreakSavesRemaining = () => {
    return streakProtection?.saves_remaining || 0
  }

  const wasStreakSavedToday = (taskId) => {
    const today = getTodayString()
    // This would need to be tracked in streak_saves_used table
    // For now, return false as placeholder
    return false
  }

  const value = {
    tasks,
    taskLogs,
    streakData,
    streakProtection,
    loading,
    toggleTask,
    addCustomTask,
    deleteTask,
    getTaskStatus,
    getTaskStreak,
    getDailyProgress,
    getHistoryData,
    isTaskLockedToday,
    getStreakSavesRemaining,
    wasStreakSavedToday,
    refreshData: initializeUserData
  }

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  )
}