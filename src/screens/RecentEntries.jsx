import React, { useState, useEffect } from 'react';
import { Container } from '../styles/global';
import EntryDBHandler from '../databasehandler/entryhandler';
import { TextColors } from '../styles/colors';
import './RecentEntries.css';

export default function RecentEntries() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const entryHandler = new EntryDBHandler();

  useEffect(() => {
    getRecentEntries();
  }, []);

  const getRecentEntries = () => {
    setLoading(true);
    entryHandler.getRecentEntries().then((result) => {
      if (result.success) {
        setEntries(result.message);
        setError(null);
      } else {
        setError(result.message);
      }
      setLoading(false);
    }).catch((error) => {
      setError(error.message || 'Failed to fetch recent entries');
      setLoading(false);
    });
  };

  const createEntryComponent = (entry) => {
    let color = TextColors.income;
    if (entry.cType.toLowerCase() === 'expense') {
      color = TextColors.expense;
    }
    
    return (
      <div key={entry.id} className="recent-entries-container">
        <div className="slash1"></div>
        <div className="slash2"></div>
        <div className="slash3"></div>
        <div className="slash4"></div>
        <div className="recent-entries">
          <div className="details">
            <div className="recent-entries-title">{entry.title}</div>
            <div className="recent-entries-category">{entry.cTitle}</div>
            <div className="user-text">{entry.username}</div>
            
          </div>
          <div className="recent-entries-date">
            <div className="date-text">{entry.date}</div>
            <div className="recent-entries-amount" style={{ color: color }}>
              $ {entry.amount}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Container>
        <div className="recent-entries-screen">
          <h2>Recent Entries</h2>
          <div className="loading-content">
            <p>Loading recent entries...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="recent-entries-screen">
          <h2>Recent Entries</h2>
          <div className="error-content">
            <p>Error: {error}</p>
            <button onClick={getRecentEntries} className="btn btn-primary">
              Retry
            </button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="recent-entries-screen">
        <h2>Recent Entries</h2>
        <div className="entry-list">
          {entries.length === 0 ? (
            <div className="no-entries">
              <p>No recent entries found</p>
            </div>
          ) : (
            entries.map((entry) => createEntryComponent(entry))
          )}
        </div>
      </div>
    </Container>
  );
}
