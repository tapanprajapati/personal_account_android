import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Graph, TextColors } from '../../../styles/colors';
import { formatLargeNumber } from '../../../utils/converters';
import './TypePieChart.css';

export default function TypePieChart({ income = 0, expense = 0 }) {
  const diff = income - expense;
  
  // Add some debugging
  console.log('TypePieChart props:', { income, expense, diff });
  
  // For testing, if both are 0, show sample data
  const testIncome = income === 0 && expense === 0 ? 1000 : income;
  const testExpense = income === 0 && expense === 0 ? 750 : expense;
  
  const data = [
    { name: 'Expense', value: testExpense, color: Graph.expense },
    { name: 'Income', value: testIncome, color: Graph.income },
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Don't show labels for very small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.25;
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
    <div style={{ display: 'flex', flex: 1, padding: '5px' }}>
      {income === 0 && expense === 0 && (
        <div style={{ fontSize: '12px', color: '#999', textAlign: 'center', marginBottom: '5px' }}>
          Showing sample data - no real data available
        </div>
      )}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '200px',
        minHeight: '200px',
      }}>
        <ResponsiveContainer width="100%" height="100%">
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
        <div style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
            ${formatLargeNumber(testIncome - testExpense)}
          </div>
          <div style={{
            fontSize: '12px',
            fontWeight: '500',
            color: (testIncome - testExpense) < 0 ? '#FF5252' : '#00E676'
          }}>
          </div>
        </div>
      </div>
    </div>
  );
}
