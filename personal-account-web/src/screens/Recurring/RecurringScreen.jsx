import React, { useEffect, useState } from 'react';
import { Container } from '../../styles/global';
import RecurringModal from './RecurringModal';
import './RecurringScreen.css';
import RecurringDBHandler from '../../databasehandler/recurringhandler';

export default function RecurringScreen() {

  const [recurrings, setRecurrings] = useState([]);
  const [selectedRecurring, setSelectedRecurring] = useState();
  const [edit, setEdit] = useState(false);

  const recurringHandler = new RecurringDBHandler()

  const createRecurring = async (recurring) => {
    console.log('Creating new recurring');

    try {
      const result = await recurringHandler.createRecurring(recurring);
      if (result.success) {
        alert(result.message);
      } else {
        alert('Error Creating Recurring');
      }
    } catch (error) {
      console.error('Error creating recurring:', error);
    }
  };
  
  const getRecurrings = () => {
    console.log('getting recurrings');

    recurringHandler.getRecurrings()
      .then(result => {
        if(result.success) {
          setRecurrings(result.message);
        } else {
          alert("Error Getting Recurrings");
        }
      })
      .catch(error => {
        console.error("Error Getting Recurrings");
        console.error(error);
      })
  };

  const saveRecurring = (recurring) => {
    recurringHandler.updateRecurring(recurring)
    .then(result => {
      if(result.success) {
        alert("Recurring Updated");
      } else {
      }
    })
    .catch(error => {
      alert("Error Updating Recurring");
      console.log("Error Updating Recurring");
      console.log(error)
    })
  }

  useEffect(() => {
    getRecurrings();

  }, []);
  

  return (
    <Container>
      <div className="recurring-screen">
        <h2>Recurring Entry</h2>
        <div className="recurring-list">
              {recurrings.map((r, index) => (
                <div className="recurring-row">
                  {r.title} | {r.description}
                </div>
              ))}
            </div>
      </div>
      <RecurringModal
        isVisible={edit}
        close={() => setEdit(false)}
        saveRecurring={saveRecurring}
        recurring={selectedRecurring}
      />
    </Container>
  );
}
