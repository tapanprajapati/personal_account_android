import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Graph, TextColors } from '../../../styles/colors';
import { formatLargeNumber } from '../../../utils/converters';
import './TypePieChart.css';

export default function TypePieChart({ income, expense }) {
  const diff = income - expense;
  
  const data = [
    { name: 'Expense', value: expense, color: Graph.expense },
    { name: 'Income', value: income, color: Graph.income },
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Don't show labels for very small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="type-pie-chart">
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`$${formatLargeNumber(value)}`, '']}
              labelFormatter={(label) => label}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="center-text">
          <div className="center-amount">
            ${formatLargeNumber(diff)}
          </div>
          <div className={`center-label ${diff < 0 ? 'negative' : 'positive'}`}>
            {diff < 0 ? 'Deficit' : 'Surplus'}
          </div>
        </div>
      </div>
    </div>
  );
}
