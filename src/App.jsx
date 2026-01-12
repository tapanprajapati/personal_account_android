import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainNavigation from './navigation/MainNavigation';
import './App.css';
import './styles/AppLayout.css';

function App() {

  return (
    <Router>
      <div className="App">
        <MainNavigation />
      </div>
    </Router>
  );
}

export default App;
