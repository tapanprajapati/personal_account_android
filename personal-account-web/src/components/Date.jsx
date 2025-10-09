import React, { useState, useEffect } from 'react';
import { formatLargeNumber } from '../utils/converters';
import { getMonthName } from '../utils/converters';
import Entry from './Entry';
import './Date.css';

export default function Date({ 
  date,
  passTotal
}) {
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    let total = 0;
    date.entries.map((entry, index) => (
      total+=entry.amount
    ))
    setAmount(total);
    passTotal(total);
  }, []);

  console.log(date)

  return (
     <div className="date-i-container">
      <div className="date-title-container">
        <h3 className="date-title">{date.date}</h3>
        {/* <div className="date-title-material-back"></div> */}
      </div>
      {/* <div className="date-title-shadow-container"> */}
        {/* <div className="date-title-material-back-shadow"></div> */}
      {/* </div> */}

      <p className="footer">${amount.toFixed(2)}</p>

      <div className="list-of-entries">
        {date.entries.map((item) => (
          <Entry
            key={item.id}
            entry={item}
          />
        ))}
      </div>
    </div>
  );
}

function Month({ 
  month, 
  year, 
  type, 
  categories, 
  users, 
  selectedUser, 
  searchText, 
  edit, 
  onMonthClick 
}) {
  const handleClick = () => {
    onMonthClick(month.month);
  };

  return (
    <div className="m-container" onClick={handleClick}>
      <span className="month-text">{getMonthName(month.month)}</span>
      <span className="month-amount">$ {formatLargeNumber(month.total)}</span>
    </div>
  );
}
