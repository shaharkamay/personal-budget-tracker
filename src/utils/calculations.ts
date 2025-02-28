import { BudgetData, Category, Expense, Income, MonthlyBudgetSummary } from '../types';

// Helper to check if a date is in the current month
const isCurrentMonth = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

// Calculate monthly budget summary
export const calculateMonthlyBudget = (data: BudgetData): MonthlyBudgetSummary => {
  const { categories, expenses, incomes } = data;
  
  // Filter for current month
  const currentMonthExpenses = expenses.filter(expense => isCurrentMonth(expense.date));
  const currentMonthIncomes = incomes.filter(income => isCurrentMonth(income.date));
  
  // Calculate totals
  const totalBudget = categories.reduce((sum, category) => sum + category.budgetLimit, 0);
  const totalSpent = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncome = currentMonthIncomes.reduce((sum, income) => sum + income.amount, 0);
  
  // Calculate category spending
  const categorySpending: MonthlyBudgetSummary['categorySpending'] = {};
  
  categories.forEach(category => {
    const spent = currentMonthExpenses
      .filter(expense => expense.categoryId === category.id)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    const limit = category.budgetLimit;
    const percentage = limit > 0 ? (spent / limit) * 100 : 0;
    
    categorySpending[category.id] = {
      spent,
      limit,
      percentage,
    };
  });
  
  return {
    totalBudget,
    totalSpent,
    remainingBudget: totalBudget - totalSpent,
    totalIncome,
    netSavings: totalIncome - totalSpent,
    categorySpending,
  };
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Get category by ID
export const getCategoryById = (categories: Category[], id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

// Calculate percentage of budget used
export const calculateBudgetPercentage = (spent: number, limit: number): number => {
  if (limit <= 0) return 0;
  return Math.min(Math.round((spent / limit) * 100), 100);
};

// Get expenses for a specific category
export const getExpensesByCategory = (expenses: Expense[], categoryId: string): Expense[] => {
  return expenses.filter(expense => expense.categoryId === categoryId);
};

// Get total expenses for a specific category
export const getTotalExpensesByCategory = (expenses: Expense[], categoryId: string): number => {
  return getExpensesByCategory(expenses, categoryId)
    .reduce((sum, expense) => sum + expense.amount, 0);
};

// Get random color for new categories
export const getRandomColor = (): string => {
  const colors = [
    '#4f46e5', '#10b981', '#f59e0b', '#6366f1', '#ef4444', 
    '#8b5cf6', '#ec4899', '#0ea5e9', '#64748b', '#d946ef',
    '#f97316', '#14b8a6', '#a855f7', '#f43f5e', '#0891b2'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};