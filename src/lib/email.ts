import { Resend, type CreateEmailOptions } from 'resend';
import { businessInfo } from '@/content/contact';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export type EmailResult =
  | { success: true; messageId: string }
  | { success: false; error: string };

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function teamInbox(): string {
  return process.env.ADMIN_EMAIL?.trim() || 'hey@jstarstudios.com';
}

function isValidResendKey(): boolean {
  const apiKey = process.env.RESEND_API_KEY;
  return !!apiKey && apiKey !== 'your_resend_api_key_here' && apiKey.trim() !== '' && apiKey.startsWith('re_');
}

// Resolve lazily so builds and local HTML previews need no provider credential.
function getResendInstance(): Resend | null {
  if (!isValidResendKey()) {
    console.warn('Resend API key not configured properly. Email functions will return gracefully.');
    return null;
  }
  try {
    return new Resend(process.env.RESEND_API_KEY);
  } catch (error) {
    console.error('Failed to initialize Resend client:', error);
    return null;
  }
}

export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  try {
    const resend = getResendInstance();
    if (!resend) {
      return { success: false, error: 'Email service not configured - check RESEND_API_KEY environment variable' };
    }
    const { to, subject, html, text, from, replyTo } = options;
    const fields = {
      from: from || process.env.EMAIL_FROM?.trim() || 'J StaR Films Studios <hey@jstarstudios.com>',
      to: Array.isArray(to) ? to : [to],
      subject,
      ...(replyTo ? { replyTo } : {}),
    };
    const emailData: CreateEmailOptions = html ? { ...fields, html } : { ...fields, text: text || '' };
    const result = await resend.emails.send(emailData);
    if (result.error) return { success: false, error: result.error.message };
    if (!result.data?.id?.trim()) return { success: false, error: 'Email provider did not return a message ID' };
    return { success: true, messageId: result.data.id };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown email error' };
  }
}

const website = 'https://jstarstudios.com';
const paragraph = 'margin:0 0 18px;font-size:16px;line-height:1.65;color:#344a43;';
const grain = `${website}/redesign/email-grain.png`;
const studioLogo = `${website}/redesign/email-studio-logo.png`;

// Texture and logo are decorative. Solid backgrounds and the text wordmark survive image blocking.
function emailLayout(label: string, preheader: string, title: string, content: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)} | J StaR Films Studios</title>
<style>@media(max-width:480px){.email-pad{padding-left:24px!important;padding-right:24px!important}.email-title{font-size:30px!important}.email-label{width:78px!important}.email-brand{font-size:32px!important}.email-logo-cell{width:88px!important}.email-logo{width:80px!important;height:80px!important}}</style>
</head><body style="margin:0;padding:0;background:#f3f4e9;font-family:Arial,Helvetica,sans-serif;color:#001514;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f3f4e9" background="${grain}" style="background-color:#f3f4e9;background-image:url('${grain}');background-repeat:repeat;"><tr><td align="center" style="padding:24px 12px;">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#fbfffe" background="${grain}" style="width:100%;max-width:600px;background-color:#fbfffe;background-image:url('${grain}');background-repeat:repeat;">
<tr><td class="email-pad" bgcolor="#001514" background="${grain}" style="padding:24px 36px;border-bottom:4px solid #b5e619;background-color:#001514;background-image:url('${grain}');background-repeat:repeat;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td valign="middle"><a class="email-brand" href="${website}" style="display:inline-block;color:#fbfffe;text-decoration:none;font-size:36px;font-weight:700;line-height:1;letter-spacing:-2px;white-space:nowrap;">J StaR<span style="display:block;margin-top:9px;font-size:10px;font-weight:400;letter-spacing:3px;">FILMS STUDIOS</span></a>
<p style="margin:22px 0 0;color:#b5e619;font-size:10px;line-height:1.5;letter-spacing:2px;">${escapeHtml(label)}</p></td>
<td class="email-logo-cell" width="136" align="right" valign="middle" style="width:136px;"><a href="${website}" aria-label="J StaR Films Studios"><img class="email-logo" src="${studioLogo}" width="120" height="120" alt="" border="0" style="display:block;width:120px;height:120px;"></a></td>
</tr></table>
</td></tr>
<tr><td class="email-pad" style="padding:32px 36px 18px;">
<h1 class="email-title" style="margin:0 0 24px;font-size:36px;line-height:1.1;letter-spacing:-1.4px;font-weight:700;color:#001514;">${escapeHtml(title)}</h1>
${content}
</td></tr>
<tr><td class="email-pad" style="padding:22px 36px 28px;border-top:1px solid #dce4de;">
<p style="margin:0 0 14px;font-size:13px;line-height:1.5;"><a href="${website}" style="color:#001514;text-decoration:none;font-weight:700;">jstarstudios.com</a></p>
<p style="margin:0 0 16px;font-size:12px;line-height:1.8;">
<a href="${businessInfo.socialLinks.instagram}" style="color:#344a43;text-decoration:underline;">Instagram</a>&nbsp;&nbsp;·&nbsp;&nbsp;
<a href="https://youtube.com/@jstarfilms" style="color:#344a43;text-decoration:underline;">YouTube</a>&nbsp;&nbsp;·&nbsp;&nbsp;
<a href="${businessInfo.socialLinks.linkedin}" style="color:#344a43;text-decoration:underline;">LinkedIn</a></p>
<p style="margin:0;font-size:11px;line-height:1.6;color:#64736b;">J StaR Films Studios<br>Films you feel. Software you use.</p>
</td></tr></table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table></body></html>`;
}

function emailButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 16px;"><tr><td bgcolor="#b5e619" style="background:#b5e619;"><a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 20px;border:1px solid #b5e619;font-size:14px;font-weight:700;line-height:1.4;color:#001514;text-decoration:none;">${escapeHtml(label)} &#8599;</a></td></tr></table>`;
}

export async function sendAdminNotification(submission: {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  service: string;
  message: string;
  newsletter: boolean;
  submittedAt: Date;
}): Promise<EmailResult> {
  const fields = {
    name: escapeHtml(submission.name), email: escapeHtml(submission.email),
    subject: escapeHtml(submission.subject), service: escapeHtml(submission.service),
    message: escapeHtml(submission.message), id: escapeHtml(submission.id),
  };
  const labelStyle = 'width:96px;padding:12px 12px 12px 0;border-bottom:1px solid #dce4de;color:#64736b;font-size:12px;line-height:1.6;';
  const valueStyle = 'padding:12px 0;border-bottom:1px solid #dce4de;color:#001514;font-size:14px;line-height:1.6;word-break:break-word;';
  const reply = `mailto:${encodeURIComponent(submission.email)}?subject=${encodeURIComponent('Re: ' + submission.subject)}`;
  const html = emailLayout('FOR THE STUDIO', `A new ${submission.service} enquiry from ${submission.name}.`, 'A new project enquiry.', `
<p style="${paragraph}">The details are below. Reply directly to this email to reach ${fields.name}.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 26px;table-layout:fixed;">
<tr><td class="email-label" valign="top" style="${labelStyle}">From</td><td style="${valueStyle}"><strong>${fields.name}</strong><br><a href="mailto:${encodeURIComponent(submission.email)}" style="color:#344a43;">${fields.email}</a></td></tr>
${submission.phone ? `<tr><td class="email-label" valign="top" style="${labelStyle}">Phone</td><td style="${valueStyle}">${escapeHtml(submission.phone)}</td></tr>` : ''}
<tr><td class="email-label" valign="top" style="${labelStyle}">Project</td><td style="${valueStyle}">${fields.service}</td></tr>
<tr><td class="email-label" valign="top" style="${labelStyle}">Subject</td><td style="${valueStyle}">${fields.subject}</td></tr>
</table>
<p style="margin:0 0 10px;font-size:10px;letter-spacing:2px;color:#64736b;">PROJECT BRIEF</p>
<p style="${paragraph}white-space:pre-wrap;overflow-wrap:anywhere;">${fields.message}</p>
${emailButton(reply, 'Reply to the enquiry')}
<p style="margin:24px 0 4px;font-size:11px;line-height:1.6;color:#64736b;">Received ${escapeHtml(submission.submittedAt.toUTCString())}<br>Reference ${fields.id}<br>Newsletter requested: ${submission.newsletter ? 'Yes' : 'No'}</p>`);
  return sendEmail({ to: teamInbox(), replyTo: submission.email, subject: `New enquiry: ${submission.subject}`, html });
}

export async function sendUserConfirmation(userEmail: string, userName: string, newsletter: boolean): Promise<EmailResult> {
  const html = emailLayout('ENQUIRY RECEIVED', 'We have received your project enquiry.', 'Thanks for getting in touch.', `
<p style="${paragraph}">Hi ${escapeHtml(userName)},</p>
<p style="${paragraph}">We've received your enquiry. Our team will review the details and get back to you.</p>
<p style="${paragraph}">If you'd like to add anything, just reply to this email.</p>
${emailButton(website + '/#selected-work', 'Explore our work')}
${newsletter ? `<p style="margin:22px 0;font-size:13px;line-height:1.6;color:#64736b;">You also asked for studio updates. The subscription confirmation is a separate email.</p>` : ''}
<p style="margin:24px 0 12px;font-size:14px;line-height:1.6;color:#001514;">Speak soon,<br><strong>The J StaR team</strong></p>`);
  return sendEmail({ to: userEmail, replyTo: teamInbox(), subject: "We've received your enquiry | J StaR Films Studios", html });
}

export async function sendNewsletterSignupConfirmation(userEmail: string, userName?: string): Promise<EmailResult> {
  const unsubscribe = `mailto:${teamInbox()}?subject=Unsubscribe`;
  const html = emailLayout('STUDIO UPDATES', 'Thanks for your interest in updates from J StaR Films Studios.', 'A little more from the studio.', `
<p style="${paragraph}">Hi ${escapeHtml(userName || 'there')},</p>
<p style="${paragraph}">Thanks for your interest in J StaR Films Studios. We'll share news from our film, website and software work.</p>
${emailButton(website + '/#selected-work', 'Explore our work')}
<p style="margin:24px 0 12px;font-size:13px;line-height:1.6;color:#64736b;">Changed your mind? <a href="${escapeHtml(unsubscribe)}" style="color:#344a43;text-decoration:underline;">Request removal by email</a>. This goes to our team; it is not an automatic unsubscribe link.</p>`);
  return sendEmail({ to: userEmail, replyTo: teamInbox(), subject: 'Studio updates | J StaR Films Studios', html });
}
