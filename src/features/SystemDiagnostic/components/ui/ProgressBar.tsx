'use client';

import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  color?: 'red' | 'green' | 'blue' | 'yellow' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  animated?: boolean;
  className?: string;
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'red',
  size = 'md',
  showValue = false,
  animated = true,
  className = '',
  label
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  const colorClasses = {
    red: 'bg-gradient-to-r from-red-600 to-red-500',
    green: 'bg-gradient-to-r from-green-600 to-green-500',
    blue: 'bg-gradient-to-r from-blue-600 to-blue-500',
    yellow: 'bg-gradient-to-r from-yellow-600 to-yellow-500',
    purple: 'bg-gradient-to-r from-purple-600 to-purple-500'
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
          {showValue && (
            <span className="text-sm font-medium text-gray-900 dark:text-white">{percentage.toFixed(1)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} rounded-full transition-all duration-500 ease-out ${animated ? 'transition-all' : ''}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label || `Progress: ${percentage.toFixed(1)}%`}
        />
      </div>
      {!label && showValue && (
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>0%</span>
          <span>{percentage.toFixed(1)}%</span>
          <span>100%</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
