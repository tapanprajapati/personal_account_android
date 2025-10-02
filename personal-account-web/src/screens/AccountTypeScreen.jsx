import React from 'react';
import { Container } from '../styles/global';
import './AccountTypeScreen.css';

export default function AccountTypeScreen({ type = 'Account' }) {

  return (
    <Container>
      <div className="account-type-screen">
        <h2>{type} Screen</h2>
        <p>This is the {type} management screen.</p>
        <div className="placeholder-content">
          <p>🚧 This screen is under construction</p>
          <p>Features to be implemented:</p>
          <ul>
            <li>View {type} entries</li>
            <li>Add new {type} entries</li>
            <li>Edit existing entries</li>
            <li>Delete entries</li>
            <li>Filter and search functionality</li>
          </ul>
        </div>
      </div>
    </Container>
  );
}
