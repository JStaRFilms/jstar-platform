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
- **Tailwind v4 theming** using core tokens (background, foreground, border, ring)
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

Phase 3: Conversation History & Settings (Coming Soon)

---

This implementation establishes a solid foundation for conversational AI in the J StaR Films platform, with enterprise-grade architecture, mobile-first design, and room for future expansion.
