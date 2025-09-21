import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withAdminAuth } from '@/lib/admin-auth';
import { sendEmail } from '@/lib/email';

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
  context?: { params: Promise<{ id: string }> }
) => {
  const params = await context?.params;
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

    // Send email to the contact (don't fail the request if email fails)
    if (body.responseType === 'EMAIL' || !body.responseType) {
      try {
        const emailSubject = `Re: ${existingSubmission.subject}`;
        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Response from J StaR Films</title>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #2563EB 0%, #8B5CF6 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
                .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
                .original-message { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e5e7eb; }
                .response { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563EB; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
                .highlight { background: linear-gradient(135deg, #2563EB 0%, #8B5CF6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Response from J StaR Films</h1>
                  <p>Thank you for your message</p>
                </div>

                <div class="content">
                  <p>Hi ${existingSubmission.name},</p>

                  <div class="response">
                    <p><strong>My Response:</strong></p>
                    <div style="white-space: pre-wrap;">${body.response}</div>
                  </div>

                  <div class="original-message">
                    <p><strong>Your Original Message:</strong></p>
                    <p><em>Subject: ${existingSubmission.subject}</em></p>
                    <div style="white-space: pre-wrap;">${existingSubmission.message}</div>
                  </div>

                  <p>If you have any further questions or need additional information, please don't hesitate to reach out.</p>

                  <p>Best regards,<br><strong>John Oluleke-Oke</strong><br>J StaR Films<br>Where Faith Meets Film and Future</p>

                  <div style="text-align: center; margin: 20px 0;">
                    <a href="https://jstarfilms.com" style="background: linear-gradient(135deg, #2563EB 0%, #8B5CF6 100%); color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Visit My Website</a>
                  </div>
                </div>

                <div class="footer">
                  <p>This email was sent in response to your contact form submission.</p>
                  <p>J StaR Films - Professional Cinematography & App Development</p>
                </div>
              </div>
            </body>
          </html>
        `;

        await sendEmail({
          to: existingSubmission.email,
          subject: emailSubject,
          html: emailHtml,
        });

        console.log(`Response email sent to ${existingSubmission.email}`);

      } catch (emailError) {
        console.error('Failed to send response email:', emailError);
        // Don't fail the entire request if email fails
        // The response was still recorded in the database
      }
    }

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
