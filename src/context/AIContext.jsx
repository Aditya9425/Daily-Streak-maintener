import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'
import { useAuth } from './AuthContext'
import { useTasks } from './TasksContext'
import { geminiService } from '../services/gemini'
import { getTodayString, getDateRange } from '../utils/dateUtils'

const AIContext = createContext({})

export const useAI = () => {
  const context = useContext(AIContext)
  if (!context) {
    throw new Error('useAI must be used within AIProvider')
  }
  return context
}

export const AIProvider = ({ children }) => {
  const { user } = useAuth()
  const { tasks, taskLogs, getTaskStreak } = useTasks()
  const [dailyCoaching, setDailyCoaching] = useState(null)
  const [weeklyReview, setWeeklyReview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [lastCoachingDate, setLastCoachingDate] = useState(null)

  useEffect(() => {
    if (user && tasks.length > 0) {
      const today = getTodayString()
      
      // Always try to load/generate coaching for today
      const initializeAI = async () => {
        try {
          // Check if AI tables exist
          await supabase.from('ai_daily_coaching').select('id').limit(1)
          
          // Load or generate daily coaching
          await loadDailyCoaching()
          
          // Load weekly review with delay
          setTimeout(() => loadWeeklyReview(), 2000)
        } catch (error) {
          // Set fallback coaching message
          setDailyCoaching({
            message: "Keep pushing forward! Every small step counts toward your goals.",
            action_suggestion: "Focus on completing at least one task today.",
            date: today
          })
        }
      }
      
      initializeAI()
    }
  }, [user, tasks])

  const loadDailyCoaching = async () => {
    const today = getTodayString()
    
    // Don't reload if we already have coaching for today
    if (dailyCoaching && dailyCoaching.date === today) {
      return
    }
    
    try {
      // Check if coaching already exists for today
      const { data: existing, error } = await supabase
        .from('ai_daily_coaching')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading daily coaching:', error)
        // Set fallback message on error
        setDailyCoaching({
          message: "Stay focused on your goals today!",
          action_suggestion: "Complete your most important task first.",
          date: today
        })
        return
      }

      if (existing) {
        setDailyCoaching(existing)
        setLastCoachingDate(today)
        return
      }

      // Generate new coaching only if no existing data and we have tasks
      if (tasks.length > 0) {
        await generateDailyCoaching()
      } else {
        // Fallback for no tasks
        setDailyCoaching({
          message: "Ready to start your journey? Add some tasks to track!",
          action_suggestion: "Set up your first daily habit to begin building streaks.",
          date: today
        })
      }
    } catch (error) {
      console.error('Error loading daily coaching:', error)
      // Always provide fallback coaching
      setDailyCoaching({
        message: "Every day is a new opportunity to grow!",
        action_suggestion: "Take one small step toward your goals today.",
        date: today
      })
    }
  }

  const generateDailyCoaching = async () => {
    if (!user || tasks.length === 0) return

    setLoading(true)
    try {
      const userStats = getUserStats()
      const aiResponse = await geminiService.generateDailyCoaching(userStats)
      
      if (aiResponse) {
        const lines = aiResponse.split('\n').filter(line => line.trim())
        const message = lines[0] || aiResponse
        const action = lines[1] || null

        const { data, error } = await supabase
          .from('ai_daily_coaching')
          .insert({
            user_id: user.id,
            date: getTodayString(),
            message,
            action_suggestion: action
          })
          .select()
          .single()

        if (error) throw error
        setDailyCoaching(data)
      }
    } catch (error) {
      console.error('Error generating daily coaching:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadWeeklyReview = async () => {
    const weekStart = getWeekStartDate()
    
    try {
      const { data: existing, error } = await supabase
        .from('ai_weekly_reviews')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start_date', weekStart)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading weekly review:', error)
        return
      }

      if (existing) {
        setWeeklyReview(existing)
      }
    } catch (error) {
      console.error('Error loading weekly review:', error)
    }
  }

  const generateWeeklyReview = async () => {
    if (!user || tasks.length === 0) return

    try {
      const weeklyStats = getWeeklyStats()
      const aiResponse = await geminiService.generateWeeklyReview(weeklyStats)
      
      if (aiResponse) {
        const lines = aiResponse.split('\n').filter(line => line.trim())
        
        const { data, error } = await supabase
          .from('ai_weekly_reviews')
          .insert({
            user_id: user.id,
            week_start_date: getWeekStartDate(),
            biggest_win: lines[0] || null,
            weakest_habit: lines[1] || null,
            improvement_suggestion: lines[2] || null
          })
          .select()
          .single()

        if (error) throw error
        setWeeklyReview(data)
      }
    } catch (error) {
      console.error('Error generating weekly review:', error)
    }
  }

  const handleMissedTaskFeedback = async (taskId, missedDays, userReason) => {
    const task = tasks.find(t => t.task_id === taskId)
    if (!task) return

    try {
      const aiSuggestion = await geminiService.generateMissedTaskSuggestion(
        task.name, 
        missedDays, 
        userReason
      )

      if (aiSuggestion) {
        await supabase
          .from('ai_missed_task_feedback')
          .insert({
            user_id: user.id,
            task_id: taskId,
            missed_days: missedDays,
            user_reason: userReason,
            ai_suggestion: aiSuggestion
          })

        return aiSuggestion
      }
    } catch (error) {
      console.error('Error generating missed task feedback:', error)
    }
    return null
  }

  const getUserStats = () => {
    const today = getTodayString()
    const todayLogs = taskLogs.filter(log => log.date === today)
    const completedTasks = todayLogs.filter(log => log.completed).length
    
    const streakData = {
      strong: tasks.filter(task => {
        const streak = getTaskStreak(task.task_id)
        return streak.current >= 3
      }).map(task => task.name),
      weak: tasks.filter(task => {
        const streak = getTaskStreak(task.task_id)
        return streak.current === 0
      }).map(task => task.name)
    }

    const missedTasks = tasks.filter(task => {
      const todayLog = todayLogs.find(log => log.task_id === task.task_id)
      return !todayLog || !todayLog.completed
    }).map(task => task.name)

    return {
      completedTasks,
      totalTasks: tasks.length,
      streakData,
      missedTasks
    }
  }

  const getWeeklyStats = () => {
    const weekDates = getDateRange(7)
    const weekLogs = taskLogs.filter(log => weekDates.includes(log.date))
    
    const totalCompleted = weekLogs.filter(log => log.completed).length
    const totalPossible = tasks.length * 7
    const completionRate = Math.round((totalCompleted / totalPossible) * 100)

    const taskStats = tasks.map(task => {
      const taskWeekLogs = weekLogs.filter(log => log.task_id === task.task_id)
      const completed = taskWeekLogs.filter(log => log.completed).length
      return {
        task: task.name,
        completed,
        possible: 7,
        rate: Math.round((completed / 7) * 100)
      }
    })

    const bestStreak = taskStats.reduce((best, current) => 
      current.rate > best.rate ? current : best, taskStats[0] || { task: 'None', days: 0 })
    
    const worstTask = taskStats.reduce((worst, current) => 
      current.rate < worst.rate ? current : worst, taskStats[0] || { task: 'None', completed: 0, possible: 7 })

    return {
      totalCompleted,
      totalPossible,
      completionRate,
      bestStreak: { task: bestStreak.task, days: bestStreak.completed },
      worstTask
    }
  }

  const getWeekStartDate = () => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const diff = today.getDate() - dayOfWeek
    const weekStart = new Date(today.setDate(diff))
    return weekStart.toISOString().split('T')[0]
  }

  const value = {
    dailyCoaching,
    weeklyReview,
    loading,
    generateWeeklyReview,
    handleMissedTaskFeedback
  }

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  )
}