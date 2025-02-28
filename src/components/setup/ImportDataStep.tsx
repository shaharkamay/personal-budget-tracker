import React, { useState } from 'react';
import { useCSVReader } from 'react-papaparse';
import { Category } from '../../types';
import { parseExpensesFromCSV, parseIncomesFromCSV } from '../../utils/csv';
import { addExpense, addIncome, addCategory } from '../../utils/storage';
import Button from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { FileUp, Check, AlertCircle } from 'lucide-react';

interface ImportDataStepProps {
  categories: Category[];
}

const ImportDataStep: React.FC<ImportDataStepProps> = ({ categories }) => {
  const { CSVReader } = useCSVReader();
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');
  
  const handleExpensesImport = (data: any) => {
    try {
      const { expenses, newCategories } = parseExpensesFromCSV(data, categories);
      
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
      
      setImportStatus('success');
      setImportMessage(`Successfully imported ${expenses.length} expenses and ${newCategories.length} new categories.`);
    } catch (error) {
      console.error('Error importing expenses:', error);
      setImportStatus('error');
      setImportMessage('Failed to import expenses. Please check your CSV format.');
    }
  };
  
  const handleIncomesImport = (data: any) => {
    try {
      const incomes = parseIncomesFromCSV(data);
      
      // Add incomes
      incomes.forEach(income => {
        addIncome(income);
      });
      
      setImportStatus('success');
      setImportMessage(`Successfully imported ${incomes.length} income entries.`);
    } catch (error) {
      console.error('Error importing incomes:', error);
      setImportStatus('error');
      setImportMessage('Failed to import incomes. Please check your CSV format.');
    }
  };
  
  return (
    <div>
      <p className="text-gray-600 mb-6">
        Optionally, you can import your existing expense and income data from CSV files.
        This step is optional - you can always import data later.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-700 mb-2">Import Expenses</h4>
            <p className="text-sm text-gray-500 mb-4">
              CSV format: Date, Amount, Category, Description
            </p>
            
            <CSVReader
              onUploadAccepted={(results: any) => {
                handleExpensesImport(results.data);
              }}
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
                  <FileUp size={16} className="mr-2" />
                  Choose Expenses CSV
                </Button>
              )}
            </CSVReader>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-700 mb-2">Import Income</h4>
            <p className="text-sm text-gray-500 mb-4">
              CSV format: Date, Amount, Description
            </p>
            
            <CSVReader
              onUploadAccepted={(results: any) => {
                handleIncomesImport(results.data);
              }}
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
                  <FileUp size={16} className="mr-2" />
                  Choose Income CSV
                </Button>
              )}
            </CSVReader>
          </CardContent>
        </Card>
      </div>
      
      {importStatus !== 'idle' && (
        <div
          className={`p-4 rounded-md mb-6 ${
            importStatus === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          <div className="flex items-center">
            {importStatus === 'success' ? (
              <Check size={20} className="mr-2" />
            ) : (
              <AlertCircle size={20} className="mr-2" />
            )}
            <p>{importMessage}</p>
          </div>
        </div>
      )}
      
      <p className="text-sm text-gray-500">
        Tip: You can skip this step and manually add your expenses and income later.
      </p>
    </div>
  );
};

export default ImportDataStep;