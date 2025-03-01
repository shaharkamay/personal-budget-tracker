import React, { useState } from 'react';
import { Expense, Category } from '../../types';
import { formatCurrency, getCategoryById } from '../../utils/calculations';
import { deleteExpense } from '../../utils/storage';
import { Trash2, Edit } from 'lucide-react';
import Button from '../ui/Button';
import EditExpenseForm from './EditExpenseForm';

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, categories }) => {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  
  // Filter expenses for current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthExpenses = expenses.filter(expense => {
    const date = new Date(expense.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
  
  // Sort by date (newest first)
  const sortedExpenses = [...currentMonthExpenses].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  const handleDelete = (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק הוצאה זו?')) {
      deleteExpense(id);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'short',
    });
  };
  
  if (sortedExpenses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">לא נרשמו הוצאות לחודש זה.</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-right py-2 px-4 font-medium text-gray-500">תאריך</th>
              <th className="text-right py-2 px-4 font-medium text-gray-500">קטגוריה</th>
              <th className="text-right py-2 px-4 font-medium text-gray-500">תיאור</th>
              <th className="text-right py-2 px-4 font-medium text-gray-500">סכום</th>
              <th className="text-right py-2 px-4 font-medium text-gray-500">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {sortedExpenses.map(expense => {
              const category = getCategoryById(categories, expense.categoryId);
              
              return (
                <tr key={expense.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{formatDate(expense.date)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {category && (
                        <div
                          className="w-3 h-3 rounded-full ml-2"
                          style={{ backgroundColor: category.color }}
                        />
                      )}
                      <span>{category ? category.name : 'לא ידוע'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{expense.description}</td>
                  <td className="py-3 px-4 text-right font-medium">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-gray-500 hover:text-red-500 mx-1"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        onClick={() => setEditingExpense(expense)}
                        className="text-gray-500 hover:text-blue-500 mx-1"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {editingExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">ערוך הוצאה</h3>
              <EditExpenseForm
                expense={editingExpense}
                categories={categories}
                onClose={() => setEditingExpense(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;