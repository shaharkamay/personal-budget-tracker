import React from 'react';
import { useCSVReader } from 'react-papaparse';
import { getBudgetData } from '../../utils/storage';
import {
  prepareExpensesForExport,
  prepareIncomesForExport,
  downloadCSV,
  parseExpensesFromCSV,
  parseIncomesFromCSV,
} from '../../utils/csv';
import { addExpense, addIncome, addCategory } from '../../utils/storage';
import Button from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Download, Upload } from 'lucide-react';

const DataSettings: React.FC = () => {
  const { CSVReader } = useCSVReader();
  
  const handleExportExpenses = () => {
    const data = getBudgetData();
    const csvContent = prepareExpensesForExport(data.expenses, data.categories);
    downloadCSV(csvContent, 'budget-tracker-expenses.csv');
  };
  
  const handleExportIncomes = () => {
    const data = getBudgetData();
    const csvContent = prepareIncomesForExport(data.incomes);
    downloadCSV(csvContent, 'budget-tracker-incomes.csv');
  };
  
  const handleImportExpenses = (data: any) => {
    try {
      const budgetData = getBudgetData();
      const { expenses, newCategories } = parseExpensesFromCSV(data.data, budgetData.categories);
      
      // First add any new categories
      const addedCategories = newCategories.map(category => addCategory(category));
      
      // Then add expenses with the correct category IDs
      expenses.forEach(expense => {
        // If the category was a new one, find its real ID
        if (expense.categoryId.startsWith('new_')) {
          const index = parseInt(expense.categoryId.split('_')[1]) - 1;
          if (index >= 0 && index < addedCategories.length) {
            expense.categoryId = addedCategories[index].id;
          }
        }
        
        addExpense(expense);
      });
      
      alert(`Successfully imported ${expenses.length} expenses and ${newCategories.length} new categories.`);
    } catch (error) {
      console.error('Error importing expenses:', error);
      alert('Failed to import expenses. Please check your CSV format.');
    }
  };
  
  const handleImportIncomes = (data: any) => {
    try {
      const incomes = parseIncomesFromCSV(data.data);
      
      // Add incomes
      incomes.forEach(income => {
        addIncome(income);
      });
      
      alert(`Successfully imported ${incomes.length} income entries.`);
    } catch (error) {
      console.error('Error importing incomes:', error);
      alert('Failed to import incomes. Please check your CSV format.');
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-md font-medium mb-2">Export Data</h3>
        <p className="text-sm text-gray-500 mb-4">
          Export your budget data to CSV files for backup or analysis in other applications.
        </p>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportExpenses}>
            <Download size={16} className="mr-1" /> Export Expenses
          </Button>
          
          <Button variant="outline" onClick={handleExportIncomes}>
            <Download size={16} className="mr-1" /> Export Income
          </Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-md font-medium mb-2">Import Data</h3>
        <p className="text-sm text-gray-500 mb-4">
          Import data from CSV files. This will add to your existing data, not replace it.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-700 mb-2">Import Expenses</h4>
              <p className="text-xs text-gray-500 mb-4">
                CSV format: Date, Amount, Category, Description
              </p>
              
              <CSVReader
                onUploadAccepted={handleImportExpenses}
                config={{
                  header: true,
                  skipEmptyLines: true,
                }}
              >
                {({ getRootProps }: any) => (
                  <Button
                    variant="outline"
                    fullWidth
                    {...getRootProps()}
                  >
                    <Upload size={16} className="mr-1" />
                    Choose Expenses CSV
                  </Button>
                )}
              </CSVReader>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-700 mb-2">Import Income</h4>
              <p className="text-xs text-gray-500 mb-4">
                CSV format: Date, Amount, Description
              </p>
              
              <CSVReader
                onUploadAccepted={handleImportIncomes}
                config={{
                  header: true,
                  skipEmptyLines: true,
                }}
              >
                {({ getRootProps }: any) => (
                  <Button
                    variant="outline"
                    fullWidth
                    {...getRootProps()}
                  >
                    <Upload size={16} className="mr-1" />
                    Choose Income CSV
                  </Button>
                )}
              </CSVReader>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataSettings;