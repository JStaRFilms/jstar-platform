'use client';

import React from 'react';
import { EnvelopeIcon, PaperAirplaneIcon, ClockIcon } from '@/components/icons';
import { usePrecisionModeContext } from '../contexts/PrecisionModeContext';

/**
 * Props for the CommunicationTimeline component
 */
interface CommunicationTimelineProps {
  /** The selected message to show timeline for */
  message: Message | null;
}

/**
 * Message interface for type safety
 */
interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  service: string;
  status: 'unread' | 'read' | 'responded' | 'archived';
  submittedAt: string;
  phone?: string;
  location?: string;
  ipAddress?: string;
}

/**
 * CommunicationTimeline Component
 * Shows the timeline of communication events for a message
 */
export const CommunicationTimeline: React.FC<CommunicationTimelineProps> = ({ message }) => {
  const { precisionState } = usePrecisionModeContext();

  if (!message) {
    return null;
  }

  // Enhanced timeline events with precision mode data
  const timelineEvents = [
    {
      id: 'received',
      type: 'received' as const,
      title: 'Message Received',
      timestamp: message.submittedAt,
      icon: EnvelopeIcon,
      color: 'bg-red-500',
      precisionData: precisionState.isActive ? {
        exactTimestamp: new Date(message.submittedAt).toISOString(),
        location: message.location || 'Unknown',
        ipAddress: message.ipAddress || 'Not available'
      } : undefined
    },
    ...(message.status === 'responded' ? [{

      id: 'responded',
      type: 'responded' as const,
      title: 'Response Sent',
      timestamp: 'Just now',
      icon: PaperAirplaneIcon,
      color: 'bg-green-500',
      precisionData: precisionState.isActive ? {
        exactTimestamp: new Date().toISOString(),
        responseTime: '2 minutes 34 seconds',
        method: 'Email'
      } : undefined
    }] : []),
    ...(message.status !== 'responded' ? [{

      id: 'pending',
      type: 'pending' as const,
      title: 'Response Pending',
      timestamp: 'You haven\'t responded yet',
      icon: ClockIcon,
      color: 'bg-gray-300',
      precisionData: precisionState.isActive ? {
        timeSinceReceived: '1 hour 23 minutes',
        priority: 'Medium',
        suggestedAction: 'Send response within 24 hours'
      } : undefined
    }] : [])
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Communication Timeline
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
            <div className="text-xs text-gray-500 dark:text-gray-400">Timeline Precision</div>
            <div className="text-sm font-mono text-blue-600 dark:text-blue-400">
              {precisionState.precisionLevel.toFixed(3)}%
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {timelineEvents.map((event, index) => (
          <div key={event.id} className="timeline-event p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-start">
              <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full ${event.color} text-white flex items-center justify-center mt-1 mr-3 sm:mr-4`}>
                <event.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  {event.title}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {event.timestamp}
                </div>

                {/* Precision Mode Event Details */}
                {precisionState.isActive && precisionState.detailTracking && event.precisionData && (
                  <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                    <div className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">
                      Precision Details
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                      {event.precisionData.exactTimestamp && (
                        <div>• Exact timestamp: {event.precisionData.exactTimestamp}</div>
                      )}
                      {event.precisionData.location && (
                        <div>• Location: {event.precisionData.location}</div>
                      )}
                      {event.precisionData.ipAddress && (
                        <div>• IP Address: {event.precisionData.ipAddress}</div>
                      )}
                      {event.precisionData.responseTime && (
                        <div>• Response time: {event.precisionData.responseTime}</div>
                      )}
                      {event.precisionData.method && (
                        <div>• Method: {event.precisionData.method}</div>
                      )}
                      {event.precisionData.timeSinceReceived && (
                        <div>• Time since received: {event.precisionData.timeSinceReceived}</div>
                      )}
                      {event.precisionData.priority && (
                        <div>• Priority: {event.precisionData.priority}</div>
                      )}
                      {event.precisionData.suggestedAction && (
                        <div>• Suggested action: {event.precisionData.suggestedAction}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline connector line */}
            {index < timelineEvents.length - 1 && (
              <div className="ml-4 sm:ml-5 mt-4 w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
            )}
          </div>
        ))}
      </div>

      {/* Precision Mode Timeline Analysis */}
      {precisionState.isActive && precisionState.detailTracking && (
        <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">
            Timeline Analysis
          </div>
          <div className="space-y-1 text-xs text-purple-700 dark:text-purple-300">
            <div>• Total events: {timelineEvents.length}</div>
            <div>• Timeline precision: {precisionState.precisionLevel.toFixed(3)}%</div>
            <div>• Last updated: {new Date().toLocaleTimeString()}</div>
            <div>• Precision tracking: Active</div>
          </div>
        </div>
      )}
    </div>
  );
};
