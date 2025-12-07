import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Spending from './pages/Spending'
import Budget from './pages/Budget'
import LifestyleCreep from './pages/LifestyleCreep'
import './App.css'

function App() {
  const [budgetData, setBudgetData] = useState(null)
  const [spendingData, setSpendingData] = useState(null)
  const [aiInsights, setAiInsights] = useState({})
  const [creepAnalysis, setCreepAnalysis] = useState(null)

  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/spending" element={<Spending spendingData={spendingData} setSpendingData={setSpendingData} budgetData={budgetData} aiInsights={aiInsights} setAiInsights={setAiInsights} />} />
            <Route path="/budget" element={<Budget budgetData={budgetData} setBudgetData={setBudgetData} />} />
            <Route path="/lifestyle-creep" element={<LifestyleCreep spendingData={spendingData} creepAnalysis={creepAnalysis} setCreepAnalysis={setCreepAnalysis} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
