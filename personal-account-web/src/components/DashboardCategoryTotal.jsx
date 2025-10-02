import React from "react";
import { TextColors } from "../styles/colors";
import { formatLargeNumber } from "../utils/converters";
import './DashboardCategoryTotal.css';

export default function DashboardCategoryTotal({ type, data, YTD }) {
  console.log(data);
  console.log(YTD);

  const getTotalColor = (total, allowance, isIncome) => {
    if (isIncome) {
      return total < allowance ? TextColors.expense : TextColors.income;
    }
    return total > allowance ? TextColors.expense : TextColors.income;
  };

  const getYTDColor = (ytd, allowance, isIncome) => {
    const yearlyAllowance = allowance * 12;
    if (isIncome) {
      return ytd < yearlyAllowance ? TextColors.expense : TextColors.income;
    }
    return ytd > yearlyAllowance ? TextColors.expense : TextColors.income;
  };

  return (
    <div className="dashboard-category-total">
      <h3 className="title">{type}</h3>
      <div className="category-header">
        <div className="category-title">Title</div>
        <div className="category-total">Limit</div>
        <div className="category-total">Month</div>
        <div className="category-total">YTD</div>
        <div className="category-total">YTD Rem.</div>
      </div>
      <div className="category-list">
        {data.map((item, index) => {
          const YTDValue = YTD[index] ? YTD[index].total : 0;
          const isIncome = type === "Income";
          const totalColor = getTotalColor(item.total, item.allowance, isIncome);
          const ytdColor = getYTDColor(YTDValue, item.allowance, isIncome);

          return (
            <div key={`${item.title}-${index}`} className="category-row">
              <div className="category-title">
                {item.title}
              </div>
              <div className="category-total">
                {item.allowance}
              </div>
              <div className="category-total" style={{ color: totalColor }}>
                {formatLargeNumber(item.total)}
              </div>
              <div className="category-total" style={{ color: ytdColor }}>
                {formatLargeNumber(YTDValue)}
              </div>
              <div className="category-total" style={{ color: ytdColor }}>
                {formatLargeNumber(item.allowance * 12 - YTDValue)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
