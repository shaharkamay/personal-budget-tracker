import { Expense, Income, Category } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { getRandomColor } from './calculations';

// Prepare expenses data for CSV export
export const prepareExpensesForExport = (expenses: Expense[], categories: Category[]): string => {
  // CSV header
  let csv = 'Date,Amount,Category,Description\n';
  
  // Add each expense as a row
  expenses.forEach(expense => {
    const category = categories.find(c => c.id === expense.categoryId);
    const categoryName = category ? category.name : 'Unknown';
    
    // Format the row and escape any commas in the description
    const row = [
      expense.date,
      expense.amount.toString(),
      categoryName,
      `"${expense.description.replace(/"/g, '""')}"`
    ].join(',');
    
    csv += row + '\n';
  });
  
  return csv;
};

// Prepare incomes data for CSV export
export const prepareIncomesForExport = (incomes: Income[]): string => {
  // CSV header
  let csv = 'Date,Amount,Description\n';
  
  // Add each income as a row
  incomes.forEach(income => {
    // Format the row and escape any commas in the description
    const row = [
      income.date,
      income.amount.toString(),
      `"${income.description.replace(/"/g, '""')}"`
    ].join(',');
    
    csv += row + '\n';
  });
  
  return csv;
};

// Parse expenses from CSV import
export const parseExpensesFromCSV = (
  data: Array<Array<string>>, 
  categories: Category[]
): { expenses: Omit<Expense, 'id'>[], newCategories: Omit<Category, 'id'>[] } => {
  const expenses: Omit<Expense, 'id'>[] = [];
  const categoryMap = new Map<string, string>();
  const newCategories: Omit<Category, 'id'>[] = [];
  
  // Create a map of existing categories by name for quick lookup
  categories.forEach(category => {
    categoryMap.set(category.name.toLowerCase(), category.id);
  });
  
  // Skip the header row
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row.length < 3) continue; // Skip invalid rows
    
    const [date, amountStr, categoryName, description = ''] = row;
    const amount = parseFloat(amountStr);
    
    if (isNaN(amount) || !date) continue; // Skip rows with invalid amount or date
    
    // Check if the category exists, if not create a new one
    let categoryId = categoryMap.get(categoryName.toLowerCase());
    
    if (!categoryId) {
      // Create a new category
      const newCategory = {
        name: categoryName,
        color: getRandomColor(),
        budgetLimit: 0
      };
      
      newCategories.push(newCategory);
      categoryId = `new_${newCategories.length}`; // Temporary ID
      categoryMap.set(categoryName.toLowerCase(), categoryId);
    }
    
    expenses.push({
      date,
      amount,
      categoryId,
      description
    });
  }
  
  return { expenses, newCategories };
};

// Parse incomes from CSV import
export const parseIncomesFromCSV = (data: Array<Array<string>>): Omit<Income, 'id'>[] => {
  const incomes: Omit<Income, 'id'>[] = [];
  
  // Skip the header row
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row.length < 2) continue; // Skip invalid rows
    
    const [date, amountStr, description = ''] = row;
    const amount = parseFloat(amountStr);
    
    if (isNaN(amount) || !date) continue; // Skip rows with invalid amount or date
    
    incomes.push({
      date,
      amount,
      description
    });
  }
  
  return incomes;
};

// Download data as CSV file
export const downloadCSV = (data: string, filename: string): void => {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};