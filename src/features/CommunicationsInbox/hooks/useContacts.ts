'use client';

import useSWR from 'swr';
import { useMemo } from 'react';
import { ContactFilters, ContactSubmission, ContactListResponse, MessageStats, MessageFilter, ApiError } from '../types';
import { fetchContacts, updateContact, archiveContact, handleApiError, getErrorMessage } from '@/lib/communications-api';

/**
 * Custom hook for managing contact submissions with SWR
 * Provides data fetching, caching, and mutation capabilities
 */
export const useContacts = (filters: ContactFilters = {}) => {
  // Generate cache key from filters
  const cacheKey = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.status?.length) params.append('status', filters.status.join(','));
    if (filters.service?.length) params.append('service', filters.service.join(','));
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    return `/api/admin/contacts?${params.toString()}`;
  }, [filters]);

  // Fetch contacts with SWR
  const {
    data: response,
    error,
    isLoading,
    mutate,
    isValidating
  } = useSWR<ContactListResponse>(
    cacheKey,
    () => fetchContacts(filters),
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  // Extract data from response
  const contacts = response?.data?.submissions || [];
  const pagination = response?.data ? {
    total: response.data.total,
    page: response.data.page,
    limit: response.data.limit,
    totalPages: response.data.totalPages,
  } : null;

  // Calculate statistics
  const stats = useMemo((): MessageStats => {
    const total = contacts.length;
    const responded = contacts.filter((c: ContactSubmission) => c.status === 'RESPONDED').length;
    const unread = contacts.filter((c: ContactSubmission) => c.status === 'PENDING').length;

    return {
      total,
      unread,
      responded,
      responseRate: total > 0 ? Math.round((responded / total) * 100) : 0,
      avgResponseTime: '24h' // TODO: Calculate from actual data
    };
  }, [contacts]);

  // Filter contacts based on UI filters (client-side filtering for quick filters)
  const getFilteredContacts = (uiFilter: MessageFilter) => {
    return contacts.filter((contact: ContactSubmission) => {
      const now = new Date();
      const submittedAt = new Date(contact.submittedAt);

      switch (uiFilter) {
        case 'unread':
          return contact.status === 'PENDING';
        case 'today':
          return submittedAt.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return submittedAt >= weekAgo;
        case 'all':
        default:
          return true;
      }
    });
  };

  // Update contact status with optimistic updates
  const updateContactStatus = async (contactId: string, status: ContactSubmission['status']) => {
    try {
      // Optimistic update
      const optimisticContacts = contacts.map(contact =>
        contact.id === contactId ? { ...contact, status } : contact
      );

      // Update cache optimistically
      mutate(
        (prev: ContactListResponse | undefined) => prev ? {
          ...prev,
          data: {
            ...prev.data,
            submissions: optimisticContacts
          }
        } : prev,
        false // Don't revalidate immediately
      );

      // Make API call
      await updateContact(contactId, { status });

      // Revalidate to get server state
      mutate();

    } catch (error) {
      // Revert optimistic update on error
      mutate();

      const apiError = handleApiError(error);
      throw new Error(getErrorMessage(apiError));
    }
  };

  // Archive contact
  const archiveContactById = async (contactId: string) => {
    try {
      await archiveContact(contactId);

      // Remove from cache
      mutate(
        (prev: ContactListResponse | undefined) => prev ? {
          ...prev,
          data: {
            ...prev.data,
            submissions: prev.data.submissions.filter((c: ContactSubmission) => c.id !== contactId),
            total: prev.data.total - 1
          }
        } : prev,
        false
      );

    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(getErrorMessage(apiError));
    }
  };

  // Refresh data
  const refresh = () => {
    mutate();
  };

  return {
    // Data
    contacts,
    pagination,
    stats,
    isLoading,
    isValidating,
    error: error ? getErrorMessage(handleApiError(error)) : null,

    // Computed data
    getFilteredContacts,

    // Actions
    updateContactStatus,
    archiveContact: archiveContactById,
    refresh,
    mutate,
  };
};
