'use client';

import React from 'react';
import { EnvelopeIcon } from '@/components/icons';
import { usePrecisionModeContext } from '../contexts/PrecisionModeContext';

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
  /** Whether data is loading */
  isLoading?: boolean;
  /** Error message if any */
  error?: string | null;
  /** Callback to refresh data */
  onRefresh?: () => void;
  /** Current page number */
  currentPage?: number;
  /** Total number of pages */
  totalPages?: number;
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
  /** Handler for toggling fullscreen */
  onToggleFullscreen?: (target: 'messageList' | 'messageDetails' | 'responseComposer') => void;
  /** Check if element is in fullscreen */
  isFullscreen?: (target: 'messageList' | 'messageDetails' | 'responseComposer') => boolean;
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
  onFilterChange,
  isLoading = false,
  error = null,
  onRefresh,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onToggleFullscreen,
  isFullscreen
}) => {
  const filterOptions = ['all', 'unread', 'today', 'week'] as const;
  const { precisionState, togglePrecisionMode } = usePrecisionModeContext();

  // Handle pagination
  const handlePrevious = () => {
    if (onPageChange && currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (onPageChange && currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 touch-manipulation">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Messages</h2>
          {precisionState.isActive && (
            <div className="precision-badge bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
              <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Precision Mode
            </div>
          )}
        </div>

        {/* Filter Buttons and Controls - Responsive */}
        <div className="flex flex-wrap items-center gap-2">
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

          {/* Precision Mode Toggle */}
          <button
            onClick={togglePrecisionMode}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              precisionState.isActive
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            title={precisionState.isActive ? 'Exit Precision Mode (Ctrl+P)' : 'Enter Precision Mode (Ctrl+P)'}
          >
            <svg className="h-4 w-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Precision
          </button>

          {/* Fullscreen Toggle Button */}
          <button
            onClick={() => onToggleFullscreen?.('messageList')}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={isFullscreen?.('messageList') ? 'Exit Fullscreen (Escape)' : 'Enter Fullscreen'}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isFullscreen?.('messageList') ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M15 15h4.5M15 15v4.5M15 15l5.5 5.5" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              )}
            </svg>
          </button>

          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              title="Refresh messages"
            >
              <svg className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-600 animate-pulse">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      )}

      {/* Messages List - Responsive */}
      <div className="space-y-3 max-h-[38rem] overflow-y-auto">
        {!isLoading && !error && messages.length === 0 ? (
          <div className="text-center py-8">
            <EnvelopeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No messages found</p>
          </div>
        ) : !isLoading && !error && (
          messages.map((message) => (
            <div
              key={message.id}
              onClick={() => onMessageSelect(message)}
              className={`message-item p-3 sm:p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                selectedMessageId === message.id
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  : message.status === 'unread'
                  ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-700'
              } ${precisionState.isActive ? 'precision-mode' : ''}`}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-medium text-gray-900 dark:text-white truncate">
                      {message.name}
                    </div>
                    {precisionState.isActive && (
                      <div className="precision-badge bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs">
                        {precisionState.precisionLevel.toFixed(1)}%
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">
                    {message.subject}
                  </div>
                  <div className={`text-sm text-gray-500 dark:text-gray-400 mb-2 ${
                    precisionState.isActive ? 'line-clamp-none' : 'line-clamp-2'
                  }`}>
                    {precisionState.isActive && precisionState.detailTracking ? (
                      <span className="detail-tracker">
                        {message.message}
                      </span>
                    ) : (
                      message.message
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <div className={`w-2 h-2 rounded-full mr-2 flex-shrink-0 ${
                      message.status === 'unread' ? 'bg-red-500' :
                      message.status === 'responded' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="truncate">
                      {precisionState.isActive && precisionState.showTimestamps
                        ? `${message.submittedAt} • ${message.location}`
                        : `${message.submittedAt} • ${message.location}`
                      }
                    </span>
                    {precisionState.isActive && message.ipAddress && (
                      <span className="ml-2 text-xs text-blue-600 dark:text-blue-400 font-mono">
                        IP: {message.ipAddress}
                      </span>
                    )}
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

                  {precisionState.isActive && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Precise</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Precision Mode Progress Bar */}
              {precisionState.isActive && (
                <div className="mt-3">
                  <div className="message-bar">
                    <div
                      className={`message-fill ${
                        message.status === 'unread' ? 'message-unread' :
                        message.status === 'responded' ? 'message-read' : 'message-archived'
                      }`}
                      style={{ width: `${precisionState.precisionLevel}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination - Responsive */}
      {totalPages > 1 && (
        <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-3 order-1 sm:order-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage <= 1}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage <= 1
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-95'
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage >= totalPages}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage >= totalPages
                  ? 'bg-red-200 dark:bg-red-900/50 text-red-400 dark:text-red-600 cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-600 active:scale-95'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
