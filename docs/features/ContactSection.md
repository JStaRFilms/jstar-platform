# Feature: Contact Section

## 1. Purpose

The ContactSection component serves as the primary contact interface on the J StaR Films homepage. It provides visitors with a comprehensive way to reach out for business inquiries, project discussions, and newsletter subscriptions. The component combines a functional contact form with contact information and social proof to encourage user engagement.

## Company email contract, October 2026

The current `/` uses `src/app/redesign/EnquiryForm.tsx`. The previous homepage at `/redesign` and `/contact` share the same server endpoint. All three must distinguish a saved enquiry with incomplete email acceptance from a submission that was not saved.

The owner approved `hey@jstarstudios.com` as the team inbox and the shared sender address. Keep `RESEND_API_KEY` and `ADMIN_EMAIL`; add `EMAIL_FROM` with default `J StaR Films Studios <hey@jstarstudios.com>`. The team notification's Reply-To is the validated visitor email. The acknowledgement's Reply-To is the configured team inbox. Visitor and optional newsletter confirmations remain addressed only to that visitor.

Check the installed Resend SDK's returned error and require a nonempty message ID. Provider acceptance is not mailbox delivery. Escape visitor text in HTML templates. Send the team notification first; on failure, do not send the acknowledgement or newsletter confirmation. If acknowledgement alone fails, retain the accepted team notification and do not repeat it automatically.

The database save remains authoritative and unchanged. After saving, return HTTP202 with `status: "partial"` if any required email is not accepted. Include saved submission metadata and per-message acceptance flags. The UI retains the draft, displays the specific saved/partial message, and prevents an unchanged immediate resend. A subsequent intentional edit can start a new submission. HTTP200 `success` means the save and required provider acceptances succeeded, not proof of inbox delivery. Existing validation, rate limiting and newsletter/analytics writes remain unchanged. No Prisma model change is required.

Tests must mock both Resend and Prisma. Do not send real mail, create keys, change DNS or install runtime credentials as part of local verification. Each live sending runtime needs its own reviewed configuration and product/environment-scoped sending-only key restricted to `jstarstudios.com`. Never borrow Melo's key or assume a website host configures another backend. A live test needs explicit approval for the environment, database target and exact controlled recipients.

### Local checks and runtime boundary

Run `node --test tests/contact-email.test.cjs`. The tests transpile the real helper and route with mocked Resend and Prisma; they do not read live credentials, send email or write a database. Eighteen cases passed, covering defaults and overrides, From/To/Reply-To, HTML escaping, missing keys, returned/thrown provider failures, missing IDs, team-first ordering, partial acknowledgement/newsletter outcomes, database failure, validation and rate limiting. Current-source TypeScript and focused lint also passed.

`tests/contact-form-ui.cjs` is an optional Chrome/Playwright check. Set `PLAYWRIGHT_PATH` to an installed Playwright package and optionally `CONTACT_TEST_BASE` to the local validation server. All POSTs are intercepted; it checks saved/partial messaging, retained drafts and resend blocking on `/`, `/redesign` and `/contact`. All three cases passed against an isolated current-source production build, which compiled and typechecked successfully. No screenshots were taken. The temporary loopback server was stopped after testing.

The first dev-server UI run passed `/` but timed out on the legacy form, followed by a timed-out dev-server health request. This is not counted as a pass. The production check waits for legacy client hydration before interacting and passed all three forms. No dev cache, protected preview or Next configuration was replaced. The isolated build retained the existing workspace-root inference warning; no hosted build or actual inbox delivery is certified.

The owner approved local `.env.local` routing: ADMIN_EMAIL is `hey@jstarstudios.com`, and EMAIL_FROM is `J StaR Films Studios <hey@jstarstudios.com>`. They subsequently supplied a dedicated Preview key through the private vault form, confirming sending-only access restricted to `jstarstudios.com`. Only local RESEND_API_KEY was then replaced; other settings and existing provider keys were left untouched. Hosted runtime configuration was not changed. Key scope was owner-confirmed, not independently audited with an administrative credential. Provider acceptance, receiving mailbox delivery and successful reply routing must be checked separately.

### Controlled live Preview check

The owner explicitly approved one labelled enquiry on the displayed Neon `neondb` target, its normal analytics update, and both messages to `hey@jstarstudios.com`, with newsletter off. The first request returned HTTP500 before any email because the database lacked `contact_submissions.phone`; read-only inspection found zero test records. The repository already contained `20261002144557_add_contact_submission_phone`.

After separate exact-target approval, only that migration's `ALTER TABLE public.contact_submissions ADD COLUMN phone TEXT` statement was applied with a 5-second lock timeout and 15-second statement timeout. The column was verified as nullable TEXT. No other migrations, schema synchronization, migration-history creation or existing-record changes were performed. This target had no Prisma migration-history table, so do not blindly run the full migration chain.

The single separately approved retry returned HTTP200, saved exactly one labelled test record and confirmed Resend acceptance for both team and acknowledgement emails. No newsletter email was sent. The temporary loopback test server used the passed production build and explicit reviewed local configuration, then stopped. Existing private preview mappings were not changed. The labelled test record was retained; deletion was not authorised. The owner confirmed that both messages arrived at `hey@jstarstudios.com`. This verifies actual receipt in addition to provider acceptance. Because both messages went to the same inbox, cross-inbox reply delivery was not tested.

The existing staff-response endpoint also calls the shared helper but has its own response-reporting logic. This contact-form change does not certify staff replies or other transactional flows.

### Email design and corrected links

The owner rejected the old blue/purple form-style emails after the controlled test. The test visitor name was a labelled fixture, not intended customer copy. Normally the team receives the enquiry details and the visitor receives only the acknowledgement. Both went to the team inbox solely for the approved delivery test.

The templates now use the site's forest `#001514`, lime `#b5e619` and paper `#fbfffe` colours, a text wordmark, inline styling and presentation tables. The text wordmark and solid backgrounds remain readable when images are blocked, and no web fonts are required. The visitor gets a short acknowledgement and a selected-work link; the team gets aligned contact/project details, a readable brief and a mailto reply action. No unsupported response-time or newsletter schedule is promised. Newsletter confirmation uses the same layout and a labelled manual removal request instead of a fake `#` unsubscribe action. This is not an automated unsubscribe implementation.

Website links use `https://jstarstudios.com`. Instagram is `https://www.instagram.com/j_starr.films/`, and LinkedIn is `https://www.linkedin.com/company/j-star-films-studios/`. The same corrections were applied to the shared contact record. The existing email YouTube URL, `https://youtube.com/@jstarfilms`, is unchanged. No website layout changed.

Run `node tests/render-email-preview.cjs` to regenerate `docs/Mockups/01_Public_Website/email-templates.html` from the actual helpers. A stub provider captures HTML with a synthetic visitor and no live credentials, network or sends. The mock-up has separate visitor/team tabs and a phone-width mode. Preview links are inactive. Browser previews checked the email at desktop and phone widths without horizontal overflow; Gmail/Outlook rendering of the new design has not been certified. Nineteen mocked email/API tests, current-source types and focused lint passed. The redesigned templates were not emailed and no database records were created for the design pass.

The owner then requested texture and better use of the header's right side. A subtle, repeatable film-grain PNG now textures the header and paper surfaces, with the actual studio logo in a right-hand header cell. The original website logo is unchanged; the email-only PNG trims transparent canvas and retains the complete artwork/aspect ratio. `tests/build-email-assets.py` reproducibly generates `public/redesign/email-grain.png` and `email-studio-logo.png`, together about 15 KB. Desktop and 390/320px previews showed no horizontal overflow. The in-chat mock-up inlines these local assets without network requests. Actual emails reference their `jstarstudios.com/redesign/` URLs, so the assets must be published before a new real-email appearance test. Clients that block background images will show the solid-colour fallback rather than texture. No additional mail was sent.

## 2. Main Component (`ContactSection.tsx`)

The ContactSection is a client-side React component that handles contact form submissions, validation, and user feedback.

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| None | - | - | This component accepts no props and is self-contained |

### State Management

The component uses a comprehensive form state management system:

```typescript
interface FormState {
  data: ContactFormData;
  errors: FormErrors;
  isSubmitting: boolean;
  isSuccess: boolean;
  submitCount: number;
}
```

### Key Features

- **Real-time Validation**: Client-side validation with immediate feedback
- **Server-side Validation**: Duplicate validation on the backend for security
- **Loading States**: Visual feedback during form submission
- **Success/Error Handling**: Comprehensive error handling with user-friendly messages
- **Newsletter Integration**: Optional newsletter signup with form submission
- **Rate Limiting**: Protection against spam submissions
- **Accessibility**: Full keyboard navigation and screen reader support
- **Responsive Design**: Mobile-first approach with adaptive layouts

## 3. API Integration (`/api/contact`)

### Endpoint Details

**URL:** `POST /api/contact`
**Content-Type:** `application/json`

### Request Body

```typescript
interface ContactFormData {
  name: string;        // Required, min 2 characters
  email: string;       // Required, valid email format
  subject: string;     // Required
  service: string;     // Required, from predefined options
  message: string;     // Required, min 10 characters
  newsletter: boolean; // Required, user preference
}
```

### Response Format

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Message sent successfully",
  "data": {
    "id": "contact_1234567890",
    "submittedAt": "2025-01-16T17:00:00.000Z",
    "status": "pending"
  }
}
```

**Error Response (400/429/500):**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": ["Name is required", "Valid email address is required"]
}
```

### Rate Limiting

- **Window:** 15 minutes
- **Max Requests:** 3 submissions per IP address
- **Response:** 429 status with retry-after header

## 4. Email Integration

### Email Service Architecture

The contact system uses an abstracted email service that can be easily switched between providers:

```typescript
// src/lib/email.ts - Provider abstraction
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  // Currently uses Resend, but can be swapped for SendGrid, Postmark, etc.
}
```

### Automated Email Notifications

When a contact form is submitted, the system automatically sends:

1. **Admin Notification Email**
   - Contains full submission details
   - Formatted for easy reading
   - Includes submission metadata

2. **User Confirmation Email**
   - Thanks the user for their message
   - Provides next steps and timeline
   - Includes links to portfolio/services/blog

3. **Newsletter Signup Confirmation** (if opted in)
   - Welcome message to the newsletter
   - Explains what subscribers will receive
   - Provides unsubscribe information

### Email Templates

All emails use responsive HTML templates with:
- Professional branding and colors
- Mobile-optimized layouts
- Clear call-to-action buttons
- Unsubscribe links (where applicable)

### Environment Configuration

```bash
# Required environment variables
RESEND_API_KEY="your_resend_api_key_here"
ADMIN_EMAIL="hey@jstarstudios.com"
# Optional override, default shown
EMAIL_FROM="J StaR Films Studios <hey@jstarstudios.com>"
```

### Email Failure Handling

- A failed database save returns an error and sends no email.
- A saved enquiry with incomplete provider acceptance returns HTTP202 `partial`, without discarding the saved record or encouraging a blind retry.
- Team rejection stops visitor acknowledgements. An acknowledgement rejection does not undo the accepted team notification.
- The response reports provider acceptance separately from the saved enquiry. Real delivery, receiving mailbox configuration and reply routing require separate verification.

## 4. Database Schema

### Contact Submissions

```sql
-- Main contact form submissions
CREATE TABLE contact_submissions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  service TEXT NOT NULL,
  message TEXT NOT NULL,
  newsletter BOOLEAN DEFAULT FALSE,
  submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  ipAddress TEXT,
  userAgent TEXT,
  status TEXT DEFAULT 'PENDING',
  adminNotes TEXT,
  respondedAt DATETIME,
  respondedBy TEXT
);
```

### Newsletter Subscribers

```sql
-- Newsletter subscription tracking
CREATE TABLE newsletter_subscribers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscribedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  unsubscribedAt DATETIME,
  isActive BOOLEAN DEFAULT TRUE,
  source TEXT,
  tags TEXT -- JSON array of tags
);
```

### Analytics

```sql
-- Daily contact analytics
CREATE TABLE contact_analytics (
  id TEXT PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  submissions INTEGER DEFAULT 0,
  newsletterSignups INTEGER DEFAULT 0,
  serviceBreakdown TEXT -- JSON object
);
```

## 5. Service Options

The contact form includes a dropdown for service selection:

```typescript
const serviceOptions = [
  { value: '', label: 'Select a service' },
  { value: 'wedding', label: 'Wedding Cinematography' },
  { value: 'corporate', label: 'Corporate Videos' },
  { value: 'app', label: 'App Development' },
  { value: 'ai', label: 'AI Creator Tools' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'other', label: 'Other' },
];
```

## 6. Usage Example

### Basic Implementation

```tsx
import ContactSection from '@/features/HomePage/components/ContactSection';

export default function HomePage() {
  return (
    <div>
      {/* Other page content */}
      <ContactSection />
    </div>
  );
}
```

### With Custom Styling

```tsx
// The component uses CSS custom properties for theming
// Update globals.css to customize colors:

@theme {
  --color-jstar-blue: #your-brand-blue;
  --color-faith-purple: #your-brand-purple;
  --color-growth-green: #your-brand-green;
  --color-sacred-gold: #your-brand-gold;
}
```

## 7. Validation Rules

### Client-side Validation

- **Name:** Required, minimum 2 characters
- **Email:** Required, valid email format
- **Subject:** Required, non-empty
- **Service:** Required, must select from dropdown
- **Message:** Required, minimum 10 characters
- **Newsletter:** Must be boolean (checkbox state)

### Server-side Validation

Duplicate validation on the server with additional security checks:
- SQL injection prevention
- XSS sanitization
- Input length limits
- Email format verification

## 8. Error Handling

### Form Validation Errors

Displayed inline with red styling:
- Field-specific error messages
- Real-time validation feedback
- Clear visual indicators (red borders, error text)

### Submission Errors

- **Network Errors:** "Network error. Please check your connection and try again."
- **Rate Limiting:** "Too many requests. Please wait X seconds before trying again."
- **Server Errors:** "Internal server error. Please try again later."
- **Validation Errors:** Specific field-by-field error messages

### Success States

- Green checkmark icon
- Success message with newsletter confirmation
- Auto-dismiss after 5 seconds
- Option to send another message

## 9. Accessibility Features

### Keyboard Navigation

- Full keyboard accessibility
- Tab order follows logical sequence
- Enter key submits form
- Escape key clears errors

### Screen Reader Support

- Proper ARIA labels on all form elements
- Error announcements for validation failures
- Success announcements for form submission
- Semantic HTML structure

### Focus Management

- Focus trapped during loading states
- Error fields receive focus on validation failure
- Success message announced to screen readers

## 10. Performance Considerations

### Bundle Size

- **Component Size:** ~8KB (gzipped)
- **Dependencies:** React hooks only
- **Icons:** Imported from local IconComponents

### Loading Performance

- **Lazy Loading:** Can be lazy-loaded if needed
- **Code Splitting:** Separate chunk for contact functionality
- **Image Optimization:** No images used (icons are SVG)

### Runtime Performance

- **Re-renders:** Optimized with useCallback for handlers
- **State Updates:** Batched state updates
- **Memory:** No memory leaks (proper cleanup)

## 11. Security Features

### Input Validation

- Client and server-side validation
- SQL injection prevention
- XSS sanitization
- Input length limits

### Rate Limiting

- IP-based rate limiting (15 min window, 3 requests)
- Exponential backoff for retries
- CAPTCHA ready for future implementation

### Data Protection

- No sensitive data stored in plain text
- IP addresses logged for abuse prevention
- User agent tracking for analytics

## 12. Analytics Integration

### Form Analytics

- Submission tracking
- Conversion rate monitoring
- Service interest breakdown
- Newsletter signup conversion

### User Behavior

- Form abandonment tracking
- Field interaction analytics
- Error rate monitoring
- Completion time analysis

## 13. Future Enhancements

### Planned Features

1. **Email Integration**
   - Admin email notifications
   - User confirmation emails
   - Auto-reply functionality

2. **Admin Dashboard**
   - Contact management interface
   - Response tracking
   - Analytics dashboard

3. **Advanced Validation**
   - reCAPTCHA integration
   - Phone number validation
   - File upload support

4. **Multi-language Support**
   - Internationalization (i18n)
   - RTL language support
   - Localized validation messages

## 14. Testing Strategy

### Unit Tests

```typescript
// Example test cases
describe('ContactSection', () => {
  it('validates required fields', () => { /* ... */ });
  it('handles form submission', () => { /* ... */ });
  it('displays error messages', () => { /* ... */ });
  it('shows success state', () => { /* ... */ });
});
```

### Integration Tests

- API endpoint testing
- Database integration testing
- Email service testing
- Rate limiting verification

### E2E Tests

- Complete form submission flow
- Error handling scenarios
- Mobile responsiveness
- Accessibility compliance

## 15. Troubleshooting

### Common Issues

1. **Form not submitting**
   - Check network connectivity
   - Verify API endpoint is running
   - Check browser console for errors

2. **Validation errors**
   - Ensure all required fields are filled
   - Check email format
   - Verify message length

3. **Styling issues**
   - Confirm Tailwind CSS is loaded
   - Check custom theme colors in globals.css
   - Verify dark mode classes

### Debug Mode

Enable debug logging by setting:
```javascript
localStorage.setItem('contact_debug', 'true');
```

## 16. Maintenance

### Regular Tasks

- **Database Cleanup:** Archive old submissions monthly
- **Analytics Review:** Monthly analytics report generation
- **Security Updates:** Regular dependency updates
- **Performance Monitoring:** Response time tracking

### Update Procedures

1. **Code Updates:** Test thoroughly before deployment
2. **Database Changes:** Use migrations for schema updates
3. **API Changes:** Maintain backward compatibility
4. **UI Changes:** Test across all breakpoints and browsers

## 17. Integration Checklist

### Pre-deployment

- [ ] Database schema created and migrated
- [ ] API endpoints tested
- [ ] Form validation working
- [ ] Email service configured (future)
- [ ] Analytics tracking implemented
- [ ] Accessibility tested
- [ ] Mobile responsiveness verified
- [ ] Cross-browser compatibility checked

### Post-deployment

- [ ] Form submissions monitored
- [ ] Error rates tracked
- [ ] User feedback collected
- [ ] Performance metrics reviewed
- [ ] Analytics data verified

---

**Last Updated:** January 16, 2025
**Version:** 1.0.0
**Status:** Production Ready
