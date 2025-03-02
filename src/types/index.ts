export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  budgetLimit: number;
}

export interface Expense {
  id: string;
  date: string;
  amount: number;
  categoryId: string;
  description: string;
}

export interface Income {
  id: string;
  date: string;
  amount: number;
  description: string;
}

export interface BudgetData {
  categories: Category[];
  expenses: Expense[];
  incomes: Income[];
  setupComplete: boolean;
}

export interface MonthlyBudgetSummary {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  totalIncome: number;
  netSavings: number;
  categorySpending: {
    [categoryId: string]: {
      spent: number;
      limit: number;
      percentage: number;
    };
  };
}

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}