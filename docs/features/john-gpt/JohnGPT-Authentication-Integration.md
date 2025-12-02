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
| **GUEST** (Anonymous) | ✅ Yes | ❌ No (widget only) | ❌ No |
| **TIER1** (Free login) | ✅ Yes | ✅ Yes (full-page) | ✅ Yes |
| **TIER2+** (Paid) | ✅ Yes | ✅ Yes (full-page) | ✅ Yes |
| **ADMIN** | ✅ Yes | ✅ Yes (full-page) | ✅ Yes |

---

## 4. **IMPLEMENTED**: Chat History & Storage

### Current Storage Architecture

**Status**: ✅ **Fully Implemented** (as of 2025-11-30)

JohnGPT uses a **hybrid local-first architecture** with cloud backup:

#### **Primary Layer: IndexedDB**

**File**: `src/lib/chat-storage.ts`

- **Browser Database**: `johngpt-db` using IndexedDB via `idb` library
- **Offline-First**: Conversations saved locally for instant access
- **Structure**:
  ```typescript
  interface Conversation {
    id: string;
    title: string;
    messages: ExtendedMessage[];
    createdAt: number;
    updatedAt: number;
    personaId: string;
    syncedToDrive: boolean;
    driveFileId?: string;
  }
  ```

#### **Secondary Layer: Google Drive Sync**

**API Routes**: 
- `POST /api/johngpt/sync/save` - Upload conversation to Drive
- `GET /api/johngpt/sync/list` - List remote conversations
- `GET /api/johngpt/sync/get?fileId=...` - Download conversation
- `POST /api/johngpt/sync/delete` - Delete from Drive

**Sync Behavior**:
1. **Upload**: Unsynced local conversations uploaded to user's Google Drive
2. **Download**: Remote changes pulled and merged into IndexedDB
3. **Bidirectional**: Keeps local and cloud in sync automatically
4. **Background**: Syncs on conversation save and load

#### **Context-Aware Saving**

| Context | Saves to IndexedDB? | Syncs to Drive? | Use Case |
|---------|-------------------|----------------|----------|
| `widget` | ❌ No | ❌ No | Guest mode, ephemeral chats |
| `full-page` | ✅ Yes | ✅ Yes (if authenticated) | Logged-in users on `/john-gpt` |

**Implementation**: The context detection (fixed in Phase 5) determines whether the `onFinish` handler in `ChatView.tsx` saves the conversation.

#### **Storage Workflow**

**File**: `src/features/john-gpt/components/ChatView.tsx`

```typescript
// onFinish callback (runs when AI response completes)
onFinish: async (message: any) => {
  // Only runs in full-page context
  const convId = conversationIdRef.current || crypto.randomUUID();
  
  // Generate title (1st or 3rd exchange)
  const title = await generateTitle(messages);
  
  // Save to IndexedDB
  await chatStorage.saveConversation({
    id: convId,
    title,
    messages: updatedMessages,
    createdAt: currentConv?.createdAt || Date.now(),
    updatedAt: Date.now(),
    personaId: 'default',
    syncedToDrive: false, // Mark for sync
  });
  
  // Background sync to Drive (if authenticated)
  if (user) {
    chatStorage.syncConversations(user.id);
  }
}
```

### Key Features

✅ **Automatic Syncing**: Conversations sync in background after save  
✅ **Offline Access**: All chats available offline via IndexedDB  
✅ **Multi-Device**: Google Drive enables cross-device access  
✅ **Title Generation**: AI-generated titles at 1st and 3rd message exchange  
✅ **Conversation Management**: Edit, delete, load previous chats  
✅ **Race Condition Prevention**: Saves before navigation to prevent blank screens

### Storage Limits

**Current Implementation**: No hard limits enforced (IndexedDB typically 50MB-10GB per origin)

**Recommended Future Limits** (not yet implemented):

| Tier | Max Conversations | Max Messages Per Conversation |
|------|------------------|-------------------------------|
| GUEST | 0 (ephemeral) | N/A |
| TIER1 | 100 | 500 |
| TIER2 | 500 | 1000 |
| TIER3 | Unlimited | Unlimited |
| ADMIN | Unlimited | Unlimited |

### Files Implementing Storage

| File | Purpose |
|------|---------|
| `src/lib/chat-storage.ts` | Core storage service (IndexedDB + sync logic) |
| `src/features/john-gpt/components/ChatView.tsx` | Saves conversations on message completion |
| `src/features/john-gpt/components/ConversationSidebar.tsx` | Displays and manages conversation list |
| `src/features/john-gpt/hooks/useConversationManagement.ts` | React hooks for conversation state |
| `src/app/api/johngpt/sync/*` | Google Drive sync API routes |

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
