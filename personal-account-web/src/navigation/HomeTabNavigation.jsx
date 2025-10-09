import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardScreen from '../screens/DashboardScreen';
import AccountType from '../screens/AccountTypeScreen';
import Difference from '../screens/DifferenceScreen/DifferenceScreen';
import './HomeTabNavigation.css';

export default function HomeTabNavigation() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', component: DashboardScreen },
    { id: 'expense', label: 'Expense', component: AccountType, params: { type: 'Expense' } },
    { id: 'income', label: 'Income', component: AccountType, params: { type: 'Income' } },
    { id: 'difference', label: 'Difference', component: Difference },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
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
      default:
        break;
    }
  };

  const renderActiveComponent = () => {
    const activeTabData = tabs.find(tab => tab.id === activeTab);
    if (!activeTabData) return null;

    const Component = activeTabData.component;
    return <Component {...activeTabData.params} />;
  };

  return (
    <div className="home-tab-navigation">
      <div className="header">
        <h1>Personal Account</h1>
        <div className="header-actions">
          <button 
            className="header-btn"
            onClick={() => handleMenuAction('recent')}
            title="Recent Entries"
          >
            📋
          </button>
          <div className="dropdown">
            <button className="header-btn dropdown-btn" title="More Options">
              ⋮
            </button>
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
          </div>
        </div>
      </div>

      <div className="tab-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {renderActiveComponent()}
      </div>
    </div>
  );
}
