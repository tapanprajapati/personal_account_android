import React from 'react';
import { Container } from '../../styles/global';
import EntryForm from './EntryForm';
import EntryDBHandler from '../../databasehandler/entryhandler';
import { useLocation, useNavigate } from 'react-router-dom';
import './UpdateScreen.css'

export default function UpdateScreen(
) {
  const location = useLocation();
  const entryHandler = new EntryDBHandler()
  const {entry} = location.state;
  const navigate = useNavigate()

  const updateEntry = async (entry) => {
    console.log("Updating Entry:")
    console.log(entry)
    entryHandler.updateEntry(entry)
    .then(result=> {
      if(result.success) {
        alert("Entry Updated");
        //navigate.
      } else {
        alert("Something went wrong. Try again");
        console.log(result.message)
      }
    })
    .catch(result=> {
      alert(result);
    })
  }
  return (
    <Container>
      <div className="update-screen">
        <h2>Update Entry</h2>
        <EntryForm
          handleFormData={updateEntry}
          entry={entry}
          type={entry.cType}
        />
      </div>
    </Container>
  );
}
