import React, { useState, useEffect } from 'react';
import { Category } from '../../types';
import { getBudgetData } from '../../utils/storage';
import { getRandomColor } from '../../utils/calculations';
import { v4 as uuidv4 } from 'uuid';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { X, Plus } from 'lucide-react';

interface CategoriesStepProps {
  onCategoriesChange: (categories: Category[]) => void;
}

const CategoriesStep: React.FC<CategoriesStepProps> = ({ onCategoriesChange }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryLimit, setNewCategoryLimit] = useState('');
  
  useEffect(() => {
    // Load default categories from storage
    const data = getBudgetData();
    setCategories(data.categories);
  }, []);
  
  useEffect(() => {
    // Notify parent component when categories change
    onCategoriesChange(categories);
  }, [categories, onCategoriesChange]);
  
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const limit = parseFloat(newCategoryLimit) || 0;
    
    const newCategory: Category = {
      id: uuidv4(),
      name: newCategoryName.trim(),
      color: getRandomColor(),
      budgetLimit: limit,
    };
    
    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    setNewCategoryLimit('');
  };
  
  const handleRemoveCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
  };
  
  const handleUpdateLimit = (id: string, limitStr: string) => {
    const limit = parseFloat(limitStr) || 0;
    
    setCategories(
      categories.map(category =>
        category.id === id ? { ...category, budgetLimit: limit } : category
      )
    );
  };
  
  return (
    <div>
      <p className="text-gray-600 mb-4">
        Define your expense categories and set monthly budget limits for each one.
        You can add, edit, or remove categories later.
      </p>
      
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">Your Categories</h4>
        
        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
          {categories.map(category => (
            <div
              key={category.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: category.color }}
                />
                <span>{category.name}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-32">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={category.budgetLimit.toString()}
                    onChange={(e) => handleUpdateLimit(category.id, e.target.value)}
                    className="py-1 px-2 h-8 text-sm"
                    placeholder="Budget limit"
                  />
                </div>
                
                <button
                  onClick={() => handleRemoveCategory(category.id)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ))}
          
          {categories.length === 0 && (
            <p className="text-gray-500 text-sm italic">No categories defined yet.</p>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category name"
            className="flex-1"
          />
          
          <Input
            type="number"
            min="0"
            step="0.01"
            value={newCategoryLimit}
            onChange={(e) => setNewCategoryLimit(e.target.value)}
            placeholder="Budget limit (optional)"
            className="w-32"
          />
          
          <Button
            onClick={handleAddCategory}
            disabled={!newCategoryName.trim()}
            className="whitespace-nowrap"
          >
            <Plus size={16} className="mr-1" /> Add
          </Button>
        </div>
      </div>
      
      <p className="text-sm text-gray-500">
        Tip: You can always modify these categories later from the settings page.
      </p>
    </div>
  );
};

export default CategoriesStep;