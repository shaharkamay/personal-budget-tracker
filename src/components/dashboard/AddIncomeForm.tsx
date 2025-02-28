import React, { useState } from 'react';
import { addIncome } from '../../utils/storage';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface AddIncomeFormProps {
  onClose: () => void;
}

const AddIncomeForm: React.FC<AddIncomeFormProps> = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
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
    
    addIncome({
      amount: parseFloat(amount),
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
        
        <Input
          label="Description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Source of income"
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
        <Button type="submit" variant="success">
          Add Income
        </Button>
      </div>
    </form>
  );
};

export default AddIncomeForm;