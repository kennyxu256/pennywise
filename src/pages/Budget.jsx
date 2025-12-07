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
    const total = Object.values(categories).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
    const data = {
      income: parseFloat(income),
      categories,
      totalAllocated: total,
      remaining: parseFloat(income) - total
    }
    setBudgetData(data)
    setStep('results')
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
          <h3>Remaining</h3>
          <p className={`amount ${budgetData.remaining < 0 ? 'negative' : 'positive'}`}>
            ${budgetData.remaining.toFixed(0)}
          </p>
        </div>
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
