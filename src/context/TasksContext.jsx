import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'
import { useAuth } from './AuthContext'
import { PREDEFINED_TASKS } from '../utils/tasks'
import { getTodayString, calculateStreak } from '../utils/dateUtils'

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      initializeTasks()
      fetchTaskLogs()
    } else {
      setTasks([])
      setTaskLogs([])
      setLoading(false)
    }
  }, [user])

  const initializeTasks = async () => {
    try {
      // Check if user already has tasks
      const { data: existingTasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)

      if (existingTasks && existingTasks.length > 0) {
        setTasks(existingTasks)
      } else {
        // Create predefined tasks for new user
        const tasksToInsert = PREDEFINED_TASKS.map(task => ({
          user_id: user.id,
          task_id: task.id,
          name: task.name,
          icon: task.icon,
          description: task.description
        }))

        const { data: newTasks, error } = await supabase
          .from('tasks')
          .insert(tasksToInsert)
          .select()

        if (error) throw error
        setTasks(newTasks)
      }
    } catch (error) {
      console.error('Error initializing tasks:', error)
    } finally {
      setLoading(false)
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

  const toggleTask = async (taskId) => {
    const today = getTodayString()
    
    try {
      // Check if task is already completed today
      const existingLog = taskLogs.find(
        log => log.task_id === taskId && log.date === today
      )

      if (existingLog) {
        // Toggle completion status
        const { error } = await supabase
          .from('task_logs')
          .update({ completed: !existingLog.completed })
          .eq('id', existingLog.id)

        if (error) throw error

        setTaskLogs(prev => prev.map(log => 
          log.id === existingLog.id 
            ? { ...log, completed: !log.completed }
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
    } catch (error) {
      console.error('Error toggling task:', error)
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
    const logs = taskLogs.filter(log => log.task_id === taskId)
    return calculateStreak(logs)
  }

  const getDailyProgress = () => {
    const today = getTodayString()
    const todayLogs = taskLogs.filter(log => log.date === today && log.completed)
    return Math.round((todayLogs.length / tasks.length) * 100) || 0
  }

  const value = {
    tasks,
    taskLogs,
    loading,
    toggleTask,
    getTaskStatus,
    getTaskStreak,
    getDailyProgress,
    refreshData: () => {
      initializeTasks()
      fetchTaskLogs()
    }
  }

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  )
}