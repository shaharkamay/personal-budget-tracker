import { fetchApi } from "./api";

// src/services/sheets.ts
interface Category {
  name: string;
  color: string;
  budgetLimit: number;
}

interface Entry {
  date: string;
  category: string;
  amount: number;
  description: string;
  rowIndex?: number;
}

// Get sheet data for a specific month
export const getSheetData = async (month: string): Promise<Entry[]> => {
  try {
    const response = await fetchApi<Entry[]>(`entries?month=${encodeURIComponent(month)}`);
    
    if (!response.success || !response.data) {
      console.error('Error fetching sheet data:', response.error);
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error('Error in getSheetData:', error);
    return [];
  }
};

// Add a new entry
export const addEntry = async (entry: Omit<Entry, 'rowIndex'>): Promise<boolean> => {
  try {
    const response = await fetchApi<null>(`entries`, {method: 'POST', body: JSON.stringify(entry)});
    return response.success;
  } catch (error) {
    console.error('Error in addEntry:', error);
    return false;
  }
};

// Update an existing entry
export const updateEntry = async (entry: Entry): Promise<boolean> => {
  if (entry.rowIndex === undefined) {
    console.error('Cannot update entry without rowIndex');
    return false;
  }
  
  try {
    const response = await fetchApi<null>(`entries/${entry.rowIndex}`, {method: 'PUT', body: JSON.stringify(entry)});
    return response.success;
  } catch (error) {
    console.error('Error in updateEntry:', error);
    return false;
  }
};

// Delete an entry
export const deleteEntry = async (rowIndex: number): Promise<boolean> => {
  try {
    const response = await fetchApi<null>(`entries/${rowIndex}`, {method: 'DELETE'});
    return response.success;
  } catch (error) {
    console.error('Error in deleteEntry:', error);
    return false;
  }
};

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetchApi<Category[]>('categories');
    
    if (!response.success || !response.data) {
      console.error('Error fetching categories:', response.error);
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error('Error in getCategories:', error);
    return [];
  }
};

// Add a new category
export const addCategory = async (category: Category): Promise<boolean> => {
  try {
    const response = await fetchApi<null>('categories', {method: 'POST', body: JSON.stringify(category)});
    return response.success;
  } catch (error) {
    console.error('Error in addCategory:', error);
    return false;
  }
};

// Update a category
export const updateCategory = async (categoryId: string, category: Category): Promise<boolean> => {
  try {
    const response = await fetchApi<null>(`categories/${categoryId}`, {method: 'PUT', body: JSON.stringify(category)});
    return response.success;
  } catch (error) {
    console.error('Error in updateCategory:', error);
    return false;
  }
};

// Delete a category
export const deleteCategory = async (categoryId: string): Promise<boolean> => {
  try {
    const response = await fetchApi<null>(`categories/${categoryId}`, {method: 'DELETE'});
    return response.success;
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    return false;
  }
};