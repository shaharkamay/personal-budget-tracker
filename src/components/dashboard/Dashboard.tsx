import React, { useState, useEffect } from 'react';
import { getBudgetData } from '../../utils/storage';
import { calculateMonthlyBudget, formatCurrency } from '../../utils/calculations';
import { BudgetData, MonthlyBudgetSummary } from '../../types';
import BudgetSummary from './BudgetSummary';
import ExpenseList from './ExpenseList';
import CategoryBreakdown from './CategoryBreakdown';
import AddExpenseForm from './AddExpenseForm';
import AddIncomeForm from './AddIncomeForm';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { PlusCircle, Download, Upload } from 'lucide-react';
import Button from '../ui/Button';
import { prepareExpensesForExport, prepareIncomesForExport, downloadCSV } from '../../utils/csv';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<BudgetData | null>(null);
  const [summary, setSummary] = useState<MonthlyBudgetSummary | null>(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddIncome, setShowAddIncome] = useState(false);
  
  useEffect(() => {
    const loadData = () => {
      const budgetData = getBudgetData();
      setData(budgetData);
      
      const monthlySummary = calculateMonthlyBudget(budgetData);
      setSummary(monthlySummary);
    };
    
    loadData();
    
    // Set up interval to refresh data every 5 seconds
    const interval = setInterval(loadData, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleExportExpenses = () => {
    if (!data) return;
    
    const csvContent = prepareExpensesForExport(data.expenses, data.categories);
    downloadCSV(csvContent, 'budget-tracker-expenses.csv');
  };
  
  const handleExportIncomes = () => {
    if (!data) return;
    
    const csvContent = prepareIncomesForExport(data.incomes);
    downloadCSV(csvContent, 'budget-tracker-incomes.csv');
  };
  
  if (!data || !summary) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Monthly Budget Dashboard</h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            onClick={() => setShowAddIncome(true)}
            className="text-sm"
          >
            <PlusCircle size={16} className="mr-1" /> Add Income
          </Button>
          
          <Button
            onClick={() => setShowAddExpense(true)}
            className="text-sm"
          >
            <PlusCircle size={16} className="mr-1" /> Add Expense
          </Button>
        </div>
      </div>
      
      <BudgetSummary summary={summary} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Recent Transactions</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportExpenses}
                >
                  <Download size={16} className="mr-1" /> Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ExpenseList
                expenses={data.expenses}
                categories={data.categories}
              />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Category Breakdown</h2>
            </CardHeader>
            <CardContent>
              <CategoryBreakdown
                categories={data.categories}
                expenses={data.expenses}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      
      {showAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h2 className="text-lg font-semibold">Add New Expense</h2>
            </CardHeader>
            <CardContent>
              <AddExpenseForm
                categories={data.categories}
                onClose={() => setShowAddExpense(false)}
              />
            </CardContent>
          </Card>
        </div>
      )}
      
      {showAddIncome && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h2 className="text-lg font-semibold">Add New Income</h2>
            </CardHeader>
            <CardContent>
              <AddIncomeForm
                onClose={() => setShowAddIncome(false)}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;