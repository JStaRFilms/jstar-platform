'use client';

import React from 'react';

/**
 * Props for DynamicVariables component
 */
interface DynamicVariablesProps {
  /** Callback when a variable is clicked */
  onVariableClick: (variable: string) => void;
}

/**
 * DynamicVariables Component
 * Provides categorized variable badges for template personalization
 */
const DynamicVariables: React.FC<DynamicVariablesProps> = ({ onVariableClick }) => {
  const variableCategories = [
    {
      title: 'User Variables',
      variables: [
        { name: 'first_name', display: 'first_name' },
        { name: 'last_name', display: 'last_name' },
        { name: 'email', display: 'email' },
        { name: 'user_tier', display: 'user_tier' },
        { name: 'join_date', display: 'join_date' }
      ]
    },
    {
      title: 'Purchase Variables',
      variables: [
        { name: 'product_name', display: 'product_name' },
        { name: 'purchase_date', display: 'purchase_date' },
        { name: 'order_id', display: 'order_id' },
        { name: 'amount', display: 'amount' },
        { name: 'download_link', display: 'download_link' }
      ]
    },
    {
      title: 'Course Variables',
      variables: [
        { name: 'course_name', display: 'course_name' },
        { name: 'course_url', display: 'course_url' },
        { name: 'completion_percent', display: 'completion_percent' },
        { name: 'next_lesson', display: 'next_lesson' }
      ]
    },
    {
      title: 'System Variables',
      variables: [
        { name: 'current_date', display: 'current_date' },
        { name: 'platform_name', display: 'platform_name' },
        { name: 'support_email', display: 'support_email' },
        { name: 'unsubscribe_link', display: 'unsubscribe_link' }
      ]
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Dynamic Variables</h2>
      <div className="space-y-4">
        {variableCategories.map((category) => (
          <div key={category.title} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="font-medium text-gray-900 dark:text-white mb-2">{category.title}</div>
            <div className="flex flex-wrap">
              {category.variables.map((variable) => (
                <span
                  key={variable.name}
                  className="variable-badge"
                  onClick={() => onVariableClick(`{{${variable.name}}}`)}
                >
                  {variable.display}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicVariables;
