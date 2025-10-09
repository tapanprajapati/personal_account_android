import React, { useState, useEffect } from 'react';
import { Container } from '../../styles/global';
import CategoryDBHandler from '../../databasehandler/categoryhandler';
import EntryDBHandler from '../../databasehandler/entryhandler';
import UserDBHandler from '../../databasehandler/userhandler';
import CategoryFilterModal from '../../modals/CategoryFilterModal';
import YearDifference from './YearDifference';
import { TextBackground } from '../../styles/colors';
import { formatLargeNumber } from '../../utils/converters';
import './DifferenceScreen.css';

export default function DifferenceScreen() {
  const [years, setYears] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [edit, setEdit] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showIncomeFilter, setShowIncomeFilter] = useState(false);
  const [showExpenseFilter, setShowExpenseFilter] = useState(false);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("ALL");

  const entryHandler = new EntryDBHandler();
  const categoryHandler = new CategoryDBHandler();
  const userHandler = new UserDBHandler();

  const addToIncome = (amount) => {
    amount = parseFloat(amount);
    setIncome(prevIncome => prevIncome + amount);
  };

  const addToExpense = (amount) => {
    amount = parseFloat(amount);
    setExpense(prevExpense => prevExpense + amount);
  };

  const getYears = () => {
    setEdit(false);
    entryHandler.getYears().then((result) => {
      if (result.success) {
        const yearsData = result.message;
        console.log(yearsData);
        setYears(yearsData);
        setRefresh(false);
      } else {
        alert(`ERROR: ${result.message.toUpperCase()}`);
      }
    });
  };

  const getUsers = () => {
    userHandler.getAllUsers().then(result => {
      if (result.success) {
        result.message.push({ username: "ALL" });
        setUsers(result.message);
        setSelectedUser("ALL");
      } else {
        alert(`ERROR: ${result.message.toUpperCase()}`);
      }
    });
  };

  const getCategories = (type) => {
    categoryHandler.getCategories(type).then((result) => {
      if (result.success) {
        const categories = result.message;
        let temp = [];

        categories.forEach((category) => {
          temp.push({
            category: category,
            status: true,
          });
        });

        if (type === 'income') {
          setIncomeCategories(temp);
        } else {
          setExpenseCategories(temp);
        }
      } else {
        alert(`ERROR: ${result.message.toUpperCase()}`);
      }
    });
  };

  useEffect(() => {
    getYears();
    getUsers();
    getCategories('income');
    getCategories('expense');
  }, []);

  const handleRefresh = () => {
    setEdit(true);
    setIncome(0);
    setExpense(0);
    setRefresh(true);
    getYears();
  };

  const saveIncomeCategories = (categories, user = "ALL") => {
    console.log("CategoryModalClosed: " + user);
    setIncomeCategories(categories);
    setEdit(true);
    setIncome(0);
    setExpense(0);
    setSelectedUser(user);
    setTimeout(getYears, 10);
  };

  const saveExpenseCategories = (categories, user = "ALL") => {
    setExpenseCategories(categories);
    setEdit(true);
    setIncome(0);
    setExpense(0);
    setSelectedUser(user);
    setTimeout(getYears, 10);
  };

  const difference = income - expense;
  let diffColor = TextBackground.savingGreen;
  if (difference < 0) {
    diffColor = TextBackground.savingRed;
  }

  return (
    <Container>
      <div className="difference-screen">
        <div className="filter-container">
          <div className="filter-tab">
            <button 
              className="filter-btn"
              onClick={() => setShowIncomeFilter(true)}
            >
              🔽 Income
            </button>
          </div>
          <div className="filter-tab">
            <button 
              className="filter-btn"
              onClick={() => setShowExpenseFilter(true)}
            >
              🔽 Expense
            </button>
          </div>
        </div>

        <div className="years-container">
          {refresh && (
            <div className="loading-spinner">Loading...</div>
          )}
          {years.map((year) => (
            <YearDifference
              key={year}
              year={year}
              incomeCategories={incomeCategories}
              expenseCategories={expenseCategories}
              addToIncome={addToIncome}
              edit={edit}
              selectedUser={selectedUser}
              addToExpense={addToExpense}
            />
          ))}
        </div>

        <div className="total-summary">
          <div className="total-title">Total</div>
          <div className="total-income">
            $ {formatLargeNumber(income)}
          </div>
          <div className="total-expense">
            $ {formatLargeNumber(expense)}
          </div>
          <div className="total-difference" style={{ color: diffColor }}>
            $ {formatLargeNumber(difference)}
          </div>
        </div>

        {showIncomeFilter && (
          <CategoryFilterModal
            categories={incomeCategories}
            saveChanges={saveIncomeCategories}
            users={users}
            selectedUser={selectedUser}
            close={() => setShowIncomeFilter(false)}
          />
        )}

        {showExpenseFilter && (
          <CategoryFilterModal
            categories={expenseCategories}
            saveChanges={saveExpenseCategories}
            users={users}
            selectedUser={selectedUser}
            close={() => setShowExpenseFilter(false)}
          />
        )}
      </div>
    </Container>
  );
}
