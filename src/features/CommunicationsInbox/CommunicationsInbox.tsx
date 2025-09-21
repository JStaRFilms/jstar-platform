'use client';

import React from 'react';
import { useCommunicationsInbox } from './hooks/useCommunicationsInbox';
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
  // Use custom hook for all logic
  const {
    messages,
    selectedMessage,
    filter,
    searchQuery,
    responseText,
    isSending,
    stats,
    handleMessageSelect,
    handleFilterChange,
    handleSearchChange,
    handleResponseTextChange,
    handleSendResponse,
    handleArchiveMessage
  } = useCommunicationsInbox();

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
        messages={messages}
        selectedMessage={selectedMessage}
        currentFilter={filter}
        responseText={responseText}
        isSending={isSending}
        onMessageSelect={handleMessageSelect}
        onFilterChange={handleFilterChange}
        onResponseTextChange={handleResponseTextChange}
        onSendResponse={handleSendResponse}
      />
    </div>
  );
};
