import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './LifestyleCreep.css'

function LifestyleCreep({ spendingData, creepAnalysis, setCreepAnalysis }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (spendingData?.transactions && !creepAnalysis) {
      analyzeLifestyleCreep(spendingData.transactions)
    }
  }, [spendingData, creepAnalysis])

  const analyzeLifestyleCreep = async (transactions) => {
    setLoading(true)

    // Calculate category trends
    const monthlyByCategory = {}
    transactions.forEach(t => {
      const month = t.date.substring(0, 7)
      if (!monthlyByCategory[month]) monthlyByCategory[month] = {}
      if (!monthlyByCategory[month][t.category]) monthlyByCategory[month][t.category] = 0
      monthlyByCategory[month][t.category] += parseFloat(t.amount)
    })

    const months = Object.keys(monthlyByCategory).sort()
    const categoryTrends = []

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
          categoryTrends.push({
            category,
            firstMonth,
            lastMonth,
            change,
            months: months.length,
            monthlyValues: months.map((m, i) => ({ month: m, value: values[i] }))
          })
        }
      })
    }

    // Get AI analysis
    const prompt = `You are analyzing lifestyle creep for a user. Provide a comprehensive analysis in second person (use "you", "your").

CATEGORY TRENDS:
${categoryTrends.map(t => 
  `- ${t.category}: $${t.firstMonth.toFixed(0)} → $${t.lastMonth.toFixed(0)} (${t.change > 0 ? '+' : ''}${t.change.toFixed(1)}% over ${t.months} months)`
).join('\n')}

Provide a detailed lifestyle creep report as JSON:
{
  "overallScore": 1-100 (100 = severe creep, 0 = no creep),
  "summary": "2-3 sentence overview in second person (use 'you', 'your')",
  "categories": [
    {
      "name": "category name",
      "severity": "low" | "medium" | "high" | "critical",
      "change": percentage change as number,
      "analysis": "specific explanation in second person",
      "recommendation": "actionable advice in second person"
    }
  ],
  "actionItems": [
    {
      "priority": "high" | "medium" | "low",
      "action": "specific action to take",
      "category": "category this applies to",
      "impact": "expected savings or benefit"
    }
  ],
  "positiveHabits": ["list of categories with good trends in second person"]
}

Return ONLY the JSON object, no other text.`

    try {
      const response = await fetch('http://localhost:3001/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      const data = await response.json()
      const analysis = typeof data.insights === 'string' 
        ? JSON.parse(data.insights)
        : data.insights
      
      setCreepAnalysis({
        ...analysis,
        rawTrends: categoryTrends.sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
      })
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!spendingData) {
    return (
      <div className="lifestyle-creep-page">
        <h1>🎪 Lifestyle Creep Indicator</h1>
        <p>Upload your transactions on the Spending page to see your lifestyle creep analysis.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="lifestyle-creep-page">
        <h1>🎪 Lifestyle Creep Indicator</h1>
        <p>Analyzing your spending patterns...</p>
      </div>
    )
  }

  if (!creepAnalysis) return null

  const getScoreColor = (score) => {
    if (score >= 75) return '#dc2626'
    if (score >= 50) return '#ea580c'
    if (score >= 25) return '#f59e0b'
    return '#16a34a'
  }

  const getSeverityEmoji = (severity) => {
    switch(severity) {
      case 'critical': return '🚨'
      case 'high': return '⚠️'
      case 'medium': return '⚡'
      case 'low': return '💡'
      default: return '✅'
    }
  }

  return (
    <div className="lifestyle-creep-page">
      <h1>🎪 Lifestyle Creep Indicator</h1>
      
      <div className="creep-score-card">
        <div className="score-circle" style={{ borderColor: getScoreColor(creepAnalysis.overallScore) }}>
          <span className="score-number">{creepAnalysis.overallScore}</span>
          <span className="score-label">Creep Score</span>
        </div>
        <div className="score-summary">
          <h2>Overall Assessment</h2>
          <p>{creepAnalysis.summary}</p>
        </div>
      </div>

      <div className="category-analysis">
        <h2>Category Breakdown</h2>
        {creepAnalysis.categories?.map((cat, i) => (
          <div key={i} className={`category-card severity-${cat.severity}`}>
            <div className="category-header">
              <span className="category-emoji">{getSeverityEmoji(cat.severity)}</span>
              <h3>{cat.name}</h3>
              <span className={`change-badge ${cat.change > 0 ? 'increase' : 'decrease'}`}>
                {cat.change > 0 ? '+' : ''}{cat.change}%
              </span>
            </div>
            <p className="category-analysis-text">{cat.analysis}</p>
            <div className="category-recommendation">
              <strong>Action:</strong> {cat.recommendation}
            </div>
          </div>
        ))}
      </div>

      {creepAnalysis.positiveHabits?.length > 0 && (
        <div className="positive-habits">
          <h2>✅ Good Habits</h2>
          <ul>
            {creepAnalysis.positiveHabits.map((habit, i) => (
              <li key={i}>{habit}</li>
            ))}
          </ul>
        </div>
      )}

      {creepAnalysis.actionItems?.length > 0 && (
        <div className="action-items">
          <h2>📋 Action Items</h2>
          <p className="action-intro">Here's what you should do next to get your spending back on track:</p>
          {creepAnalysis.actionItems
            .sort((a, b) => {
              const priority = { high: 0, medium: 1, low: 2 }
              return priority[a.priority] - priority[b.priority]
            })
            .map((item, i) => (
              <div key={i} className={`action-item priority-${item.priority}`}>
                <div className="action-header">
                  <span className="priority-badge">{item.priority.toUpperCase()}</span>
                  <span className="action-category">{item.category}</span>
                </div>
                <p className="action-text">{item.action}</p>
                <p className="action-impact">💰 {item.impact}</p>
                {item.action.toLowerCase().includes('budget') && (
                  <button 
                    onClick={() => navigate('/budget')}
                    className="action-link-button"
                  >
                    Set Budget →
                  </button>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default LifestyleCreep
