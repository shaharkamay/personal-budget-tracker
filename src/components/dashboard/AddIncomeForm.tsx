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
      newErrors.amount = 'אנא הזן סכום תקין';
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
        
        <Input
          label="תיאור"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="מקור ההכנסה"
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
      
      <div className="flex gap-2 justify-end mt-6">
        <Button type="button" variant="secondary" onClick={onClose}>
          ביטול
        </Button>
        <Button type="submit" variant="success">
          הוסף הכנסה
        </Button>
      </div>
    </form>
  );
};

export default AddIncomeForm;