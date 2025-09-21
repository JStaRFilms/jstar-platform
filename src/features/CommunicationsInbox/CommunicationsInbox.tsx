'use client';

import React, { useState, useMemo } from 'react';
import { useContacts } from './hooks/useContacts';
import { ContactFilters, MessageFilter, ContactSubmission, ContactStatus } from './types';
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

  // API filters based on search and UI state
  const apiFilters = useMemo((): ContactFilters => ({
    search: searchQuery || undefined,
    page: 1,
    limit: 50,
    sortBy: 'submittedAt',
    sortOrder: 'desc',
  }), [searchQuery]);

  // Use the new contacts hook
  const {
    contacts,
    stats,
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

  const handleSendResponse = async () => {
    if (!responseText.trim() || !selectedMessage) return;

    setIsSending(true);
    try {
      // TODO: Implement response sending via API
      // For now, just update status to responded
      await updateContactStatus(selectedMessage.id, ContactStatus.RESPONDED);
      setResponseText('');
      setSelectedMessage(null);
    } catch (error) {
      console.error('Failed to send response:', error);
      // TODO: Show error message to user
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
      <QuickStats stats={stats} />

      {/* Main Content Grid */}
      <MainContentGrid
        messages={filteredContacts}
        selectedMessage={selectedMessage}
        currentFilter={uiFilter}
        responseText={responseText}
        isSending={isSending}
        isLoading={isLoading}
        error={error}
        onMessageSelect={handleMessageSelect}
        onFilterChange={handleFilterChange}
        onResponseTextChange={handleResponseTextChange}
        onSendResponse={handleSendResponse}
        onRefresh={refresh}
      />
    </div>
  );
};
