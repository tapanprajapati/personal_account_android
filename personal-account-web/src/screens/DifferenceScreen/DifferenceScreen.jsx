import React from 'react';
import { Container } from '../../styles/global';
import './DifferenceScreen.css';

export default function DifferenceScreen() {
  return (
    <Container>
      <div className="difference-screen">
        <h2>Difference Screen</h2>
        <p>View income vs expense differences and trends.</p>
        <div className="placeholder-content">
          <p>🚧 This screen is under construction</p>
          <p>Features to be implemented:</p>
          <ul>
            <li>Monthly difference charts</li>
            <li>Yearly difference analysis</li>
            <li>Trend visualization</li>
            <li>Budget vs actual comparisons</li>
          </ul>
        </div>
      </div>
    </Container>
  );
}
