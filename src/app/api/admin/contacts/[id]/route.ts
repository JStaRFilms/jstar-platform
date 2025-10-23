import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, ContactStatus } from '@prisma/client';
import { withCache, generateCacheKey, CACHE_TTL } from '@/lib/api-cache';
import { withAdminAuth } from '@/lib/admin-auth';

const prisma = new PrismaClient();

// Types for request/response
interface ContactDetailsResponse {
  status: 'success';
  data: ContactSubmissionWithResponses;
  message: string;
}

interface ContactUpdateRequest {
  status?: ContactStatus;
  adminNotes?: string;
  respondedAt?: Date;
  respondedBy?: string;
}

interface ContactUpdateResponse {
  status: 'success';
  data: ContactSubmissionWithResponses;
  message: string;
}

interface ContactSubmissionWithResponses {
  id: string;
  name: string;
  email: string;
  subject: string;
  service: string;
  message: string;
  newsletter: boolean;
  status: ContactStatus;
  submittedAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  adminNotes: string | null;
  respondedAt: Date | null;
  respondedBy: string | null;
  responseCount: number;
  responses?: ContactResponse[];
}

interface ContactResponse {
  id: string;
  response: string;
  responseType: 'EMAIL' | 'CALL' | 'MEETING' | 'NOTE';
  sentAt: Date;
  adminId: string | null;
}

/**
 * GET /api/admin/contacts/[id]
 * Get detailed information about a specific contact submission
 */
export const GET = withAdminAuth(async (
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const params = await context.params;
  if (!params?.id) {
    return NextResponse.json(
      { status: 'error', message: 'Missing contact ID' },
      { status: 400 }
    );
  }

  const cacheKey = generateCacheKey(`/api/admin/contacts/${params.id}`);

  try {
    const result = await withCache(cacheKey, async () => {
      const submission = await prisma.contactSubmission.findUnique({
        where: { id: params.id },
        include: {
          responses: {
            orderBy: { sentAt: 'desc' },
            select: {
              id: true,
              response: true,
              responseType: true,
              sentAt: true,
              adminId: true,
            }
          }
        }
      });

      if (!submission) {
        throw new Error('Contact submission not found');
      }

      const response: ContactDetailsResponse = {
        status: 'success',
        data: {
          ...submission,
          responseCount: submission.responses.length,
        },
        message: 'Contact submission retrieved successfully',
      };

      return response;
    }, { ttl: CACHE_TTL.QUICK_STATS });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching contact submission:', error);

    if (error instanceof Error && error.message === 'Contact submission not found') {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Contact submission not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch contact submission',
      },
      { status: 500 }
    );
  }
});

/**
 * PUT /api/admin/contacts/[id]
 * Update contact submission status and admin notes
 */
export const PUT = withAdminAuth(async (
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const params = await context.params;
  if (!params?.id) {
    return NextResponse.json(
      { status: 'error', message: 'Missing contact ID' },
      { status: 400 }
    );
  }

  try {
    const body: ContactUpdateRequest = await request.json();

    // Validate required fields
    if (!body.status && !body.adminNotes && !body.respondedAt && !body.respondedBy) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'At least one field must be provided for update',
        },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (body.status && !['PENDING', 'PROCESSED', 'RESPONDED', 'ARCHIVED'].includes(body.status)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Invalid status value',
        },
        { status: 400 }
      );
    }

    // Check if submission exists
    const existingSubmission = await prisma.contactSubmission.findUnique({
      where: { id: params.id },
    });

    if (!existingSubmission) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Contact submission not found',
        },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: {
      status?: ContactStatus;
      adminNotes?: string;
      respondedAt?: Date;
      respondedBy?: string;
    } = {};

    if (body.status) updateData.status = body.status;
    if (body.adminNotes !== undefined) updateData.adminNotes = body.adminNotes;
    if (body.respondedAt) updateData.respondedAt = new Date(body.respondedAt);
    if (body.respondedBy) updateData.respondedBy = body.respondedBy;

    // If status is being changed to RESPONDED and no respondedAt is provided, set it now
    if (body.status === 'RESPONDED' && !body.respondedAt) {
      updateData.respondedAt = new Date();
    }

    // Update the submission
    const updatedSubmission = await prisma.contactSubmission.update({
      where: { id: params.id },
      data: updateData,
      include: {
        responses: {
          orderBy: { sentAt: 'desc' },
          select: {
            id: true,
            response: true,
            responseType: true,
            sentAt: true,
            adminId: true,
          }
        }
      }
    });

    const response: ContactUpdateResponse = {
      status: 'success',
      data: {
        ...updatedSubmission,
        responseCount: updatedSubmission.responses.length,
      },
      message: 'Contact submission updated successfully',
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error updating contact submission:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to update contact submission',
      },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/admin/contacts/[id]
 * Archive a contact submission (soft delete by setting status to ARCHIVED)
 */
export const DELETE = withAdminAuth(async (
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const params = await context.params;
  if (!params?.id) {
    return NextResponse.json(
      { status: 'error', message: 'Missing contact ID' },
      { status: 400 }
    );
  }

  try {
    // Check if submission exists
    const existingSubmission = await prisma.contactSubmission.findUnique({
      where: { id: params.id },
    });

    if (!existingSubmission) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Contact submission not found',
        },
        { status: 404 }
      );
    }

    // Archive the submission by updating status
    const archivedSubmission = await prisma.contactSubmission.update({
      where: { id: params.id },
      data: {
        status: 'ARCHIVED',
        adminNotes: (existingSubmission.adminNotes || '') + '\n\n[ARCHIVED] ' + new Date().toISOString(),
      },
    });

    return NextResponse.json({
      status: 'success',
      data: archivedSubmission,
      message: 'Contact submission archived successfully',
    });

  } catch (error) {
    console.error('Error archiving contact submission:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to archive contact submission',
      },
      { status: 500 }
    );
  }
});
