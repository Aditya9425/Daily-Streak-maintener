import { getTodayString, getDateRange } from '../utils/dateUtils'

/**
 * Centralized analytics service - Single source of truth for all data calculations
 * Used by: AI Coach, Weekly Review, Calendar, Progress Ring
 */
export class AnalyticsService {
  constructor(tasks, taskLogs, getTaskStreak, selectedDate = null) {
    this.tasks = tasks || []
    this.taskLogs = taskLogs || []
    this.getTaskStreak = getTaskStreak
    this.selectedDate = selectedDate || getTodayString()
  }

  // Get selected date's completion data
  getTodayStats() {
    const selectedDateLogs = this.taskLogs.filter(log => log.date === this.selectedDate)
    const completedTasks = selectedDateLogs.filter(log => log.completed)
    
    return {
      date: this.selectedDate,
      totalTasks: this.tasks.length,
      completedCount: completedTasks.length,
      completedTasks: completedTasks.map(log => {
        const task = this.tasks.find(t => t.task_id === log.task_id)
        return { ...log, taskName: task?.name || 'Unknown' }
      }),
      pendingTasks: this.tasks.filter(task => {
        const selectedDateLog = selectedDateLogs.find(log => log.task_id === task.task_id)
        return !selectedDateLog || !selectedDateLog.completed
      }),
      completionPercentage: this.tasks.length > 0 ? Math.round((completedTasks.length / this.tasks.length) * 100) : 0
    }
  }

  // Get weekly stats (last 7 days)
  getWeeklyStats() {
    const weekDates = getDateRange(7)
    const weekLogs = this.taskLogs.filter(log => weekDates.includes(log.date))
    
    const totalCompleted = weekLogs.filter(log => log.completed).length
    const totalPossible = this.tasks.length * 7
    const completionRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0

    // Task-specific weekly stats
    const taskStats = this.tasks.map(task => {
      const taskWeekLogs = weekLogs.filter(log => log.task_id === task.task_id)
      const completed = taskWeekLogs.filter(log => log.completed).length
      const streak = this.getTaskStreak ? this.getTaskStreak(task.task_id) : { current: 0, longest: 0 }
      
      return {
        taskId: task.task_id,
        taskName: task.name,
        completed,
        possible: 7,
        completionRate: Math.round((completed / 7) * 100),
        currentStreak: streak.current,
        longestStreak: streak.longest
      }
    })

    // Find best and worst performing tasks
    const bestTask = taskStats.length > 0 
      ? taskStats.reduce((best, current) => current.completionRate > best.completionRate ? current : best)
      : null
    
    const worstTask = taskStats.length > 0 
      ? taskStats.reduce((worst, current) => current.completionRate < worst.completionRate ? current : worst)
      : null

    return {
      weekDates,
      totalCompleted,
      totalPossible,
      completionRate,
      taskStats,
      bestTask,
      worstTask,
      averageDailyCompletion: Math.round(totalCompleted / 7)
    }
  }

  // Get streak analysis
  getStreakAnalysis() {
    const strongStreaks = this.tasks.filter(task => {
      const streak = this.getTaskStreak ? this.getTaskStreak(task.task_id) : { current: 0 }
      return streak.current >= 3
    }).map(task => ({
      taskId: task.task_id,
      taskName: task.name,
      streak: this.getTaskStreak ? this.getTaskStreak(task.task_id) : { current: 0, longest: 0 }
    }))

    const weakStreaks = this.tasks.filter(task => {
      const streak = this.getTaskStreak ? this.getTaskStreak(task.task_id) : { current: 0 }
      return streak.current === 0
    }).map(task => ({
      taskId: task.task_id,
      taskName: task.name,
      streak: this.getTaskStreak ? this.getTaskStreak(task.task_id) : { current: 0, longest: 0 }
    }))

    return {
      strongStreaks,
      weakStreaks,
      totalActiveStreaks: strongStreaks.length,
      totalBrokenStreaks: weakStreaks.length
    }
  }

  // Get calendar data for date range
  getCalendarData(days = 30) {
    const dates = getDateRange(days)
    
    return dates.map(date => {
      const dayLogs = this.taskLogs.filter(log => log.date === date)
      const completedLogs = dayLogs.filter(log => log.completed)
      const totalTasks = this.tasks.length
      
      let status = 'none'
      let completionPercentage = 0
      
      if (totalTasks > 0) {
        completionPercentage = Math.round((completedLogs.length / totalTasks) * 100)
        if (completionPercentage === 100) status = 'full'
        else if (completionPercentage > 0) status = 'partial'
      } else {
        status = 'no-tasks'
      }
      
      return {
        date,
        status,
        completionPercentage,
        completedCount: completedLogs.length,
        totalTasks,
        completedTasks: completedLogs.map(log => {
          const task = this.tasks.find(t => t.task_id === log.task_id)
          return task?.name || 'Unknown'
        })
      }
    })
  }

  // Generate AI coaching insights based on real data
  generateCoachingInsights() {
    const todayStats = this.getTodayStats()
    const weeklyStats = this.getWeeklyStats()
    const streakAnalysis = this.getStreakAnalysis()

    // Generate dynamic message based on current state
    let message = "Keep building those daily habits!"
    let actionSuggestion = "Focus on consistency over perfection."

    if (todayStats.completedCount === 0) {
      message = "Ready to start your day strong? Every journey begins with a single step."
      actionSuggestion = "Pick your easiest task and complete it first to build momentum."
    } else if (todayStats.completionPercentage === 100) {
      message = "Outstanding! You've completed all your tasks today. This is how champions are made!"
      actionSuggestion = "Celebrate this win and prepare for tomorrow's success."
    } else if (todayStats.completionPercentage >= 50) {
      message = `Great progress! You've completed ${todayStats.completedCount} of ${todayStats.totalTasks} tasks today.`
      actionSuggestion = `You're more than halfway there. Complete ${todayStats.totalTasks - todayStats.completedCount} more to finish strong!`
    } else {
      message = `You've started with ${todayStats.completedCount} tasks completed. Keep the momentum going!`
      actionSuggestion = "Focus on your next most important task to build positive momentum."
    }

    // Add streak-specific insights
    if (streakAnalysis.strongStreaks.length > 0) {
      const strongestStreak = streakAnalysis.strongStreaks.reduce((max, current) => 
        current.streak.current > max.streak.current ? current : max
      )
      message += ` Your ${strongestStreak.taskName} streak of ${strongestStreak.streak.current} days is impressive!`
    }

    if (streakAnalysis.weakStreaks.length > 0 && todayStats.completedCount > 0) {
      const weakTask = streakAnalysis.weakStreaks[0]
      actionSuggestion = `Consider focusing on ${weakTask.taskName} to rebuild that streak.`
    }

    return {
      message,
      actionSuggestion,
      todayStats,
      weeklyStats,
      streakAnalysis
    }
  }

  // Generate weekly review insights
  generateWeeklyReviewInsights() {
    const weeklyStats = this.getWeeklyStats()
    const streakAnalysis = this.getStreakAnalysis()

    let biggestWin = "You showed up this week!"
    let weakestHabit = "All habits need consistent attention."
    let improvementSuggestion = "Focus on small, consistent improvements."

    if (weeklyStats.bestTask && weeklyStats.bestTask.completionRate > 70) {
      biggestWin = `${weeklyStats.bestTask.taskName}: ${weeklyStats.bestTask.completed}/7 days completed (${weeklyStats.bestTask.completionRate}%)`
    }

    if (weeklyStats.worstTask && weeklyStats.worstTask.completionRate < 50) {
      weakestHabit = `${weeklyStats.worstTask.taskName}: Only ${weeklyStats.worstTask.completed}/7 days completed`
      improvementSuggestion = `Focus on ${weeklyStats.worstTask.taskName} next week. Try to complete it at least 4 times.`
    }

    if (weeklyStats.completionRate >= 80) {
      improvementSuggestion = "You're doing excellent! Maintain this consistency and consider adding a new challenge."
    } else if (weeklyStats.completionRate >= 60) {
      improvementSuggestion = "Good progress! Try to improve your completion rate by 10% next week."
    }

    return {
      biggestWin,
      weakestHabit,
      improvementSuggestion,
      weeklyStats,
      streakAnalysis
    }
  }
}

// Factory function to create analytics service
export const createAnalyticsService = (tasks, taskLogs, getTaskStreak, selectedDate) => {
  return new AnalyticsService(tasks, taskLogs, getTaskStreak, selectedDate)
}