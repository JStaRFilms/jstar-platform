'use client';

import React from 'react';

/**
 * TemplateSelection Component
 * Displays available email/SMS templates with status indicators and creation options
 */
const TemplateSelection: React.FC = () => {
  const templates = [
    {
      id: 'welcome-email',
      name: 'Welcome Email',
      description: 'New user onboarding',
      status: 'active',
      variables: 12,
      deliveryRate: 98
    },
    {
      id: 'purchase-confirmation',
      name: 'Purchase Confirmation',
      description: 'Product/service purchase',
      status: 'active',
      variables: 15,
      deliveryRate: 99
    },
    {
      id: 'lead-magnet-delivery',
      name: 'Lead Magnet Delivery',
      description: 'Free resource delivery',
      status: 'active',
      variables: 8,
      deliveryRate: 95
    },
    {
      id: 'course-reminder',
      name: 'Course Reminder',
      description: 'Course enrollment reminder',
      status: 'active',
      variables: 10,
      deliveryRate: 92
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Template Selection</h2>
      <div className="space-y-3">
        {templates.map((template) => (
          <div key={template.id} className="template-item p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{template.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{template.description}</div>
              </div>
              <span className="template-badge template-active">Active</span>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {template.variables} variables • {template.deliveryRate}% delivery rate
            </div>
          </div>
        ))}
        <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 font-medium">
          Create New Template
        </button>
      </div>
    </div>
  );
};

export default TemplateSelection;
