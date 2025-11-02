import React, { useState, useEffect } from 'react';
import { Container } from '../../styles/global';
import CategoryDBHandler from '../../databasehandler/categoryhandler';
import EntryDBHandler from '../../databasehandler/entryhandler';
import UserDBHandler from '../../databasehandler/userhandler';
import CategoryFilterModal from '../../modals/CategoryFilterModal';
import YearDifference from './YearDifference';
import { TextBackground } from '../../styles/colors';
import { formatLargeNumber, getSelectedCategories } from '../../utils/converters';
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

  const getData = (iCategories, eCategories) => {
    setEdit(false);
    entryHandler.getDifferenceData(getSelectedCategories(iCategories), getSelectedCategories(eCategories)).then((result) => {
      if (result.success) {
        const yearsData = result.message;
        // console.log(yearsData);
        setYears(yearsData);
        // yearsData.map(year=>console.log(year));
        setRefresh(false);
      } else {
        alert(`ERROR: ${result.message}`);
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

  const getCategories = () => {
    categoryHandler.getCategories('income').then((result) => {
      if (result.success) {
        let iCategories = [];

        result.message.forEach((category) => {
          iCategories.push({
            category: category,
            status: true,
          });
        });
        console.log(iCategories);

        setIncomeCategories(iCategories);
        categoryHandler.getCategories('expense').then((result) => {
          if (result.success) {
            let eCategories = [];
    
            result.message.forEach((category) => {
              eCategories.push({
                category: category,
                status: true,
              });
            });
            console.log(eCategories);
    
            setExpenseCategories(eCategories);
            getData(iCategories, eCategories);        
          } else {
            alert(`ERROR: ${result.message.toUpperCase()}`);
          }
        });


      } else {
        alert(`ERROR: ${result.message.toUpperCase()}`);
      }
    });
  };

  useEffect(() => {
    getCategories();
    getUsers();
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
    getData(categories, expenseCategories);
  };

  const saveExpenseCategories = (categories, user = "ALL") => {
    setExpenseCategories(categories);
    setEdit(true);
    setIncome(0);
    setExpense(0);
    setSelectedUser(user);
    getData(incomeCategories, categories);
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
          {years.map((year,index) => (
            <YearDifference
              key={index}
              year={year}
              addToIncome={addToIncome}
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
