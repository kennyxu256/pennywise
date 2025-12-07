import { useState, useEffect } from 'react'
import './AIInsights.css'

function AIInsights({ insights, budgetData, selectedMonth, cachedInsights, setCachedInsights }) {
  const [aiInsights, setAiInsights] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!insights) return
    
    // Create cache key based on month selection
    const cacheKey = selectedMonth || 'all-months'
    
    // Check if we have cached insights for this specific month
    if (cachedInsights && cachedInsights[cacheKey]) {
      setAiInsights(cachedInsights[cacheKey])
      return
    }
    
    generateAIInsights(insights, budgetData, selectedMonth)
  }, [insights, budgetData, selectedMonth, cachedInsights])

  const generateAIInsights = async (data, budget, month) => {
    setLoading(true)
    
    const categories = Object.entries(data.byCategory).sort((a, b) => b[1] - a[1])
    const totalSpending = Object.values(data.byCategory).reduce((a, b) => a + b, 0)
    const income = budget?.data?.income ? parseFloat(budget.data.income) : null
    const savingsRate = income ? ((income - totalSpending) / income) * 100 : null
    
    // Calculate category-specific trends for lifestyle creep detection
    const categoryTrends = {}
    if (data.transactions && data.transactions.length > 0) {
      const sortedTransactions = [...data.transactions].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      )
      
      // Group by month and category
      const monthlyByCategory = {}
      sortedTransactions.forEach(t => {
        const month = t.date.substring(0, 7) // YYYY-MM
        if (!monthlyByCategory[month]) monthlyByCategory[month] = {}
        if (!monthlyByCategory[month][t.category]) monthlyByCategory[month][t.category] = 0
        monthlyByCategory[month][t.category] += parseFloat(t.amount)
      })
      
      // Calculate trends for each category
      const months = Object.keys(monthlyByCategory).sort()
      if (months.length >= 2) {
        const allCategories = new Set()
        Object.values(monthlyByCategory).forEach(m => 
          Object.keys(m).forEach(c => allCategories.add(c))
        )
        
        allCategories.forEach(category => {
          const values = months.map(m => monthlyByCategory[m][category] || 0)
          const firstMonth = values[0]
          const lastMonth = values[values.length - 1]
          
          if (firstMonth > 0) {
            const change = ((lastMonth - firstMonth) / firstMonth) * 100
            const avgMonthly = values.reduce((a, b) => a + b, 0) / values.length
            
            categoryTrends[category] = {
              change: change.toFixed(1),
              firstMonth: firstMonth.toFixed(2),
              lastMonth: lastMonth.toFixed(2),
              avgMonthly: avgMonthly.toFixed(2),
              months: months.length
            }
          }
        })
      }
    }
    
    const prompt = `You are a financial coach for young professionals (early 20s) who are earning their first real income. Your PRIMARY GOAL is to detect and explain lifestyle creep patterns in detail.

SPENDING DATA:
${categories.map(([cat, amt]) => `- ${cat}: $${amt.toFixed(0)}`).join('\n')}
Total spending: $${totalSpending.toFixed(0)}
${income ? `Monthly income: $${income.toFixed(0)}` : ''}
${savingsRate !== null ? `Savings rate: ${savingsRate.toFixed(1)}%` : ''}

${Object.keys(categoryTrends).length > 0 ? `CATEGORY-SPECIFIC LIFESTYLE CREEP ANALYSIS:
${Object.entries(categoryTrends)
  .filter(([, trend]) => Math.abs(parseFloat(trend.change)) > 10)
  .sort((a, b) => Math.abs(parseFloat(b[1].change)) - Math.abs(parseFloat(a[1].change)))
  .map(([cat, trend]) => 
    `- ${cat}: Started at $${trend.firstMonth}, now $${trend.lastMonth} (${trend.change > 0 ? '+' : ''}${trend.change}% over ${trend.months} months)`
  ).join('\n')}` : ''}

CRITICAL INSTRUCTIONS:
1. **Lifestyle Creep is Priority #1**: If ANY category shows >15% increase, create a dedicated insight explaining:
   - Exact category and percentage increase
   - Dollar amounts (before → after)
   - Why this matters for young professionals
   - Specific action to take (set limit, track weekly, etc.)

2. **Be Extremely Specific**: Use actual numbers from the data above. Say "Your rideshare spending jumped from $50 to $180 (+260%)" not "rideshare increased significantly"

3. **Multiple Categories**: If 2+ categories show creep, create separate insights for each major one (>30% increase)

4. **Tone**: Friendly but direct. This is serious—lifestyle creep can derail financial futures. Be encouraging but honest.

Return ONLY a JSON array with 4-6 insights (prioritize lifestyle creep warnings). Each insight MUST have:
- type: "savings" | "warning" | "alert" | "success" | "tip"
- icon: single emoji
- title: specific category name if lifestyle creep (e.g., "Rideshare Spending Up 260%")
- message: detailed explanation with exact numbers (max 60 words)

Focus on categories with biggest increases first.`

    try {
      const response = await fetch('http://localhost:3001/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      
      const { insights } = await response.json()
      setAiInsights(insights)
      
      // Cache with month-specific key
      const cacheKey = month || 'all-months'
      setCachedInsights({
        ...cachedInsights,
        [cacheKey]: insights
      })
    } catch (error) {
      console.error('AI generation failed:', error)
      setAiInsights([{
        type: 'tip',
        icon: '💡',
        title: 'AI Unavailable',
        message: `Error: ${error.message || 'Start backend with: npm run server'}`
      }])
    } finally {
      setLoading(false)
    }
  }


  if (loading) {
    return (
      <div className="ai-insights">
        <h3>🤖 AI-Powered Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <p>Analyzing your spending patterns...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!aiInsights || aiInsights.length === 0) return null

  return (
    <div className="ai-insights">
      <h3>🤖 AI-Powered Insights</h3>
      <div className="insights-grid">
        {aiInsights.map((insight, i) => (
          <div key={i} className={`insight-card insight-${insight.type}`}>
            <div className="insight-icon">{insight.icon}</div>
            <div className="insight-content">
              <h4>{insight.title}</h4>
              <p>{insight.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AIInsights
