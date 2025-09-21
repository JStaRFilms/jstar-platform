'use client';

import React from 'react';
import { EnvelopeIcon, PaperAirplaneIcon, ClockIcon } from '@/components/icons';

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
  if (!message) {
    return null;
  }

  const timelineEvents = [
    {
      id: 'received',
      type: 'received' as const,
      title: 'Message Received',
      timestamp: message.submittedAt,
      icon: EnvelopeIcon,
      color: 'bg-red-500'
    },
    ...(message.status === 'responded' ? [{
      id: 'responded',
      type: 'responded' as const,
      title: 'Response Sent',
      timestamp: 'Just now',
      icon: PaperAirplaneIcon,
      color: 'bg-green-500'
    }] : []),
    ...(message.status !== 'responded' ? [{
      id: 'pending',
      type: 'pending' as const,
      title: 'Response Pending',
      timestamp: 'You haven\'t responded yet',
      icon: ClockIcon,
      color: 'bg-gray-300'
    }] : [])
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-5">
        Communication Timeline
      </h2>

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
              </div>
            </div>

            {/* Timeline connector line */}
            {index < timelineEvents.length - 1 && (
              <div className="ml-4 sm:ml-5 mt-4 w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
