import React, { useState, useEffect } from 'react';
import { TextBackground } from '../../styles/colors';
import { formatLargeNumber, getMonthName, getSelectedCategories } from '../../utils/converters';
import './MonthDifference.css';

export default function MonthDifference({
  month
}) {
  const difference = month.incomeTotal - month.expenseTotal;
  let diffColor = TextBackground.savingGreen;
  if (difference < 0) {
    diffColor = TextBackground.savingRed;
  }

  return (
    <div className="month-difference">
      <div className="month-name">{getMonthName(month.month)}</div>
      <div className="month-income">
        $ {formatLargeNumber(month.incomeTotal)}
      </div>
      <div className="month-expense">
        $ {formatLargeNumber(month.expenseTotal)}
      </div>
      <div className="month-saving" style={{ color: diffColor }}>
        $ {formatLargeNumber(difference)}
      </div>
    </div>
  );
}
