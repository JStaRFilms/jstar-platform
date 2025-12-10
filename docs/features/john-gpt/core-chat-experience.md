# Feature: JohnGPT Core Chat Experience

## 1. Purpose

The `JohnGPT` feature is responsible for providing an interactive AI chat interface within the J StaR Films platform. It offers a conversational AI assistant powered by configurable AI providers (primarily Google Gemini) with real-time streaming responses, designed for admin users during Phase 1.

## 2. Main Component (`JohnGPTDialog.tsx`)

**File Location**: `src/features/john-gpt/components/JohnGPTDialog.tsx`

### Props

| Prop          | Type                      | Required | Description                          |
|---------------|---------------------------|----------|--------------------------------------|
| `open`        | `boolean`                 | Yes      | Whether the dialog is currently open |
| `onOpenChange`| `(open: boolean) => void` | Yes      | Callback when dialog open state changes |

### State

- `messages`: Array of chat messages from AI SDK
- `input`: Current text input value managed locally
- `status`: Current chat status ('ready', 'streaming', 'submitted', 'error')
- `isLoading`: Computed boolean for loading states

### Features

- Responsive modal dialog using shadcn/ui
- Motion blur background effect
- Animated close button integration
- Auto-resizing input handling

## 3. Custom Hooks (`useChat` via Vercel AI SDK)

- **Purpose**: Manages AI chat state, streaming responses, and communication with API endpoints.
- **Returns**: `{ messages, sendMessage, status }` (used internally by components)

## 4. Component Details

### ChatMessages Component

**File Location**: `src/features/john-gpt/components/ChatMessages.tsx`

- **Purpose**: Displays chat message history with auto-scroll
- **Props**:
  - `messages`: `UIMessage[]` - Array of chat messages
  - `isLoading`: `boolean` - Loading state indicator

### ChatInput Component

**File Location**: `src/features/john-gpt/components/ChatInput.tsx`

- **Purpose**: Auto-resizing text input with send functionality
- **Props**:
  - `input`: `string` - Current input value
  - `handleInputChange`: `(e: ChangeEvent<HTMLTextAreaElement>) => void`
  - `handleSubmit`: `(e: FormEvent<HTMLFormElement>) => void`
  - `isLoading`: `boolean` - Loading state indicator

## 5. Usage Example

```tsx
import { JohnGPTFeature } from '@/features/john-gpt';

export default function Layout() {
  return (
    <div>
      {/* Other layout content */}
      <JohnGPTFeature />
    </div>
  );
}
```

## 6. Architecture Details

### Provider Layer (`src/lib/ai-providers.ts`)

- **Purpose**: Multi-provider AI abstraction with environment-based switching
- **Supported Providers**: Gemini (primary), OpenAI, Groq
- **Functions**:
  - `getAISetup()`: Returns current provider and model configuration
  - `getAIModel()`: Returns configured LanguageModel instance
- **Important**: Gemini 1.5 models require v1 API endpoint (not v1beta)

### API Layer (`src/app/api/chat/route.ts`)

- **Runtime**: Vercel Edge Runtime
- **Authentication**: Admin-only via `requireAdmin()` middleware
- **Streaming**: Real-time text responses using `streamText`
- **Environment Dependencies**: `AI_PROVIDER`, `AI_MODEL` configuration

### File Structure

```
src/features/john-gpt/
├── components/
│   ├── JohnGPTDialog.tsx    # Main chat dialog
│   ├── ChatMessages.tsx     # Message display component
│   └── ChatInput.tsx        # Input component with auto-resize
├── index.tsx                # Feature entry point with floating button
```

## 7. Configuration

```env
# AI Provider Settings
AI_PROVIDER=gemini                    # 'gemini', 'openai', 'groq'
AI_MODEL=gemini-1.5-flash            # Provider-specific model name
GOOGLE_GENERATIVE_AI_API_KEY=your_key # Required for Gemini
OPENAI_API_KEY=your_key              # Optional for OpenAI
GROQ_API_KEY=your_key                # Optional for Groq
```

## 8. Security Notes

- **Phase 1**: Admin-only access via bearer token authentication
- **Future**: User authentication expansion planned
- **Request Flow**: Authentication → AI processing → Streaming response

## 9. Streaming Protocol Diagram

```
Frontend (React)                      Backend (API Route)                    AI Provider (Gemini)
     |                                        |                                       |
     |  1. User types message                |                                       |
     |     sendMessage(text)                  |                                       |
     |---------------------------------------->|                                       |
     |                                        |  2. Authentication check             |
     |                                        |     requireAdmin()                   |
     |                                        |     ✓ Bearer admin-dev-token         |
     |                                        |                                       |
     |                                        |  3. Convert messages                 |
     |                                        |     UIMessage[] → ModelMessage[]     |
     |                                        |                                       |
     |                                        |  4. Call AI provider                 |
     |                                        |     streamText({                     |
     |                                        |       model: provider(model),        |
     |                                        |       messages: modelMessages        |
     |                                        |     })                               |
     |                                        |---------------------------------------->|
     |                                        |                                       |  5. AI processing
     |                                        |                                       |     Generate response
     |                                        |                                       |
     |  6. Stream chunks start                |                                       |
     |<----------------------------------------|  7. Stream response chunks           |
     |     onFinish()                          |     chunk data & metadata            |
     |     onText()                            |<----------------------------------------|
     |     onToolCall()                        |                                       |
     |                                        |                                       |
     |  8. Streaming ends                     |                                       |
     |     - Final UI update                  |                                       |
     |     - Status: ready                    |                                       |
```

### Protocol Flow Explanation

1. **User Input**: User types message and clicks send
2. **API Call**: Frontend sends POST to `/api/chat` with Authorization header
3. **Authentication**: Backend validates bearer token (`Bearer admin-dev-token`)
4. **Message Conversion**: Messages converted to AI SDK format
5. **AI Processing**: Selected provider (Gemini/OpenAI/Groq) processes request
6. **Streaming Starts**: Server returns streaming response headers
7. **Chunk Delivery**: Text chunks sent progressively from AI → Backend → Frontend
8. **UI Updates**: Frontend updates messages in real-time via AI SDK hooks
9. **Completion**: Stream ends, UI shows final message, status resets

### Technical Details

- **Edge Runtime**: Optimized for low latency streaming
- **Authentication**: Bearer token in `Authorization: Bearer admin-dev-token`
- **Message Format**: UIMessage[] → ModelMessage[] conversion required
- **Provider Selection**: `AI_PROVIDER` env var controls routing to Gemini/OpenAI/Groq

## 10. Troubleshooting Checklist

### 🚨 Critical Issues

- [ ] **Admin Auth Fails**
  - Confirm `Authorization: Bearer admin-dev-token` header
  - Check if auth check is uncommented in `/api/chat/route.ts`
  - Verify token starts with 'admin-' prefix

- [ ] **Streaming Won't Start**
  - Check Edge Runtime configuration in route.ts
  - Verify AI provider API keys are set
  - Confirm correct model names (Gemini requires v1 endpoint)
  - Check browser network tab for connection errors

- [ ] **401 Unauthorized Error**
  - Auth middleware is active but token incorrect
  - Check request headers in browser dev tools
  - Verify admin-auth middleware is working

### 🔧 Common Form/Response Issues

- [ ] **Nested Forms Double-Submit**
  - Check for form event.preventDefault() on submit handlers
  - Ensure form nesting doesn't create conflicting event handlers
  - Use separate <form> elements or stop event propagation

- [ ] **Response Type Mismatch**
  - Ensure API returns `.toUIMessageStreamResponse()` for streaming
  - Check if streaming vs static response is causing issues
  - Verify UIMessage/ModelMessage conversion is applied

- [ ] **Input Not Clearing**
  - Confirm `setInput('')` after `sendMessage()` call
  - Check for async state updates causing delays
  - Use controlled component for textarea clearing

- [ ] **Loading State Issues**
  - Status values: 'ready', 'streaming', 'submitted', 'error'
  - Check logic: `isLoading = status === 'streaming' || status === 'submitted'`
  - Ensure status updates trigger re-renders

- [ ] **Auto-scroll Not Working**
  - Verify `useEffect` watches messages array
  - Check scroll target element refs
  - Ensure scrollIntoView behavior is smooth

- [ ] **Textarea Not Resizing**
  - Implement dynamic height calculation in useEffect
  - Check for proper `ref.current.style.height` updates
  - Verify min/max height constraints

### 🎨 UI/Common Issues

- [ ] **Dialog Background Blur**
  - Check `useScrollBlur` hook implementation
  - Verify dialog open state triggers blur effect
  - Test smooth scroll behavior conflicts

- [ ] **Animated Icons Not Working**
  - Import AnimatedCloseIcon or similar components
  - Check for proper click handlers on close buttons
  - Verify animation trigger conditions

- [ ] **Dialog State Management**
  - Check open/onOpenChange prop flow
  - Ensure parent component controls dialog state
  - Test dialog close on ESC key and overlay click

### 🔌 API/Backend Issues

- [ ] **Provider Selection**
  - Environment variable `AI_PROVIDER` set correctly
  - Supported values: 'gemini', 'openai', 'groq'
  - Model parameter matches provider capabilities

- [ ] **API Key Errors**
  - Gemini: `GOOGLE_GENERATIVE_AI_API_KEY` set
  - OpenAI: `OPENAI_API_KEY` set
  - Groq: `GROQ_API_KEY` set
  - Keys must be valid and have API access enabled

- [ ] **Edge Runtime Errors**
  - Check Vercel deployment configuration
  - Ensure route exports correct runtime constant
  - Verify Edge API compatibility for chosen providers

### 🧪 Testing Steps

1. **Open JohnGPT dialog** → Dialog renders without errors
2. **Send message** → Streaming status shows in UI
3. **Check network tab** → POST request to /api/chat with auth header
4. **Monitor streaming** → Response chunks arrive progressively
5. **Verify completion** → Final message appears, loading ends
6. **Test edge cases** → Empty input, long messages, network errors

### 🔍 Debug Mode Setup

Add temporary logging to route.ts:

```ts
console.log('Auth check:', requireAdmin(req));
console.log('AI setup:', getAISetup());
```

Check browser console for errors and status updates in components.

## 9. Troubleshooting

### Gemini 1.5 Models Require v1 API

**Problem**: Receiving 404 errors or DNS resolution failures when using `gemini-1.5-flash` or `gemini-1.5-pro`.

**Cause**: The Vercel AI SDK defaults to Google Generative AI `v1beta` endpoint, but Gemini 1.5 models are only available on the stable `v1` endpoint.

**Solution**: Force the Google provider to use `v1` endpoint:

```ts
// In src/lib/ai-providers.ts
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1', // Force v1
});
```

### Valid Gemini Models

- ✅ `gemini-1.5-flash` (fastest, cheapest)
- ✅ `gemini-1.5-pro` (most capable)
- ✅ `gemini-1.0-pro` (works on v1beta)
- ❌ `gemini-2.5-flash` (doesn't exist)

### API Key Verification

If you continue getting connection errors:

1. Verify your Google AI API key starts with `AIzaSy`
2. Check that the key has Generative AI API access enabled
3. Test the key directly with Google's REST API if needed

### UIMessage Conversion Issues

If you see errors about `UIMessage[]` vs `ModelMessage[]`, ensure the API route uses:

```ts
import { convertToModelMessages } from 'ai';
// ... then convert before streamText
const modelMessages = convertToModelMessages(messages);
```

---

## ✨ Phase 3: Mockup-Accurate UI Implementation

The JohnGPT interface now matches the exact designs from `docs/Mockups/02_JohnGPT_Enhanced/` with professional messaging, rich content components, and seamless light/dark theme support.

### Enhanced ChatInput Component
- **Persona Selector**: Dropdown-style button in header (desktop) or input area (mobile) with "Creative Director" default
- **File Attachment**: Paperclip icon button with hover states, tooltip, triggers file picker
- **Send Button**: Rounded purple button (`bg-accent-purple`) with animated send icon
- **Auto-Resize**: Maintained dynamic height adjustment with mobile keyboard compatibility

### Rich Message Components
- **Color Palette Grid**: Responsive 3×3 (mobile) / 3×2 (desktop) grid with hex values and clipboard functionality
- **Code Blocks**: Dark-themed (`bg-black/50`) syntax-highlighted blocks with language labels and copy buttons
- **File Attachments**: Preview cards with icons, filenames, sizes, and secure download functionality

### Message Actions & Timestamps
- **Desktop**: Actions (copy, regenerate) show on hover with opacity transition
- **Mobile**: Actions always visible for better touch accessibility
- **Timestamps**: Semantic `<time>` elements, hover-reveal on desktop, always-visible on mobile

### Theme Compliance
- **Tailwind v4 Tokens**: All colors use `@theme` properties (`--color-background`, `--color-foreground`, etc.)
- **Dark Mode First**: Optimized for `#0B1221` background with premium contrast
- **Light Mode Support**: Verified readability in light themes with proper contrast ratios
- **No Hardcoded Colors**: Fully reactive to theme changes

### Mobile Layout (new_mobile-chat.html)
- **Fixed Header**: Hamburger menu, title/subtitle, menu button
- **Message Bubbles**:
  - User: `bg-accent-blue`, `rounded-br-lg`, `max-w-[85%]`
  - AI: `bg-neutral-800`, `rounded-bl-lg`, `max-w-[85%]`
- **Input Footer**: Persona selector above textarea/input with send button

### Desktop Layout (new_chat-interface.html)
- **Header**: Dialog-style with persona selector and actions menu
- **Message Bubbles**:
  - User: `bg-accent-blue/80`, `max-w-xl`, `rounded-br-none`
  - AI: `bg-neutral-800/60`, `max-w-2xl`, `rounded-tl-none`
- **Actions**: Hover-reveal buttons on AI messages for copy/regenerate

### Animated Icon Integration
- **Core Icons**: Brain (header/empty), Send (animated purple), Close (hover states)
- **Interactive States**: Loading dots for streaming, attachment/file icons
- **Performance**: Respects `prefers-reduced-motion` with optimized animations

## ✨ UX Polish Features

The JohnGPT chat experience now includes premium UI enhancements for improved usability and visual appeal:

- **Typing Indicators**: Animated dots with "JohnGPT is thinking..." text during AI response generation
- **Message Timestamps**: Subtle time context shown on hover (desktop) / always visible (mobile) using semantic `<time>` elements
- **Error Recovery**: Graceful error states with AlertCircle icon and retry button for failed requests
- **Smooth Auto-Scroll**: Intelligent scrolling that only activates when user is within 100px of bottom
- **Enhanced Welcome State**: Animated brain icon with descriptive copy encouraging user interaction

### Implementation Details

All features follow the project's `'docs/coding_guidelines.md'` and `'docs/Styling-in-Next-and-Tailwind-v4.md'` specifications:

- **Component-driven architecture** with single responsibility
- **Semantic HTML** for accessibility (time elements, aria attributes)
- **Tailwind v4 theming** using `@theme` tokens (`--color-background`, `--color-foreground`, etc.)
- **Performance considerations** with `prefers-reduced-motion` respect
- **TypeScript safety** with proper interface definitions
- **Mobile-first responsive design** with hover states differentiated

---

## 📱 Phase 2: Adaptive Mobile Integration

**Completed**: JohnGPT is now seamlessly integrated into the mobile bottom navigation system.

### **6-Tab Navigation Structure**
```
Home | About | Services | Work | Contact | JohnGPT ← always last
```

## 🔧 Phase A: Mobile Nav Scroll-Jump Fix

**Completed**: Fixed mobile nav scroll-jump behavior for JohnGPT tab by replacing href="#" with pure action handlers using preventDefault().

### **Technical Changes**

#### **1. NavItemConfig Interface Extension**
- Added optional `onClick` and `onLongPress` callback function properties
- Made `href` optional for action-only navigation items

```typescript
export interface NavItemConfig {
  href?: string; // Optional for action-only items
  label: string;
  iconName: string; // Corresponds to an icon in AnimatedIconsList.md
  isAction?: boolean; // For non-navigation actions like modals
  onClick?: () => void; // Direct click handler for action items
  onLongPress?: () => void; // Long press handler for action items
}
```

#### **2. JohnGPT Configuration Update**
- Replaced empty `href: ''` with callback functions
- Maintains existing tap/long-press behavior for modal/dashboard access

```typescript
{
  label: 'JohnGPT',
  iconName: 'brain',
  isAction: true,
  onClick: () => { /* Prevents default link behavior */ },
  onLongPress: () => { /* Prevents default link behavior */ }
}
```

#### **3. Action Handler Implementation**
- Added preventDefault/stopPropagation in click and long-press handlers
- Ensures no page scroll behavior is triggered even with "#" fallback
- Maintains proper event handling for animation and touch interactions

#### **4. Smart Navigation Isolation**
**Key Fix**: Conditionally disabled smart navigation hooks for action items to prevent href-based interference.

- **Smart Navigation Bypass**: Action items now skip `useSmartNavigation` entirely, preventing `'#'` fallback href from triggering browser navigation
- **Event Handler Isolation**: `handlePressStart` function excludes action items from smart navigation calls, avoiding mouse/touch handler interference
- **Clean Action Handling**: Action items operate with pure JavaScript callbacks, completely isolated from navigation system

#### **5. Component Architecture Preservation**
- JohnGPT retains special long-press hook behavior (tap → modal, long-press → dashboard)
- Other action items can use generic callback functions
- No breaking changes to existing navigation flow or styling

### **Problem Solved**
- **Before**: JohnGPT tab caused unwanted page scroll-to-top due to empty `href=""` being treated as anchor link
- **After**: Pure JavaScript action handling with event prevention prevents all default browser navigation behavior
- **Result**: Clean user experience with no unintended scrolling interruptions

### **Testing Verification**
✅ JohnGPT tap opens chat modal without page movement
✅ JohnGPT long-press navigates to dashboard without scroll
✅ Other navigation items maintain expected scroll spy behavior
✅ Active state highlighting works correctly for all tabs
✅ Mobile responsive design preserved across screen sizes

### **Responsive Behavior**
- **≥414px screens**: All 6 tabs visible with full labels and standard spacing
- **<414px screens**: All 6 tabs maintained, reduced icon size (w-5 h-5), smaller labels (text-[0.65rem]), tighter padding (p-0.5)
- **Navigation order**: Fixed to maintain narrative flow (JohnGPT as culmination)

### **JohnGPT Special Interactions**
- **Tap (immediate)**: Opens full-screen chat modal on mobile
- **Long-press (≥500ms)**: Navigates to `/john-gpt` dashboard stub page
- **Active state**: Highlights with `text-primary` + `bg-primary/10` background
- **Accessibility**: Proper `aria-label` explaining dual functionality

### **Motion Blur Performance Guardrails**
```ts
const shouldApplyBlur = useMemo(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGoodPerformance = navigator.hardwareConcurrency >= 4;
  return !prefersReducedMotion && hasGoodPerformance;
}, []);
```

- **Guardrails**: Skips blur on low-performance devices or when user prefers reduced motion
- **Preservation**: Motion blur maintained for cinematic aesthetic on capable devices

### **Mobile Chat Modal**
- **Full-screen on mobile**: `fixed inset-0 m-0 h-screen max-h-screen`
- **Desktop**: Centered modal with max width (`md:max-w-2xl md:rounded-lg`)
- **Flexible layout**: `flex-1 overflow-hidden` for proper mobile keyboard handling

### **About Page Preservation**
✓ **Maintains full accessibility** - no content removal or redirection
✓ **Remains in navigation** - unchanged position and functionality
✓ **No content migration** - original About content preserved

### **Technical Architecture**
- **`useMediaQuery` hook**: Screen size detection for responsive styling
- **`useLongPress` hook**: Debounced long-press vs tap differentiation
- **Performance monitoring**: Hardware concurrency check for motion density
- **Touch handling**: Cross-platform compatibility (touch + mouse events)

### **Testing Criteria Verified**
✅ All 6 tabs visible on iPhone 14 Pro (393px) and iPhone 12 Pro Max (428px)
✅ JohnGPT always positioned last in navigation
✅ Tap opens modal, long-press navigates to dashboard
✅ Responsive scaling prevents horizontal overflow
✅ Motion blur conditional on performance and user preferences
✅ About page remains fully functional
✅ Passes Lighthouse performance audits

This mobile integration transforms JohnGPT from a desktop-only feature into the intelligent climax of the mobile navigation experience, while maintaining the About page's storytelling value and the platform's cinematic aesthetic.

---

## 📱 Phase 3.5: Mobile Contextual Awareness & Markdown Support

**Completed**: Enhanced JohnGPT with mobile-focused contextual cues and rich markdown rendering for professional AI responses.

### **Mobile Contextual Awareness Layer**

#### **A. Header Badge / Label**
- Added "⚡ AI Assistant Mode" badge in mobile header for clear contextual messaging
- Signals users are in an AI companion layer, not the main app experience

#### **B. Back-to-Content Button (Mobile Only)**
- Replaced primary X close button with prominent back button on mobile
- Clear "Return to main content" arrow signaling layer exit
- Includes `aria-label="Return to main content"` for accessibility

#### **C. Subtle Overlay Blur (Preserved)**
- Maintains existing `useScrollBlur` hook creating atmospheric depth
- Perfectly complements "layer" perception on mobile

### **Rich Markdown Rendering**

#### **MarkdownRenderer Component**
- **File Location**: `src/components/ui/MarkdownRenderer.tsx`
- **Purpose**: Client-side markdown parsing for rich AI responses
- **Props**:
  - `content`: `string` - Markdown content to render
- **Library**: Remarkable (lightweight, fast markdown parser)
- **Features**:
  - Headings (H1-H6) with proper styling
  - Code blocks with dark theme background
  - Inline code with syntax highlighting
  - Lists (ordered/unordered) with proper indentation
  - Blockquotes with border styling
  - Links with hover states
  - All elements use Tailwind v4 `@theme` tokens

#### **Integration into ChatMessages**
- **Assistant Message Enhancement**: Renders markdown content for AI responses only
- **Theme Compliance**: Uses design tokens (`text-foreground`, `border-border`, etc.)
- **Performance Optimization**: Dynamic import of Remarkable with error handling
- **Fallback Behavior**: Falls back to basic text rendering if markdown fails

### **Mobile Dashboard Teaser CTA**

#### **JohnGPT Dashboard Promotion**
- **Conditional Display**: Shows only on mobile devices after conversation starts
- **Trigger Conditions**: `isMobile && messages.length > 0 && !isLoading`
- **CTA Content**: "Want more? Explore the full dashboard" with navigation link
- **Styling**: Subtle background (`bg-primary/5`) with primary text color
- **Integration**: Positioned at bottom of messages area before scroll anchor

### **Enhanced Long-Press Navigation**

#### **Mobile Bottom Nav Improvements**
- **Fixed Active State**: Brain icon now properly highlights on `/john-gpt` page
- **Special Detection Logic**: Custom active state handling for action items
- **Navigation Flow**: Long-press (500ms) → `/john-gpt` dashboard routing
- **Animation**: Proper touch feedback with icon animation during press
- **Accessibility**: Clear `aria-label` explaining tap vs long-press behavior

### **Theme Compliance & Performance**

#### **Tailwind v4 Token Usage**
- All components use `@theme` properties for consistent theming
- Dark mode first design with light mode support verified
- No hardcoded colors - fully reactive to theme changes

#### **Performance Guardrails**
- `prefers-reduced-motion` respect for animations
- Dynamic Remarkable import avoids loading delays
- Efficient DOM manipulation for markdown rendering
- Proper error boundaries with text fallbacks

### **Technical Implementation Details**

#### **Component Architecture**
- **Remarkable Integration**: Dynamic imports to work around TypeScript issues
- **Error Handling**: Catch blocks provide graceful text fallbacks
- **Accessibility**: Semantic HTML elements maintained throughout
- **TypeScript Safety**: Proper interfaces and type checking

#### **Mobile UX Philosophy**
- **Layer Concept**: JohnGPT feels like an overlay companion, not main app
- **Progressive Journey**: Chat assistant → dashboard discovery → deeper engagement
- **Contextual Clarity**: Clear mode badges and navigation signals

#### **Testing Verification**
- ✅ Mobile header shows "AI Assistant Mode" badge
- ✅ Back button replaces X on mobile, signals content return
- ✅ Markdown renders with theme-compliant styling
- ✅ Dashboard teaser appears conditionally on mobile
- ✅ Active state highlights brain icon properly
- ✅ Long-press navigation to `/john-gpt` works correctly

This enhancement transforms JohnGPT into a truly mobile-first AI experience where users understand their context within the platform's layered architecture while receiving rich, formatted AI responses that match the professional aesthetic.

---

## 📦 Phase 6: Chat History & Persistent Storage

**Completed**: Hybrid local-first storage architecture with cloud backup for conversation persistence.

For full technical details, architecture diagrams, and API documentation, please refer to:
👉 **[JohnGPT Storage & Persistence](./StorageAndPersistence.md)**

### **High-Level Overview**

JohnGPT uses a **three-tier hybrid storage system**:
1.  **IndexedDB (Local)**: Instant load times and offline support.
2.  **Google Drive (Cloud)**: JSON backup for cross-device sync and data ownership.
3.  **Neon DB (Metadata)**: Lightweight indexing for the conversation sidebar.

### **Key Features**
- **Auto-Save**: Conversations save locally immediately and sync to cloud in background.
- **AI Titles**: Automatically generates descriptive titles after 6 messages using Groq Llama 3.3.
- **Smart Sync**: Debounced uploads (5s) to prevent API rate limiting.
- **Privacy**: User owns their data in their personal Google Drive.

- **Title Editing**: Inline edit with auto-save
- **Delete with Sync**: Deletes locally and from Drive
- **Load Previous**: Click to load conversation into chat view
- **New Chat**: Create fresh conversation
- **Search**: Filter conversations by title (future)

#### **UI Components**

```tsx
<ConversationSidebar
    conversations={conversations}
    currentConversationId={conversationId}
    onSelectConversation={(id) => router.push(`/john-gpt/${id}`)}
    onNewChat={() => router.push('/john-gpt')}
    onDeleteConversation={handleDelete}
    onEditTitle={handleEditTitle}
/>
```

### **5. Data Persistence Guarantees**

#### **Race Condition Prevention**

**Problem Solved**: Original implementation navigated to `/john-gpt/{id}` before saving, causing blank screen

**Solution**: 
1. Save conversation to IndexedDB **FIRST**
2. **AWAIT** completion of save operation
3. **THEN** navigate to conversation URL

```typescript
// Save FIRST and AWAIT completion
await chatStorage.saveConversation({ /*...*/ });

// THEN navigate ONLY if we don't have a conversationId in the URL
if (!conversationId) {
    router.push(`/john-gpt/${convId}`);
}
```

#### **Data Integrity**

- ✅ **Deduplication**: Messages deduplicated by ID before save
- ✅ **Timestamps**: All messages guaranteed to have timestamps
- ✅ **Atomic Saves**: IndexedDB transactions ensure all-or-nothing writes
- ✅ **Sync State Tracking**: `syncedToDrive` flag prevents duplicate uploads

### **6. Message Data Structure**

```typescript
export interface ExtendedMessage extends Omit<UIMessage, 'parts'> {
    timestamp: number;
    parts?: ExtendedMessagePart[];
}

export type ExtendedMessagePart =
    | { type: 'text'; text: string }
    | { type: 'image_link'; driveFileId: string; mimeType: string };
```

**Extensions over AI SDK's UIMessage**:
- `timestamp`: Required for chronological sorting
- `image_link` part: Supports media attachments via Drive IDs

### **7. Storage Limits & Performance**

#### **Current Limits**

| Storage Type | Typical Limit | Current Enforcement |
|--------------|---------------|-------------------|
| IndexedDB | 50MB - 10GB | ❌ No limits enforced |
| Google Drive | 15GB (free) | ✅ Drive quota applies |

#### **Performance Characteristics**

- **Save Speed**: ~10-50ms (IndexedDB write)
- **Load Speed**: ~5-20ms (IndexedDB read)
- **Sync Upload**: ~200-500ms per conversation
- **Sync Download**: ~300-700ms per conversation

#### **Optimization Strategies**

- **Lazy Sync**: Background sync doesn't block UI
- **Batch Operations**: Multiple conversations synced in parallel
- **Conditional Sync**: Only unsynced conversations uploaded
- **Timestamp Comparison**: Skips downloading unchanged files

### **8. Error Handling & Recovery**

#### **Sync Failures**

```typescript
async syncConversations(userId: string): Promise<void> {
    try {
        // Sync logic...
    } catch (error) {
        console.error('Sync failed:', error);
        // Fails silently - local data remains intact
        // User can retry later
    }
}
```

**Graceful Degradation**:
- ❌ Sync fails → Local conversations still accessible
- ❌ Drive unavailable → App works offline
- ❌ Network error → Retry on next save/load

#### **Data Loss Prevention**

- **Server-Side**: IndexedDB persists across browser sessions
- **Client-Side**: Google Drive acts as backup
- **Multi-Device**: Sync ensures data available on all devices

### **9. Future Enhancements (Not Yet Implemented)**

#### **Planned Features**

- [ ] **Tier-Based Limits**: Enforce max conversations per tier
- [ ] **Search**: Full-text search across all conversations
- [ ] **Export**: Download conversations as JSON/Markdown
- [ ] **Import**: Restore from exported files
- [ ] **Archive**: Move old conversations to archive folder
- [ ] **Favorites**: Star important conversations
- [ ] **Tags**: Organize conversations with custom tags

#### **Potential Database Migration**

**Current**: IndexedDB + Drive (client-side)  
**Future**: Neon DB (server-side) with Drive as export option

**Benefits of DB Migration**:
- Server-side search and filtering
- Shared conversations between team members
- Admin analytics and insights
- Better tier-based enforcement

---

### **10. Bug Fixes & Troubleshooting**

#### **Fixed: onFinish Callback Not Triggering (December 2, 2025)**

**Issue**: Chat history was not saving despite all storage infrastructure being in place.

**Root Cause**: The `useBranchingChat` hook had a critical bug in how it wrapped the `onFinish` callback:

```typescript
// BROKEN CODE (was looking in wrong place for onFinish)
onFinish: (message: any, options: any) => {
    options?.onFinish?.(message, options);  // ❌ options here is callback param, not hook options!
},
```

**Fix**: Changed to correctly reference the original `options.onFinish` from the hook's configuration:

```typescript
// FIXED CODE
onFinish: (message: any, finishOptions: any) => {
    if (options.onFinish) {  // ✅ options from hook's scope
        options.onFinish(message, finishOptions);
    }
},
```

**Impact**: This fix restored all chat history functionality including IndexedDB saves and Google Drive sync.

**File Modified**: `src/features/john-gpt/hooks/useBranchingChat.ts`

---

Phase 4: Conversation History & Settings (Coming Soon)

---

## 🔧 Phase 4: Modal Layout Fixes (Fixed Modal Positioning & Background Issues)

**Completed**: Comprehensive fixes for modal positioning conflicts, background coverage, and responsive layout issues that created floating input elements and jarring expansion effects.

### **Root Cause Analysis**

The JohnGPT dialog suffered from multiple layout and positioning conflicts:

1. **Radix UI Positioning Conflicts**: Custom modal classes overrode default centering, causing layout instability
2. **Flex Expansion During Streaming**: Lack of height constraints caused modal to grow during AI responses
3. **Background Coverage Gaps**: Background not extending from header to input area
4. **Input Positioning Issues**: Input field appearing disconnected from modal body
5. **Responsive Layout Problems**: Different behaviors on mobile vs desktop

### **Technical Solution Overview**

Implemented a unified flexbox architecture where `DialogContent` serves as the single master container with complete background coverage:

#### **Key Architectural Changes**

##### **1. Single Flex Container Architecture**
```tsx
// DialogContent became the master flex container
<DialogContent className={`${dialogClasses} flex flex-col bg-background/95`}>
  ├── <Header /> (flex-shrink-0)
  ├── <ChatMessages /> (flex-1, expands)
  ├── <Error /> (flex-shrink-0, conditional)
  └── <ChatInput /> (flex-shrink-0)
</DialogContent>
```

**Benefits:**
- ✅ Eliminates layout flow conflicts (no positioned elements)
- ✅ Guaranteed background coverage across entire modal
- ✅ Consistent top-to-bottom layout control
- ✅ Proper input positioning at bottom

##### **2. Unified Height Management**
```tsx
const fixedModalHeight = isMobile ? 'h-full' : 'h-[500px]';
// Desktop: Fixed 500px height prevents expansion
// Mobile: Full screen utilization
```

**Benefits:**
- ✅ Prevents modal growth during streaming responses
- ✅ Consistent visual size across all states
- ✅ Matches user's expectation of stable modal dimensions

##### **3. Flex-Based Component Structure**

Each modal section now follows perfect flex behavior:

- **Header**: `flex-shrink-0` (fixed size, never shrinks)
- **ChatMessages**: `flex-1` (grows to fill available space)
- **Error**: `flex-shrink-0` (conditional, fixed when present)
- **ChatInput**: `flex-shrink-0` (anchored at bottom, fixed size)

**Benefits:**
- ✅ Input always stays at bottom
- ✅ Messages area expands properly
- ✅ No floating or disconnected elements

##### **4. Message Area Expansion Fix**
```tsx
// Empty state now expands to fill space
<div className="flex-1 flex items-center justify-center p-8">

// Messages area properly expands
<div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollContainerRef}>
```

**Benefits:**
- ✅ Input positioned correctly even when chat is empty
- ✅ Seamless layout transition from empty to populated state

##### **5. Dialog Component Enhancements**

**File Location**: `src/components/ui/dialog.tsx`

Added `hideDefaultClose` prop for flexible close button control and better custom positioning support.

```tsx
DialogContent.defaultProps = { hideDefaultClose: false };
```

**Benefits:**
- ✅ Prevents close button conflicts
- ✅ Allows custom close implementations
- ✅ Maintains accessibility standards

### **Resolved Issues Checklist**

- [x] **Modal height consistency** - Fixed at 500px desktop, full screen mobile
- [x] **Background coverage gaps** - Single container covers header to input
- [x] **Input positioning bugs** - Anchored at bottom via flex-shrink-0
- [x] **Radix positioning conflicts** - Unified layout system
- [x] **Expansion during streaming** - Fixed height prevents growth
- [x] **Responsive behavior** - Identical logic on mobile and desktop
- [x] **Accessibility compliance** - Hidden DialogTitle maintains screen reader support
- [x] **Flex flow integrity** - All elements in normal document flow
- [x] **Touch/scroll handling** - Proper overflow and scrolling behavior

### **Performance & UX Impact**

- **Visual Stability**: Modal size now consistent across all interaction states
- **Layout Performance**: Single flex container eliminates multiple reflows
- **Touch Experience**: Proper mobile keyboard handling and scroll behavior
- **Loading Experience**: No jarring size changes during AI response streaming
- **Accessibility**: Screen readers properly announce modal and focus management

### **Browser Compatibility**

- ✅ **Chrome/Edge/Safari**: Full flexbox support
- ✅ **Mobile Safari/iOS Safari**: Proper viewport handling
- ✅ **Firefox**: Complete layout compatibility
- ✅ **Edge Runtime**: Optimized for streaming responses

### **Testing Verification**

**Desktop Modal Behavior:**
1. Opens at fixed 500px height immediately
2. Input positioned at bottom with continuous background
3. Messages area expands properly without modal growth
4. Responsive to window resizing
5. Background covers entire modal seamlessly

**Mobile Modal Behavior:**
1. Opens full screen (h-full) immediately
2. Input anchored at bottom of viewport
3. Messages area fills available space above keyboard
4. Background covers entire screen modal
5. Keyboard handling prevents layout breaks

**Streaming Response Behavior:**
1. Modal size remains constant during streaming
2. No expansion or position shifting
3. Background maintains full coverage
4. Input stays anchored at bottom
5. Smooth user experience without visual interruption

### **Implementation Files Modified**

1. **`src/components/ui/dialog.tsx`**: Enhanced with flexible positioning and close button control
2. **`src/features/john-gpt/components/JohnGPTDialog.tsx`**: Complete layout restructure
3. **`src/features/john-gpt/components/ChatMessages.tsx`**: Fixed flex expansion issues

### **Code Quality Assurance**

- **TypeScript Safety**: All changes type-safe with proper interfaces
- **Accessibility Compliance**: ARIA support and screen reader compatibility
- **Performance Optimization**: Reduced DOM reflows and layout thrashing
- **Cross-browser Testing**: Verified on major browsers and mobile devices
- **Framework Guidelines**: Adheres to project's component-driven architecture

This comprehensive layout overhaul transforms JohnGPT from a layout-conflicted dialog into a polished, stable modal experience that maintains visual consistency and proper user interaction flow across all scenarios.

---

This implementation establishes a solid foundation for conversational AI in the J StaR Films platform, with enterprise-grade architecture, mobile-first design, and room for future expansion.

## 📋 Phase 3: "Invisible Agents" Architecture (Completed)

We have successfully pivoted from a manual "Persona Selector" UI to a frictionless, intelligent **"Invisible Router"** architecture. This aligns with the "Creative Operating System" vision where the AI adapts to the user's intent automatically.

### **1. The "Invisible Router" Logic**

Instead of forcing users to select a mode (e.g., "Coding Mode" vs. "Creative Mode") from a dropdown, the system now analyzes the user's input to determine the best persona.

**Mechanism:**
1.  **Input Analysis:** The backend (`src/app/api/chat/route.ts`) inspects the user's last message.
2.  **Slash Command Detection:** It checks for specific slash commands that trigger specialized modes.
3.  **Database Fetch:** It dynamically fetches the corresponding System Prompt from the `Persona` table in the database.
4.  **Fallback:** If no command is found, it defaults to the **"Universal"** JohnGPT persona (Role: `Universal`).

### **2. Supported Modes (Slash Commands)**

Power users can force specific modes using slash commands. These prompts are stored in the database and can be updated without code changes.

| Command | Persona Name | Role | Description |
| :--- | :--- | :--- | :--- |
| **(Default)** | JohnGPT | `Universal` | The default "Truth-Teller" mode. Strategic, objective, and creative. |
| `/code` | The Architect | `code` | Senior Full-Stack Engineer. Focuses on Next.js, Tailwind, and best practices. |
| `/roast` | The Critic | `roast` | Brutally honest design critic. Tears apart UI/UX flaws with wit. |
| `/simplify` | The Teacher | `simplify` | Explains complex concepts simply. Uses analogies and clear language. |
| `/bible` | The Shepherd | `bible` | Biblical counselor. Provides wisdom and scripture-based advice. |

### **3. Context Awareness & PromptManager**

To further enhance the "Invisible" experience, JohnGPT now adapts its behavior based on **where** it is being used (Context) and **who** is using it (Tier). This logic is centralized in the `PromptManager`.

**File Location**: `src/lib/ai/prompt-manager.ts`

#### **Contexts**
-   **Widget (`context='widget'`)**: The floating chat bubble found on the website.
-   **Full Page (`context='full-page'`)**: The dedicated chat interface at `/john-gpt`.

#### **Tier-Based Logic**
The `PromptManager` dynamically appends instructions to the "Universal" system prompt based on the user's tier:

1.  **Guest (Widget)**
    *   **Behavior**: 80% Brand Ambassador / 20% General Assistant.
    *   **Goal**: Help visitors navigate J StaR Films, answer service questions, and convert leads.
    *   **Instruction**: "Your PRIMARY goal is to be a helpful BRAND AMBASSADOR... If the user asks general questions, answer briefly but try to pivot back..."

2.  **Tier 1+ User (Widget)**
    *   **Behavior**: 40% Brand Focus / 60% General Assistant.
    *   **Goal**: Provide a helpful utility for registered users while keeping the brand present.
    *   **Instruction**: "Your PRIMARY goal is to be a helpful assistant... engage FREELY and intelligently."

3.  **Full Page (All Tiers)**
    *   **Behavior**: 5% Brand Focus / 95% General Assistant.
    *   **Goal**: A powerful, unrestricted AI companion for deep work and conversation.
    *   **Instruction**: "Do NOT aggressively push the J StaR brand... Engage deeply with the user's topics..."

### **4. Implementation Details**

-   **Frontend**:
    -   `JohnGPTDialog.tsx` passes `api: '/api/chat?context=widget'` to `useChat`.
    -   `ChatView.tsx` passes `api: '/api/chat?context=full-page'` to `useChat`.
-   **Backend**:
    -   `route.ts` extracts the `context` from the query parameters.
    -   It fetches the authenticated user (if any) to determine the `tier`.
    -   It calls `PromptManager.getSystemPrompt({ role, context, user })` to generate the final prompt.

---

## 🔧 Phase 5: Context Detection Fix (December 2, 2025)

**Completed**: Fixed critical context detection bug where the chat API was incorrectly identifying all requests as `widget` context instead of `full-page`, preventing chat history from being saved on the `/john-gpt` page.

### **The Problem**

The original implementation attempted to pass context information from the client to the API via three different methods:

1. **Query Parameters**: `api: '/api/chat?context=full-page'`  
2. **Request Body**: `body: { context: 'full-page' }`  
3. **Custom Headers**: `headers: { 'X-Chat-Context': 'full-page' }`

**None of these methods worked** because the Vercel AI SDK's `useChat` hook doesn't preserve or merge these values into the actual HTTP request.

### **Impact**

- ❌ All chats from `/john-gpt` were treated as `widget` context
- ❌ Chat history was **not being saved** because the system thought users were in widget mode
- ❌ Backend logs showed: `Context resolution: queryContext=null, bodyContext=undefined, finalContext=widget`
- ❌ Different personas were being triggered incorrectly

### **Root Cause Analysis**

The Vercel AI SDK's `useChat` hook:
- Does **not** automatically include query parameters from the `api` URL in requests
- Does **not** merge the `body` option with the request payload
- Does **not** send custom `headers` reliably across all request types

**Evidence from logs**:
```
[useBranchingChat] Options received: { body: { context: 'full-page' }, api: '/api/chat' }
API /api/chat received body: {
  "id": "V8M3j1cGty2n0Hg2",
  "messages": 1,
  "trigger": "submit-message"
}
Context resolution: queryContext=null, bodyContext=undefined, finalContext=widget
```

The `context` field was being passed to `useBranchingChat`, but **never reached the API**.

### **The Solution: Server-Side Detection**

Instead of relying on client-side data passing, we implemented **automatic context detection on the server** using the HTTP `Referer` header.

#### **Implementation**

**File**: `src/app/api/chat/route.ts`

```typescript
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { messages } = body;
  
  // Detect context from the Referer header - much more reliable than client-side
  const referer = req.headers.get('referer') || '';
  const context = referer.includes('/john-gpt') ? 'full-page' : 'widget';
  
  console.log('API /api/chat received body:', JSON.stringify({ ...body, messages: messages.length }, null, 2));
  console.log(`Context detected from referer: ${referer} => ${context}`);
  
  // ... rest of the API logic
}
```

#### **Why This Works**

1. **Automatic**: The browser automatically sends the `Referer` header with every request
2. **Reliable**: No dependency on AI SDK's internal request handling  
3. **Simple**: Single, deterministic check: does the URL contain `/john-gpt`?
4. **Bulletproof**: Works across all browsers and request types

#### **Client-Side Cleanup**

Removed all failed context-passing attempts from the client:

**File**: `src/features/john-gpt/components/ChatView.tsx`
```typescript
// Before (didn't work):
api: '/api/chat?context=full-page',
body: { context: 'full-page' },

// After (clean):
api: '/api/chat',
// Context is now auto-detected server-side from the Referer header
```

**File**: `src/features/john-gpt/hooks/useBranchingChat.ts`
```typescript
// Removed unnecessary headers and fetch customization
const chatHelpers = useChat({
    ...options,
    // Context detection happens server-side now
    onFinish: (message: any, options: any) => { /* ... */ },
    onResponse: (response: Response) => { /* ... */ },
}) as any;
```

### **Verification**

After the fix, backend logs now show correct context detection:

```
✅ On /john-gpt page:
Context detected from referer: http://localhost:5782/john-gpt => full-page
Routing to Persona Role: bible (Context: full-page)

✅ On homepage widget:
Context detected from referer: http://localhost:5782/ => widget
Routing to Persona Role: Universal (Context: widget)
```

### **Benefits**

- ✅ **Chat history now saves** correctly on `/john-gpt` page
- ✅ **Automatic detection** - no client-side configuration needed
- ✅ **Simpler codebase** - removed all failed context-passing logic
- ✅ **More reliable** - not dependent on AI SDK internal behavior
- ✅ **Future-proof** - works for any new pages we add

### **Architecture Lessons Learned**

1. **Don't fight the framework**: When a library doesn't support a feature, find an alternative approach
2. **Server-side is more reliable**: Context information is better determined server-side using standard HTTP headers
3. **Keep it simple**: The simplest solution (checking Referer) ended up being the most robust
4. **Test thoroughly**: Always verify that data is actually reaching the destination, not just being passed to an intermediate function

### **Files Modified**

| File | Changes |
|------|---------|
| `src/app/api/chat/route.ts` | Added Referer-based context detection logic |
| `src/features/john-gpt/components/ChatView.tsx` | Removed unnecessary `body` option from `useBranchingChat` |
| `src/features/john-gpt/hooks/useBranchingChat.ts` | Removed unsuccessful `headers` and `fetch` customization attempts |

### **Updated Frontend Implementation**

-   **Frontend**:
    -   `JohnGPTDialog.tsx` passes `api: '/api/chat'` to `useChat` (widget context auto-detected)
    -   `ChatView.tsx` passes `api: '/api/chat'` to `useChat` (full-page context auto-detected)
-   **Backend**:
    -   `route.ts` extracts the `context` from the `referer` header automatically
    -   It fetches the authenticated user (if any) to determine the `tier`
    -   It calls `PromptManager.getSystemPrompt({ role, context, user })` to generate the final prompt.

---

### **3. Database Schema Integration**

The `Persona` model in `prisma/schema.prisma` stores these configurations:

```prisma
model Persona {
  id           String   @id @default(cuid())
  name         String   @unique
  role         String   // e.g., "Universal", "code", "roast"
  description  String
  systemPrompt String   @db.Text
  // ... other fields
}
```

### **4. Benefits of this Architecture**

*   **Frictionless UX:** Users just type. No setup required.
*   **Dynamic Updates:** System prompts can be tweaked in the database instantly without redeploying the app.
*   **Extensibility:** New modes (e.g., `/marketing`, `/legal`) can be added simply by inserting a row into the `Persona` table.
*   **Power User Speed:** Typing `/c` is faster than clicking a dropdown menu.

### **5. Implementation Details**

*   **Frontend:** The `PersonaSelector` component has been removed. The UI is now cleaner and focused purely on the chat.
*   **Backend:** `src/app/api/chat/route.ts` now contains the routing logic and Prisma queries to fetch prompts.
*   **Seeding:** `prisma/seed.ts` includes the default prompts for all supported modes to ensure the database is populated on fresh installs.
## 🔧 Phase 7: Streaming Reliability Fixes (December 2025)

**Completed**: Addressed issues where chat streams were cutting off mid-sentence due to Vercel Hobby plan timeouts and buffering.

### **The Problem**
- Chat responses were cutting off after ~30 seconds.
- Streaming was "aggressive" (bursty) followed by long pauses.
- No error messages were displayed; the stream just stopped.

### **Root Cause**
1. **Timeout**: The `maxDuration` in `src/app/api/chat/route.ts` was set to `30` seconds. Vercel's Hobby plan has a hard limit of `60` seconds for Serverless Functions, but the strict 30s limit was prematurely killing longer generations (especially from slower models or during "thinking" phases).
2. **Buffering**: Response buffering (likely at the Vercel Edge or proxy layer) was holding back chunks, causing them to arrive in bursts and potentially leading to timeouts if the buffer wasn't flushed before the limit.

### **The Solution**

**File**: `src/app/api/chat/route.ts`

1.  **Increased Timeout**: Set `maxDuration = 60` to maximize the available execution time on the Hobby plan.
2.  **Streaming Headers**: Added `Cache-Control: no-cache, no-transform` and `Connection: keep-alive` to force immediate flushing of chunks and prevent connection drops.
3.  **Resilience**: Increased `maxRetries` from `1` to `2` to handle transient network blips.

```typescript
export const maxDuration = 60; // Increased from 30

// ...

return result.toUIMessageStreamResponse({
  messageMetadata: () => ({ mode: targetRole }),
  headers: {
    'Connection': 'keep-alive', // Ensure connection stays open during pauses
    'Cache-Control': 'no-cache, no-transform', // Prevent buffering
  }
});
```

### **Verification**
- Stream should now persist for up to 60 seconds.
- Text delivery should be smoother (less bursty) due to disabled caching/buffering.
