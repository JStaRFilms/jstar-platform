/**
 * API utilities for Communications Inbox
 * Centralized API calling and error handling
 */

import { ContactFilters, ContactListResponse, ContactDetailResponse, ContactUpdateRequest, ContactUpdateResponse, SendResponseRequest, SendResponseResponse, AnalyticsResponse, ApiError } from '@/features/CommunicationsInbox/types';

/**
 * Get admin authentication token
 * TODO: Implement proper token management
 */
const getAdminToken = (): string | null => {
  // For now, return a placeholder token
  // In production, this should get the token from secure storage
  return process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin-token-placeholder';
};

/**
 * Generic API call function with error handling
 */
export const apiCall = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  const token = getAdminToken();

  if (!token) {
    throw new ApiError(401, 'Admin authentication required');
  }

  try {
    const response = await fetch(`/api/admin${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options?.headers
      },
      ...options
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new ApiError(response.status, errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network or other errors
    throw new ApiError(0, error instanceof Error ? error.message : 'Network error');
  }
};

/**
 * Fetch contact submissions with filtering and pagination
 */
export const fetchContacts = async (filters: ContactFilters = {}): Promise<ContactListResponse> => {
  const params = new URLSearchParams();

  if (filters.status?.length) params.append('status', filters.status.join(','));
  if (filters.service?.length) params.append('service', filters.service.join(','));
  if (filters.search) params.append('search', filters.search);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

  const queryString = params.toString();
  const endpoint = `/contacts${queryString ? `?${queryString}` : ''}`;

  return apiCall<ContactListResponse>(endpoint);
};

/**
 * Fetch individual contact details with responses
 */
export const fetchContactDetails = async (contactId: string): Promise<ContactDetailResponse> => {
  return apiCall<ContactDetailResponse>(`/contacts/${contactId}`);
};

/**
 * Update contact status and notes
 */
export const updateContact = async (
  contactId: string,
  updates: ContactUpdateRequest
): Promise<ContactUpdateResponse> => {
  return apiCall<ContactUpdateResponse>(`/contacts/${contactId}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
};

/**
 * Send response to contact
 */
export const sendContactResponse = async (
  contactId: string,
  responseData: SendResponseRequest
): Promise<SendResponseResponse> => {
  return apiCall<SendResponseResponse>(`/contacts/${contactId}/respond`, {
    method: 'POST',
    body: JSON.stringify(responseData)
  });
};

/**
 * Fetch analytics data
 */
export const fetchAnalytics = async (): Promise<AnalyticsResponse> => {
  return apiCall<AnalyticsResponse>('/contacts/analytics');
};

/**
 * Archive contact (soft delete)
 */
export const archiveContact = async (contactId: string): Promise<ContactUpdateResponse> => {
  return updateContact(contactId, { status: 'ARCHIVED' as any });
};

/**
 * Handle API errors with user-friendly messages
 */
export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(0, error.message);
  }

  return new ApiError(0, 'An unexpected error occurred');
};

/**
 * Get user-friendly error message
 */
export const getErrorMessage = (error: ApiError): string => {
  switch (error.status) {
    case 401:
      return 'Authentication required. Please log in again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
};
