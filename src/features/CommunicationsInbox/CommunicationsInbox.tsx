'use client';

import React, { useState, useMemo } from 'react';
import { useContacts } from './hooks/useContacts';
import { useContactDetails } from './hooks/useContactDetails';
import { useAnalytics } from './hooks/useAnalytics';
import { sendContactResponse } from '@/lib/communications-api';
import { ContactFilters, MessageFilter, ContactSubmission, ContactStatus, ResponseType } from './types';
import { SystemStatus } from './components/SystemStatus';
import { QuickStats } from './components/QuickStats';
import { MainContentGrid } from './components/MainContentGrid';
import { PageHeader } from './components/PageHeader';

/**
 * Props for the CommunicationsInbox component
 */
interface CommunicationsInboxProps {
  /** Optional className for styling */
  className?: string;
}

/**
 * CommunicationsInbox Component
 * Main container component for the Communications Inbox feature
 * Follows component-driven development principles with proper separation of concerns
 * Integrated with admin navigation system - header and breadcrumbs handled by AdminContentContainer
 */
export const CommunicationsInbox: React.FC<CommunicationsInboxProps> = ({
  className = ''
}) => {
  // Local state for UI filters and selections
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null);
  const [uiFilter, setUiFilter] = useState<MessageFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [responseText, setResponseText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // API filters based on search and UI state
  const apiFilters = useMemo((): ContactFilters => ({
    search: searchQuery || undefined,
    page: currentPage,
    limit: 50,
    sortBy: 'submittedAt',
    sortOrder: 'desc',
  }), [searchQuery, currentPage]);

  // Use the analytics hook for real-time stats
  const { quickStats } = useAnalytics();

  // Use the new contacts hook
  const {
    contacts,
    pagination,
    isLoading,
    error,
    getFilteredContacts,
    updateContactStatus,
    archiveContact,
    refresh,
  } = useContacts(apiFilters);

  // Get filtered contacts based on UI filter
  const filteredContacts = useMemo(() => {
    return getFilteredContacts(uiFilter);
  }, [getFilteredContacts, uiFilter]);

  // Event handlers
  const handleMessageSelect = (message: ContactSubmission) => {
    setSelectedMessage(message);
  };

  const handleFilterChange = (newFilter: MessageFilter) => {
    setUiFilter(newFilter);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleResponseTextChange = (text: string) => {
    setResponseText(text);
  };

  const handleSendResponse = async (responseData: {
    response: string;
    responseType: ResponseType;
    adminNotes?: string;
  }) => {
    if (!selectedMessage) return;

    setIsSending(true);
    try {
      // Send the response via API
      await sendContactResponse(selectedMessage.id, responseData);
      setResponseText('');
      setSelectedMessage(null);
      // Success message could be shown here
    } catch (error) {
      console.error('Failed to send response:', error);
      // Error message will be handled by the ResponseComposer component
      throw error; // Re-throw to let ResponseComposer handle it
    } finally {
      setIsSending(false);
    }
  };

  const handleArchiveMessage = async () => {
    if (!selectedMessage) return;

    if (confirm('Are you sure you want to archive this message?')) {
      try {
        await archiveContact(selectedMessage.id);
        setSelectedMessage(null);
      } catch (error) {
        console.error('Failed to archive message:', error);
        // TODO: Show error message to user
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedMessage(null); // Clear selection when changing pages
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Page Header */}
      <PageHeader
        title="Communications Inbox"
        description="Manage all contact form submissions and communications"
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onArchive={handleArchiveMessage}
      />

      {/* System Status */}
      <SystemStatus />

      {/* Quick Stats */}
      <QuickStats stats={quickStats} />

      {/* Main Content Grid */}
      <MainContentGrid
        messages={filteredContacts}
        selectedMessage={selectedMessage}
        currentFilter={uiFilter}
        responseText={responseText}
        isSending={isSending}
        isLoading={isLoading}
        error={error}
        currentPage={pagination?.page || 1}
        totalPages={pagination?.totalPages || 1}
        onMessageSelect={handleMessageSelect}
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
        onResponseTextChange={handleResponseTextChange}
        onSendResponse={handleSendResponse}
        onRefresh={refresh}
      />
    </div>
  );
};
