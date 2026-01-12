import React, { useState, useEffect } from 'react';
import { TextBackground } from '../../styles/colors';
import { formatLargeNumber } from '../../utils/converters';
import MonthDifference from './MonthDifference';
import './YearDifference.css';

export default function YearDifference({
  year,
}) {
  const difference = year.income - year.expense;
  let diffColor = TextBackground.savingGreen;
  if (difference < 0) {
    diffColor = TextBackground.savingRed;
  }

  return (
    <div className="year-difference">
      <div className="year-title">{year.year}</div>
      
      <div className="header-row">
        <div className="header-month">Month</div>
        <div className="header-income">Income</div>
        <div className="header-expense">Expense</div>
        <div className="header-saving">Saving</div>
      </div>

      <div className="months-container">
        {year.months.map((month,index) => (
          <MonthDifference
            key={index}
            month={month}
          />
        ))}
      </div>

      <div className="year-total">
        <div className="year-total-title">Total</div>
        <div className="year-total-income">
          $ {formatLargeNumber(year.income)}
        </div>
        <div className="year-total-expense">
          $ {formatLargeNumber(year.expense)}
        </div>
        <div className="year-total-saving" style={{ color: diffColor }}>
          $ {formatLargeNumber(difference)}
        </div>
      </div>
    </div>
  );
}
