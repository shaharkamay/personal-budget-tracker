import React from 'react';
import { Category, Expense } from '../../types';
import { formatCurrency, getTotalExpensesByCategory } from '../../utils/calculations';
import ProgressBar from '../ui/ProgressBar';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryBreakdownProps {
  categories: Category[];
  expenses: Expense[];
}

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ categories, expenses }) => {
  // Filter expenses for current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthExpenses = expenses.filter(expense => {
    const date = new Date(expense.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
  
  // Calculate spending by category
  const categorySpending = categories.map(category => {
    const spent = getTotalExpensesByCategory(currentMonthExpenses, category.id);
    const limit = category.budgetLimit;
    const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
    
    return {
      ...category,
      spent,
      percentage,
    };
  });
  
  // Sort by spending (highest first)
  categorySpending.sort((a, b) => b.spent - a.spent);
  
  // Prepare data for doughnut chart
  const chartData = {
    labels: categorySpending.map(cat => cat.name),
    datasets: [
      {
        data: categorySpending.map(cat => cat.spent),
        backgroundColor: categorySpending.map(cat => cat.color),
        borderColor: categorySpending.map(cat => cat.color),
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: '70%',
    responsive: true,
    maintainAspectRatio: false,
  };
  
  return (
    <div>
      <div className="h-48 mb-6">
        <Doughnut data={chartData} options={chartOptions} />
      </div>
      
      <div className="space-y-4">
        {categorySpending.map(category => (
          <div key={category.id}>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm font-medium">{category.name}</span>
              </div>
              <span className="text-sm text-gray-500">
                {formatCurrency(category.spent)}
                {category.budgetLimit > 0 && ` / ${formatCurrency(category.budgetLimit)}`}
              </span>
            </div>
            
            {category.budgetLimit > 0 && (
              <ProgressBar
                value={category.spent}
                max={category.budgetLimit}
                color={category.color.replace('#', '')}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBreakdown;