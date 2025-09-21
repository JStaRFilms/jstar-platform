'use client';

import React from 'react';

/**
 * Props for the SystemStatus component
 */
interface SystemStatusProps {
  /** Optional className for styling */
  className?: string;
  /** Contact form status */
  contactFormActive?: boolean;
  /** Auto-responder status */
  autoResponderActive?: boolean;
  /** Last submission timestamp */
  lastSubmissionTime?: string;
}

/**
 * SystemStatus Component
 * Displays the current status of the communications system
 * Shows contact form status, auto-responder status, and last submission time
 */
export const SystemStatus: React.FC<SystemStatusProps> = ({
  className = '',
  contactFormActive = true,
  autoResponderActive = true,
  lastSubmissionTime = '15 min ago'
}) => {
  return (
    <section className={`mb-8 ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Communications System Status
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Current contact form and communication system status
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center">
              <span className={`status-indicator ${contactFormActive ? 'status-active' : 'status-critical'}`}></span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Contact Form {contactFormActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex items-center">
              <span className={`status-indicator ${autoResponderActive ? 'status-active' : 'status-critical'}`}></span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Auto-Responder {autoResponderActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="status-indicator status-active"></span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Submission: {lastSubmissionTime}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
