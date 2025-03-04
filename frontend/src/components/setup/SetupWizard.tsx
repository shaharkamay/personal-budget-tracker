import React, { useState } from 'react';
import { Category } from '../../types';
import { completeSetup } from '../../utils/storage';
import WelcomeStep from './WelcomeStep';
import CategoriesStep from './CategoriesStep';
import ImportDataStep from './ImportDataStep';
import Button from '../ui/Button';
import { Card, CardContent, CardFooter } from '../ui/Card';

interface SetupWizardProps {
  onComplete: () => void;
}

const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);

  const steps = [
    { title: 'ברוך הבא', component: <WelcomeStep /> },
    { title: 'קטגוריות', component: <CategoriesStep onCategoriesChange={setCategories} /> },
    { title: 'ייבוא נתונים', component: <ImportDataStep categories={categories} /> },
  ];
  
  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Complete setup
      completeSetup(categories);
      onComplete();
    }
  };
  
  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  
  const handleSkip = () => {
    completeSetup();
    onComplete();
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-3xl">
        <CardContent className="p-6">
          <div className="flex flex-col gap-2 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{steps[step].title}</h2>
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full ${
                    index <= step ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="py-4">{steps[step].component}</div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t border-gray-200 p-6">
          <div>
            {step > 0 ? (
              <Button variant="secondary" onClick={handleBack}>
                חזרה
              </Button>
            ) : (
              <Button variant="outline" onClick={handleSkip}>
                דלג על ההגדרות
              </Button>
            )}
          </div>
          
          <Button onClick={handleNext}>
            {step < steps.length - 1 ? 'הבא' : 'סיים הגדרות'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SetupWizard;