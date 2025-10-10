import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setShowDropdown(false);
  };

  const handleMenuAction = (action) => {
    switch (action) {
      case 'recent':
        navigate('/recent-entries');
        break;
      case 'categories':
        navigate('/manage-categories');
        break;
      case 'config':
        navigate('/config');
        break;
      case 'report':
        navigate('/report');
        break;
      case 'add-entry':
        navigate('/add-entry');
        break;
      default:
        break;
    }
    setShowDropdown(false);
  };

  const isActiveRoute = (path) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    if (path === '/accountType/expense' && location.pathname === '/accountType/expense') return true;
    if (path === '/accountType/income' && location.pathname === '/accountType/income') return true;
    if (path === '/difference' && location.pathname === '/difference') return true;
    return location.pathname === path;
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-left">
          <h1 className="app-title" onClick={() => navigate('/dashboard')}>
            Personal Account
          </h1>
        </div>

        <nav className="header-nav">
          <button
            className={`nav-button ${isActiveRoute('/dashboard') ? 'active' : ''}`}
            onClick={() => handleNavigation('/dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`nav-button ${isActiveRoute('/accountType/expense') ? 'active' : ''}`}
            onClick={() => handleNavigation('/accountType/expense')}
          >
            Expense
          </button>
          <button
            className={`nav-button ${isActiveRoute('/accountType/income') ? 'active' : ''}`}
            onClick={() => handleNavigation('/accountType/income')}
          >
            Income
          </button>
          <button
            className={`nav-button ${isActiveRoute('/difference') ? 'active' : ''}`}
            onClick={() => handleNavigation('/difference')}
          >
            Difference
          </button>
        </nav>

        <div className="header-actions">
          <button 
            className="action-btn"
            onClick={() => handleMenuAction('add-entry')}
            title="Add Entry"
          >
            ➕
          </button>
          <button 
            className="action-btn"
            onClick={() => handleMenuAction('recent')}
            title="Recent Entries"
          >
            📋
          </button>
          <div className="dropdown">
            <button 
              className="action-btn dropdown-btn" 
              onClick={() => setShowDropdown(!showDropdown)}
              title="More Options"
            >
              ⋮
            </button>
            {showDropdown && (
              <div className="dropdown-content">
                <button onClick={() => handleMenuAction('categories')}>
                  Manage Categories
                </button>
                <button onClick={() => handleMenuAction('config')}>
                  Configs
                </button>
                <button onClick={() => handleMenuAction('report')}>
                  Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
