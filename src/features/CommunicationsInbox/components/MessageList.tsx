'use client';

import React from 'react';
import { EnvelopeIcon } from '@/components/icons';

/**
 * Props for the MessageList component
 */
interface MessageListProps {
  /** Array of messages to display */
  messages: Message[];
  /** Currently selected message ID */
  selectedMessageId: string | null;
  /** Callback when a message is selected */
  onMessageSelect: (message: Message) => void;
  /** Current filter applied to messages */
  currentFilter: 'all' | 'unread' | 'today' | 'week';
  /** Callback when filter changes */
  onFilterChange: (filter: 'all' | 'unread' | 'today' | 'week') => void;
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
 * MessageList Component
 * Displays a list of messages with filtering capabilities
 */
export const MessageList: React.FC<MessageListProps> = ({
  messages,
  selectedMessageId,
  onMessageSelect,
  currentFilter,
  onFilterChange
}) => {
  const filterOptions = ['all', 'unread', 'today', 'week'] as const;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Messages</h2>

        {/* Filter Buttons - Responsive */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => onFilterChange(filterOption)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                currentFilter === filterOption
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List - Responsive */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <EnvelopeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No messages found</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              onClick={() => onMessageSelect(message)}
              className={`p-3 sm:p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                selectedMessageId === message.id
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  : message.status === 'unread'
                  ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white mb-1 truncate">
                    {message.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">
                    {message.subject}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                    {message.message}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <div className={`w-2 h-2 rounded-full mr-2 flex-shrink-0 ${
                      message.status === 'unread' ? 'bg-red-500' :
                      message.status === 'responded' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="truncate">{message.submittedAt} • {message.location}</span>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 sm:ml-4 flex-shrink-0">
                  <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                    message.status === 'unread'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                      : message.status === 'responded'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}>
                    {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination - Responsive */}
      <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-3">
        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-colors order-2 sm:order-1">
          Previous
        </button>
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors order-1 sm:order-2">
          Next
        </button>
      </div>
    </div>
  );
};
