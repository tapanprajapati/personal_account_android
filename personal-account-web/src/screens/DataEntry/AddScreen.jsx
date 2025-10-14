import React from 'react';
import { Container } from '../../styles/global';
import EntryForm from './EntryForm';
import './AddScreen.css';
import EntryDBHandler from '../../databasehandler/entryhandler';

export default function AddScreen({ type = 'expense' }) {

  const entryHandler = new EntryDBHandler()

  const addEntry = async (entry) => {
    console.log('Adding data');

    try {
      const result = await entryHandler.addEntry(entry);
      if (result.success) {
        alert(result.message);
      } else {
        alert('Error Adding Category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };
  

  return (
    <Container>
      <div className="add-screen">
        <h2>Add Entry</h2>
        <EntryForm
          handleFormData={addEntry}
          type={type}
        />
      </div>
    </Container>
  );
}
