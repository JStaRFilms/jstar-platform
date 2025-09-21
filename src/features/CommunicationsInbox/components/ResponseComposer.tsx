'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
 * Response templates for quick replies
 */
const RESPONSE_TEMPLATES = {
  'standard': `Thank you for reaching out! I've received your message and will get back to you within 24 hours.

Best regards,
J StaR Films Team`,

  'quote': `Thank you for your interest in our services. I'd be happy to provide a detailed quote for your project.

Could you please provide more details about:
- Your timeline
- Budget range
- Specific requirements

I'll prepare a customized proposal for you.

Best regards,
J StaR Films Team`,

  'follow_up': `I wanted to follow up on your previous inquiry. Are you still interested in our services?

Please let me know if you have any questions or need additional information.

Best regards,
J StaR Films Team`,

  'technical': `Thank you for your technical inquiry. I'll need to review the details and get back to you with a comprehensive response.

In the meantime, please ensure you have:
- System requirements met
- Latest software updates installed
- Contact information for follow-up

I'll respond within 24 hours with detailed technical guidance.

Best regards,
J StaR Films Team`
};

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
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load draft from localStorage on mount
  useEffect(() => {
    if (contact?.id) {
      const draftKey = `response_draft_${contact.id}`;
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft && !responseText) {
        onResponseTextChange(savedDraft);
      }
    }
  }, [contact?.id, responseText, onResponseTextChange]);

  // Handle template selection
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateKey = e.target.value;
    setSelectedTemplate(templateKey);

    if (templateKey && RESPONSE_TEMPLATES[templateKey as keyof typeof RESPONSE_TEMPLATES]) {
      const templateText = RESPONSE_TEMPLATES[templateKey as keyof typeof RESPONSE_TEMPLATES];
      onResponseTextChange(templateText);
    }
  };

  // Handle saving draft
  const handleSaveDraft = async () => {
    if (!contact || !responseText.trim()) return;

    setIsSavingDraft(true);
    try {
      const draftKey = `response_draft_${contact.id}`;
      localStorage.setItem(draftKey, responseText.trim());

      // Show success feedback (you could add a toast notification here)
      console.log('Draft saved successfully');
    } catch (error) {
      console.error('Failed to save draft:', error);
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Handle sending response
  const handleSendResponse = async () => {
    if (!contact || !responseText.trim()) return;

    try {
      await onSendResponse({
        response: responseText.trim(),
        responseType,
        adminNotes: selectedTemplate ? `Used template: ${selectedTemplate}` : undefined,
      });

      // Show success message
      setSuccessMessage('Response sent successfully! The contact has been notified via email.');

      // Clear the success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);

      // Clear draft after successful send
      const draftKey = `response_draft_${contact.id}`;
      localStorage.removeItem(draftKey);

      // Clear response text
      onResponseTextChange('');

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
          <select
            value={selectedTemplate}
            onChange={handleTemplateChange}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
          >
            <option value="">Select a template...</option>
            <option value="standard">Standard Inquiry Response</option>
            <option value="quote">Project Quote Template</option>
            <option value="follow_up">Follow-up Response</option>
            <option value="technical">Technical Support Response</option>
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
            onClick={handleSaveDraft}
            disabled={isSending || isSavingDraft || !responseText.trim()}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center"
          >
            {isSavingDraft ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800 dark:border-gray-200 mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Draft'
            )}
          </button>
          <button
            onClick={handleSendResponse}
            disabled={isSending || !responseText.trim()}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center"
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

        {/* Success Message */}
        {successMessage && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  {successMessage}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
