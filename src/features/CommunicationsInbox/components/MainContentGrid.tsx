'use client';

import React from 'react';
import { MessageList } from './MessageList';
import { MessageDetails } from './MessageDetails';
import { ResponseComposer } from './ResponseComposer';
import { CommunicationTimeline } from './CommunicationTimeline';

/**
 * Props for the MainContentGrid component
 */
interface MainContentGridProps {
  /** Array of messages to display */
  messages: any[];
  /** Currently selected message */
  selectedMessage: any;
  /** Current filter applied */
  currentFilter: 'all' | 'unread' | 'today' | 'week';
  /** Response text for composition */
  responseText: string;
  /** Whether response is being sent */
  isSending: boolean;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Error message if any */
  error?: string | null;
  /** Handler for message selection */
  onMessageSelect: (message: any) => void;
  /** Handler for filter changes */
  onFilterChange: (filter: 'all' | 'unread' | 'today' | 'week') => void;
  /** Handler for response text changes */
  onResponseTextChange: (text: string) => void;
  /** Handler for sending response */
  onSendResponse: () => void;
  /** Handler for refreshing data */
  onRefresh?: () => void;
  /** Optional className for styling */
  className?: string;
}

/**
 * MainContentGrid Component
 * Main layout container for the Communications Inbox content
 * Organizes the message list, details, composer, and timeline in a responsive grid
 */
export const MainContentGrid: React.FC<MainContentGridProps> = ({
  messages,
  selectedMessage,
  currentFilter,
  responseText,
  isSending,
  isLoading = false,
  error = null,
  onMessageSelect,
  onFilterChange,
  onResponseTextChange,
  onSendResponse,
  onRefresh,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 ${className}`}>
      {/* Messages List */}
      <div className="lg:col-span-2 space-y-4 sm:space-y-6">
        <MessageList
          messages={messages}
          selectedMessageId={selectedMessage?.id || null}
          onMessageSelect={onMessageSelect}
          currentFilter={currentFilter}
          onFilterChange={onFilterChange}
          isLoading={isLoading}
          error={error}
          onRefresh={onRefresh}
        />
      </div>

      {/* Message Details & Response */}
      <div className="space-y-4 sm:space-y-6">
        <MessageDetails message={selectedMessage} />

        <ResponseComposer
          message={selectedMessage}
          responseText={responseText}
          onResponseTextChange={onResponseTextChange}
          onSendResponse={onSendResponse}
          isSending={isSending}
        />

        <CommunicationTimeline message={selectedMessage} />
      </div>
    </div>
  );
};
