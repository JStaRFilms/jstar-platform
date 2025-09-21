'use client';

import { useState, useMemo } from 'react';

/**
 * Message interface for type safety
 */
export interface Message {
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
 * Message statistics interface
 */
export interface MessageStats {
  total: number;
  unread: number;
  responded: number;
  responseRate: number;
  avgResponseTime: string;
}

/**
 * Filter type for messages
 */
export type MessageFilter = 'all' | 'unread' | 'today' | 'week';

/**
 * Custom hook for Communications Inbox logic
 * Handles state management, filtering, and message operations
 */
export const useCommunicationsInbox = () => {
  // State management
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<MessageFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [responseText, setResponseText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Computed filtered messages
  const filteredMessages = useMemo(() => {
    return messages.filter(message => {
      // Filter by status
      const matchesFilter = filter === 'all' ||
        (filter === 'unread' && message.status === 'unread') ||
        (filter === 'today' && message.submittedAt.includes('Today')) ||
        (filter === 'week' && (message.submittedAt.includes('Today') || message.submittedAt.includes('Yesterday')));

      // Filter by search query
      const matchesSearch = searchQuery === '' ||
        message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.message.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [messages, filter, searchQuery]);

  // Computed statistics
  const stats = useMemo((): MessageStats => {
    return {
      total: messages.length,
      unread: messages.filter(m => m.status === 'unread').length,
      responded: messages.filter(m => m.status === 'responded').length,
      responseRate: messages.length > 0 ? Math.round((messages.filter(m => m.status === 'responded').length / messages.length) * 100) : 0,
      avgResponseTime: '24h'
    };
  }, [messages]);

  // Event handlers
  const handleMessageSelect = (message: Message) => {
    setSelectedMessage(message);
    // Mark as read if unread
    if (message.status === 'unread') {
      setMessages(prev => prev.map(m =>
        m.id === message.id ? { ...m, status: 'read' } : m
      ));
    }
  };

  const handleFilterChange = (newFilter: MessageFilter) => {
    setFilter(newFilter);
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

    // Simulate API call
    setTimeout(() => {
      setMessages(prev => prev.map(m =>
        m.id === selectedMessage.id ? { ...m, status: 'responded' } : m
      ));
      setResponseText('');
      setIsSending(false);
      alert('Response sent successfully!');
    }, 2000);
  };

  const handleArchiveMessage = () => {
    if (!selectedMessage) return;

    if (confirm('Are you sure you want to archive this message?')) {
      setMessages(prev => prev.filter(m => m.id !== selectedMessage.id));
      setSelectedMessage(null);
      alert('Message archived successfully!');
    }
  };

  return {
    // State
    messages: filteredMessages,
    selectedMessage,
    filter,
    searchQuery,
    responseText,
    isSending,
    stats,

    // Actions
    handleMessageSelect,
    handleFilterChange,
    handleSearchChange,
    handleResponseTextChange,
    handleSendResponse,
    handleArchiveMessage
  };
};

// Mock data for demonstration
const mockMessages: Message[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    subject: 'Inquiry about video production services',
    message: 'Hello John, I came across your website and was impressed with your portfolio. I\'m looking for a videographer for my small business in Lagos. Can you please tell me more about your services and pricing?',
    service: 'Video Production',
    status: 'unread',
    submittedAt: 'Today at 14:23',
    phone: '+234 803 123 4567',
    location: 'Lagos, Nigeria'
  },
  {
    id: '2',
    name: 'Michael Okafor',
    email: 'michael.okafor@example.com',
    subject: 'Request for collaboration',
    message: 'Hi John, I\'m a content creator with 50k subscribers on YouTube. I\'d love to collaborate with you on a project for my channel. Let me know if you\'re interested and available next month.',
    service: 'Collaboration',
    status: 'read',
    submittedAt: 'Yesterday at 10:45',
    phone: '+234 802 987 6543',
    location: 'Abuja, Nigeria'
  },
  {
    id: '3',
    name: 'Chinedu Nwosu',
    email: 'chinedu.nwosu@example.com',
    subject: 'Technical question about JohnGPT',
    message: 'Hello John, I noticed your JohnGPT feature on the website. Could you explain how it works and what kind of prompts work best? I\'m interested in using it for my YouTube channel.',
    service: 'JohnGPT',
    status: 'read',
    submittedAt: 'Oct 12 at 09:15',
    phone: '+234 701 456 7890',
    location: 'Port Harcourt, Nigeria'
  },
  {
    id: '4',
    name: 'Aisha Bello',
    email: 'aisha.bello@example.com',
    subject: 'Website feedback',
    message: 'Hi John, I really like your website design! The hero section is very impressive. I just wanted to let you know that the contact form on mobile was a bit hard to use. Keep up the great work!',
    service: 'Feedback',
    status: 'read',
    submittedAt: 'Oct 10 at 16:30',
    phone: '+234 809 123 4567',
    location: 'Kano, Nigeria'
  },
  {
    id: '5',
    name: 'David Adeyemi',
    email: 'david.adeyemi@example.com',
    subject: 'Project inquiry',
    message: 'Hello John, I\'m reaching out regarding your video production services. I have a corporate event coming up next month and need professional videography. Could you provide a quote for a 2-day event?',
    service: 'Corporate Video',
    status: 'read',
    submittedAt: 'Oct 8 at 11:20',
    phone: '+234 803 555 7890',
    location: 'Ibadan, Nigeria'
  }
];
