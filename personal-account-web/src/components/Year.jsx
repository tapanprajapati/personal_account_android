import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EntryDBHandler from '../databasehandler/entryhandler';
import { ListColors } from '../styles/colors';
import { formatLargeNumber, getSelectedCategories } from '../utils/converters';
import { getMonthName } from '../utils/converters';
import './Year.css';

export default function Year({ 
  year, 
  type, 
  edit, 
  categories, 
  users, 
  selectedUser, 
  searchText, 
  passTotal, 
  doneLoading 
}) {
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let total = 0;
    year.months.map((month, index) => (
      total+=month.total
    ))
    setAmount(total);
    passTotal(total);
  }, []);

  useEffect(() => {
    if (edit) {
      setAmount(0);
    }
  }, [edit, categories, searchText, selectedUser]);

  const goToEntryListScreen = (month) => {
    navigate('/entry-list/', {
      state: {
        type: type,
        year: year.year,
        month: month,
        categories: categories,
        searchText: searchText,
        users: users,
        selectedUser: selectedUser
      }
    });
  };

  return (
    <div className="y-container">
          <h3 className="y-title">{year.year}</h3>
      
      <div className="year-months-list">
        {year.months.map((month, index) => (
          <Month 
            key={index}
            month={month}
            year={year}
            type={type}
            categories={categories}
            users={users}
            selectedUser={selectedUser}
            searchText={searchText}
            edit={edit}
            onMonthClick={goToEntryListScreen}
          />
        ))}
      </div>
      
      <div className="year-footer">
        Total: $ {formatLargeNumber(amount)}
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
