'use client';

import React from 'react';

interface StatusIndicatorProps {
  status: 'active' | 'warning' | 'critical' | 'idle' | 'running' | 'passed' | 'failed';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const statusClasses = {
    active: 'bg-green-500',
    warning: 'bg-yellow-500',
    critical: 'bg-red-500',
    idle: 'bg-gray-400',
    running: 'bg-blue-500',
    passed: 'bg-green-500',
    failed: 'bg-red-500'
  };

  return (
    <div
      className={`${sizeClasses[size]} ${statusClasses[status]} rounded-full ${className}`}
      aria-label={`Status: ${status}`}
    />
  );
};

export default StatusIndicator;
