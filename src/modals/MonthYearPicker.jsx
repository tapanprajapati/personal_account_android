import React, { useState, useEffect } from 'react';
import { getMonthName } from '../utils/converters';
import './MonthYearPicker.css';

export default function MonthYearPicker({ isVisible, close, saveDate, date }) {
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth());
  const [selectedYear, setSelectedYear] = useState(date.getFullYear());

  const getYears = () => {
    const current = new Date().getFullYear();
    let years = [];
    for (let i = current - 20; i <= current + 20; i++) {
      years.push(i);
    }
    return years;
  };

  const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const years = getYears();

  useEffect(() => {
    if (isVisible) {
      setSelectedMonth(date.getMonth());
      setSelectedYear(date.getFullYear());
    }
  }, [isVisible, date]);

  const handleSave = () => {
    const newDate = new Date(selectedYear, selectedMonth, 1);
    saveDate(newDate);
    close();
  };

  const handleReset = () => {
    const now = new Date();
    setSelectedMonth(now.getMonth());
    setSelectedYear(now.getFullYear());
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Select Month and Year</h3>
          </div>
          
          <div className="date-selector">
            <div className="selector-group">
              <label>Month</label>
              <select 
                value={selectedMonth} 
                onChange={handleMonthChange}
                className="month-select"
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {getMonthName(month + 1, 'short')}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="selector-group">
              <label>Year</label>
              <select 
                value={selectedYear} 
                onChange={handleYearChange}
                className="year-select"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
            <button className="btn btn-secondary" onClick={close}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
