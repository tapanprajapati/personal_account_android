import React from 'react';
import './LoadingSpinner.css';

export default function LoadingSpinner({ isLoading, message = "Loading..." }) {
  if (!isLoading) return null;

  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
}
