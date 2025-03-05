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
      
      alert(`ייבוא מוצלח של ${expenses.length} הוצאות ו-${newCategories.length} קטגוריות חדשות.`);
    } catch (error) {
      console.error('Error importing expenses:', error);
      alert('נכשל בייבוא הוצאות. אנא בדוק את פורמט ה-CSV.');
    }
  };
  
  const handleImportIncomes = (data: any) => {
    try {
      const incomes = parseIncomesFromCSV(data.data);
      
      // Add incomes
      incomes.forEach(income => {
        addIncome(income);
      });
      
      alert(`ייבוא מוצלח של ${incomes.length} רשומות הכנסה.`);
    } catch (error) {
      console.error('Error importing incomes:', error);
      alert('נכשל בייבוא הכנסות. אנא בדוק את פורמט ה-CSV.');
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-md font-medium mb-2">ייצוא נתונים</h3>
        <p className="text-sm text-gray-500 mb-4">
          ייצא את נתוני התקציב שלך לקבצי CSV לגיבוי או ניתוח ביישומים אחרים.
        </p>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportIncomes} className="mr-2">
            <Download size={16} className="ml-1" /> ייצוא הכנסות
          </Button>
          
          <Button variant="outline" onClick={handleExportExpenses}>
            <Download size={16} className="ml-1" /> ייצוא הוצאות
          </Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-md font-medium mb-2">ייבוא נתונים</h3>
        <p className="text-sm text-gray-500 mb-4">
          ייבא נתונים מקבצי CSV. פעולה זו תוסיף לנתונים הקיימים שלך, ולא תחליף אותם.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-700 mb-2">ייבוא הוצאות</h4>
              <p className="text-xs text-gray-500 mb-4">
                פורמט CSV: תאריך, סכום, קטגוריה, תיאור
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
                    <Upload size={16} className="ml-1" />
                    בחר קובץ CSV של הוצאות
                  </Button>
                )}
              </CSVReader>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium text-gray-700 mb-2">ייבוא הכנסות</h4>
              <p className="text-xs text-gray-500 mb-4">
                פורמט CSV: תאריך, סכום, תיאור
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
                    <Upload size={16} className="ml-1" />
                    בחר קובץ CSV של הכנסות
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