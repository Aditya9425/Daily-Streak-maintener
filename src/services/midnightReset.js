import { supabase } from '../utils/supabase'
import { getTodayString, getYesterdayString } from '../utils/dateUtils'

class MidnightResetService {
  constructor() {
    this.resetInProgress = false
    this.lastResetDate = null
  }

  async performMidnightReset(userId) {
    if (this.resetInProgress) return
    
    const today = getTodayString()
    
    // Check if reset already performed today
    if (this.lastResetDate === today) return
    
    this.resetInProgress = true
    
    try {
      console.log('Performing midnight reset for user:', userId)
      
      // 1. Reset weekly streak protection if needed (Requires Supabase RPC setup)
      // await this.resetWeeklyStreakProtection(userId)
      
      // 2. Update streak data for missed tasks
      await this.updateStreaksForMissedTasks(userId)
      
      // 3. Clean up old data (optional)
      await this.cleanupOldData(userId)
      
      this.lastResetDate = today
      console.log('Midnight reset completed successfully')
      
    } catch (error) {
      console.error('Error during midnight reset:', error)
    } finally {
      this.resetInProgress = false
    }
  }

  async resetWeeklyStreakProtection(userId) {
    try {
      const { error } = await supabase.rpc('reset_weekly_streak_protection', {
        p_user_id: userId
      })
      
      if (error) {
        console.error('Error resetting weekly streak protection:', error)
      }
    } catch (error) {
      console.error('Error in resetWeeklyStreakProtection:', error)
    }
  }

  async updateStreaksForMissedTasks(userId) {
    try {
      const yesterday = getYesterdayString()
      
      // Get all user tasks
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('task_id')
        .eq('user_id', userId)
      
      if (tasksError) throw tasksError
      
      // Check which tasks were not completed yesterday
      for (const task of tasks) {
        const { data: yesterdayLog, error: logError } = await supabase
          .from('task_logs')
          .select('completed')
          .eq('user_id', userId)
          .eq('task_id', task.task_id)
          .eq('date', yesterday)
          .maybeSingle()
        
        if (logError && logError.code !== 'PGRST116') {
          console.error('Error checking task log:', logError)
          continue
        }
        
        // If task was not completed yesterday, update streak
        if (!yesterdayLog || !yesterdayLog.completed) {
          await supabase.rpc('update_streak_data', {
            p_user_id: userId,
            p_task_id: task.task_id,
            p_completed: false,
            p_date: yesterday
          })
        }
      }
    } catch (error) {
      console.error('Error updating streaks for missed tasks:', error)
    }
  }

  async cleanupOldData(userId) {
    try {
      // Clean up task logs older than 90 days
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - 90)
      const cutoffString = cutoffDate.toISOString().split('T')[0]
      
      const { error } = await supabase
        .from('task_logs')
        .delete()
        .eq('user_id', userId)
        .lt('date', cutoffString)
      
      if (error) {
        console.error('Error cleaning up old data:', error)
      }
    } catch (error) {
      console.error('Error in cleanupOldData:', error)
    }
  }

  // Check if midnight reset is needed
  shouldPerformReset() {
    const today = getTodayString()
    return this.lastResetDate !== today && !this.resetInProgress
  }
}

// Export singleton instance
export const midnightResetService = new MidnightResetService()