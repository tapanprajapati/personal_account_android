import React, { useState, useEffect } from 'react';
import EntryDBHandler from '../../databasehandler/entryhandler';
import { TextBackground } from '../../styles/colors';
import { formatLargeNumber } from '../../utils/converters';
import MonthDifference from './MonthDifference';
import './YearDifference.css';

export default function YearDifference({
  year,
  incomeCategories,
  expenseCategories,
  addToIncome,
  edit,
  selectedUser,
  addToExpense
}) {
  const [months, setMonths] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  const entryHandler = new EntryDBHandler();

  useEffect(() => {
    getMonths();
  }, []);

  useEffect(() => {
    if (edit) {
      setIncome(0);
      setExpense(0);
      getMonths();
    }
  }, [edit]);

  const getMonths = () => {
    entryHandler.getMonths(year).then((result) => {
      if (result.success) {
        const monthsData = result.message;
        console.log(`Months: ${year}`);
        console.log(monthsData);
        setMonths(monthsData);
      } else {
        alert(`ERROR: ${result.message.toUpperCase()}`);
      }
    });
  };

  const handleAddToIncome = (amount) => {
    amount = parseFloat(amount);
    setIncome(prevIncome => prevIncome + amount);
    addToIncome(amount);
  };

  const handleAddToExpense = (amount) => {
    amount = parseFloat(amount);
    setExpense(prevExpense => prevExpense + amount);
    addToExpense(amount);
  };

  const difference = income - expense;
  let diffColor = TextBackground.savingGreen;
  if (difference < 0) {
    diffColor = TextBackground.savingRed;
  }

  return (
    <div className="year-difference">
      <div className="year-title">{year}</div>
      
      <div className="header-row">
        <div className="header-month">Month</div>
        <div className="header-income">Income</div>
        <div className="header-expense">Expense</div>
        <div className="header-saving">Saving</div>
      </div>

      <div className="months-container">
        {months.map((month) => (
          <MonthDifference
            key={month}
            month={month}
            year={year}
            edit={edit}
            selectedUser={selectedUser}
            incomeCategories={incomeCategories}
            expenseCategories={expenseCategories}
            addToIncome={handleAddToIncome}
            addToExpense={handleAddToExpense}
          />
        ))}
      </div>

      <div className="year-total">
        <div className="year-total-title">Total</div>
        <div className="year-total-income">
          $ {formatLargeNumber(income)}
        </div>
        <div className="year-total-expense">
          $ {formatLargeNumber(expense)}
        </div>
        <div className="year-total-saving" style={{ color: diffColor }}>
          $ {formatLargeNumber(difference)}
        </div>
      </div>
    </div>
  );
}
