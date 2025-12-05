# Feature: Unified Navigation System (goTo Tool)

## 1. Purpose

The Unified Navigation System provides JohnGPT with a single, intelligent `goTo` tool that handles all navigation needs - page navigation, section scrolling, and cross-page section navigation. It replaces the previous fragmented `navigate` + `scrollToSection` tools with a smarter, database-driven approach that understands user context and intent.

### Key Capabilities
- **Smart Destination Resolution**: Uses vector similarity search to find the best match for natural language queries
- **Context Awareness**: Knows the user's current page via referer header
- **Automatic Disambiguation**: Distinguishes between "pricing page" vs "pricing section"
- **Visual Feedback**: Shows spotlight glow effect on destination arrival
- **Database-Driven Sections**: Auto-discovers sections from codebase via script

---

## 2. Architecture Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  AI Model       │────▶│  goTo Tool       │────▶│ findDestination │
│  (Gemini)       │     │  (route.ts)      │     │  (resolver)     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                │                        │
                                ▼                        ▼
                        ┌──────────────────┐     ┌─────────────────┐
                        │ useBranchingChat │     │  Database       │
                        │ (hook handler)   │     │  (page_sections)│
                        └──────────────────┘     └─────────────────┘
                                │
                                ▼
                        ┌──────────────────┐
                        │ ChatActionContext│
                        │ (spotlight + nav)│
                        └──────────────────┘
```

---

## 3. Database Model

### PageSection (`prisma/schema.prisma`)

Stores sections discovered from the codebase for semantic search.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `String` | Primary key (cuid) |
| `pageId` | `String` | Foreign key to `PageNavigation` |
| `elementId` | `String` | HTML element ID (e.g., `"pricing-section"`) |
| `title` | `String` | Human-readable title (e.g., `"Pricing"`) |
| `description` | `String` | Section description for search context |
| `keywords` | `String[]` | Additional search keywords |
| `order` | `Int` | Display order on the page |
| `embedding` | `Vector(768)` | Vector embedding for semantic search |
| `isActive` | `Boolean` | Whether section is currently active |

**Relationship**: Many `PageSection` → One `PageNavigation` via `pageId`

---

## 4. Core Components

### 4.1 findDestination (`src/lib/ai/findDestination.ts`)

The brain of the navigation system. Searches both pages and sections to find the best match.

#### Function Signature

```typescript
async function findDestination(
    query: string,        // Natural language query (e.g., "show me pricing")
    currentPath: string,  // Current page path (e.g., "/store")
    userTier: UserTier    // User's access tier
): Promise<DestinationMatch | null>
```

#### Return Type

```typescript
type DestinationMatch = {
    type: 'page' | 'section' | 'page_and_section';
    pageUrl: string;
    pageTitle: string;
    requiredTier: UserTier;
    sectionId?: string;
    sectionTitle?: string;
    similarity: number;
    isOnCurrentPage?: boolean;
    alternativeExists?: boolean;
}
```

#### Disambiguation Logic

| User Query | Current Path | Result |
|------------|--------------|--------|
| "pricing" | `/` (homepage) | `section` → scroll to pricing-section |
| "pricing" | `/about` | `page` or `page_and_section` |
| "pricing page" | any | `page` → force page navigation |
| "pricing section" | `/` | `section` → force section scroll |
| "pricing section" | `/about` | `page_and_section` → navigate + scroll |

---

### 4.2 goTo Tool (`src/app/api/chat/route.ts`)

The unified AI tool that replaces both `navigate` and `scrollToSection`.

#### Tool Definition

```typescript
goTo: tool({
    description: 'Navigate the user to a specific page or section on the website.',
    inputSchema: z.object({
        destination: z.string().describe('Where the user wants to go'),
    }),
    execute: async ({ destination }) => {
        const match = await findDestination(destination, currentPath, userTier);
        // Returns appropriate action based on match type
    }
})
```

#### Actions Returned

| Action | Payload | When Used |
|--------|---------|-----------|
| `navigate` | `{ url, title, message }` | Page navigation only |
| `scrollToSection` | `{ sectionId, sectionTitle, message }` | Scroll on current page |
| `navigateAndScroll` | `{ url, title, sectionId, sectionTitle }` | Cross-page section navigation |
| `showLoginComponent` | `{ requiredTier, targetUrl }` | Access restricted |

---

### 4.3 useBranchingChat Hook (`src/features/john-gpt/hooks/useBranchingChat.ts`)

Handles `tool-goTo` parts from the AI response and executes the appropriate action.

#### Tool Handler

```typescript
if (part.type === 'tool-goTo' && part.state === 'output-available') {
    const result = part.output;
    switch (result?.action) {
        case 'navigate':
            router.push(`${result.url}?spotlight=page`);
            break;
        case 'scrollToSection':
            scrollFn(result.sectionId);
            break;
        case 'navigateAndScroll':
            router.push(`${result.url}?spotlight=${result.sectionId}`);
            break;
    }
}
```

---

### 4.4 ChatActionContext (`src/features/john-gpt/context/ChatActionContext.tsx`)

Manages spotlight animations and section scrolling.

#### Key Functions

| Function | Purpose |
|----------|---------|
| `scrollToSection(sectionId)` | Scroll to element + add spotlight class |
| `clearSpotlight()` | Remove spotlight animation |

#### Spotlight Query Param Listener

Listens for `?spotlight=` query param on page load and triggers appropriate effect:
- `?spotlight=page` → Highlights entire page with glass glow
- `?spotlight=services-section` → Scrolls to and highlights section

---

### 4.5 Visual Feedback Components (`src/features/john-gpt/components/ChatActionComponents.tsx`)

UI components that render tool call status in the chat.

| Component | Purpose |
|-----------|---------|
| `NavigationPreview` | Shows "Navigating to..." / "✓ Navigated to..." |
| `SectionScrollPreview` | Shows "Scrolling to services..." |
| `NavigateAndScrollPreview` | Shows "Taking you to pricing on Home..." |
| `LoginActionComponent` | Shows access restricted message with login button |

---

## 5. CSS Animation (`src/app/globals.css`)

The spotlight effect uses a glass overlay with purple gradient and sparkle accents.

```css
.section-spotlight {
    animation: spotlight-glow 2.5s ease-out forwards;
    backdrop-filter: blur(4px) saturate(1.2);
    /* Purple gradient background, sparkle pseudo-element */
}
```

**Features**:
- Full glass overlay covering entire section
- Purple gradient background (violet-500 to indigo-500)
- Sparkle radial gradient pseudo-elements
- Inset glow for depth
- Dark mode variant with increased intensity
- Respects `prefers-reduced-motion`

---

## 6. Auto-Discovery Script (`src/scripts/populate-sections.ts`)

Automatically discovers sections from the codebase and syncs to database.

### How It Works

1. Scans all `.tsx` and `.jsx` files in `src/`
2. Finds elements with `id="xxx-section"` pattern
3. Extracts title from comment or element content
4. Maps file path to page URL using configuration
5. Generates vector embedding for semantic search
6. Upserts to `page_sections` table

### Usage

```bash
# Sync sections only
npm run update-sections

# Sync both pages and sections
npm run db:sync-nav
```

### Configuration (`FILE_PATH_TO_PAGE`)

```typescript
const FILE_PATH_TO_PAGE: Record<string, string> = {
    'src/features/HomePage': '/',
    'src/app/(main)/about': '/about',
    'src/app/(main)/store': '/store',
    // Add mappings as needed
};
```

---

## 7. Prompt Manager (`src/lib/ai/prompt-manager.ts`)

Updated tool guidelines for the AI:

```
GOTO_TOOL (Unified Navigation):
- TRIGGER: User wants to change their view or "see" something.
- USAGE:
  * User: "Go to services" → goTo({ destination: "services" })
  * User: "Show me the pricing" → goTo({ destination: "pricing" })
- RULE: If the user asks "Where is X?", take them there using this tool.
- ACTION: goTo({ destination: "<simple keyword>" })
```

---

## 8. Usage Examples

### Example 1: Section Scroll on Current Page

**User** (on homepage): "Show me the services section"

**AI calls**: `goTo({ destination: "services section" })`

**Result**:
1. `findDestination` returns `type: 'section'`
2. Hook calls `scrollToSection("services-section")`
3. Page scrolls smoothly, section glows purple

---

### Example 2: Cross-Page Section Navigation

**User** (on `/store`): "Show me pricing"

**AI calls**: `goTo({ destination: "pricing" })`

**Result**:
1. `findDestination` returns `type: 'page_and_section'` or `type: 'section'` with different page
2. Hook navigates to `/?spotlight=pricing-section`
3. On homepage load, `ChatActionContext` detects param
4. Scrolls to pricing section with spotlight effect

---

### Example 3: Page Navigation

**User**: "Go to the contact page"

**AI calls**: `goTo({ destination: "contact page" })`

**Result**:
1. `findDestination` returns `type: 'page'`
2. Hook navigates to `/contact?spotlight=page`
3. On page load, main content gets glass glow effect

---

## 9. Files Changed/Created

| File | Type | Description |
|------|------|-------------|
| `prisma/schema.prisma` | Modified | Added `PageSection` model |
| `src/scripts/populate-sections.ts` | Created | Auto-discovery script |
| `src/lib/ai/findDestination.ts` | Created | Smart destination resolver |
| `src/app/api/chat/route.ts` | Modified | Added unified `goTo` tool |
| `src/features/john-gpt/hooks/useBranchingChat.ts` | Modified | Handle `tool-goTo` actions |
| `src/features/john-gpt/context/ChatActionContext.tsx` | Modified | Spotlight param listener |
| `src/features/john-gpt/components/ChatActionComponents.tsx` | Modified | Added scroll/navigate previews |
| `src/features/john-gpt/components/ChatMessages.tsx` | Modified | Render `tool-goTo` parts |
| `src/features/john-gpt/components/JohnGPTDialog.tsx` | Modified | Wire `scrollToSection` |
| `src/lib/ai/prompt-manager.ts` | Modified | Updated tool guidance |
| `src/app/globals.css` | Modified | Glass spotlight animation |
| `package.json` | Modified | Added `update-sections` script |

---

## 10. Related Documentation

- [JohnGPT Core Chat Experience](./core-chat-experience.md)
- [RAG Knowledge Base](./RAG-KnowledgeBase.md)
- [Storage and Persistence](./StorageAndPersistence.md)
