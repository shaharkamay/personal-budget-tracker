import { BudgetData, Category, Expense, Income } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'budget_tracker_data';

const defaultCategories: Category[] = [
  { id: uuidv4(), name: 'דיור', color: '#4f46e5', budgetLimit: 0 },
  { id: uuidv4(), name: 'מזון', color: '#10b981', budgetLimit: 0 },
  { id: uuidv4(), name: 'תחבורה', color: '#f59e0b', budgetLimit: 0 },
  { id: uuidv4(), name: 'חשבונות', color: '#6366f1', budgetLimit: 0 },
  { id: uuidv4(), name: 'בריאות', color: '#ef4444', budgetLimit: 0 },
  { id: uuidv4(), name: 'אישי', color: '#8b5cf6', budgetLimit: 0 },
  { id: uuidv4(), name: 'בידור', color: '#ec4899', budgetLimit: 0 },
  { id: uuidv4(), name: 'חינוך', color: '#0ea5e9', budgetLimit: 0 },
  { id: uuidv4(), name: 'שונות', color: '#64748b', budgetLimit: 0 },
];

const defaultData: BudgetData = {
  categories: defaultCategories,
  expenses: [],
  incomes: [],
  setupComplete: false,
};

export const getBudgetData = (): BudgetData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return defaultData;
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading budget data:', error);
    return defaultData;
  }
};

export const saveBudgetData = (data: BudgetData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving budget data:', error);
  }
};

export const addCategory = (category: Omit<Category, 'id'>): Category => {
  const data = getBudgetData();
  const newCategory = { ...category, id: uuidv4() };
  
  data.categories.push(newCategory);
  saveBudgetData(data);
  
  return newCategory;
};

export const updateCategory = (category: Category): void => {
  const data = getBudgetData();
  const index = data.categories.findIndex(c => c.id === category.id);
  
  if (index !== -1) {
    data.categories[index] = category;
    saveBudgetData(data);
  }
};

export const deleteCategory = (categoryId: string): void => {
  const data = getBudgetData();
  data.categories = data.categories.filter(c => c.id !== categoryId);
  
  // Also remove expenses with this category
  data.expenses = data.expenses.filter(e => e.categoryId !== categoryId);
  
  saveBudgetData(data);
};

export const addExpense = (expense: Omit<Expense, 'id'>): Expense => {
  const data = getBudgetData();
  const newExpense = { ...expense, id: uuidv4() };
  
  data.expenses.push(newExpense);
  saveBudgetData(data);
  
  return newExpense;
};

export const updateExpense = (expense: Expense): void => {
  const data = getBudgetData();
  const index = data.expenses.findIndex(e => e.id === expense.id);
  
  if (index !== -1) {
    data.expenses[index] = expense;
    saveBudgetData(data);
  }
};

export const deleteExpense = (expenseId: string): void => {
  const data = getBudgetData();
  data.expenses = data.expenses.filter(e => e.id !== expenseId);
  saveBudgetData(data);
};

export const addIncome = (income: Omit<Income, 'id'>): Income => {
  const data = getBudgetData();
  const newIncome = { ...income, id: uuidv4() };
  
  data.incomes.push(newIncome);
  saveBudgetData(data);
  
  return newIncome;
};

export const updateIncome = (income: Income): void => {
  const data = getBudgetData();
  const index = data.incomes.findIndex(i => i.id === income.id);
  
  if (index !== -1) {
    data.incomes[index] = income;
    saveBudgetData(data);
  }
};

export const deleteIncome = (incomeId: string): void => {
  const data = getBudgetData();
  data.incomes = data.incomes.filter(i => i.id !== incomeId);
  saveBudgetData(data);
};

export const completeSetup = (categories?: Category[]): void => {
  const data = getBudgetData();
  data.setupComplete = true;
  if (categories) data.categories = categories;
  saveBudgetData(data);
};

export const resetData = (): void => {
  saveBudgetData(defaultData);
};