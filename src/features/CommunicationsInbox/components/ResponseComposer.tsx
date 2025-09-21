'use client';

import React, { useState, useMemo } from 'react';
import { PaperAirplaneIcon } from '@/components/icons';
import { ContactSubmission, ResponseType } from '../types';

/**
 * Props for the ResponseComposer component
 */
interface ResponseComposerProps {
  /** The selected contact for responding to */
  contact: ContactSubmission | null;
  /** Current response text */
  responseText: string;
  /** Callback when response text changes */
  onResponseTextChange: (text: string) => void;
  /** Callback when send button is clicked */
  onSendResponse: (responseData: {
    response: string;
    responseType: ResponseType;
    adminNotes?: string;
  }) => Promise<void>;
  /** Loading state for sending */
  isSending: boolean;
}

/**
 * ResponseComposer Component
 * Provides interface for composing and sending responses to messages
 */
export const ResponseComposer: React.FC<ResponseComposerProps> = ({
  contact,
  responseText,
  onResponseTextChange,
  onSendResponse,
  isSending
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [responseType, setResponseType] = useState<ResponseType>('EMAIL' as ResponseType);

  // Handle sending response
  const handleSendResponse = async () => {
    if (!contact || !responseText.trim()) return;

    try {
      await onSendResponse({
        response: responseText.trim(),
        responseType,
        adminNotes: selectedTemplate ? `Used template: ${selectedTemplate}` : undefined,
      });
    } catch (error) {
      console.error('Failed to send response:', error);
    }
  };

  if (!contact) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-5">
        Compose Response
      </h2>

      <div className="space-y-4 sm:space-y-5">
        {/* Template Selector */}
        <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="font-medium text-gray-900 dark:text-white mb-3">
            Response Template
          </div>
          <select className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
            <option>Select a template...</option>
            <option>Standard Inquiry Response</option>
            <option>Project Quote Template</option>
            <option>Collaboration Response</option>
            <option>Technical Support Response</option>
          </select>
        </div>

        {/* Response Text Area */}
        <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="font-medium text-gray-900 dark:text-white mb-2">
            Message
          </div>
          <textarea
            value={responseText}
            onChange={(e) => onResponseTextChange(e.target.value)}
            placeholder="Write your response here..."
            className="w-full min-h-[120px] sm:min-h-[150px] px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            disabled={isSending}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSending}
          >
            Save Draft
          </button>
          <button
            onClick={handleSendResponse}
            disabled={isSending || !responseText.trim()}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                Send Response
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
