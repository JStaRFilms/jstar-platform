import { Resend } from 'resend';

// Email service abstraction for easy provider switching
export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Initialize Resend (can be easily swapped for SendGrid, Postmark, etc.)
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send email using the configured provider
 * Currently uses Resend, but can be easily switched to SendGrid, Postmark, etc.
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  try {
    const { to, subject, html, text, from } = options;

    // Default sender (customize as needed)
    const fromEmail = from || 'J StaR Films <hello@jstarfilms.com>';

    // Resend requires either 'react' or 'html' - we'll use html
    const emailData: any = {
      from: fromEmail,
      to: Array.isArray(to) ? to : [to],
      subject,
    };

    if (html) {
      emailData.html = html;
    } else if (text) {
      emailData.text = text;
    }

    const result = await resend.emails.send(emailData);

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    console.error('Email sending failed:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email error',
    };
  }
}

/**
 * Send admin notification for new contact form submission
 */
export async function sendAdminNotification(submission: {
  id: string;
  name: string;
  email: string;
  subject: string;
  service: string;
  message: string;
  newsletter: boolean;
  submittedAt: Date;
}): Promise<EmailResult> {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@jstarfilms.com';

  const subject = `New Contact Form Submission: ${submission.subject}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563EB 0%, #8B5CF6 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #2563EB; }
          .value { background: white; padding: 8px; border-radius: 4px; border: 1px solid #e5e7eb; }
          .newsletter { background: #d1fae5; color: #065f46; padding: 8px; border-radius: 4px; display: inline-block; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
            <p>Received at ${submission.submittedAt.toLocaleString()}</p>
          </div>

          <div class="content">
            <div class="field">
              <div class="label">From:</div>
              <div class="value">${submission.name} <${submission.email}></div>
            </div>

            <div class="field">
              <div class="label">Subject:</div>
              <div class="value">${submission.subject}</div>
            </div>

            <div class="field">
              <div class="label">Service:</div>
              <div class="value">${submission.service}</div>
            </div>

            <div class="field">
              <div class="label">Newsletter Signup:</div>
              <div class="value ${submission.newsletter ? 'newsletter' : ''}">
                ${submission.newsletter ? '✅ Yes - Added to newsletter list' : '❌ No'}
              </div>
            </div>

            <div class="field">
              <div class="label">Message:</div>
              <div class="value" style="white-space: pre-wrap;">${submission.message}</div>
            </div>

            <div class="footer">
              <p><strong>Submission ID:</strong> ${submission.id}</p>
              <p>This email was sent automatically from the J StaR Films contact system.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: adminEmail,
    subject,
    html,
  });
}

/**
 * Send confirmation email to user after form submission
 */
export async function sendUserConfirmation(
  userEmail: string,
  userName: string,
  newsletter: boolean
): Promise<EmailResult> {
  const subject = 'Thank you for contacting J StaR Films!';
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Thank you for your message</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563EB 0%, #8B5CF6 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .highlight { background: linear-gradient(135deg, #2563EB 0%, #8B5CF6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; }
          .newsletter { background: #d1fae5; border: 1px solid #a7f3d0; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
          .social { margin: 20px 0; }
          .social a { margin: 0 10px; color: #2563EB; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You, ${userName}!</h1>
            <p>Your message has been received</p>
          </div>

          <div class="content">
            <p>Hi ${userName},</p>

            <p>Thank you for reaching out to <span class="highlight">J StaR Films</span>! I've received your message and will get back to you within 24 hours.</p>

            <p>While you wait, feel free to explore:</p>
            <ul>
              <li><a href="https://jstarfilms.com/portfolio">My portfolio</a> - See examples of my work</li>
              <li><a href="https://jstarfilms.com/services">Services</a> - Learn about what I offer</li>
              <li><a href="https://jstarfilms.com/blog">Blog</a> - Read my latest thoughts on creativity and tech</li>
            </ul>

            ${newsletter ? `
            <div class="newsletter">
              <h3>🎉 Welcome to the newsletter!</h3>
              <p>You'll receive weekly tips on filmmaking, app development, AI tools, and creative entrepreneurship.</p>
            </div>
            ` : ''}

            <p>Looking forward to connecting with you!</p>
            <p>Best regards,<br><strong>John Oluleke-Oke</strong><br>J StaR Films</p>

            <div class="social">
              <a href="https://instagram.com/jstarfilms">Instagram</a> |
              <a href="https://youtube.com/@jstarfilms">YouTube</a> |
              <a href="https://linkedin.com/in/john-oluleke-oke">LinkedIn</a>
            </div>
          </div>

          <div class="footer">
            <p>This email was sent automatically in response to your contact form submission.</p>
            <p>J StaR Films - Where Faith Meets Film and Future</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject,
    html,
  });
}

/**
 * Send newsletter signup confirmation
 */
export async function sendNewsletterSignupConfirmation(
  userEmail: string,
  userName?: string
): Promise<EmailResult> {
  const displayName = userName || 'there';
  const subject = 'Welcome to the J StaR Films Newsletter!';
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to our newsletter</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8B5CF6 0%, #2563EB 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .highlight { background: linear-gradient(135deg, #8B5CF6 0%, #2563EB 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold; }
          .benefits { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B5CF6; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
          .unsubscribe { color: #6b7280; text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome aboard! 🎉</h1>
            <p>You're now part of the J StaR Films community</p>
          </div>

          <div class="content">
            <p>Hi ${displayName},</p>

            <p>Thank you for subscribing to the <span class="highlight">J StaR Films newsletter</span>! You're joining a community of creators, filmmakers, and entrepreneurs who are passionate about using technology and creativity to make an impact.</p>

            <div class="benefits">
              <h3>What you'll receive:</h3>
              <ul>
                <li>🎬 <strong>Filmmaking Tips:</strong> Behind-the-scenes insights and techniques</li>
                <li>💻 <strong>Tech Tutorials:</strong> App development and AI tool guides</li>
                <li>🚀 <strong>Business Strategies:</strong> Growing your creative business</li>
                <li>🙏 <strong>Inspiration:</strong> Faith-based motivation and encouragement</li>
                <li>🎁 <strong>Exclusive Content:</strong> Free resources and early access</li>
              </ul>
            </div>

            <p><strong>Next steps:</strong></p>
            <ol>
              <li>Check your inbox for the first newsletter (usually sent every Wednesday)</li>
              <li><a href="https://jstarfilms.com/blog">Explore the blog</a> for immediate value</li>
              <li><a href="https://jstarfilms.com/portfolio">View my portfolio</a> to see my work</li>
            </ol>

            <p>I'm excited to be part of your creative journey!</p>
            <p>Best regards,<br><strong>John Oluleke-Oke</strong><br>J StaR Films</p>
          </div>

          <div class="footer">
            <p>You can <a href="#" class="unsubscribe">unsubscribe</a> at any time.</p>
            <p>J StaR Films - Where Faith Meets Film and Future</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject,
    html,
  });
}
