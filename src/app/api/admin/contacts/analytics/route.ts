import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withCache, generateCacheKey, CACHE_TTL } from '@/lib/api-cache';
import { withAdminAuth } from '@/lib/admin-auth';

const prisma = new PrismaClient();

// Types for request/response
interface ContactAnalyticsResponse {
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

/**
 * GET /api/admin/contacts/analytics
 * Get comprehensive contact analytics and metrics
 */
export const GET = withAdminAuth(async (_request: NextRequest) => {
  const cacheKey = generateCacheKey('/api/admin/contacts/analytics');

  try {
    const result = await withCache(cacheKey, async () => {
      // Get date ranges for recent activity
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const _thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Get overall counts
      const [
        totalSubmissions,
        pendingCount,
        processedCount,
        respondedCount,
        archivedCount,
        newsletterSignups,
        recentSubmissions,
        recentSignups,
      ] = await Promise.all([
        prisma.contactSubmission.count(),
        prisma.contactSubmission.count({ where: { status: 'PENDING' } }),
        prisma.contactSubmission.count({ where: { status: 'PROCESSED' } }),
        prisma.contactSubmission.count({ where: { status: 'RESPONDED' } }),
        prisma.contactSubmission.count({ where: { status: 'ARCHIVED' } }),
        prisma.newsletterSubscriber.count({ where: { isActive: true } }),
        prisma.contactSubmission.count({
          where: { submittedAt: { gte: sevenDaysAgo } }
        }),
        prisma.newsletterSubscriber.count({
          where: {
            subscribedAt: { gte: sevenDaysAgo },
            isActive: true
          }
        }),
      ]);

      // Get service breakdown
      const serviceStats = await prisma.contactSubmission.groupBy({
        by: ['service'],
        _count: { service: true },
        orderBy: { _count: { service: 'desc' } },
      });

      const serviceBreakdown: Record<string, number> = {};
      serviceStats.forEach(stat => {
        serviceBreakdown[stat.service] = stat._count.service;
      });

      // Get daily stats for the last 30 days
      const dailyStats = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

        const [daySubmissions, daySignups] = await Promise.all([
          prisma.contactSubmission.count({
            where: {
              submittedAt: {
                gte: startOfDay,
                lt: endOfDay,
              },
            },
          }),
          prisma.newsletterSubscriber.count({
            where: {
              subscribedAt: {
                gte: startOfDay,
                lt: endOfDay,
              },
              isActive: true,
            },
          }),
        ]);

        dailyStats.push({
          date: startOfDay.toISOString().split('T')[0],
          submissions: daySubmissions,
          signups: daySignups,
        });
      }

      const response: ContactAnalyticsResponse = {
        status: 'success',
        data: {
          totalSubmissions,
          pendingCount,
          processedCount,
          respondedCount,
          archivedCount,
          newsletterSignups,
          recentSubmissions,
          recentSignups,
          serviceBreakdown,
          dailyStats,
        },
        message: 'Contact analytics retrieved successfully',
      };

      return response;
    }, { ttl: CACHE_TTL.SYSTEM_METRICS }); // Use longer cache for analytics

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching contact analytics:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch contact analytics',
      },
      { status: 500 }
    );
  }
});
