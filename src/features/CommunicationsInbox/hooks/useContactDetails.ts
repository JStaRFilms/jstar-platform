'use client';

import useSWR from 'swr';
import { ContactDetailResponse, ContactSubmission, ContactResponse, ContactUpdateRequest, ContactUpdateResponse, ApiError } from '../types';
import { fetchContactDetails, updateContact, handleApiError, getErrorMessage } from '@/lib/communications-api';

/**
 * Custom hook for managing individual contact details with SWR
 * Provides data fetching, caching, and mutation capabilities for a single contact
 */
export const useContactDetails = (contactId: string | null) => {
  // Fetch contact details with SWR
  const {
    data: response,
    error,
    isLoading,
    mutate,
    isValidating
  } = useSWR<ContactDetailResponse>(
    contactId ? `/api/admin/contacts/${contactId}` : null,
    contactId ? () => fetchContactDetails(contactId) : null,
    {
      refreshInterval: 60000, // Refresh every minute for detailed view
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 10000,
      errorRetryCount: 2,
      errorRetryInterval: 3000,
    }
  );

  // Extract data from response
  const contact = response?.data?.submission || null;
  const responses = response?.data?.responses || [];

  // Update contact status with optimistic updates
  const updateContactStatus = async (status: ContactSubmission['status'], adminNotes?: string) => {
    if (!contactId || !contact) return;

    try {
      // Optimistic update
      const optimisticContact = { ...contact, status, adminNotes: adminNotes || contact.adminNotes };

      // Update cache optimistically
      mutate(
        prev => prev ? {
          ...prev,
          data: {
            ...prev.data,
            submission: optimisticContact
          }
        } : prev,
        false // Don't revalidate immediately
      );

      // Make API call
      const updateRequest: ContactUpdateRequest = { status };
      if (adminNotes !== undefined) {
        updateRequest.adminNotes = adminNotes;
      }

      await updateContact(contactId, updateRequest);

      // Revalidate to get server state
      mutate();

    } catch (error) {
      // Revert optimistic update on error
      mutate();

      const apiError = handleApiError(error);
      throw new Error(getErrorMessage(apiError));
    }
  };

  // Update admin notes
  const updateAdminNotes = async (adminNotes: string) => {
    if (!contactId || !contact) return;

    try {
      // Optimistic update
      const optimisticContact = { ...contact, adminNotes };

      // Update cache optimistically
      mutate(
        prev => prev ? {
          ...prev,
          data: {
            ...prev.data,
            submission: optimisticContact
          }
        } : prev,
        false // Don't revalidate immediately
      );

      // Make API call
      await updateContact(contactId, { adminNotes });

      // Revalidate to get server state
      mutate();

    } catch (error) {
      // Revert optimistic update on error
      mutate();

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
    contact,
    responses,
    isLoading,
    isValidating,
    error: error ? getErrorMessage(handleApiError(error)) : null,

    // Actions
    updateContactStatus,
    updateAdminNotes,
    refresh,
    mutate,
  };
};
