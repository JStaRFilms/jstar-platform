'use client';

import React from 'react';

interface RecommendationCardProps {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionLabel: string;
  onAction?: () => void;
  className?: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  title,
  description,
  priority,
  actionLabel,
  onAction,
  className = ''
}) => {
  const priorityConfig = {
    high: {
      borderColor: 'border-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      hoverBgColor: 'hover:bg-red-100 dark:hover:bg-red-900/30',
      textColor: 'text-red-800 dark:text-red-200',
      buttonColor: 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300'
    },
    medium: {
      borderColor: 'border-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      hoverBgColor: 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30',
      textColor: 'text-yellow-800 dark:text-yellow-200',
      buttonColor: 'text-yellow-700 dark:text-yellow-300 hover:text-yellow-800 dark:hover:text-yellow-200'
    },
    low: {
      borderColor: 'border-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      hoverBgColor: 'hover:bg-green-100 dark:hover:bg-green-900/30',
      textColor: 'text-green-800 dark:text-green-200',
      buttonColor: 'text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200'
    }
  };

  const config = priorityConfig[priority];

  return (
    <div className={`p-4 border-l-4 rounded-r-lg transition-colors ${config.borderColor} ${config.bgColor} ${config.hoverBgColor} ${className}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className={`font-medium text-gray-900 dark:text-white mb-1`}>{title}</h3>
          <p className={`text-sm ${config.textColor} mb-2`}>{description}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ml-2 flex-shrink-0 ${
          priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
          priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
          'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
        }`}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>
      </div>
      <div className="mt-2">
        <button
          onClick={onAction}
          className={`text-sm font-medium ${config.buttonColor} transition-colors`}
          aria-label={`Action: ${actionLabel}`}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
};

export default RecommendationCard;
