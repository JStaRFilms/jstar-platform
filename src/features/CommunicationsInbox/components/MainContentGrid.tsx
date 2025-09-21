'use client';

import React, { useState, useEffect } from 'react';
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
  /** Current page number */
  currentPage?: number;
  /** Total number of pages */
  totalPages?: number;
  /** Handler for message selection */
  onMessageSelect: (message: any) => void;
  /** Handler for filter changes */
  onFilterChange: (filter: 'all' | 'unread' | 'today' | 'week') => void;
  /** Handler for page changes */
  onPageChange?: (page: number) => void;
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
  currentPage = 1,
  totalPages = 1,
  onMessageSelect,
  onFilterChange,
  onPageChange,
  onResponseTextChange,
  onSendResponse,
  onRefresh,
  className = ''
}) => {
  // Mobile slide panel state
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle message selection for mobile
  const handleMobileMessageSelect = (message: any) => {
    onMessageSelect(message);
    if (isMobile) {
      setShowMobileDetails(true);
    }
  };

  // Handle back to messages list
  const handleBackToMessages = () => {
    setShowMobileDetails(false);
  };

  // Handle successful response send
  const handleResponseSent = async (responseData: {
    response: string;
    responseType: ResponseType;
    adminNotes?: string;
  }) => {
    await onSendResponse(responseData);
    if (isMobile) {
      setShowMobileDetails(false);
    }
  };

  // Get detailed contact information
  const {
    contact,
    responses,
    isLoading: contactLoading,
    error: contactError,
    updateContactStatus
  } = useContactDetails(selectedMessage?.id || null);

  // Handle status updates
  const handleStatusUpdate = async (contactId: string, status: ContactStatus, adminNotes?: string) => {
    try {
      await updateContactStatus(status, adminNotes);
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
    <div className={`relative ${className}`}>
      {/* Mobile: Messages List View */}
      <div className={`lg:hidden ${showMobileDetails ? 'hidden' : 'block'}`}>
        <MessageList
          messages={messages}
          selectedMessageId={selectedMessage?.id || null}
          onMessageSelect={handleMobileMessageSelect}
          currentFilter={currentFilter}
          onFilterChange={onFilterChange}
          isLoading={isLoading}
          error={error}
          onRefresh={onRefresh}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>

      {/* Mobile: Message Details Slide Panel */}
      <div className={`lg:hidden fixed inset-0 z-50 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out ${
        showMobileDetails ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Mobile Header with Back Button */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
          <button
            onClick={handleBackToMessages}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Message Details</h2>
        </div>

        {/* Mobile Details Content */}
        <div className="h-full overflow-y-auto">
          <div className="p-4 space-y-4">
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
              onSendResponse={handleResponseSent}
              isSending={isSending}
            />

            <CommunicationTimeline message={selectedMessage} />
          </div>
        </div>
      </div>

      {/* Desktop: Grid Layout */}
      <div className={`hidden lg:grid lg:grid-cols-3 gap-4 sm:gap-6`}>
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
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>

        {/* Message Details & Response */}
        <div className="max-h-[calc(120vh-12rem)] overflow-y-auto space-y-4 sm:space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
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
    </div>
  );
};
