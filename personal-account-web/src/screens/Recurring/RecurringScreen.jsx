import React, { useEffect, useState } from 'react';
import { Container } from '../../styles/global';
import RecurringModal from './RecurringModal';
import './RecurringScreen.css';
import RecurringDBHandler from '../../databasehandler/recurringhandler';
import { FaEdit, FaPlusCircle, FaTrash } from 'react-icons/fa';

export default function RecurringScreen() {

  const [recurrings, setRecurrings] = useState([]);
  const [selectedRecurring, setSelectedRecurring] = useState();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [updateActive, setUpdateActive] = useState(false);
  const [createActive, setCreateActive] = useState(false);

  const recurringHandler = new RecurringDBHandler()

  const createRecurring = async (recurring) => {
    console.log('Creating new recurring');

    try {
      const result = await recurringHandler.createRecurring(recurring);
      if (result.success) {
        recurrings.push(recurring);
        setRecurrings(recurrings);
        alert(result.message);
      } else {
        alert('Error Creating Recurring');
        console.error(result);
      }
    } catch (error) {
      console.error('Error creating recurring:', error);
    }
  };

  const updateRecurring = async (recurring) => {
    console.log('Updating recurring');

    try {
      const result = await recurringHandler.updateRecurring(recurring);
      if (result.success) {
        recurrings[selectedIndex]=recurring;
        alert(result.message);
      } else {
        alert('Error Updating Recurring');
      }
    } catch (error) {
      console.error('Error Updating recurring:', error);
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

  const deleteRecurring = (index) => {
    recurringHandler.deleteRecurring(recurrings.at(index).id)
    .then(result=> {
      if(result.success) {
        alert("Recurring deleted");
        recurrings.splice(index,1);
        setRecurrings(recurrings)

      } else {
        alert("Error Deleting Recurring")
        console.error(result.message);
      }
    }).catch(error => {
      alert("Error Deleting Recurring")
      console.error(error);
    })
  }

  useEffect(() => {
    getRecurrings();

  }, []);
  

  return (
    <Container>
      <div className="recurring-screen">
        <h2>Recurring Entry</h2>
        <div className="list">
          {recurrings.map((r,index) => (
            <Recurring 
              r={r}
              handleUpdate={()=>{
                setSelectedRecurring(r);
                setSelectedIndex(index)
                setUpdateActive(true);
              }}
              handleDelete={()=>deleteRecurring(index)}
              key={index}
            />
          ))}
        </div>
        {/* <div className="recurring-header">
          <div className="recurring-total">Title</div>
          <div className="recurring-total">Description</div>
          <div className="recurring-total">Amount</div>
          <div className="recurring-total">Frequency</div>
          <div className="recurring-total">Start Date</div>
          <div className="recurring-total">Last Entry Date</div>
          <div className="recurring-total">Next Entry Date</div>
          <div className="recurring-total">Type</div>
          <div className="recurring-total">Category</div>
          <div className="recurring-total">User</div>
          <div className="recurring-total">Actions</div>
        </div>
        <div className="recurring-list">
              {recurrings.map((r, index) => (
                <div className="recurring-row" key={index}>
                  <div className="recurring-total">{r.title}</div>
                  <div className="recurring-total">{r.description}</div>
                  <div className="recurring-total">{r.amount}</div>
                  <div className="recurring-total">{r.freq.toUpperCase()}</div>
                  <div className="recurring-total">{r.start_date.slice(0, 10)}</div>
                  <div className="recurring-total">{r.last_run_date && r.last_run_date.slice(0, 10)}</div>
                  <div className="recurring-total">{r.next_run_date ? r.next_run_date.slice(0, 10) : r.start_date.slice(0, 10)}</div>
                  <div className="recurring-total">{r.cType}</div>
                  <div className="recurring-total">{r.cTitle}</div>
                  <div className="recurring-total">{r.username}</div>
                  <div className="recurring-actions">
                    <FaEdit
                      size={15}
                      className="recurring-action-button"
                      color="green"
                      onClick={() => {
                        setSelectedRecurring(r);
                        setSelectedIndex(index)
                        setUpdateActive(true);
                      }}
                    />
                    <FaTrash
                      size={15}
                      className="recurring-action-button"
                      color="red"
                      onClick={()=>{deleteRecurring(index)}}
                    />
                  </div>
                </div>
              ))}
        </div> */}
      </div> 
      <FaPlusCircle
          size={50}
          className="recurring-create-button"
          color="#0A89A7"
          onClick={()=>{setCreateActive(true)}}
      />
      <RecurringModal
        isVisible={updateActive}
        close={() => setUpdateActive(false)}
        handleData={updateRecurring}
        recurring={selectedRecurring}
      />
      <RecurringModal
        isVisible={createActive}
        close={() => setCreateActive(false)}
        handleData={createRecurring}
      />
    </Container>
  );
}

function Recurring({r, handleUpdate, handleDelete}) {
  
  const amountColor = r.cType=='income' ? 'green' : 'red';
  return (
    <div className="recurring-box">
      <div className="recurring-box-row">
        <div className="recurring-box-title">
          {r.title}: {r.description}
        </div>
      </div>
      <div className="recurring-box-row">
        <div className="recurring-box-category">
          Category: {r.cTitle}
        </div>
        <div className="recurring-box-amount" style={{color: amountColor}}>
          Amount: {r.amount}
        </div>
      </div>
      <div className="recurring-box-row">
        <div className="recurring-box-user">
          User: {r.username.toUpperCase()}
        </div>
        <div className="recurring-box-freq">
          Freq: {r.freq.toUpperCase()}
        </div>
      </div>
      
      <div className="recurring-box-row">
        <div className="recurring-box-next-date">
          Next Date: {r.next_run_date ? r.next_run_date.slice(0, 10) : r.start_date.slice(0, 10)}
        </div>
        <div className="recurring-box-next-date">
          Last Date: {r.next_run_date ? r.last_run_date.slice(0, 10):''}
        </div>
      </div>
      <div className="recurring-box-row">
        <FaEdit
            size={15}
            className="recurring-box-action-button"
            color="green"
            onClick={handleUpdate}
          />
          <FaTrash
            size={15}
            className="recurring-box-action-button"
            color="red"
            onClick={handleDelete}
        />
      </div>
    </div>
  );
}