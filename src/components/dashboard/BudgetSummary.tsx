import React from 'react';
import { MonthlyBudgetSummary } from '../../types';
import { formatCurrency } from '../../utils/calculations';
import { Card, CardContent } from '../ui/Card';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';

interface BudgetSummaryProps {
  summary: MonthlyBudgetSummary;
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({ summary }) => {
  const { totalBudget, totalSpent, remainingBudget, totalIncome, netSavings } = summary;
  
  const spentPercentage = totalBudget > 0 
    ? Math.min(Math.round((totalSpent / totalBudget) * 100), 100) 
    : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <SummaryCard
        title="Total Budget"
        value={formatCurrency(totalBudget)}
        icon={<Wallet className="text-blue-500" />}
        footer={`${spentPercentage}% used`}
        color="blue"
      />
      
      <SummaryCard
        title="Total Spent"
        value={formatCurrency(totalSpent)}
        icon={<TrendingDown className="text-red-500" />}
        footer={`${formatCurrency(remainingBudget)} remaining`}
        color="red"
      />
      
      <SummaryCard
        title="Total Income"
        value={formatCurrency(totalIncome)}
        icon={<TrendingUp className="text-green-500" />}
        footer="This month"
        color="green"
      />
      
      <SummaryCard
        title="Net Savings"
        value={formatCurrency(netSavings)}
        icon={<DollarSign className="text-purple-500" />}
        footer={netSavings >= 0 ? "You're saving!" : "You're overspending"}
        color={netSavings >= 0 ? "green" : "red"}
      />
    </div>
  );
};

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  footer: string;
  color: 'blue' | 'red' | 'green' | 'purple';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, footer, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-100',
    red: 'bg-red-50 border-red-100',
    green: 'bg-green-50 border-green-100',
    purple: 'bg-purple-50 border-purple-100',
  };
  
  return (
    <Card className={`border ${colorClasses[color]}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className="p-2 rounded-full bg-white shadow-sm">
            {icon}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4">{footer}</p>
      </CardContent>
    </Card>
  );
};

export default BudgetSummary;