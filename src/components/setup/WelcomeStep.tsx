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
      
      <h3 className="text-xl font-semibold mb-4">Welcome to Your Personal Budget Tracker</h3>
      
      <p className="text-gray-600 mb-6">
        This wizard will help you set up your budget tracking system. You'll be able to:
      </p>
      
      <ul className="text-left text-gray-600 space-y-2 mb-6 max-w-md mx-auto">
        <li className="flex items-start">
          <span className="mr-2 text-blue-500">✓</span>
          <span>Define custom expense categories</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 text-blue-500">✓</span>
          <span>Set monthly budget limits for each category</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 text-blue-500">✓</span>
          <span>Import existing expense data (optional)</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 text-blue-500">✓</span>
          <span>Track and visualize your spending habits</span>
        </li>
      </ul>
      
      <p className="text-gray-600">
        Let's get started by setting up your expense categories!
      </p>
    </div>
  );
};

export default WelcomeStep;