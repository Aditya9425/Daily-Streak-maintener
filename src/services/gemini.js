const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

class GeminiService {
  constructor() {
    this.lastCallTime = 0
    this.minInterval = 2000 // 2 seconds between calls
  }

  async generateContent(prompt) {
    if (!GEMINI_API_KEY) {
      console.error('Gemini API key not found')
      return null
    }

    // Rate limiting
    const now = Date.now()
    const timeSinceLastCall = now - this.lastCallTime
    if (timeSinceLastCall < this.minInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minInterval - timeSinceLastCall))
    }
    this.lastCallTime = Date.now()

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      })

      if (response.status === 429) {
        // Wait longer and retry once
        await new Promise(resolve => setTimeout(resolve, 5000))
        return await this.generateContent(prompt)
      }

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      return data.candidates?.[0]?.content?.parts?.[0]?.text || null
    } catch (error) {
      console.error('Gemini API error:', error)
      return null
    }
  }

  async generateDailyCoaching(userStats) {
    const { completedTasks, totalTasks, streakData, missedTasks } = userStats
    
    const prompt = `You are a discipline coach. Analyze this user's daily habit data and provide exactly 2 lines:
Line 1: One specific observation about their performance (completed ${completedTasks}/${totalTasks} tasks today)
Line 2: One clear action for today

Strong habits: ${streakData.strong.join(', ') || 'None'}
Weak/missed: ${missedTasks.join(', ') || 'None'}

Rules:
- Be direct and specific
- No generic motivation
- Focus on discipline and consistency
- Maximum 2 short sentences`

    return await this.generateContent(prompt)
  }

  async generateMissedTaskSuggestion(taskName, missedDays, userReason) {
    const prompt = `A user missed "${taskName}" for ${missedDays} consecutive days.
${userReason ? `Their reason: "${userReason}"` : 'No reason provided.'}

Provide ONE practical suggestion to make this habit easier or more achievable.

Rules:
- One sentence only
- Focus on simplifying or adjusting the task
- Be actionable and specific
- No motivational language`

    return await this.generateContent(prompt)
  }

  async generateWeeklyReview(weeklyStats) {
    const { totalCompleted, totalPossible, bestStreak, worstTask, completionRate } = weeklyStats
    
    const prompt = `Weekly habit review for user who completed ${totalCompleted}/${totalPossible} tasks (${completionRate}%).

Best performing: ${bestStreak.task} (${bestStreak.days} days)
Worst performing: ${worstTask.task} (${worstTask.completed}/${worstTask.possible} days)

Provide exactly 3 lines:
1. Biggest win: [specific achievement]
2. Weakest habit: [specific problem]  
3. Next week focus: [one specific improvement]

Rules:
- Be specific and data-driven
- No generic praise
- Focus on actionable insights
- Each line maximum 10 words`

    return await this.generateContent(prompt)
  }
}

export const geminiService = new GeminiService()