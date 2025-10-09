import React,{ useState, useEffect } from 'react';
import { Container } from '../styles/global';
import { useLocation } from 'react-router-dom';
import { getMonthName, getSelectedCategories } from '../utils/converters';
import EntryDBHandler from '../databasehandler/entryhandler';
import Date from '../components/Date'
import './EntryListScreen.css';

export default function EntryListScreen() {
  const location = useLocation();
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const { type, year, month, categories, searchText, users, selectedUser } = location.state;
  
  const entryHandler = new EntryDBHandler();
  const getEntries = () => {
    const categoryString = getSelectedCategories(categories).join(',');
    const date = month+"/"+year;

    entryHandler
      .getSearchEntriesByDate(searchText, date, categoryString)
      .then((result) => {
        if (result.success) {
          setData(result.message)
        } else {
          alert(`ERROR: ${result.message.toUpperCase()}`);
        }
      })
      .catch((error) => {
        console.error('Error getting years:', error);
      });
  };

  const addToTotal = (amount) => {
    setTotal(prevTotal => prevTotal + amount);
  };

  useEffect(() => {
    getEntries()

  }, [type,year,month]);

  return (
    <Container>
      <div className="entry-list-screen">
        <h2>{type}: {getMonthName(month)} {year}</h2>
        
        <div className="dates-container">
        {data.length === 0 ? (
            <div className="no-data-message">
              <p>No data found for the selected criteria.</p>
              <p>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="dates-list">
              {data.map((d, index) => (
                <Date
                  key={d.date}
                  date={d}
                  passTotal={addToTotal}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
