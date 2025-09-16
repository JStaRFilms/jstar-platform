# Feature: Contact Section

## 1. Purpose

The ContactSection component serves as the primary contact interface on the J StaR Films homepage. It provides visitors with a comprehensive way to reach out for business inquiries, project discussions, and newsletter subscriptions. The component combines a functional contact form with contact information and social proof to encourage user engagement.

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
ADMIN_EMAIL="admin@jstarfilms.com"
```

### Email Failure Handling

- Email failures don't break form submission
- Errors are logged but don't affect user experience
- Graceful degradation ensures system reliability

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
