import React, { useState, useEffect } from 'react';
import { Container } from '../styles/global';
import TypePieChart from '../components/graph/DashboardComponents/TypePieChart';
import { formatLargeNumber, getMonthName } from '../utils/converters';
import MonthYearPicker from '../modals/MonthYearPicker';
import DashboardCategoryTotal from '../components/DashboardCategoryTotal';
import CategoryDBHandler from '../databasehandler/categoryhandler';
import './DashboardScreen.css';

export default function DashboardScreen() {
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [incomeData, setIncomeData] = useState([]);
  const [incomeYTD, setIncomeYTD] = useState([]);
  const [expenseYTD, setExpenseYTD] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);

  const categoryHandler = new CategoryDBHandler();

  const saveDate = (newDate) => {
    setDate(newDate);
    setTimeout(() => {
      getCategoryData("income");
      getCategoryData("expense");
    }, 100);
  };

  const getCategoryData = (type) => {
    const monthYear =
      (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      '/' +
      date.getFullYear();
    
    categoryHandler.getAllCategoriesTotalMonth(type, monthYear).then(result => {
      if (result.success) {
        const data = result.message;
        const total = getTypeTotal(data);
        if (type === "income") {
          setIncomeData(data);
          setIncomeTotal(total);
        } else {
          setExpenseData(data);
          setExpenseTotal(total);
        }
      } else {
        alert(`ERROR: ${result.message.toUpperCase()}`);
      }
    });

    categoryHandler.getAllCategoriesTotalYear(type, date.getFullYear()).then(result => {
      if (result.success) {
        const data = result.message;
        if (type === "income") {
          setIncomeYTD(data);
        } else {
          setExpenseYTD(data);
        }
      } else {
        alert(`ERROR: ${result.message.toUpperCase()}`);
      }
    });
  };

  const getTypeTotal = (data) => {
    let total = 0;
    data.forEach((item) => {
      total += item.total;
    });
    return total;
  };

  const refresh = () => {
    saveDate(date);
  };

  useEffect(() => {
    getCategoryData("income");
    getCategoryData("expense");
  }, []);

  return (
    <Container>
      <div className="dashboard-first">
        <div
          className="date-container"
          onClick={() => setIsDatePickerVisible(true)}
        >
          <div className='date'>
            <span className="month">
              {getMonthName(
                date.getMonth() + 1,
                'short',
              ).toUpperCase()}
            </span>
            <span className="year">{date.getFullYear()}</span>
          </div>
        </div>

        {/* <div className="pie-chart">
          <TypePieChart income={incomeTotal} expense={expenseTotal} />
        </div> */}
        <div className="dashboard-total-summary">
          <div className="dashboard-total-income">Income: ${formatLargeNumber(incomeTotal)}</div>
          <div className="dashboard-total-expense">Expense: ${formatLargeNumber(expenseTotal)}</div>
          <div className="dashboard-total-diff">Difference: ${formatLargeNumber(incomeTotal-expenseTotal)}</div>
        </div>
      </div>

      <div className="category-container">
        <div className="category">
          <DashboardCategoryTotal
            type={"Income"}
            data={incomeData}
            YTD={incomeYTD}
          />
        </div>

        <div className="category">
          <DashboardCategoryTotal
            type={"Expense"}
            data={expenseData}
            YTD={expenseYTD}
          />
        </div>
      </div>

      <MonthYearPicker
        isVisible={isDatePickerVisible}
        close={() => setIsDatePickerVisible(false)}
        saveDate={saveDate}
        date={date}
      />
    </Container>
  );
}
