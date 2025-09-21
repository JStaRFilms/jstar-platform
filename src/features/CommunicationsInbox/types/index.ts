/**
 * TypeScript interfaces and types for Communications Inbox feature
 * Based on Prisma schema and API response structures
 */

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  service: string;
  message: string;
  newsletter: boolean;
  status: ContactStatus;
  submittedAt: Date;
  adminNotes: string | null;
  respondedAt: Date | null;
  respondedBy: string | null;
  responseCount: number;
  // Additional metadata from API
  ipAddress?: string;
  userAgent?: string;
}

export interface ContactResponse {
  id: string;
  submissionId: string;
  adminId?: string;
  response: string;
  responseType: ResponseType;
  sentAt: Date;
}

export interface ContactAnalytics {
  id: string;
  date: Date;
  submissions: number;
  newsletterSignups: number;
  serviceBreakdown?: Record<string, number>;
}

export interface ContactFilters {
  status?: ContactStatus[];
  service?: string[];
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'submittedAt' | 'status' | 'service';
  sortOrder?: 'asc' | 'desc';
}

export interface ContactListResponse {
  status: 'success';
  data: {
    submissions: ContactSubmission[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
}

export interface ContactDetailResponse {
  status: 'success';
  data: {
    submission: ContactSubmission;
    responses: ContactResponse[];
  };
  message: string;
}

export interface ContactUpdateRequest {
  status?: ContactStatus;
  adminNotes?: string;
}

export interface ContactUpdateResponse {
  status: 'success';
  data: ContactSubmission;
  message: string;
}

export interface SendResponseRequest {
  response: string;
  responseType?: ResponseType;
  adminNotes?: string;
}

export interface SendResponseResponse {
  status: 'success';
  data: {
    submission: ContactSubmission;
    response: ContactResponse;
  };
  message: string;
}

export interface AnalyticsResponse {
  status: 'success';
  data: {
    totalSubmissions: number;
    pendingCount: number;
    processedCount: number;
    respondedCount: number;
    archivedCount: number;
    newsletterSignups: number;
    recentSubmissions: number;
    recentSignups: number;
    serviceBreakdown: Record<string, number>;
    dailyStats: Array<{
      date: string;
      submissions: number;
      signups: number;
    }>;
  };
  message: string;
}

export class ApiError extends Error {
  status: number;
  details?: any;

  constructor(status: number, message: string, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
    this.name = 'ApiError';
  }
}

// Enums matching Prisma schema
export enum ContactStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  RESPONDED = 'RESPONDED',
  ARCHIVED = 'ARCHIVED'
}

export enum ResponseType {
  EMAIL = 'EMAIL',
  CALL = 'CALL',
  MEETING = 'MEETING',
  NOTE = 'NOTE'
}

// UI-specific types for the Communications Inbox
export interface MessageStats {
  total: number;
  unread: number;
  responded: number;
  responseRate: number;
  avgResponseTime: string;
}

export type MessageFilter = 'all' | 'unread' | 'today' | 'week';

// Legacy interface for backward compatibility during migration
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
