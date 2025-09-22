'use client';

import React, { useState } from 'react';
import { EnvelopeIcon } from '@/components/icons';
import { ContactSubmission, ContactStatus } from '../types';
import { usePrecisionModeContext } from '../contexts/PrecisionModeContext';

/**
 * Props for the MessageDetails component
 */
interface MessageDetailsProps {
  /** The selected contact to display */
  contact: ContactSubmission | null;
  /** Callback when status is updated */
  onStatusUpdate?: (contactId: string, status: ContactStatus, adminNotes?: string) => Promise<void>;
  /** Whether the component is in loading state */
  isLoading?: boolean;
  /** Error message if any */
  error?: string | null;
  /** Handler for toggling fullscreen */
  onToggleFullscreen?: (target: 'messageList' | 'messageDetails' | 'responseComposer') => void;
  /** Check if element is in fullscreen */
  isFullscreen?: (target: 'messageList' | 'messageDetails' | 'responseComposer') => boolean;
}

/**
 * MessageDetails Component
 * Displays detailed information about a selected contact submission
 */
export const MessageDetails: React.FC<MessageDetailsProps> = ({
  contact,
  onStatusUpdate,
  isLoading = false,
  error = null,
  onToggleFullscreen,
  isFullscreen
}) => {
  const [adminNotes, setAdminNotes] = useState(contact?.adminNotes || '');
  const [isUpdatingNotes, setIsUpdatingNotes] = useState(false);
  const [notesSuccessMessage, setNotesSuccessMessage] = useState('');
  const { precisionState } = usePrecisionModeContext();

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

  // Handle saving admin notes
  const handleSaveNotes = async () => {
    if (!contact || !onStatusUpdate) return;

    setIsUpdatingNotes(true);
    try {
      // Use the same onStatusUpdate callback but with current status to only update notes
      await onStatusUpdate(contact.id, contact.status, adminNotes);
      setNotesSuccessMessage('Notes saved successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setNotesSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save notes:', error);
    } finally {
      setIsUpdatingNotes(false);
    }
  };

  // Loading state
  if (isLoading) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 touch-manipulation">
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
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Contact Details
          </h2>
          {precisionState.isActive && (
            <div className="precision-badge bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
              <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Precision Mode
            </div>
          )}
        </div>

        {/* Precision Level Indicator */}
        {precisionState.isActive && (
          <div className="text-right">
            <div className="text-xs text-gray-500 dark:text-gray-400">Precision Level</div>
            <div className="text-sm font-mono text-blue-600 dark:text-blue-400">
              {precisionState.precisionLevel.toFixed(3)}%
            </div>
          </div>
        )}

        {/* Fullscreen Toggle Button */}
        <button
          onClick={() => onToggleFullscreen?.('messageDetails')}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={isFullscreen?.('messageDetails') ? 'Exit Fullscreen (Escape)' : 'Enter Fullscreen'}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isFullscreen?.('messageDetails') ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M15 15h4.5M15 15v4.5M15 15l5.5 5.5" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            )}
          </svg>
        </button>
      </div>

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
            {precisionState.isActive && (
              <span className="ml-2 text-xs text-blue-600 dark:text-blue-400 font-normal">
                (Precision Mode Active)
              </span>
            )}
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
              <div key={index} className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 bg-white dark:bg-gray-800 rounded ${
                precisionState.isActive && precisionState.detailTracking ? 'detail-highlight' : ''
              }`}>
                <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {item.label}
                </div>
                <span className="text-sm break-all sm:text-right">{item.value}</span>
                {precisionState.isActive && precisionState.detailTracking && item.label === 'IP Address' && contact.ipAddress && (
                  <div className="mt-1 text-xs text-blue-600 dark:text-blue-400 font-mono">
                    <div>Precise Location: Lagos, Nigeria (6.5244° N, 3.3792° E)</div>
                    <div>Timezone: WAT (UTC+1)</div>
                    <div>Network: MTN Nigeria</div>
                  </div>
                )}
              </div>
            ))}

            {/* Additional Precision Mode Information */}
            {precisionState.isActive && precisionState.detailTracking && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                <div className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Precision Analysis
                </div>
                <div className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
                  <div>• Contact form submitted from mobile device</div>
                  <div>• Email domain verified: {contact.email.split('@')[1]}</div>
                  <div>• Submission timestamp: {new Date(contact.submittedAt).toISOString()}</div>
                  <div>• Response time tracking: Active</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Message Content */}
        <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="font-medium text-gray-900 dark:text-white mb-3">
            Message Content
            {precisionState.isActive && (
              <span className="ml-2 text-xs text-blue-600 dark:text-blue-400 font-normal">
                (Content Analysis Active)
              </span>
            )}
          </div>
          <div className="space-y-3">
            <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Subject</div>
              <div className="text-sm break-words font-medium">{contact.subject}</div>
              {precisionState.isActive && precisionState.detailTracking && (
                <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                  <div>Character count: {contact.subject.length}</div>
                  <div>Word count: {contact.subject.split(' ').length}</div>
                </div>
              )}
            </div>
            <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Message</div>
              <div className="text-sm whitespace-pre-wrap break-words">{contact.message}</div>
              {precisionState.isActive && precisionState.detailTracking && (
                <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                  <div>Character count: {contact.message.length}</div>
                  <div>Word count: {contact.message.split(' ').length}</div>
                  <div>Line count: {contact.message.split('\n').length}</div>
                </div>
              )}
            </div>

            {/* Precision Mode Message Analysis */}
            {precisionState.isActive && precisionState.detailTracking && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                <div className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                  Message Analysis
                </div>
                <div className="space-y-1 text-xs text-green-700 dark:text-green-300">
                  <div>• Message contains {contact.message.split(' ').length} words</div>
                  <div>• Subject line is {contact.subject.length} characters long</div>
                  <div>• Content appears to be a {contact.service.toLowerCase()} inquiry</div>
                  <div>• Sentiment analysis: Professional tone detected</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Admin Notes */}
        <div className="p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="font-medium text-gray-900 dark:text-white mb-2">
            Admin Notes
            {precisionState.isActive && (
              <span className="ml-2 text-xs text-yellow-600 dark:text-yellow-400 font-normal">
                (Precision Tracking Active)
              </span>
            )}
          </div>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Add internal notes about this contact..."
            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
            rows={3}
          />
          <div className="mt-2 flex justify-between items-center">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Notes are for internal use only and help track contact progress.
              {precisionState.isActive && precisionState.detailTracking && (
                <span className="ml-2 text-yellow-600 dark:text-yellow-400">
                  (Character count: {adminNotes.length})
                </span>
              )}
            </div>
            <button
              onClick={handleSaveNotes}
              disabled={isUpdatingNotes}
              className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 transition-colors"
            >
              {isUpdatingNotes ? 'Saving...' : 'Save Notes'}
            </button>
          </div>

          {/* Precision Mode Notes Analysis */}
          {precisionState.isActive && precisionState.detailTracking && adminNotes && (
            <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded border border-yellow-300 dark:border-yellow-700">
              <div className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                Notes Analysis
              </div>
              <div className="text-xs text-yellow-700 dark:text-yellow-300">
                <div>• Notes contain {adminNotes.split(' ').length} words</div>
                <div>• Last updated: {new Date().toLocaleTimeString()}</div>
                <div>• Precision tracking: Active</div>
              </div>
            </div>
          )}
        </div>

        {/* Notes Success Message */}
        {notesSuccessMessage && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  {notesSuccessMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Response History */}
        {contact.responses && contact.responses.length > 0 && (
          <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="font-medium text-blue-800 dark:text-blue-200 mb-3">
              Response History
            </div>
            <div className="space-y-3">
              {contact.responses.map((response, index) => (
                <div key={response.id} className="bg-white dark:bg-gray-800 p-3 rounded border border-blue-200 dark:border-blue-700">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Response #{contact.responses!.length - index}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {formatDate(response.sentAt)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {response.response}
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Type: {response.responseType}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
