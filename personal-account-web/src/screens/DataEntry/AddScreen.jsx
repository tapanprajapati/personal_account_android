import React from 'react';
import { Container } from '../../styles/global';
import './AddScreen.css';

export default function AddScreen() {
  return (
    <Container>
      <div className="add-screen">
        <h2>Add Entry</h2>
        <div className="placeholder-content">
          <p>🚧 This screen is under construction</p>
          <p>Features to be implemented:</p>
          <ul>
            <li>Entry form with validation</li>
            <li>Category selection</li>
            <li>Amount input</li>
            <li>Date picker</li>
            <li>Description field</li>
            <li>Image upload</li>
          </ul>
        </div>
      </div>
    </Container>
  );
}
