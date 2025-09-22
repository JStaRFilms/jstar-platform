'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { PaperAirplaneIcon } from '@/components/icons';
import { ContactSubmission, ResponseType } from '../types';
import { usePrecisionModeContext } from '../contexts/PrecisionModeContext';

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
  /** Handler for toggling fullscreen */
  onToggleFullscreen?: (target: 'messageList' | 'messageDetails' | 'responseComposer') => void;
  /** Check if element is in fullscreen */
  isFullscreen?: (target: 'messageList' | 'messageDetails' | 'responseComposer') => boolean;
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
  isSending,
  onToggleFullscreen,
  isFullscreen
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [responseType, setResponseType] = useState<ResponseType>('EMAIL' as ResponseType);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { precisionState } = usePrecisionModeContext();

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
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 touch-manipulation">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Compose Response
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
            <div className="text-xs text-gray-500 dark:text-gray-400">Response Precision</div>
            <div className="text-sm font-mono text-blue-600 dark:text-blue-400">
              {precisionState.precisionLevel.toFixed(3)}%
            </div>
          </div>
        )}

        {/* Fullscreen Toggle Button */}
        <button
          onClick={() => onToggleFullscreen?.('responseComposer')}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={isFullscreen?.('responseComposer') ? 'Exit Fullscreen (Escape)' : 'Enter Fullscreen'}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isFullscreen?.('responseComposer') ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M15 15h4.5M15 15v4.5M15 15l5.5 5.5" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            )}
          </svg>
        </button>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {/* Template Selector */}
        <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="font-medium text-gray-900 dark:text-white mb-3">
            Response Template
            {precisionState.isActive && (
              <span className="ml-2 text-xs text-blue-600 dark:text-blue-400 font-normal">
                (Template Analysis Active)
              </span>
            )}
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

          {/* Precision Mode Template Analysis */}
          {precisionState.isActive && precisionState.detailTracking && selectedTemplate && (
            <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              <div className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">
                Template Analysis
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300">
                <div>• Template: {selectedTemplate.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                <div>• Character count: {RESPONSE_TEMPLATES[selectedTemplate as keyof typeof RESPONSE_TEMPLATES]?.length || 0}</div>
                <div>• Word count: {RESPONSE_TEMPLATES[selectedTemplate as keyof typeof RESPONSE_TEMPLATES]?.split(' ').length || 0}</div>
                <div>• Precision tracking: Active</div>
              </div>
            </div>
          )}
        </div>

        {/* Response Text Area */}
        <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="font-medium text-gray-900 dark:text-white mb-2">
            Message
            {precisionState.isActive && (
              <span className="ml-2 text-xs text-blue-600 dark:text-blue-400 font-normal">
                (Content Analysis Active)
              </span>
            )}
          </div>
          <textarea
            value={responseText}
            onChange={(e) => onResponseTextChange(e.target.value)}
            placeholder="Write your response here..."
            className="w-full min-h-[120px] sm:min-h-[150px] px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            disabled={isSending}
          />

          {/* Precision Mode Response Analysis */}
          {precisionState.isActive && precisionState.detailTracking && responseText && (
            <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
              <div className="text-xs font-medium text-green-800 dark:text-green-200 mb-1">
                Response Analysis
              </div>
              <div className="text-xs text-green-700 dark:text-green-300">
                <div>• Character count: {responseText.length}</div>
                <div>• Word count: {responseText.split(' ').length}</div>
                <div>• Line count: {responseText.split('\n').length}</div>
                <div>• Precision tracking: Active</div>
              </div>
            </div>
          )}
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

        {/* Precision Mode Action Analysis */}
        {precisionState.isActive && precisionState.detailTracking && responseText && (
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">
              Action Analysis
            </div>
            <div className="space-y-1 text-xs text-purple-700 dark:text-purple-300">
              <div>• Response ready for sending</div>
              <div>• Character count: {responseText.length}</div>
              <div>• Template used: {selectedTemplate ? selectedTemplate.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Custom response'}</div>
              <div>• Precision tracking: Active</div>
            </div>
          </div>
        )}

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
