import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendAdminNotification, sendUserConfirmation, sendNewsletterSignupConfirmation } from '@/lib/email';

const prisma = new PrismaClient();

// TypeScript interfaces (shared with frontend)
interface ContactFormData {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  service: string;
  message: string;
  newsletter: boolean;
}

interface ContactSubmission extends ContactFormData {
  id?: string;
  submittedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  status: 'pending' | 'processed' | 'responded';
}

// Validation function (server-side)
function validateContactData(data: unknown, errors: string[]): data is ContactFormData {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    errors.push('Request body must be an object');
    return false;
  }

  if (!('name' in data) || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }

  if (!('email' in data) || typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Valid email address is required');
  }

  if ('phone' in data && data.phone != null) {
    if (typeof data.phone !== 'string') {
      errors.push('Phone must be a string');
    } else {
      const phone = data.phone.trim();
      if (phone.length > 40 || (phone && (!/^[+0-9(). -]+$/.test(phone) || !/[0-9]/.test(phone)))) {
        errors.push('Phone must be at most 40 characters and contain a valid phone number');
      }
    }
  }

  if (!('subject' in data) || typeof data.subject !== 'string' || data.subject.trim().length === 0) {
    errors.push('Subject is required');
  }

  if (!('service' in data) || typeof data.service !== 'string' || data.service.length === 0) {
    errors.push('Service selection is required');
  }

  if (!('message' in data) || typeof data.message !== 'string' || data.message.trim().length < 10) {
    errors.push('Message is required and must be at least 10 characters');
  }

  if (!('newsletter' in data) || typeof data.newsletter !== 'boolean') {
    errors.push('Newsletter preference must be specified');
  }

  return errors.length === 0;
}

const CONTACT_COOLDOWN = 60 * 1000;
const CONTACT_WINDOW = 15 * 60 * 1000;
const CONTACT_MAX_REQUESTS = 3;

export async function POST(request: NextRequest) {
  try {
    const ip = (request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip'))?.split(',')[0].trim() || 'unknown';

    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { status: 'error', message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate input data
    const errors: string[] = [];
    if (!validateContactData(body, errors)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Validation failed',
          errors
        },
        { status: 400 }
      );
    }

    // Create submission object
    const submission: ContactSubmission = {
      ...body,
      name: body.name.trim(),
      email: body.email.trim(),
      subject: body.subject.trim(),
      service: body.service.trim(),
      message: body.message.trim(),
      phone: body.phone?.trim() || null,
      submittedAt: new Date(),
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || undefined,
      status: 'pending'
    };

    let savedSubmission;

    try {
      const saved = await prisma.$transaction(async transaction => {
        // Transaction locks serialize overlapping senders/IPs across serverless instances.
        // Select an integer instead of decoding the lock function's PostgreSQL void result.
        // Release the locks before contacting the email provider.
        await transaction.$queryRaw`SELECT 1 AS locked FROM pg_advisory_xact_lock(hashtextextended(${`jstar-contact:ip:${ip}`}, 0))`;
        await transaction.$queryRaw`SELECT 1 AS locked FROM pg_advisory_xact_lock(hashtextextended(${`jstar-contact:email:${submission.email.toLowerCase()}`}, 0))`;
        const since = new Date(Date.now() - CONTACT_WINDOW);
        const email = { equals: submission.email, mode: 'insensitive' as const };
        const duplicate = await transaction.contactSubmission.findFirst({
          where: {
            email, name: submission.name, phone: submission.phone, subject: submission.subject,
            service: submission.service, message: submission.message, newsletter: submission.newsletter,
            submittedAt: { gte: since },
          },
          orderBy: { submittedAt: 'desc' }, select: { id: true, submittedAt: true },
        });
        if (duplicate) return { kind: 'duplicate', submission: duplicate } as const;
        const recent = await transaction.contactSubmission.findMany({
          where: { OR: [{ ipAddress: ip }, { email }], submittedAt: { gte: since } },
          orderBy: { submittedAt: 'desc' }, take: CONTACT_MAX_REQUESTS, select: { submittedAt: true },
        });
        const nextAllowed = Math.max(
          recent[0] ? recent[0].submittedAt.getTime() + CONTACT_COOLDOWN : 0,
          recent.length === CONTACT_MAX_REQUESTS ? recent[CONTACT_MAX_REQUESTS - 1].submittedAt.getTime() + CONTACT_WINDOW : 0,
        );
        const retryAfter = Math.ceil((nextAllowed - Date.now()) / 1000);
        if (retryAfter > 0) return { kind: 'limited', retryAfter } as const;
        const created = await transaction.contactSubmission.create({
          data: {
            name: submission.name, email: submission.email, phone: submission.phone,
            subject: submission.subject, service: submission.service, message: submission.message,
            newsletter: submission.newsletter, ipAddress: ip, userAgent: submission.userAgent, status: 'PENDING',
          },
        });
        return { kind: 'created', submission: created } as const;
      }, { isolationLevel: 'ReadCommitted' });
      if (saved.kind === 'limited') {
        return NextResponse.json({
          status: 'error', message: `Please wait ${saved.retryAfter} seconds before sending another enquiry.`, retryAfter: saved.retryAfter,
        }, { status: 429, headers: { 'Retry-After': String(saved.retryAfter) } });
      }
      if (saved.kind === 'duplicate') {
        return NextResponse.json({
          status: 'duplicate', message: 'We already have this enquiry. No duplicate email was sent. You do not need to submit it again.',
          retryAfter: Math.max(0, Math.ceil((saved.submission.submittedAt.getTime() + CONTACT_COOLDOWN - Date.now()) / 1000)),
          data: { id: saved.submission.id, submittedAt: saved.submission.submittedAt, saved: true },
        });
      }
      savedSubmission = saved.submission;

    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { status: 'error', message: 'Could not save your message. Please try again later.' },
        { status: 500 }
      );
    }

    // Newsletter and analytics updates are best-effort after the contact is saved.
    try {
      // Handle newsletter signup
      if (submission.newsletter) {
        await prisma.newsletterSubscriber.upsert({
          where: { email: submission.email },
          update: {
            name: submission.name,
            isActive: true,
            source: 'contact_form',
            tags: JSON.stringify(['contact_form'])
          },
          create: {
            email: submission.email,
            name: submission.name,
            source: 'contact_form',
            tags: JSON.stringify(['contact_form'])
          }
        });
      }

      // Update analytics
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await prisma.contactAnalytics.upsert({
        where: { date: today },
        update: {
          submissions: { increment: 1 },
          newsletterSignups: submission.newsletter ? { increment: 1 } : undefined,
        },
        create: {
          date: today,
          submissions: 1,
          newsletterSignups: submission.newsletter ? 1 : 0,
        }
      });

    } catch (dbError) {
      console.error('Newsletter or analytics update failed:', dbError);
    }

    // Saving and provider acceptance are separate outcomes. Do not repeat accepted mail.
    let notificationAccepted = false;
    let acknowledgementAccepted = false;
    let newsletterAccepted = !submission.newsletter;
    try {
      const notification = await sendAdminNotification({
        id: savedSubmission.id,
        name: submission.name,
        email: submission.email,
        phone: submission.phone,
        subject: submission.subject,
        service: submission.service,
        message: submission.message,
        newsletter: submission.newsletter,
        submittedAt: submission.submittedAt,
      });

      notificationAccepted = notification.success;
      if (notificationAccepted) {
        const acknowledgement = await sendUserConfirmation(submission.email, submission.name, submission.newsletter, {
          service: submission.service, subject: submission.subject, message: submission.message,
        });
        acknowledgementAccepted = acknowledgement.success;
        if (acknowledgementAccepted && submission.newsletter) {
          const newsletter = await sendNewsletterSignupConfirmation(submission.email, submission.name);
          newsletterAccepted = newsletter.success;
        }
      }
    } catch {
      console.error('Contact email acceptance could not be confirmed', { submissionId: savedSubmission.id });
    }

    // Log submission (in production, use proper logging)
    console.log('Contact form submission saved:', {
      id: savedSubmission.id,
      name: submission.name,
      email: submission.email,
      service: submission.service,
      newsletter: submission.newsletter,
      submittedAt: submission.submittedAt
    });

    const complete = notificationAccepted && acknowledgementAccepted && newsletterAccepted;
    const message = !notificationAccepted
      ? 'Your enquiry is saved, but we could not confirm the team notification email. Please do not resubmit. Contact us directly if it is urgent.'
      : !acknowledgementAccepted
        ? 'Your enquiry is saved, but we could not confirm your acknowledgement email. Please do not resubmit.'
        : !newsletterAccepted
          ? 'Your enquiry is saved, but we could not confirm your newsletter welcome email. Please do not resubmit.'
          : 'Message received successfully';
    return NextResponse.json({
      status: complete ? 'success' : 'partial',
      message,
      retryAfter: Math.max(0, Math.ceil((savedSubmission.submittedAt.getTime() + CONTACT_COOLDOWN - Date.now()) / 1000)),
      data: {
        id: savedSubmission.id,
        submittedAt: submission.submittedAt,
        status: submission.status,
        saved: true,
        emailAcceptance: {
          notification: notificationAccepted,
          acknowledgement: acknowledgementAccepted,
          newsletter: submission.newsletter ? newsletterAccepted : null,
        },
      }
    }, { status: complete ? 200 : 202 });

  } catch (error) {
    console.error('Contact form submission error:', error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Internal server error. Please try again later.'
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
