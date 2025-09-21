import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withCache, generateCacheKey, CACHE_TTL } from '@/lib/api-cache';
import { withAdminAuth } from '@/lib/admin-auth';

const prisma = new PrismaClient();

// Types for request/response
interface ContactListRequest {
  status?: 'PENDING' | 'PROCESSED' | 'RESPONDED' | 'ARCHIVED';
  service?: string;
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'submittedAt' | 'status' | 'service';
  sortOrder?: 'asc' | 'desc';
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  service: string;
  message: string;
  newsletter: boolean;
  status: 'PENDING' | 'PROCESSED' | 'RESPONDED' | 'ARCHIVED';
  submittedAt: Date;
  adminNotes: string | null;
  respondedAt: Date | null;
  respondedBy: string | null;
  responseCount: number;
}

interface ContactListResponse {
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

/**
 * GET /api/admin/contacts
 * List all contact submissions with filtering, pagination, and search
 */
export const GET = withAdminAuth(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  // Parse query parameters
  const filters: ContactListRequest = {
    status: searchParams.get('status') as ContactListRequest['status'],
    service: searchParams.get('service') || undefined,
    page: Math.max(1, parseInt(searchParams.get('page') || '1')),
    limit: Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20'))),
    search: searchParams.get('search') || undefined,
    sortBy: (searchParams.get('sortBy') as ContactListRequest['sortBy']) || 'submittedAt',
    sortOrder: (searchParams.get('sortOrder') as ContactListRequest['sortOrder']) || 'desc',
  };

  // Generate cache key from query params
  const cacheParams: Record<string, string | number | boolean | undefined> = {};
  if (filters.status) cacheParams.status = filters.status;
  if (filters.service) cacheParams.service = filters.service;
  if (filters.page) cacheParams.page = filters.page;
  if (filters.limit) cacheParams.limit = filters.limit;
  if (filters.search) cacheParams.search = filters.search;
  if (filters.sortBy) cacheParams.sortBy = filters.sortBy;
  if (filters.sortOrder) cacheParams.sortOrder = filters.sortOrder;

  const cacheKey = generateCacheKey('/api/admin/contacts', cacheParams);

  try {
    const result = await withCache(cacheKey, async () => {
      // Build where clause
      const where: {
        status?: 'PENDING' | 'PROCESSED' | 'RESPONDED' | 'ARCHIVED';
        service?: string;
        OR?: Array<{
          name?: { contains: string };
          email?: { contains: string };
          subject?: { contains: string };
          message?: { contains: string };
        }>;
      } = {};

      if (filters.status) {
        where.status = filters.status;
      }

      if (filters.service) {
        where.service = filters.service;
      }

      if (filters.search) {
        // Convert search to lowercase for case-insensitive search
        const searchLower = filters.search.toLowerCase();
        where.OR = [
          { name: { contains: searchLower } },
          { email: { contains: searchLower } },
          { subject: { contains: searchLower } },
          { message: { contains: searchLower } }
        ];
      }

      // Get total count
      const total = await prisma.contactSubmission.count({ where });

      // Calculate pagination
      const totalPages = Math.ceil(total / filters.limit!);
      const skip = (filters.page! - 1) * filters.limit!;

      // Get submissions
      const submissions = await prisma.contactSubmission.findMany({
        where,
        orderBy: { [filters.sortBy!]: filters.sortOrder },
        skip,
        take: filters.limit!,
        select: {
          id: true,
          name: true,
          email: true,
          subject: true,
          service: true,
          message: true,
          newsletter: true,
          status: true,
          submittedAt: true,
          adminNotes: true,
          respondedAt: true,
          respondedBy: true,
          _count: {
            select: { responses: true }
          }
        },
      });

      // Format response
      const response: ContactListResponse = {
        status: 'success',
        data: {
          submissions: submissions.map(sub => ({
            ...sub,
            responseCount: sub._count.responses,
            _count: undefined
          })),
          total,
          page: filters.page!,
          limit: filters.limit!,
          totalPages,
        },
        message: `Found ${total} contact submissions`,
      };

      return response;
    }, { ttl: CACHE_TTL.QUICK_STATS });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch contact submissions',
      },
      { status: 500 }
    );
  }
});

/**
 * POST /api/admin/contacts/bulk
 * Bulk operations on contact submissions (future enhancement)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // For now, return not implemented
    return NextResponse.json(
      {
        status: 'error',
        message: 'Bulk operations not yet implemented',
      },
      { status: 501 }
    );
  } catch (error) {
    console.error('Error in bulk contact operation:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to process bulk operation',
      },
      { status: 500 }
    );
  }
}
