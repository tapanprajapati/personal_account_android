import React, { useState } from 'react';
import { Container } from '../../styles/global';
import EntryForm from './EntryForm';
import './AddScreen.css';

export default function AddScreen({ type = 'expense' }) {
  const [showSuccess, setShowSuccess] = useState(false);

  const addEntry = (entry, imagePath) => {
    console.log('Adding data');
    // The actual entry addition will be handled by the EntryForm component
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Container>
      <div className="add-screen">
        <h2>Add Entry</h2>
        {showSuccess && (
          <div className="success-message">
            Entry Added Successfully!
          </div>
        )}
        <EntryForm
          handleFormData={addEntry}
          type={type}
        />
      </div>
    </Container>
  );
}
