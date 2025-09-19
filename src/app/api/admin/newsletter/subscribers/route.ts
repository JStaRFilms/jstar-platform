import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withCache, generateCacheKey, CACHE_TTL } from '@/lib/api-cache';
import { withAdminAuth } from '@/lib/admin-auth';

const prisma = new PrismaClient();

// Types for request/response
interface SubscriberListRequest {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  source?: string;
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  name: string | null;
  subscribedAt: Date;
  unsubscribedAt: Date | null;
  isActive: boolean;
  source: string | null;
  tags: string | null;
}

interface SubscriberListResponse {
  status: 'success';
  data: {
    subscribers: NewsletterSubscriber[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
}

/**
 * GET /api/admin/newsletter/subscribers
 * List newsletter subscribers with filtering and pagination
 */
export const GET = withAdminAuth(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  // Parse query parameters
  const filters: SubscriberListRequest = {
    page: Math.max(1, parseInt(searchParams.get('page') || '1')),
    limit: Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20'))),
    search: searchParams.get('search') || undefined,
    isActive: searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined,
    source: searchParams.get('source') || undefined,
  };

  // Generate cache key from query params
  const cacheParams: Record<string, string | number | boolean | undefined> = {};
  if (filters.page) cacheParams.page = filters.page;
  if (filters.limit) cacheParams.limit = filters.limit;
  if (filters.search) cacheParams.search = filters.search;
  if (filters.isActive !== undefined) cacheParams.isActive = filters.isActive;
  if (filters.source) cacheParams.source = filters.source;

  const cacheKey = generateCacheKey('/api/admin/newsletter/subscribers', cacheParams);

  try {
    const result = await withCache(cacheKey, async () => {
      // Build where clause
      const where: {
        isActive?: boolean;
        source?: string;
        OR?: Array<{
          email?: { contains: string; mode: 'insensitive' };
          name?: { contains: string; mode: 'insensitive' };
          tags?: { contains: string; mode: 'insensitive' };
        }>;
      } = {};

      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      if (filters.source) {
        where.source = filters.source;
      }

      if (filters.search) {
        where.OR = [
          { email: { contains: filters.search, mode: 'insensitive' } },
          { name: { contains: filters.search, mode: 'insensitive' } },
          { tags: { contains: filters.search, mode: 'insensitive' } }
        ];
      }

      // Get total count
      const total = await prisma.newsletterSubscriber.count({ where });

      // Calculate pagination
      const totalPages = Math.ceil(total / filters.limit!);
      const skip = (filters.page! - 1) * filters.limit!;

      // Get subscribers
      const subscribers = await prisma.newsletterSubscriber.findMany({
        where,
        orderBy: { subscribedAt: 'desc' },
        skip,
        take: filters.limit!,
        select: {
          id: true,
          email: true,
          name: true,
          subscribedAt: true,
          unsubscribedAt: true,
          isActive: true,
          source: true,
          tags: true,
        },
      });

      // Format response
      const response: SubscriberListResponse = {
        status: 'success',
        data: {
          subscribers,
          total,
          page: filters.page!,
          limit: filters.limit!,
          totalPages,
        },
        message: `Found ${total} newsletter subscribers`,
      };

      return response;
    }, { ttl: CACHE_TTL.QUICK_STATS });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch newsletter subscribers',
      },
      { status: 500 }
    );
  }
});

/**
 * POST /api/admin/newsletter/subscribers
 * Add a new newsletter subscriber (admin action)
 */
export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.email) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Email is required',
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid email format',
        },
        { status: 400 }
      );
    }

    // Check if subscriber already exists
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: body.email },
    });

    if (existingSubscriber) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Subscriber with this email already exists',
        },
        { status: 409 }
      );
    }

    // Create new subscriber
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: body.email,
        name: body.name || null,
        source: body.source || 'admin_added',
        tags: body.tags || null,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });

    return NextResponse.json(
      {
        status: 'success',
        data: subscriber,
        message: 'Newsletter subscriber added successfully',
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error adding newsletter subscriber:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to add newsletter subscriber',
      },
      { status: 500 }
    );
  }
});
