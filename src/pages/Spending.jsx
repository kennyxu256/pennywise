import { useState } from 'react'
import AIInsights from '../components/AIInsights'
import { categorizeTransactions } from '../utils/categorizer'
import './Spending.css'

function Spending({ spendingData, setSpendingData, budgetData, aiInsights, setAiInsights }) {
  const [transactions, setTransactions] = useState(spendingData?.transactions || [])
  const [insights, setInsights] = useState(spendingData?.insights || null)
  const [selectedMonth, setSelectedMonth] = useState(spendingData?.selectedMonth || null)
  const [loading, setLoading] = useState(false)

  const formatCurrency = (amount) => {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const parseCSV = (text) => {
    const lines = text.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    
    return lines.slice(1).map(line => {
      const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || []
      const transaction = {}
      
      headers.forEach((header, i) => {
        let value = values[i]?.trim().replace(/^"|"$/g, '') || ''
        transaction[header] = value
      })
      
      // Handle debit/credit columns
      const debit = parseFloat(transaction.debit) || 0
      const credit = parseFloat(transaction.credit) || 0
      transaction.amount = debit || credit
      
      return transaction
    }).filter(t => t.date && t.amount && t.description && !t.description.toLowerCase().includes('payment'))
  }

  const processTransactions = (data, monthFilter = null) => {
    const byMonth = {}
    const byDay = {}
    const byCategory = {}

    data.forEach(t => {
      const amount = Math.abs(parseFloat(t.amount))
      const date = new Date(t.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const dayKey = t.date
      
      if (!monthFilter || monthKey === monthFilter) {
        byMonth[monthKey] = (byMonth[monthKey] || 0) + amount
        byDay[dayKey] = (byDay[dayKey] || 0) + amount
        byCategory[t.category] = (byCategory[t.category] || 0) + amount
      }
    })

    return { byMonth, byDay, byCategory }
  }

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setLoading(true)
    
    try {
      // Parse all files
      const allTransactions = []
      for (const file of files) {
        const text = await file.text()
        const parsed = parseCSV(text)
        allTransactions.push(...parsed)
      }

      // Remove duplicates based on date + description + amount
      const unique = allTransactions.filter((t, i, arr) => 
        arr.findIndex(x => 
          x.date === t.date && 
          x.description === t.description && 
          x.amount === t.amount
        ) === i
      )

      // Categorize transactions
      const categorized = await categorizeTransactions(unique)
      
      const newInsights = processTransactions(categorized)
      setTransactions(categorized)
      setInsights(newInsights)
      setSelectedMonth(null)
      setSpendingData({ transactions: categorized, insights: newInsights, selectedMonth: null })
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to process files. Please check the format.')
    } finally {
      setLoading(false)
    }
  }

  const handleMonthSelect = (month) => {
    const newInsights = processTransactions(transactions, month)
    setSelectedMonth(month)
    setInsights(newInsights)
    setSpendingData({ transactions, insights: newInsights, selectedMonth: month })
  }

  const handleViewAll = () => {
    const newInsights = processTransactions(transactions)
    setSelectedMonth(null)
    setInsights(newInsights)
    setSpendingData({ transactions, insights: newInsights, selectedMonth: null })
  }

  const getCategoryColor = (index) => {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#f97316']
    return colors[index % colors.length]
  }

  const getBarColor = (amount, average) => {
    return amount <= average ? '#10b981' : '#ef4444'
  }

  const getBudgetStatus = () => {
    if (!budgetData?.data?.income || !insights) return null
    
    const income = parseFloat(budgetData.data.income)
    const customBudget = budgetData.customBudget || { needs: 50, wants: 30, savings: 20 }
    
    const categoryMapping = {
      groceries: 'needs',
      shopping: 'wants',
      dining: 'wants',
      entertainment: 'wants',
      travel: 'wants',
      subscriptions: 'wants',
      gas: 'wants',
      utilities: 'needs'
    }
    
    const budgetByType = {
      needs: income * (customBudget.needs / 100),
      wants: income * (customBudget.wants / 100)
    }
    
    const spendingByType = { needs: 0, wants: 0 }
    Object.entries(insights.byCategory).forEach(([category, amount]) => {
      const type = categoryMapping[category.toLowerCase()] || 'wants'
      spendingByType[type] += amount
    })
    
    return {
      needs: { budget: budgetByType.needs, actual: spendingByType.needs, over: spendingByType.needs > budgetByType.needs },
      wants: { budget: budgetByType.wants, actual: spendingByType.wants, over: spendingByType.wants > budgetByType.wants }
    }
  }

  const budgetStatus = getBudgetStatus()

  return (
    <div className="spending">
      <h1>📊 Spending Analysis</h1>
      
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Analyzing your transactions...</p>
        </div>
      )}
      
      {!transactions.length ? (
        <div className="upload-section-empty">
          <div className="upload-instructions">
            <h2>Get Started with Your Financial Analysis</h2>
            <p>Upload your bank or credit card statements to see where your money is going and get AI-powered insights.</p>
            
            <div className="instructions-steps">
              <div className="instruction-step">
                <span className="step-number">1</span>
                <div>
                  <h3>Export Your Statements</h3>
                  <p>Log into your bank or credit card account, go to Statements → Export → Download as CSV</p>
                </div>
              </div>
              
              <div className="instruction-step">
                <span className="step-number">2</span>
                <div>
                  <h3>Upload Multiple Files</h3>
                  <p>You can select multiple CSV files at once. We'll combine them automatically for a complete picture.</p>
                </div>
              </div>
              
              <div className="instruction-step">
                <span className="step-number">3</span>
                <div>
                  <h3>More Data = Better Insights</h3>
                  <p>Upload as many months as possible (ideally 6-12 months) to detect spending trends and lifestyle creep patterns.</p>
                </div>
              </div>
            </div>
            
            <div className="privacy-note">
              🔒 <strong>Your data stays private.</strong> All processing happens in your browser. We only send anonymized category totals to AI for analysis.
            </div>
          </div>
          
          <label htmlFor="file-upload" className="upload-button-large">
            📁 Upload CSV Files
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            multiple
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <>
      <div className="upload-section">
        <label htmlFor="file-upload-more" className="upload-btn">
          Upload More Transactions
        </label>
        <input
          id="file-upload-more"
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          multiple
          style={{ display: 'none' }}
        />
      </div>

      {insights && (
        <>
          <AIInsights 
            insights={{
              ...insights,
              transactions: transactions
            }} 
            budgetData={budgetData} 
            selectedMonth={selectedMonth}
            cachedInsights={aiInsights}
            setCachedInsights={setAiInsights}
          />
          
          {budgetStatus && (
            <div className="budget-alerts">
              {budgetStatus.needs.over && (
                <div className="budget-alert alert-warning">
                  ⚠️ You're over budget on Needs (Groceries, Utilities): ${formatCurrency(budgetStatus.needs.actual)} / ${formatCurrency(budgetStatus.needs.budget)}
                </div>
              )}
              {budgetStatus.wants.over && (
                <div className="budget-alert alert-warning">
                  ⚠️ You're over budget on Wants (Shopping, Dining, Entertainment, etc.): ${formatCurrency(budgetStatus.wants.actual)} / ${formatCurrency(budgetStatus.wants.budget)}
                </div>
              )}
              {!budgetStatus.needs.over && !budgetStatus.wants.over && (
                <div className="budget-alert alert-success">
                  ✓ You're staying within your budget! Keep up the good work.
                </div>
              )}
            </div>
          )}

          <div className="month-selector">
            <button 
              className={`month-btn ${!selectedMonth ? 'active' : ''}`}
              onClick={handleViewAll}
            >
              All Time
            </button>
            {Object.keys(processTransactions(transactions).byMonth).map(month => (
              <button
                key={month}
                className={`month-btn ${selectedMonth === month ? 'active' : ''}`}
                onClick={() => handleMonthSelect(month)}
              >
                {month}
              </button>
            ))}
          </div>

          <div className="dashboard">
            <div className="card">
              <h2>{selectedMonth ? `Daily Spending - ${selectedMonth}` : 'Monthly Spending'}</h2>
              {(() => {
                const data = selectedMonth ? insights.byDay : insights.byMonth
                const entries = Object.entries(data)
                const average = entries.reduce((sum, [, amt]) => sum + amt, 0) / entries.length
                return (
                  <div className="chart-legend">
                    <div className="legend-item-inline">
                      <div className="legend-color" style={{ background: '#10b981' }} />
                      <span>Below Average</span>
                    </div>
                    <div className="legend-item-inline">
                      <div className="legend-color" style={{ background: '#ef4444' }} />
                      <span>Above Average</span>
                    </div>
                    <div className="average-label">
                      Average: ${formatCurrency(average)}
                    </div>
                  </div>
                )
              })()}
              <div className="chart-scroll">
                <div className="vertical-chart">
                  {selectedMonth ? (
                    (() => {
                      const entries = Object.entries(insights.byDay)
                      const average = entries.reduce((sum, [, amt]) => sum + amt, 0) / entries.length
                      const maxAmount = Math.max(...Object.values(insights.byDay))
                      
                      return entries.map(([day, amount]) => (
                        <div key={day} className="vertical-bar-item">
                          <div className="vertical-bar-container">
                            <div 
                              className="vertical-bar" 
                              style={{ 
                                height: `${(amount / maxAmount) * 100}%`,
                                background: getBarColor(amount, average)
                              }}
                            />
                          </div>
                          <span className="vertical-label">{new Date(day).getDate()}</span>
                          <span className="vertical-value">${formatCurrency(amount)}</span>
                        </div>
                      ))
                    })()
                  ) : (
                    (() => {
                      const entries = Object.entries(insights.byMonth)
                      const average = entries.reduce((sum, [, amt]) => sum + amt, 0) / entries.length
                      const maxAmount = Math.max(...Object.values(insights.byMonth))
                      
                      return entries.map(([month, amount]) => (
                        <div key={month} className="vertical-bar-item">
                          <div className="vertical-bar-container">
                            <div 
                              className="vertical-bar" 
                              style={{ 
                                height: `${(amount / maxAmount) * 100}%`,
                                background: getBarColor(amount, average)
                              }}
                            />
                          </div>
                          <span className="vertical-label">{month}</span>
                          <span className="vertical-value">${formatCurrency(amount)}</span>
                        </div>
                      ))
                    })()
                  )}
                </div>
              </div>
            </div>

            <div className="card">
              <h2>Spending by Category</h2>
              <div className="pie-container">
                <svg viewBox="0 0 200 200" className="pie-chart">
                  {(() => {
                    const total = Object.values(insights.byCategory).reduce((a, b) => a + b, 0)
                    let currentAngle = 0
                    return Object.entries(insights.byCategory)
                      .sort((a, b) => b[1] - a[1])
                      .map(([category, amount], i) => {
                        const percentage = amount / total
                        const startAngle = currentAngle
                        const endAngle = currentAngle + percentage * 360
                        currentAngle = endAngle

                        const startRad = (startAngle - 90) * Math.PI / 180
                        const endRad = (endAngle - 90) * Math.PI / 180
                        const x1 = 100 + 80 * Math.cos(startRad)
                        const y1 = 100 + 80 * Math.sin(startRad)
                        const x2 = 100 + 80 * Math.cos(endRad)
                        const y2 = 100 + 80 * Math.sin(endRad)
                        const largeArc = percentage > 0.5 ? 1 : 0

                        return (
                          <g key={category}>
                            <path
                              d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                              fill={getCategoryColor(i)}
                              className="pie-slice"
                            >
                              <title>{category}: ${formatCurrency(amount)} ({(percentage * 100).toFixed(1)}%)</title>
                            </path>
                          </g>
                        )
                      })
                  })()}
                </svg>
              </div>
              <div className="category-legend">
                {Object.entries(insights.byCategory)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, amount], i) => (
                    <div key={category} className="legend-item">
                      <div className="legend-color" style={{ background: getCategoryColor(i) }} />
                      <span className="legend-name">{category}</span>
                      <span className="legend-amount">${formatCurrency(amount)}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
        </>
      )}
    </div>
  )
}

export default Spending
