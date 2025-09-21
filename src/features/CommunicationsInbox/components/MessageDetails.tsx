'use client';

import React, { useState } from 'react';
import { EnvelopeIcon } from '@/components/icons';
import { ContactSubmission, ContactStatus } from '../types';

/**
 * Props for the MessageDetails component
 */
interface MessageDetailsProps {
  /** The selected contact to display */
  contact: ContactSubmission | null;
  /** Callback when status is updated */
  onStatusUpdate?: (contactId: string, status: ContactStatus) => void;
  /** Whether the component is in loading state */
  isLoading?: boolean;
  /** Error message if any */
  error?: string | null;
}

/**
 * MessageDetails Component
 * Displays detailed information about a selected contact submission
 */
export const MessageDetails: React.FC<MessageDetailsProps> = ({
  contact,
  onStatusUpdate,
  isLoading = false,
  error = null
}) => {
  const [adminNotes, setAdminNotes] = useState(contact?.adminNotes || '');
  const [isUpdatingNotes, setIsUpdatingNotes] = useState(false);

  // Format date for display
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle status update
  const handleStatusChange = async (newStatus: ContactStatus) => {
    if (!contact || !onStatusUpdate) return;

    try {
      await onStatusUpdate(contact.id, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
      // Error handling is done in the parent component
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-red-200 dark:border-red-700">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!contact) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center h-64">
        <div className="text-center">
          <EnvelopeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Select a contact to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-5">
        Contact Details
      </h2>

      <div className="space-y-4 sm:space-y-5">
        {/* Status and Actions */}
        <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <div className="font-medium text-gray-900 dark:text-white">Status</div>
            <select
              value={contact.status}
              onChange={(e) => handleStatusChange(e.target.value as ContactStatus)}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value={ContactStatus.PENDING}>Pending</option>
              <option value={ContactStatus.PROCESSED}>Processed</option>
              <option value={ContactStatus.RESPONDED}>Responded</option>
              <option value={ContactStatus.ARCHIVED}>Archived</option>
            </select>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Last updated: {formatDate(contact.submittedAt)}
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="font-medium text-gray-900 dark:text-white mb-3">
            Contact Information
          </div>
          <div className="space-y-2">
            {[
              { label: 'Name', value: contact.name },
              { label: 'Email', value: contact.email },
              { label: 'Service', value: contact.service },
              { label: 'Newsletter', value: contact.newsletter ? 'Subscribed' : 'Not subscribed' },
              { label: 'Submitted', value: formatDate(contact.submittedAt) },
              { label: 'IP Address', value: contact.ipAddress || 'Not available' },
              { label: 'User Agent', value: contact.userAgent ? contact.userAgent.substring(0, 50) + '...' : 'Not available' }
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
              <div className="text-sm break-words font-medium">{contact.subject}</div>
            </div>
            <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Message</div>
              <div className="text-sm whitespace-pre-wrap break-words">{contact.message}</div>
            </div>
          </div>
        </div>

        {/* Admin Notes */}
        <div className="p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="font-medium text-gray-900 dark:text-white mb-2">
            Admin Notes
          </div>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Add internal notes about this contact..."
            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
            rows={3}
          />
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Notes are for internal use only and help track contact progress.
          </div>
        </div>

        {/* Response Info */}
        {contact.respondedAt && (
          <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="font-medium text-green-800 dark:text-green-200 mb-2">
              Response Sent
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              Responded on {formatDate(contact.respondedAt)}
              {contact.respondedBy && ` by ${contact.respondedBy}`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
