import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Budget.css'

function Budget({ budgetData, setBudgetData }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(budgetData ? 'results' : 'income')
  const [income, setIncome] = useState(budgetData?.income || '')
  const [categories, setCategories] = useState(budgetData?.categories || {
    rent: '',
    insurance: '',
    groceries: '',
    dining: '',
    transportation: '',
    shopping: '',
    entertainment: '',
    subscriptions: ''
  })
  const [customValues, setCustomValues] = useState({})
  const [goalInput, setGoalInput] = useState('')
  const [goalAnalysis, setGoalAnalysis] = useState(null)
  const [loadingGoal, setLoadingGoal] = useState(false)

  const ranges = {
    rent: [0, 500, 1000, 1500, 2000, 2500, 3000, 4000, 5000],
    insurance: [0, 100, 200, 300, 400, 500, 750, 1000],
    groceries: [0, 100, 200, 300, 400, 500, 750, 1000],
    dining: [0, 50, 100, 200, 300, 400, 500, 750],
    transportation: [0, 50, 100, 200, 300, 400, 500, 750],
    shopping: [0, 50, 100, 200, 300, 500, 750, 1000],
    entertainment: [0, 50, 100, 150, 200, 300, 400, 500],
    subscriptions: [0, 50, 100, 150, 200, 300, 400, 500]
  }

  const icons = {
    rent: '🏠',
    insurance: '🛡️',
    groceries: '🛒',
    dining: '🍽️',
    transportation: '🚗',
    shopping: '🛍️',
    entertainment: '🎬',
    subscriptions: '📱'
  }

  const handleCategoryChange = (cat, value) => {
    if (value === 'other') {
      setCustomValues(prev => ({ ...prev, [cat]: '' }))
      setCategories(prev => ({ ...prev, [cat]: '' }))
    } else {
      setCustomValues(prev => {
        const updated = { ...prev }
        delete updated[cat]
        return updated
      })
      setCategories(prev => ({ ...prev, [cat]: value }))
    }
  }

  const handleCustomChange = (cat, value) => {
    setCustomValues(prev => ({ ...prev, [cat]: value }))
    setCategories(prev => ({ ...prev, [cat]: value }))
  }

  const handleSaveBudget = () => {
    const numericCategories = Object.fromEntries(
      Object.entries(categories).map(([key, val]) => [key, parseFloat(val) || 0])
    )
    const total = Object.values(numericCategories).reduce((sum, val) => sum + val, 0)
    const data = {
      income: parseFloat(income),
      categories: numericCategories,
      totalAllocated: total,
      remaining: parseFloat(income) - total
    }
    setBudgetData(data)
    setStep('results')
  }

  const handleGoalSubmit = async () => {
    if (!goalInput.trim()) return
    
    setLoadingGoal(true)
    try {
      const response = await fetch('http://localhost:3001/api/analyze-goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: goalInput,
          income: budgetData.income,
          spending: budgetData.categories,
          savings: budgetData.remaining
        })
      })
      const data = await response.json()
      setGoalAnalysis(data)
    } catch (error) {
      console.error('Error analyzing goal:', error)
      setGoalAnalysis({ onTrack: false, message: 'Sorry, I had trouble analyzing your goal. Please try again.' })
    } finally {
      setLoadingGoal(false)
    }
  }

  const totalAllocated = Object.values(categories).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
  const remaining = (parseFloat(income) || 0) - totalAllocated

  if (step === 'income') {
    return (
      <div className="budget-page">
        <h1>💰 Set Your Budget</h1>
        <div className="budget-card">
          <h2>What's your monthly income?</h2>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="$5,000"
            className="budget-input"
          />
          <button 
            onClick={() => setStep('categories')} 
            className="budget-button"
            disabled={!income || parseFloat(income) <= 0}
          >
            Next →
          </button>
        </div>
      </div>
    )
  }

  if (step === 'categories') {
    return (
      <div className="budget-page">
        <h1>💰 Set Your Budget</h1>
        <div className="budget-card">
          <h2>Select your spending ranges</h2>
          <p>Pick the range that best matches your monthly spending in each category.</p>
          
          <div className={`remaining-display ${remaining < 0 ? 'negative' : ''}`}>
            Remaining: ${remaining.toFixed(0)} / ${income}
          </div>

          <div className="range-categories">
            {Object.keys(categories).map(cat => (
              <div key={cat} className="range-category">
                <label>
                  <span className="category-icon">{icons[cat]}</span>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </label>
                <div className="range-input-group">
                  <select 
                    value={cat in customValues ? 'other' : categories[cat]} 
                    onChange={(e) => handleCategoryChange(cat, e.target.value)}
                    className="range-select"
                  >
                    <option value="">Select range</option>
                    {ranges[cat].map((val, i) => {
                      const next = ranges[cat][i + 1]
                      if (!next) return null
                      return (
                        <option key={val} value={(val + next) / 2}>
                          ${val} - ${next}
                        </option>
                      )
                    })}
                    <option value="other">Other (specify)</option>
                  </select>
                  {cat in customValues && (
                    <input
                      type="number"
                      value={customValues[cat]}
                      onChange={(e) => handleCustomChange(cat, e.target.value)}
                      placeholder="Enter amount"
                      className="custom-input"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={handleSaveBudget} 
            className="budget-button"
            disabled={remaining < 0}
          >
            Save Budget
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="budget-page">
      <h1>💰 Your Budget</h1>
      
      <div className="budget-summary">
        <div className="summary-card">
          <h3>Monthly Income</h3>
          <p className="amount">${budgetData.income.toFixed(0)}</p>
        </div>
        <div className="summary-card">
          <h3>Total Allocated</h3>
          <p className="amount">${budgetData.totalAllocated.toFixed(0)}</p>
        </div>
        <div className="summary-card">
          <h3>Savings</h3>
          <p className={`amount ${budgetData.remaining < 0 ? 'negative' : 'positive'}`}>
            ${budgetData.remaining.toFixed(0)}
          </p>
        </div>
      </div>

      <div className="rule-section">
        <h2>📊 The 50/30/20 Rule</h2>
        <p>A simple budgeting framework: spend 50% on needs, 30% on wants, and save 20% for your future.</p>
        
        <div className="rule-breakdown">
          <div className="rule-card">
            <h4>50% Needs</h4>
            <p className="rule-target">${(budgetData.income * 0.5).toFixed(0)}</p>
            <p className="rule-actual">Your spending: ${(budgetData.categories.rent + budgetData.categories.insurance + budgetData.categories.groceries + budgetData.categories.transportation).toFixed(0)}</p>
            <p className="rule-status">{(budgetData.categories.rent + budgetData.categories.insurance + budgetData.categories.groceries + budgetData.categories.transportation) <= budgetData.income * 0.5 ? '✅ On track' : '⚠️ Over budget'}</p>
          </div>
          
          <div className="rule-card">
            <h4>30% Wants</h4>
            <p className="rule-target">${(budgetData.income * 0.3).toFixed(0)}</p>
            <p className="rule-actual">Your spending: ${(budgetData.categories.dining + budgetData.categories.shopping + budgetData.categories.entertainment + budgetData.categories.subscriptions).toFixed(0)}</p>
            <p className="rule-status">{(budgetData.categories.dining + budgetData.categories.shopping + budgetData.categories.entertainment + budgetData.categories.subscriptions) <= budgetData.income * 0.3 ? '✅ On track' : '⚠️ Over budget'}</p>
          </div>
          
          <div className="rule-card">
            <h4>20% Savings</h4>
            <p className="rule-target">${(budgetData.income * 0.2).toFixed(0)}</p>
            <p className="rule-actual">Your savings: ${budgetData.remaining.toFixed(0)}</p>
            <p className="rule-status">{budgetData.remaining >= budgetData.income * 0.2 ? '✅ On track' : '⚠️ Below target'}</p>
          </div>
        </div>
      </div>

      <div className="goal-section">
        <h2>🎯 Set a Financial Goal</h2>
        <p>Tell me what your financial goals are, and I'll tell you if you're on track or help get you there!</p>
        
        <textarea
          value={goalInput}
          onChange={(e) => setGoalInput(e.target.value)}
          placeholder="Example: I want to save $3,000 for a down payment in 10 months"
          className="goal-input"
          rows="3"
        />
        
        <button 
          onClick={handleGoalSubmit}
          className="budget-button"
          disabled={!goalInput.trim() || loadingGoal}
        >
          {loadingGoal ? 'Analyzing...' : 'Analyze My Goal'}
        </button>

        {goalAnalysis && (
          <div className={`goal-analysis ${goalAnalysis.onTrack ? 'on-track' : 'off-track'}`}>
            <h3>Goal Analysis</h3>
            <p>{goalAnalysis.message}</p>
          </div>
        )}
      </div>

      <div className="budget-breakdown">
        <h2>Budget Breakdown</h2>
        {Object.entries(budgetData.categories)
          .filter(([, val]) => val > 0)
          .sort((a, b) => b[1] - a[1])
          .map(([cat, val]) => (
            <div key={cat} className="category-breakdown-row">
              <div className="category-info">
                <span className="category-icon">{icons[cat]}</span>
                <span className="category-name">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
              </div>
              <div className="category-bar">
                <div 
                  className="category-bar-fill" 
                  style={{ width: `${(val / budgetData.income) * 100}%` }}
                />
              </div>
              <div className="category-amount">
                ${val.toFixed(0)} ({((val / budgetData.income) * 100).toFixed(1)}%)
              </div>
            </div>
          ))}
      </div>

      <button 
        onClick={() => setStep('income')} 
        className="budget-button secondary"
      >
        Edit Budget
      </button>
    </div>
  )
}

export default Budget
