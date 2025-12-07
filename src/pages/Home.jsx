import { useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home">
      <div className="home-intro">
        <div className="clown-emoji">🤡</div>
        <h1 className="home-title">I'm PennyWise, your financially responsible personal budgeting coach!</h1>
        <p className="home-subtitle">(I bear no relation to the antagonist from It, although I see where you're coming from.)</p>
        <h1 className="home-title">What would you like to do today?</h1>
      </div>
      <div className="home-cards">
        <div className="home-card" onClick={() => navigate('/spending')}>
          <h3>Analyze Transactions</h3>
          <p>Upload your bank statements and get AI-powered insights on your spending patterns</p>
        </div>
        <div className="home-card" onClick={() => navigate('/lifestyle-creep')}>
          <h3>Detect Lifestyle Creep</h3>
          <p>Catch those sneaky spending increases before they become permanent habits. The only creep here should be me!</p>
        </div>
        <div className="home-card" onClick={() => navigate('/budget')}>
          <h3>Set Your Budget</h3>
          <p>Create a simple budget and see how you're tracking against your goals</p>
        </div>
      </div>

      <div className="about-section">
        <h2>About PennyWise</h2>
        <p>
          PennyWise is your AI-powered financial coach that helps you catch lifestyle creep before 
          it catches you. We analyze your spending patterns to detect those subtle increases in 
          rideshare, dining, and shopping that signal lifestyle creep—before they derail your 
          financial future.
        </p>
        <p>
          Unlike traditional budgeting apps that just track numbers, PennyWise uses AI to understand 
          your spending behavior and provide personalized insights. Think of me as your financially 
          savvy friend who's not afraid to call out your third DoorDash order this week.
        </p>
        <div className="about-features">
          <div className="feature">
            <span className="feature-icon">📊</span>
            <h4>Smart Analysis</h4>
            <p>AI-powered insights that go beyond basic categorization</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🎯</span>
            <h4>Lifestyle Creep Detection</h4>
            <p>Catch spending increases before they become habits</p>
          </div>
          <div className="feature">
            <span className="feature-icon">💡</span>
            <h4>Actionable Advice</h4>
            <p>Specific recommendations, not generic tips</p>
          </div>
        </div>
      </div>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        
        <div className="faq-item">
          <h4>Is my financial data secure?</h4>
          <p>
            Yes. PennyWise processes all data locally in your browser. Your transaction data never 
            leaves your device and is not stored on any server. We only send anonymized spending 
            summaries (category totals, not individual transactions) to our AI service for analysis. 
            No account numbers, merchant names, or personally identifiable information is ever transmitted.
          </p>
        </div>

        <div className="faq-item">
          <h4>Do you store my banking credentials?</h4>
          <p>
            No. PennyWise does not connect to your bank accounts or store any login credentials. 
            You manually upload CSV files exported from your bank, giving you complete control over 
            what data is analyzed.
          </p>
        </div>

        <div className="faq-item">
          <h4>What happens to my uploaded CSV files?</h4>
          <p>
            CSV files are processed entirely in your browser using JavaScript. The data stays on your 
            device and is cleared when you close the browser tab. Nothing is saved to our servers.
          </p>
        </div>

        <div className="faq-item">
          <h4>How does the AI analysis work?</h4>
          <p>
            We send only aggregated spending data (like "dining: $450, groceries: $380") to OpenAI's 
            API for analysis. Individual transaction details, merchant names, and dates are never shared. 
            The AI generates personalized insights based on these category totals.
          </p>
        </div>

        <div className="faq-item">
          <h4>Can I delete my data?</h4>
          <p>
            Since all data is stored locally in your browser, simply refreshing the page or closing 
            the tab clears everything. There's no account to delete because we don't store anything 
            on our end.
          </p>
        </div>

        <div className="faq-item">
          <h4>Who can see my spending habits?</h4>
          <p>
            Only you. PennyWise is a client-side application with no user accounts, no databases, 
            and no data persistence. Your financial information remains completely private.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home
