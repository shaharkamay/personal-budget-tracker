import React, { useState } from 'react';
import { Category } from '../../types';
import { addCategory, updateCategory, deleteCategory } from '../../utils/storage';
import { getRandomColor } from '../../utils/calculations';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Plus, Trash2, Edit } from 'lucide-react';

interface CategorySettingsProps {
  categories: Category[];
}

const CategorySettings: React.FC<CategorySettingsProps> = ({ categories: initialCategories }) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryLimit, setNewCategoryLimit] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const limit = parseFloat(newCategoryLimit) || 0;
    
    const newCategory = addCategory({
      name: newCategoryName.trim(),
      color: getRandomColor(),
      budgetLimit: limit,
    });
    
    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    setNewCategoryLimit('');
  };
  
  const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategory.name.trim()) return;
    
    updateCategory(editingCategory);
    
    setCategories(
      categories.map(cat =>
        cat.id === editingCategory.id ? editingCategory : cat
      )
    );
    
    setEditingCategory(null);
  };
  
  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? All associated expenses will also be deleted.')) {
      deleteCategory(id);
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">Add New Category</h3>
        <div className="flex space-x-2">
          <Input
            placeholder="Category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="flex-1"
          />
          
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="Budget limit (optional)"
            value={newCategoryLimit}
            onChange={(e) => setNewCategoryLimit(e.target.value)}
            className="w-40"
          />
          
          <Button
            onClick={handleAddCategory}
            disabled={!newCategoryName.trim()}
          >
            <Plus size={16} className="mr-1" /> Add
          </Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-md font-medium mb-2">Existing Categories</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {categories.map(category => (
            <div
              key={category.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              {editingCategory && editingCategory.id === category.id ? (
                <div className="flex-1 flex space-x-2">
                  <Input
                    value={editingCategory.name}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        name: e.target.value,
                      })
                    }
                    className="flex-1"
                  />
                  
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingCategory.budgetLimit.toString()}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        budgetLimit: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-32"
                    placeholder="Budget limit"
                  />
                  
                  <Button onClick={handleUpdateCategory}>Save</Button>
                  <Button
                    variant="secondary"
                    onClick={() => setEditingCategory(null)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {category.budgetLimit > 0
                        ? `Budget: $${category.budgetLimit.toFixed(2)}`
                        : 'No budget limit'}
                    </span>
                    
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="text-gray-500 hover:text-blue-500"
                    >
                      <Edit size={16} />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          
          {categories.length === 0 && (
            <p className="text-gray-500 text-sm italic">No categories defined yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySettings;