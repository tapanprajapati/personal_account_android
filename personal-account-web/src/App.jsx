import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WebStorage from './databasehandler/WebStorage';
import MainNavigation from './navigation/MainNavigation';
import './App.css';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storage = new WebStorage();
    storage.readValuesFromStorage().then(() => {
      setIsInitialized(true);
    });
  }, []);

  if (!isInitialized) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <MainNavigation />
      </div>
    </Router>
  );
}

export default App;
