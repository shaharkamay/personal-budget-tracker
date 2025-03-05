import React, { useState } from 'react';
import { Category, Expense } from '../../types';
import { updateExpense } from '../../utils/storage';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface EditExpenseFormProps {
  expense: Expense;
  categories: Category[];
  onClose: () => void;
}

const EditExpenseForm: React.FC<EditExpenseFormProps> = ({ expense, categories, onClose }) => {
  const [amount, setAmount] = useState(expense.amount.toString());
  const [categoryId, setCategoryId] = useState(expense.categoryId);
  const [description, setDescription] = useState(expense.description);
  const [date, setDate] = useState(expense.date);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'אנא הזן סכום תקין';
    }
    
    if (!categoryId) {
      newErrors.categoryId = 'אנא בחר קטגוריה';
    }
    
    if (!date) {
      newErrors.date = 'אנא בחר תאריך';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    updateExpense({
      id: expense.id,
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
          label="סכום"
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
          label="קטגוריה"
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
          label="תיאור"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="למה שימשה ההוצאה?"
          fullWidth
        />
        
        <Input
          label="תאריך"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
          fullWidth
        />
      </div>
      
      <div className="flex justify-end space-x-2 mt-6">
        <Button type="submit">
          עדכן הוצאה
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          ביטול
        </Button>
      </div>
    </form>
  );
};

export default EditExpenseForm;