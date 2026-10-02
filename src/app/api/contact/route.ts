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

// Rate limiting (simple in-memory store - replace with Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 3; // 3 submissions per 15 minutes

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const userLimit = rateLimitStore.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    // Reset or new user
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetTime: now + RATE_LIMIT_WINDOW };
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetTime: userLimit.resetTime };
  }

  userLimit.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - userLimit.count, resetTime: userLimit.resetTime };
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP (in production, use proper IP detection)
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Check rate limit
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        { status: 429 }
      );
    }

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
      phone: body.phone?.trim() || null,
      submittedAt: new Date(),
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || undefined,
      status: 'pending'
    };

    let savedSubmission;

    try {
      // Save to database
      savedSubmission = await prisma.contactSubmission.create({
        data: {
          name: submission.name,
          email: submission.email,
          phone: submission.phone,
          subject: submission.subject,
          service: submission.service,
          message: submission.message,
          newsletter: submission.newsletter,
          ipAddress: submission.ipAddress,
          userAgent: submission.userAgent,
          status: 'PENDING',
        }
      });

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

    // Send email notifications (don't fail the request if emails fail)
    try {
      // Send admin notification
      await sendAdminNotification({
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

      // Send user confirmation
      await sendUserConfirmation(submission.email, submission.name, submission.newsletter);

      // Send newsletter signup confirmation if they opted in
      if (submission.newsletter) {
        await sendNewsletterSignupConfirmation(submission.email, submission.name);
      }

    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if emails fail - log and continue
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

    return NextResponse.json({
      status: 'success',
      message: 'Message received successfully',
      data: {
        id: savedSubmission.id,
        submittedAt: submission.submittedAt,
        status: submission.status
      }
    });

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
