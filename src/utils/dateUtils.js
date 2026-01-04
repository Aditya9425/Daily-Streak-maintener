import { format, isToday, isYesterday, startOfDay, differenceInDays } from 'date-fns'

export const formatDate = (date) => format(date, 'yyyy-MM-dd')

export const isDateToday = (date) => isToday(new Date(date))

export const isDateYesterday = (date) => isYesterday(new Date(date))

export const getTodayString = () => formatDate(new Date())

export const getYesterdayString = () => formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000))

export const calculateStreak = (taskLogs) => {
  if (!taskLogs || taskLogs.length === 0) return { current: 0, longest: 0 }

  const sortedLogs = taskLogs
    .filter(log => log.completed)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  if (sortedLogs.length === 0) return { current: 0, longest: 0 }

  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0
  
  const today = startOfDay(new Date())
  let expectedDate = today

  // Calculate current streak
  for (const log of sortedLogs) {
    const logDate = startOfDay(new Date(log.date))
    const daysDiff = differenceInDays(expectedDate, logDate)
    
    if (daysDiff === 0) {
      currentStreak++
      expectedDate = new Date(expectedDate.getTime() - 24 * 60 * 60 * 1000)
    } else if (daysDiff === 1 && currentStreak === 0) {
      // Allow for today not being completed yet
      expectedDate = logDate
      currentStreak++
      expectedDate = new Date(expectedDate.getTime() - 24 * 60 * 60 * 1000)
    } else {
      break
    }
  }

  // Calculate longest streak
  let consecutiveDays = 1
  for (let i = 0; i < sortedLogs.length - 1; i++) {
    const currentDate = new Date(sortedLogs[i].date)
    const nextDate = new Date(sortedLogs[i + 1].date)
    const daysDiff = differenceInDays(currentDate, nextDate)
    
    if (daysDiff === 1) {
      consecutiveDays++
    } else {
      longestStreak = Math.max(longestStreak, consecutiveDays)
      consecutiveDays = 1
    }
  }
  longestStreak = Math.max(longestStreak, consecutiveDays)

  return { current: currentStreak, longest: longestStreak }
}