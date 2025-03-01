import React from 'react';
import { Wallet } from 'lucide-react';

const WelcomeStep: React.FC = () => {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-blue-100 rounded-full">
          <Wallet size={48} className="text-blue-600" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-4">ברוכים הבאים למעקב התקציב האישי שלך</h3>
      
      <p className="text-gray-600 mb-6">
        מדריך זה יעזור לך להגדיר את מערכת מעקב התקציב שלך. תוכל:
      </p>
      
      <ul className="text-right text-gray-600 space-y-2 mb-6 max-w-md mx-auto">
        <li className="flex items-start">
          <span className="ml-2 text-blue-500">✓</span>
          <span>להגדיר קטגוריות הוצאה מותאמות אישית</span>
        </li>
        <li className="flex items-start">
          <span className="ml-2 text-blue-500">✓</span>
          <span>לקבוע מגבלות תקציב חודשיות לכל קטגוריה</span>
        </li>
        <li className="flex items-start">
          <span className="ml-2 text-blue-500">✓</span>
          <span>לייבא נתוני הוצאות קיימים (אופציונלי)</span>
        </li>
        <li className="flex items-start">
          <span className="ml-2 text-blue-500">✓</span>
          <span>לעקוב ולהציג את הרגלי ההוצאות שלך</span>
        </li>
      </ul>
      
      <p className="text-gray-600">
        בואו נתחיל בהגדרת קטגוריות ההוצאות שלך!
      </p>
    </div>
  );
};

export default WelcomeStep;