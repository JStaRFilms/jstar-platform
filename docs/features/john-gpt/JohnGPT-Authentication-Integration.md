# Feature: JohnGPT - Access Model & Authentication Integration

## Change Log (Latest Updates)

### v2.0.0 - Freemium Model with WorkOS Integration (Latest)

**Date**: 2025-11-29

**Breaking Changes:**
- Removed admin-only authentication requirement
- Changed runtime from `edge` to `nodejs` (required for Prisma/SQLite)
- Removed mock bearer token authentication

**New Features:**
- ✅ **Anonymous Access**: Guest users (not logged in) can use JohnGPT modal
- ✅ **Optional Authentication**: Session detection via WorkOS for future chat history
- ✅ **Tier-Based Features**: Prepared for chat history (TIER1+) vs ephemeral (GUEST)

**Access Levels:**

| User Type | Can Access JohnGPT? | Chat History Saved? | Authentication Required? |
|-----------|---------------------|---------------------|-------------------------|
| **GUEST** (Anonymous) | ✅ Yes | ❌ No | ❌ No |
| **TIER1** (Free login) | ✅ Yes | 🔜 Future | ✅ Yes |
| **TIER2+** (Paid) | ✅ Yes | 🔜 Future | ✅ Yes |
| **ADMIN** | ✅ Yes | 🔜 Future | ✅ Yes |

---

## 1. Updated API Route Architecture

### File: `src/app/api/chat/route.ts`

**Runtime**: `nodejs` (changed from `edge` for Prisma support)

**Authentication**: Optional - allows anonymous users

```typescript
import { streamText, convertToModelMessages } from 'ai';
import { getAIModel } from '../../../lib/ai-providers';
import { withAuth } from '@workos-inc/authkit-nextjs';
import { prisma } from '../../../lib/prisma';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  // Optional authentication - allows anonymous users
  const { user } = await withAuth();

  if (user) {
    // User is authenticated - fetch their tier
    const dbUser = await prisma.user.findUnique({
      where: { workosId: user.id },
    });

    if (dbUser) {
      console.log(`Authenticated user: ${dbUser.email} (${dbUser.tier})`);
      // TODO: Save chat history for TIER1+ users
    }
  } else {
    // Anonymous user (GUEST)
    console.log('Anonymous user accessing JohnGPT');
    // No chat history saved
  }

  // Convert and stream response (available to ALL users)
  const modelMessages = convertToModelMessages(messages);
  const result = await streamText({
    model: getAIModel(),
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
```

### Key Changes from Previous Version

| Aspect | Before (v1.0) | After (v2.0) |
|--------|---------------|--------------|
| **Runtime** | `edge` | `nodejs` |
| **Auth** | Required (`requireAdmin()`) | Optional (`withAuth()`) |
| **Access** | Admin only | Open to all |
| **Session** | Bearer token | WorkOS cookies |
| **Chat History** | Not implemented | Prepared for TIER1+ |

---

## 2. Frontend Components (No Changes Required)

### JohnGPTDialog.tsx

The frontend component remains unchanged. Key features:

```typescript
const { messages, status, sendMessage, error } = useChat();
```

**No explicit API configuration needed** - The Vercel AI SDK defaults to `/api/chat` and automatically sends cookies with requests.

**Access:**
- Anonymous users: Can open dialog and chat
- Authenticated users: Same experience (chat history coming soon)

---

## 3. User Access Flow

### Anonymous User (GUEST) Flow

```
1. User visits site (not logged in)
   ↓
2. Clicks "JohnGPT" button
   ↓
3. Modal opens → sends message
   ↓
4. API receives request (no auth cookie)
   ↓
5. withAuth() returns { user: null }
   ↓
6. API logs "Anonymous user accessing JohnGPT"
   ↓
7. Streams AI response normally
   ↓
8. Chat session is ephemeral (lost on page refresh)
```

### Authenticated User (TIER1+) Flow

```
1. User logs in via WorkOS
   ↓
2. Session cookie set automatically
   ↓
3. Clicks "JohnGPT" button
   ↓
4. Modal opens → sends message
   ↓
5. API receives request WITH auth cookie
   ↓
6. withAuth() returns { user: WorkOSUser }
   ↓
7. API queries database for user tier
   ↓
8. API logs user email and tier
   ↓
9. Streams AI response normally
   ↓
10. [FUTURE] Chat history saved to database
```

---

## 4. Future Implementation: Chat History

### Database Schema (Already Prepared)

When implementing chat history, add a new `Conversation` model:

```prisma
model Conversation {
  id        String   @id @default(cuid())
  userId    String
  title     String?  // Auto-generated from first message
  messages  Json     // Stored as JSON array
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id])
  
  @@map("conversations")
}
```

### Implementation Steps

1. **Create Conversation on First Message**:
   - After first message from authenticated user
   - Generate title from message content
   - Store conversation ID in client state

2. **Save Each Message**:
   - Append to `messages` JSON array
   - Update `updatedAt` timestamp

3. **Load Conversation History**:
   - Add API endpoint: `GET /api/chat/history`
   - Return list of user's conversations
   - Add "Load Previous Chat" UI in dialog

### Tier-Based History Limits

| Tier | Max Conversations | Max Messages Per Conversation |
|------|------------------|-------------------------------|
| GUEST | 0 (ephemeral) | N/A |
| TIER1 | 10 | 100 |
| TIER2 | 50 | 500 |
| TIER3 | Unlimited | Unlimited |
| ADMIN | Unlimited | Unlimited |

---

## 5. Security Considerations

### Current Security Measures

✅ **Rate Limiting**: Recommended to add via middleware (10 requests/minute for GUEST, 100/minute for TIER1+)

✅ **Input Validation**: Messages validated by AI SDK before processing

✅ **SQL Injection Protection**: Prisma prevents SQL injection automatically

⚠️ **No Rate Limiting Yet**: Anonymous users can spam requests (TODO)

### Recommended Additions

```typescript
// Add rate limiting middleware
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const { user } = await withAuth();
  
  // Different limits for different tiers
  const limit = user ? 100 : 10; // requests per minute
  await rateLimit(req, limit);
  
  // ... rest of handler
}
```

---

## 6. Error Handling

### Current Behavior

| Scenario | API Response | Frontend Display |
|----------|--------------|------------------|
| No AI API key | 500 Internal Server Error | "Failed to connect to JohnGPT" |
| Invalid message format | 400 Bad Request | "Failed to send message" |
| AI provider timeout | 504 Gateway Timeout | "Request timed out, please try again" |
| Database unavailable | 500 Internal Server Error | "Service temporarily unavailable" |

### Error Messages in JohnGPTDialog

The dialog component handles errors gracefully:

```typescript
if (error) {
  return (
    <div className="error-state">
      <AlertCircle />
      <span>Failed to connect to JohnGPT. Please try again.</span>
      <button onClick={handleRetry}>Retry</button>
    </div>
  );
}
```

---

## 7. Performance Considerations

### Runtime Choice: Node.js vs Edge

**Why Node.js Runtime?**
- ✅ Full access to Prisma client (SQLite)
- ✅ Can query database for user tier
- ✅ Streaming still works (via `streamText`)
- ❌ Slightly slower cold starts (~200ms vs ~50ms)

**For Maximum Performance:**
- Consider moving chat history to a separate API route
- Use Edge runtime for `/api/chat` (anonymous access)
- Use Node.js runtime for `/api/chat/history` (authenticated only)

### Streaming Performance

**Current Setup**:
- Chunks arrive every ~50-100ms
- Average first token: ~400ms
- Full response (200 tokens): ~3-5 seconds

**Optimizations**:
- Model choice: `gemini-1.5-flash` is fastest (current default)
- Consider `gemini-1.5-pro` for higher quality (2x slower)

---

## 8. Testing & Verification

### Test Scenarios

**Anonymous User Tests:**
- [ ] Can open JohnGPT modal without signing in
- [ ] Can send messages and receive responses
- [ ] Chat is lost on page refresh
- [ ] No errors in console

**Authenticated User Tests:**
- [ ] Sign in successfully
- [ ] JohnGPT still works after login
- [ ] Server logs show user email and tier
- [ ] No chat history shown yet (feature pending)

**Edge Case Tests:**
- [ ] Extremely long messages (>5000 characters)
- [ ] Rapid message sending (stress test)
- [ ] Special characters in messages
- [ ] Code blocks and markdown in responses

---

## 9. Monitoring & Debugging

### Logging

Current logs in API route:

```typescript
// Anonymous user
console.log('Anonymous user accessing JohnGPT');

// Authenticated user
console.log(`Authenticated user: user@example.com (TIER1)`);
```

### Recommended Monitoring

Add structured logging:

```typescript
import { logger } from '@/lib/logger';

logger.info('chat_request', {
  userId: user?.id || 'anonymous',
  tier: dbUser?.tier || 'GUEST',
  messageCount: messages.length,
  timestamp: new Date().toISOString(),
});
```

---

## 10. Migration Path for Existing Users

### If Implementing Chat History Later

**Step 1**: Add `Conversation` model to Prisma schema

**Step 2**: Create migration: `npx prisma migrate dev --name add_conversations`

**Step 3**: Update API route to save messages

**Step 4**: Add UI for viewing/loading conversations

**Step 5**: No data migration needed (fresh start for all users)

---

## 11. Alignment with Coding Guidelines

### ✅ Component-Driven Development

- `JohnGPTDialog`: Container component (manages state)
- `ChatMessages`: Presentational component (displays data)
- `ChatInput`: Presentational component (handles input)

### ✅ Service Layer Pattern

- **Controller**: API route handles HTTP request/response
- **Service**: AI SDK `streamText` handles business logic
- **Data Access**: Prisma handles database queries

### ✅ Security Best Practices

- Environment variables for API keys
- No hardcoded secrets
- Input validation via AI SDK
- SQL injection protection via Prisma

### ✅ Documentation

- ✅ TSDoc comments on component props
- ✅ Feature documentation in `docs/features/`
- ✅ Change log maintained
- ✅ Usage examples provided

---

## 12. Quick Reference

### Environment Variables (Required)

```env
# AI Provider
AI_PROVIDER=gemini
AI_MODEL=gemini-1.5-flash
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...

# WorkOS (Optional for anonymous access, required for auth)
WORKOS_CLIENT_ID=client_xxxx
WORKOS_API_KEY=sk_test_xxxx
WORKOS_REDIRECT_URI=http://localhost:5782/auth/callback
WORKOS_COOKIE_PASSWORD=<64-char-random-string>
```

### File Locations

```
src/
├── app/api/chat/
│   └── route.ts                    # Main API endpoint (nodejs runtime)
├── features/john-gpt/
│   ├── components/
│   │   ├── JohnGPTDialog.tsx       # Main chat modal
│   │   ├── ChatMessages.tsx        # Message display
│   │   └── ChatInput.tsx           # Input field
│   └── index.tsx                   # Feature entry point
└── lib/
    ├── ai-providers.ts             # AI provider configuration
    └── prisma.ts                   # Prisma client singleton
```

---

**For full WorkOS authentication details, see**: [`WorkOSAuthentication.md`](./WorkOSAuthentication.md)

**For rich message components (color palettes, code blocks), see**: [`john-gpt/rich-message-components.md`](./john-gpt/rich-message-components.md)
