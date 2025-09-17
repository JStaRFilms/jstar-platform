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
      title: 'New user registered',
      description: 'Tier 2 subscription',
      timeAgo: '5 minutes ago',
      priority: 'Critical',
      priorityColor: 'bg-red-100 dark:bg-red-900/30 text-admin-red',
      icon: (
        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      ),
      iconBg: 'bg-gradient-to-r from-admin-red to-red-500'
    },
    {
      id: 2,
      title: 'New product created',
      description: 'YouTube Virality Guide v2.1',
      timeAgo: '32 minutes ago',
      priority: 'High',
      priorityColor: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
      icon: (
        <svg className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
      ),
      iconBg: 'bg-gray-200 dark:bg-gray-700'
    },
    {
      id: 3,
      title: 'System backup completed',
      description: 'Database & Vault',
      timeAgo: '1 hour ago',
      priority: 'Normal',
      priorityColor: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      icon: (
        <svg className="h-4 w-4 text-yellow-700 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      iconBg: 'bg-yellow-200 dark:bg-yellow-900/30'
    },
    {
      id: 4,
      title: 'Storage warning',
      description: 'Vault approaching limit',
      timeAgo: '2 hours ago',
      priority: 'Warning',
      priorityColor: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      icon: (
        <svg className="h-4 w-4 text-yellow-700 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      iconBg: 'bg-yellow-200 dark:bg-yellow-900/30'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
        <a href="#" className="text-admin-red hover:text-red-700 dark:hover:text-red-400 text-sm font-medium">View all</a>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-start">
              <div className={`w-8 h-8 rounded-full ${activity.iconBg} flex items-center justify-center mr-3`}>
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{activity.title}</span> - {activity.description}
                </p>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{activity.timeAgo}</span>
                  <span className={`text-xs ${activity.priorityColor} px-2 py-1 rounded`}>{activity.priority}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
