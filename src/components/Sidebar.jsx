import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'

function Sidebar() {
  const location = useLocation()

  return (
    <div className="sidebar">
      <Link to="/" className="sidebar-header">
        <span className="logo">🤡</span>
        <h2 className="sidebar-title">PennyWise</h2>
      </Link>
      <nav className="sidebar-nav">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          Home
        </Link>
        <Link to="/spending" className={location.pathname === '/spending' ? 'active' : ''}>
          Spending Activity
        </Link>
        <Link to="/budget" className={location.pathname === '/budget' ? 'active' : ''}>
          My Budget
        </Link>
        <Link to="/lifestyle-creep" className={location.pathname === '/lifestyle-creep' ? 'active' : ''}>
          Lifestyle Creep Indicator
        </Link>
      </nav>
    </div>
  )
}

export default Sidebar
