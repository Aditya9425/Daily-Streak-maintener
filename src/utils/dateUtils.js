import { format, isToday, isYesterday, startOfDay, differenceInDays, subDays, parseISO } from 'date-fns'

// IST timezone offset (UTC+5:30)
const IST_OFFSET_MINUTES = 330

// Get current IST time
export const getISTTime = () => {
  const now = new Date()
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
  return new Date(utc + (IST_OFFSET_MINUTES * 60000))
}

// Get today's date string in IST timezone
export const getTodayString = () => {
  const istTime = getISTTime()
  return format(istTime, 'yyyy-MM-dd')
}

// Get yesterday's date string in IST timezone
export const getYesterdayString = () => {
  const istTime = getISTTime()
  const yesterday = subDays(istTime, 1)
  return format(yesterday, 'yyyy-MM-dd')
}

// Check if it's midnight in IST (for reset logic)
export const isISTMidnight = () => {
  const istTime = getISTTime()
  const hours = istTime.getHours()
  const minutes = istTime.getMinutes()
  return hours === 0 && minutes === 0
}

// Format date
export const formatDate = (date) => format(date, 'yyyy-MM-dd')

export const isDateToday = (date) => {
  const istTime = getISTTime()
  const dateToCheck = parseISO(date)
  return format(istTime, 'yyyy-MM-dd') === format(dateToCheck, 'yyyy-MM-dd')
}

export const isDateYesterday = (date) => {
  const yesterday = getYesterdayString()
  return date === yesterday
}

// Get date range for history view (in IST)
export const getDateRange = (days) => {
  const dates = []
  const istTime = getISTTime()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(istTime, i)
    dates.push(format(date, 'yyyy-MM-dd'))
  }
  
  return dates
}

// Enhanced streak calculation
export const calculateStreak = (taskLogs) => {
  if (!taskLogs || taskLogs.length === 0) return { current: 0, longest: 0 }

  const completedLogs = taskLogs
    .filter(log => log.completed)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  if (completedLogs.length === 0) return { current: 0, longest: 0 }

  const today = getTodayString()
  const yesterday = getYesterdayString()
  
  let currentStreak = 0
  let longestStreak = 0
  
  // Calculate current streak
  const mostRecentLog = completedLogs[0]
  if (mostRecentLog.date === today || mostRecentLog.date === yesterday) {
    let streakDate = mostRecentLog.date
    
    for (const log of completedLogs) {
      if (log.date === streakDate) {
        currentStreak++
        // Move to previous day
        const currentDate = parseISO(streakDate)
        const prevDate = subDays(currentDate, 1)
        streakDate = format(prevDate, 'yyyy-MM-dd')
      } else {
        break
      }
    }
  }
  
  // Calculate longest streak
  let tempStreak = 1
  for (let i = 0; i < completedLogs.length - 1; i++) {
    const currentDate = parseISO(completedLogs[i].date)
    const nextDate = parseISO(completedLogs[i + 1].date)
    const daysDiff = differenceInDays(currentDate, nextDate)
    
    if (daysDiff === 1) {
      tempStreak++
    } else {
      longestStreak = Math.max(longestStreak, tempStreak)
      tempStreak = 1
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak)

  return { current: currentStreak, longest: longestStreak }
}

// Check if it's a new day since last check
export const isNewDay = (lastCheckDate) => {
  if (!lastCheckDate) return true
  const today = getTodayString()
  return lastCheckDate !== today
}

// Format date for display
export const formatDisplayDate = (dateString) => {
  const date = parseISO(dateString)
  return format(date, 'MMM d')
}

// Get day name
export const getDayName = (dateString) => {
  const date = parseISO(dateString)
  return format(date, 'EEE')
}

// Check if date is within last N days
export const isWithinLastDays = (dateString, days) => {
  const date = parseISO(dateString)
  const cutoffDate = subDays(new Date(), days)
  return date >= cutoffDate
}