import React, { useState } from 'react';
import { Category } from '../../types';
import { addExpense } from '../../utils/storage';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { X } from 'lucide-react';

interface AddExpenseFormProps {
  categories: Category[];
  onClose: () => void;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ categories, onClose }) => {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!categoryId) {
      newErrors.categoryId = 'Please select a category';
    }
    
    if (!date) {
      newErrors.date = 'Please select a date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    addExpense({
      amount: parseFloat(amount),
      categoryId,
      description,
      date,
    });
    
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Input
          label="Amount"
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          error={errors.amount}
          fullWidth
        />
        
        <Select
          label="Category"
          options={categories.map(category => ({
            value: category.id,
            label: category.name,
          }))}
          value={categoryId}
          onChange={setCategoryId}
          error={errors.categoryId}
          fullWidth
        />
        
        <Input
          label="Description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What was this expense for?"
          fullWidth
        />
        
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
          fullWidth
        />
      </div>
      
      <div className="flex justify-end space-x-2 mt-6">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Add Expense
        </Button>
      </div>
    </form>
  );
};

export default AddExpenseForm;