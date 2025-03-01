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
      const { expenses, newCategories } = parseExpensesFromCSV(data.data, categories);
      
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
      setImportMessage(`ייבוא מוצלח של ${expenses.length} הוצאות ו-${newCategories.length} קטגוריות חדשות.`);
    } catch (error) {
      console.error('Error importing expenses:', error);
      setImportStatus('error');
      setImportMessage('נכשל בייבוא הוצאות. אנא בדוק את פורמט ה-CSV.');
    }
  };
  
  const handleIncomesImport = (data: any) => {
    try {
      const incomes = parseIncomesFromCSV(data.data);
      
      // Add incomes
      incomes.forEach(income => {
        addIncome(income);
      });
      
      setImportStatus('success');
      setImportMessage(`ייבוא מוצלח של ${incomes.length} רשומות הכנסה.`);
    } catch (error) {
      console.error('Error importing incomes:', error);
      setImportStatus('error');
      setImportMessage('נכשל בייבוא הכנסות. אנא בדוק את פורמט ה-CSV.');
    }
  };
  
  return (
    <div>
      <p className="text-gray-600 mb-6">
        באופן אופציונלי, תוכל לייבא את נתוני ההוצאות וההכנסות הקיימים שלך מקבצי CSV.
        שלב זה הוא אופציונלי - תמיד תוכל לייבא נתונים מאוחר יותר.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-700 mb-2">ייבוא הוצאות</h4>
            <p className="text-xs text-gray-500 mb-4">
              פורמט CSV: תאריך, סכום, קטגוריה, תיאור
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
                  <FileUp size={16} className="ml-2" />
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
                  <FileUp size={16} className="ml-2" />
                  בחר קובץ CSV של הכנסות
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
              <Check size={20} className="ml-2" />
            ) : (
              <AlertCircle size={20} className="ml-2" />
            )}
            <p>{importMessage}</p>
          </div>
        </div>
      )}
      
      <p className="text-sm text-gray-500">
        טיפ: תוכל לדלג על שלב זה ולהוסיף את ההוצאות וההכנסות שלך באופן ידני מאוחר יותר.
      </p>
    </div>
  );
};

export default ImportDataStep;