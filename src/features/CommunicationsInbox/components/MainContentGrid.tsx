'use client';

import React from 'react';
import { useContactDetails } from '../hooks/useContactDetails';
import { sendContactResponse, handleApiError, getErrorMessage } from '@/lib/communications-api';
import { MessageList } from './MessageList';
import { MessageDetails } from './MessageDetails';
import { ResponseComposer } from './ResponseComposer';
import { CommunicationTimeline } from './CommunicationTimeline';
import { ContactSubmission, ContactStatus, ResponseType } from '../types';

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
  onSendResponse: (responseData: {
    response: string;
    responseType: ResponseType;
    adminNotes?: string;
  }) => Promise<void>;
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
  // Get detailed contact information
  const {
    contact,
    responses,
    isLoading: contactLoading,
    error: contactError,
    updateContactStatus
  } = useContactDetails(selectedMessage?.id || null);

  // Handle status updates
  const handleStatusUpdate = async (contactId: string, status: ContactStatus) => {
    try {
      await updateContactStatus(status);
    } catch (error) {
      console.error('Failed to update contact status:', error);
      // Error will be handled by the hook
    }
  };

  // Handle sending response
  const handleSendResponse = async (responseData: {
    response: string;
    responseType: ResponseType;
    adminNotes?: string;
  }) => {
    if (!selectedMessage?.id) return;

    try {
      await sendContactResponse(selectedMessage.id, responseData);
      // Success - the contact status will be updated to RESPONDED automatically
      // and the UI will reflect this through the hooks
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(getErrorMessage(apiError));
    }
  };

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
        <MessageDetails
          contact={contact || null}
          onStatusUpdate={handleStatusUpdate}
          isLoading={contactLoading}
          error={contactError}
        />

        <ResponseComposer
          contact={contact || null}
          responseText={responseText}
          onResponseTextChange={onResponseTextChange}
          onSendResponse={handleSendResponse}
          isSending={isSending}
        />

        <CommunicationTimeline message={selectedMessage} />
      </div>
    </div>
  );
};
