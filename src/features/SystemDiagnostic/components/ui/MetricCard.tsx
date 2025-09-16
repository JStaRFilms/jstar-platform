'use client';

import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className = '',
  onClick
}) => {
  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→'
  };

  return (
    <div
      className={`p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors cursor-pointer ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {icon && <div className="text-gray-500 dark:text-gray-400">{icon}</div>}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900 dark:text-white">{value}</span>
            {trend && (
              <span className={`text-sm font-medium ${trendColors[trend]}`}>
                {trendIcons[trend]}
              </span>
            )}
          </div>
          {subtitle && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
