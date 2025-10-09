import React, { useState, useEffect } from 'react';
import EntryDBHandler from '../../databasehandler/entryhandler';
import { TextBackground } from '../../styles/colors';
import { formatLargeNumber, getMonthName, getSelectedCategories } from '../../utils/converters';
import './MonthDifference.css';

export default function MonthDifference({
  month,
  year,
  edit,
  selectedUser,
  incomeCategories,
  expenseCategories,
  addToIncome,
  addToExpense
}) {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  const entryHandler = new EntryDBHandler();

  useEffect(() => {
    getTotals();
  }, []);

  useEffect(() => {
    if (edit) {
      setIncome(0);
      setExpense(0);
      getTotals();
    }
  }, [edit]);

  const getTotals = () => {
    const date = `${month}/${year}`;
    
    // Get income total
    entryHandler
      .getSearchMonthTotal(
        '',
        date,
        getSelectedCategories(incomeCategories),
        selectedUser
      )
      .then((result) => {
        if (result.success) {
          const amount = result.message;
          console.log(`Income: ${date}-> ${amount}`);
          setIncome(amount);
          addToIncome(amount);
        } else {
          alert(`ERROR: ${result.message.toUpperCase()}`);
        }
      });

    // Get expense total
    entryHandler
      .getSearchMonthTotal(
        '',
        date,
        getSelectedCategories(expenseCategories),
        selectedUser
      )
      .then((result) => {
        if (result.success) {
          const amount = result.message;
          console.log(`Expense: ${date}-> ${amount}`);
          setExpense(amount);
          addToExpense(amount);
        } else {
          alert(`ERROR: ${result.message.toUpperCase()}`);
        }
      });
  };

  const difference = income - expense;
  let diffColor = TextBackground.savingGreen;
  if (difference < 0) {
    diffColor = TextBackground.savingRed;
  }

  return (
    <div className="month-difference">
      <div className="month-name">{getMonthName(month)}</div>
      <div className="month-income">
        $ {formatLargeNumber(income)}
      </div>
      <div className="month-expense">
        $ {formatLargeNumber(expense)}
      </div>
      <div className="month-saving" style={{ color: diffColor }}>
        $ {formatLargeNumber(difference)}
      </div>
    </div>
  );
}
