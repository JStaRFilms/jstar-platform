'use client';

import React from 'react';
import { EnvelopeIcon } from '@/components/icons';

/**
 * Props for the MessageDetails component
 */
interface MessageDetailsProps {
  /** The selected message to display */
  message: Message | null;
}

/**
 * Message interface for type safety
 */
interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  service: string;
  status: 'unread' | 'read' | 'responded' | 'archived';
  submittedAt: string;
  phone?: string;
  location?: string;
  ipAddress?: string;
}

/**
 * MessageDetails Component
 * Displays detailed information about a selected message
 */
export const MessageDetails: React.FC<MessageDetailsProps> = ({ message }) => {
  if (!message) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center h-64">
        <div className="text-center">
          <EnvelopeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Select a message to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-5">
        Message Details
      </h2>

      <div className="space-y-4 sm:space-y-5">
        {/* Contact Information */}
        <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="font-medium text-gray-900 dark:text-white mb-3">
            Contact Information
          </div>
          <div className="space-y-2">
            {[
              { label: 'Name', value: message.name },
              { label: 'Email', value: message.email },
              { label: 'Phone', value: message.phone },
              { label: 'Location', value: message.location },
              { label: 'Submitted', value: message.submittedAt },
              { label: 'Status', value: message.status.charAt(0).toUpperCase() + message.status.slice(1) }
            ].map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 bg-white dark:bg-gray-800 rounded">
                <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {item.label}
                </div>
                <span className="text-sm break-all sm:text-right">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Message Content */}
        <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="font-medium text-gray-900 dark:text-white mb-3">
            Message Content
          </div>
          <div className="space-y-3">
            <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Subject</div>
              <div className="text-sm break-words">{message.subject}</div>
            </div>
            <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Message</div>
              <div className="text-sm whitespace-pre-wrap break-words">{message.message}</div>
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            <strong>Insight:</strong> Nigerian contacts often prefer phone communication.
            Consider adding a phone call option to your response template.
          </p>
        </div>
      </div>
    </div>
  );
};
