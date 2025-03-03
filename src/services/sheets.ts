// src/services/publicSheetsService.ts
import { BudgetData, Category, Expense, Income } from '../types';
import { v4 as uuidv4 } from 'uuid';

const SPREADSHEET_ID = '1tNkd4NYs35awPlODfkoB8x5hDiXgQpw3n9WyCSEhG0U';
const API_KEY = 'AIzaSyAzi4J0EAQ12wvFsZgI-EtLIerS-N4Yxj8';

// Get data from a sheet
export const getSheetData = async (
  sheetName: string,
  range: string = "A:Z"
): Promise<any[][]> => {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}!${range}?key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(data);
    return data.values || [];
  } catch (error) {
    console.error(`Error fetching ${sheetName} data:`, error);
    throw error;
  }
};

// Get all data from the spreadsheet
export const getAllData = async (): Promise<BudgetData> => {
  try {
    // Get categories
    const categoriesValues = await getSheetData('Categories');
    
    // Skip the header row (first row)
    const categories: Category[] = categoriesValues.slice(1).map(row => ({
      id: row[0],
      name: row[1],
      color: row[2],
      budgetLimit: Number(row[3]),
    }));
    
    // Get expenses
    const expensesValues = await getSheetData('Expenses');
    
    const expenses: Expense[] = expensesValues.slice(1).map(row => ({
      id: row[0],
      amount: Number(row[1]),
      categoryId: row[2],
      description: row[3],
      date: row[4],
    }));
    
    // Get incomes
    const incomesValues = await getSheetData('Incomes');
    
    const incomes: Income[] = incomesValues.slice(1).map(row => ({
      id: row[0],
      amount: Number(row[1]),
      description: row[2],
      date: row[3],
    }));
    
    // Get config
    const configValues = await getSheetData('Config');
    
    const configMap = new Map<string, string>();
    configValues.slice(1).forEach(row => {
      configMap.set(row[0], row[1]);
    });
    
    return {
      categories,
      expenses,
      incomes,
      setupComplete: configMap.get('setupComplete') === 'true',
    };
  } catch (error) {
    console.error('Error fetching all data:', error);
    throw error;
  }
};

export const addCategory = async (category: Category): Promise<boolean> => {
    try {
      // Ensure the category has an ID
      if (!category.id) {
        category.id = uuidv4();
      }
      
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Categories!A:D:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS&key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: [[category.id, category.name, category.color, category.budgetLimit]],
          }),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error adding category:', error);
      return false;
    }
  };
  