import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  showLabel?: boolean;
  height?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'blue',
  showLabel = true,
  height = 'h-2',
  className = '',
}) => {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);
  
  const getColorClass = () => {
    if (percentage > 90) return 'bg-red-500';
    if (percentage > 75) return 'bg-orange-500';
    if (percentage > 50) return 'bg-yellow-500';
    return `bg-${color}-500`;
  };
  
  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${getColorClass()} transition-all duration-300 ease-in-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs text-gray-500 text-right">
          {percentage.toFixed(0)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;