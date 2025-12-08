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
    
    // Get month-specific context
    let monthContext = ''
    let comparisonContext = ''
    
    if (month && data.byMonth) {
      const allMonths = Object.keys(data.byMonth).sort()
      const currentMonthIndex = allMonths.indexOf(month)
      
      if (currentMonthIndex > 0) {
        const prevMonth = allMonths[currentMonthIndex - 1]
        const prevMonthData = {}
        
        // Calculate previous month's category totals
        data.transactions?.forEach(t => {
          const tMonth = t.date.substring(0, 7)
          if (tMonth === prevMonth) {
            prevMonthData[t.category] = (prevMonthData[t.category] || 0) + parseFloat(t.amount)
          }
        })
        
        comparisonContext = `\nCOMPARISON TO PREVIOUS MONTH (${prevMonth}):\n${
          Object.entries(data.byCategory)
            .map(([cat, amt]) => {
              const prevAmt = prevMonthData[cat] || 0
              const change = prevAmt > 0 ? ((amt - prevAmt) / prevAmt * 100).toFixed(1) : 'N/A'
              return `- ${cat}: $${amt.toFixed(0)} (${change !== 'N/A' ? (change > 0 ? '+' : '') + change + '%' : 'new'} vs $${prevAmt.toFixed(0)})`
            }).join('\n')
        }`
      }
      
      monthContext = `\nANALYZING SPECIFIC MONTH: ${month}`
    }
    
    const prompt = month 
      ? `You are a financial coach analyzing spending for a SPECIFIC MONTH.

${monthContext}

SPENDING DATA FOR THIS MONTH:
${categories.map(([cat, amt]) => `- ${cat}: $${amt.toFixed(0)}`).join('\n')}
Total spending: $${totalSpending.toFixed(0)}
${income ? `Monthly income: $${income.toFixed(0)}` : ''}
${savingsRate !== null ? `Savings rate: ${savingsRate.toFixed(1)}%` : ''}

${comparisonContext}

INSTRUCTIONS:
1. Focus on THIS MONTH's spending patterns
2. Highlight which categories consumed the most money THIS MONTH
3. If comparison data exists, explain how spending changed from previous month
4. Provide specific insights about where money went THIS MONTH
5. Be concise and actionable

Return ONLY a JSON array with 4-5 insights. Each insight MUST have:
- type: "savings" | "warning" | "alert" | "success" | "tip"
- icon: single emoji
- title: specific insight about this month
- message: detailed explanation with exact numbers (max 60 words)`
      
      : `You are a financial coach analyzing ANNUAL spending patterns.

IMPORTANT: The numbers below are MONTHLY AVERAGES across the entire year.

MONTHLY AVERAGE SPENDING DATA:
${categories.map(([cat, amt]) => `- ${cat}: $${amt.toFixed(0)} per month (average)`).join('\n')}
Average monthly spending: $${totalSpending.toFixed(0)}
${income ? `Monthly income: $${income.toFixed(0)}` : ''}
${savingsRate !== null ? `Savings rate: ${savingsRate.toFixed(1)}%` : ''}

INSTRUCTIONS:
1. These are MONTHLY AVERAGES - treat them as typical monthly spending
2. Analyze overall spending patterns and identify biggest categories
3. Look for areas where monthly averages seem high
4. Provide strategic insights about financial health
5. Be encouraging but honest about areas for improvement

Return ONLY a JSON array with 4-6 insights. Each insight MUST have:
- type: "savings" | "warning" | "alert" | "success" | "tip"
- icon: single emoji
- title: specific category or pattern
- message: detailed explanation with exact numbers (max 60 words)`

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
