import React, { useState, useEffect } from 'react';
import { Container } from '../../styles/global';
import './CategorySummaryScreen.css';
import EntryDBHandler from '../../databasehandler/entryhandler';
import { formatLargeNumber } from '../../utils/converters';

export default function CategorySummaryScreen() {
  const [expenseCategoryData, setExpenseCategoryData] = useState([]);
  const [incomeCategoryData, setIncomeCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [incomeMonthTotals, setIncomeMonthTotals] = useState([]);
  const [expenseMonthTotals, setExpenseMonthTotals] = useState([]);

  const entryHandler = new EntryDBHandler();

  useEffect(() => {
    getCategorySummary("income", year);
    getCategorySummary("expense", year);
  }, []);

  const getCategorySummary = async (type, year = year) => {
    try {
      const result = await entryHandler.getCategorySummary(type, year);
      if (result.success) {
        if (type === 'income') {
          setIncomeCategoryData(result.message || []);
          setIncomeMonthTotals(getMonthsTotals(result.message || []));
        } else {
          setExpenseCategoryData(result.message || []);
          setExpenseMonthTotals(getMonthsTotals(result.message || []));
        }
      } else {
        console.error(result.message || 'Failed to fetch categories');
      }
    } catch (error) {
      console.error(error.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const getMonthsTotals = (data) => {
    const totals = Array(12).fill(0);
    data.forEach(category => {
      category.months.forEach((amount, index) => {
        totals[index] += amount;
      });
    });
    return totals;
  }

  return (
    <Container>
      <div className="category-summary-screen">
        <h2>Category Summary</h2>
        
        <h3>Income Summary</h3>
        <table className="category-summary-container">
          <tr className="category-summary-header-row">
            <th className="category-summary-header">Category</th>
            { ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
              <th key={month} className="category-summary-header">{month}</th>
            )) }
            <th className="category-summary-header">Total</th>  
            <th className="category-summary-header">Average</th>  
          </tr>
          { incomeCategoryData.map((category, index) => {
              return(
                <tr className='category-summary-row' key={category.title}>
                  <td className="category-summary-row-title">{category.title}</td>
                  { category.months.map((month, mIndex) => (
                    <td key={mIndex} className="category-summary-row-item">${formatLargeNumber(month)}</td>
                  )) }
                  <td className="category-summary-row-item-total">${formatLargeNumber(category.months.reduce((a,c)=>a+c,0))}</td>
                  <td className="category-summary-row-item-total">${formatLargeNumber(category.months.reduce((a,c)=>a+c,0)/(category.months.filter(d=>d>0).length))}</td>
                </tr>
              )
            }
          ) }
          {
            <tr className='category-summary-row'>
              <td className="category-summary-row-title">Total</td>
              { incomeMonthTotals.map((monthTotal, index) => (
                <td key={index} className="category-summary-row-item-total">${formatLargeNumber(monthTotal)}</td>
              )) }
              <td className="category-summary-row-item-total">${formatLargeNumber(incomeMonthTotals.reduce((a,c)=>a+c,0))}</td>
              <td className="category-summary-row-item-total">${formatLargeNumber(incomeMonthTotals.reduce((a,c)=>a+c,0)/(incomeMonthTotals.filter(d=>d>0).length))}</td>
            </tr>
          }
        </table>

        <div className="spacer"></div>

        <h3>Expense Summary</h3>
        <table className="category-summary-container">
          <tr className="category-summary-header-row">
            <th className="category-summary-header">Category</th>
            { ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
              <th key={month} className="category-summary-header">{month}</th>
            )) }
            <th className="category-summary-header">Total</th>  
            <th className="category-summary-header">Average</th>  
          </tr>
          { expenseCategoryData.map((category, index) => {
              return(
                <tr className='category-summary-row' key={category.title}>
                  <td className="category-summary-row-title">{category.title}</td>
                  { category.months.map((month, mIndex) => (
                    <td key={mIndex} className="category-summary-row-item">${formatLargeNumber(month)}</td>
                  )) }
                  <td className="category-summary-row-item-total">${formatLargeNumber(category.months.reduce((a,c)=>a+c,0))}</td>
                  <td className="category-summary-row-item-total">${formatLargeNumber(category.months.reduce((a,c)=>a+c,0)/(category.months.filter(d=>d>0).length))}</td>
                </tr>
              )
            }
          ) }
          {
            <tr className='category-summary-row'>
              <td className="category-summary-row-title">Total</td>
              { expenseMonthTotals.map((monthTotal, index) => (
                <td key={index} className="category-summary-row-item-total">${formatLargeNumber(monthTotal)}</td>
              )) }
              <td className="category-summary-row-item-total">${formatLargeNumber(expenseMonthTotals.reduce((a,c)=>a+c,0))}</td>
              <td className="category-summary-row-item-total">${formatLargeNumber(expenseMonthTotals.reduce((a,c)=>a+c,0)/(expenseMonthTotals.filter(d=>d>0).length))}</td>
            </tr>
          }
          <tr className='category-summary-row total-row'>
            <td className="category-summary-row-title-diff">Diff</td>
            { expenseMonthTotals.map((monthTotal, index) => (
              <TotalRow 
                key={index} 
                className="category-summary-row-item-total" 
                amount={incomeMonthTotals[index]-monthTotal} 
              />
            )) }
            <TotalRow
              key="total-diff"
              className="category-summary-row-item-total" 
              amount={incomeMonthTotals.reduce((a,c)=>a+c,0)-expenseMonthTotals.reduce((a,c)=>a+c,0)}
            />
            
            <TotalRow
              key="total-diff"
              className="category-summary-row-item-total" 
              amount={(incomeMonthTotals.reduce((a,c)=>a+c,0)-expenseMonthTotals.reduce((a,c)=>a+c,0))/12}
            />
          </tr>
        </table>
      </div>
    </Container>
  );
}

function TotalRow({index, className, amount}) {
  const color = amount < 0 ? ' red' : ' green';
  return (
    <td key={index} className={className+color}>${formatLargeNumber(amount)}</td>
  )
}