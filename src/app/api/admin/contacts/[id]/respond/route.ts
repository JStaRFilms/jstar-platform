import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withAdminAuth } from '@/lib/admin-auth';

const prisma = new PrismaClient();

// Types for request/response
interface SendResponseRequest {
  response: string;
  responseType?: 'EMAIL' | 'CALL' | 'MEETING' | 'NOTE';
  adminNotes?: string;
}

interface SendResponseResponse {
  status: 'success';
  data: {
    submission: ContactSubmissionWithResponses;
    response: ContactResponse;
  };
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
  status: 'PENDING' | 'PROCESSED' | 'RESPONDED' | 'ARCHIVED';
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
 * POST /api/admin/contacts/[id]/respond
 * Send a response to a contact submission
 */
export const POST = withAdminAuth(async (
  request: NextRequest,
  context?: { params: { id: string } }
) => {
  const params = context?.params;
  if (!params?.id) {
    return NextResponse.json(
      { status: 'error', message: 'Missing contact ID' },
      { status: 400 }
    );
  }

  try {
    const body: SendResponseRequest = await request.json();

    // Validate required fields
    if (!body.response || body.response.trim().length === 0) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Response text is required',
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

    // Create the response record
    const responseRecord = await prisma.contactResponse.create({
      data: {
        submissionId: params.id,
        response: body.response.trim(),
        responseType: body.responseType || 'EMAIL',
        // adminId would be set from authentication context in production
        adminId: null, // TODO: Get from auth context
      },
    });

    // Update the submission status and response info
    const updatedSubmission = await prisma.contactSubmission.update({
      where: { id: params.id },
      data: {
        status: 'RESPONDED',
        respondedAt: new Date(),
        respondedBy: 'Admin', // TODO: Get from auth context
        adminNotes: body.adminNotes
          ? (existingSubmission.adminNotes || '') + '\n\n' + body.adminNotes
          : existingSubmission.adminNotes,
      },
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

    const response: SendResponseResponse = {
      status: 'success',
      data: {
        submission: {
          ...updatedSubmission,
          responseCount: updatedSubmission.responses.length,
        },
        response: responseRecord,
      },
      message: 'Response sent successfully',
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error sending response:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to send response',
      },
      { status: 500 }
    );
  }
});
