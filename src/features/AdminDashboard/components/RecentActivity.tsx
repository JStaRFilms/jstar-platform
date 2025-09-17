'use client';

import React from 'react';

/**
 * Recent Activity Component
 * Displays recent administrative activities and system events
 */
export const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'slide_created',
      message: 'New hero slide "Creative Excellence" created',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      icon: '🎨',
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'slide_updated',
      message: 'Hero slide "Elevate Your Story" updated',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      icon: '✏️',
      color: 'text-green-500'
    },
    {
      id: 3,
      type: 'system_check',
      message: 'System health check completed successfully',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      icon: '✅',
      color: 'text-green-500'
    },
    {
      id: 4,
      type: 'api_call',
      message: 'Hero slides API accessed 12 times',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      icon: '🔗',
      color: 'text-purple-500'
    },
    {
      id: 5,
      type: 'user_login',
      message: 'Admin user logged in',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      icon: '👤',
      color: 'text-gray-500'
    }
  ];

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Latest administrative activities and system events
          </p>
        </div>
        <div className="text-2xl">📋</div>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${activity.color}`}>
              <span className="text-sm" role="img" aria-label={activity.type}>
                {activity.icon}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-white font-medium">
                {activity.message}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatTimeAgo(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors">
          View all activity →
        </button>
      </div>
    </div>
  );
};
