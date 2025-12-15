# Feature: JohnGPT Storage & Persistence

## 1. Purpose

The Storage & Persistence system ensures that user conversations are saved reliably, accessible across devices (via Google Drive), and available offline (via IndexedDB). It implements a **hybrid storage architecture** that balances performance, reliability, and data ownership.

## 2. Architecture Overview

The system uses a three-tier storage strategy:

1.  **IndexedDB (Local Cache):**
    *   **Role:** Primary read/write layer for the UI.
    *   **Benefit:** Instant load times, offline support, zero latency.
    *   **Library:** `idb` (via `IndexedDBClient`).

2.  **Neon PostgreSQL (Server DB):**
    *   **Role:** Primary cloud storage for conversations with API sync.
    *   **Benefit:** Cross-browser sync, persistent storage, real-time availability.
    *   **Manager:** `DBSyncManager` (`src/lib/storage/db-sync-manager.ts`)
    *   **Data:** Full conversation metadata and messages stored via Prisma.

3.  **Google Drive (Optional Cloud Backup):**
    *   **Status:** Backend available but **UI disabled** (2025-12-15).
    *   **Role:** Long-term storage and cross-device sync.
    *   **Benefit:** User owns their data, accessible outside the app.
    *   **Format:** JSON files named `[AI Title] - [8-char ID].json`.
    *   **Library:** Custom `GoogleDriveClient` using Google Drive API v3.

## 2.1 Current Status (2025-12-15)

### ✅ Working Features

| Feature | Status | Notes |
|---------|--------|-------|
| **Sidebar loads all conversations** | ✅ Working | Lists all user conversations from DB |
| **Messages load correctly** | ✅ Working | Full message history displays when opening a conversation |
| **New conversations save to DB** | ✅ Working | Auto-syncs with 5s debounce |
| **IndexedDB caching** | ✅ Working | Instant loads, offline support |
| **Cross-browser sync** | ✅ Working | Conversations sync via Neon PostgreSQL |
| **AI title generation** | ✅ Working | Triggers after 6 messages |
| **Conversation deletion** | ✅ Working | Removes from DB and cache |
| **Offline queue** | ✅ Working | Pending syncs retry when online |

### ⚠️ Known Issues

| Issue | Severity | Ticket |
|-------|----------|--------|
| Viewing old conversations updates `updatedAt` timestamp | Low | See `docs/escalation_report_timestamp_issue.md` |
| Google Drive sync UI disabled | Info | Backend works, UI hidden from sidebar |

## 3. Key Components

### 3.1. SyncManager (`src/lib/storage/sync-manager.ts`)

The orchestrator that manages data flow between the three layers.

*   **Debouncing:** Implements a 5-second debounce for Drive uploads to prevent API rate limiting.
*   **Queue System:** Manages a queue of conversations pending sync.
*   **Conflict Resolution:** "Last write wins" policy, favoring the most recent `updatedAt` timestamp.

### 3.2. IndexedDBClient (`src/lib/storage/indexeddb-client.ts`)

Handles all local database operations.

*   **Database:** `jstar-chat-db`
*   **Store:** `conversations`
*   **Operations:** `saveConversation`, `getConversation`, `getAllConversations`, `deleteConversation`.

### 3.3. GoogleDriveClient (`src/lib/storage/google-drive-client.ts`)

Wrapper around the Google Drive API.

*   **Folder Management:** Automatically creates/finds the `J StaR Platform/conversations` folder.
*   **File Operations:** `create`, `update`, `get`, `list`, `delete`.
*   **Authentication:** Uses OAuth 2.0 access tokens fetched via `SyncManager`.

## 4. Data Flow

### Saving a Message
1.  User sends a message.
2.  `useBranchingChat` updates local React state.
3.  `SyncManager.saveConversation()` is called.
4.  **Immediate:** Data saved to IndexedDB (UI remains responsive).
5.  **Debounced (5s):**
    *   Data uploaded to Google Drive.
    *   Metadata updated in Neon DB.

### Loading a Conversation
1.  **Fast Path:** Try loading from IndexedDB.
2.  **Fallback:** If not found locally, fetch JSON from Google Drive.
3.  **Hydration:** Populate React state and update IndexedDB cache.

### AI Title Generation
1.  Triggered after 6 messages (3 exchanges).
2.  Calls `/api/conversations/[id]/title` (Groq Llama 3.3 70B).
3.  Updates title in Neon DB and IndexedDB.
4.  **Auto-Backup:** Triggers immediate Drive sync to rename the file with the new title.

## 5. API Routes

| Route | Method | Purpose |
| :--- | :--- | :--- |
| `/api/conversations` | GET | List conversations (for sidebar) |
| `/api/conversations` | POST | Update conversation metadata |
| `/api/conversations/[id]` | GET | Get conversation metadata |
| `/api/conversations/[id]` | DELETE | Delete conversation (DB + Drive) |
| `/api/conversations/[id]/title` | POST | Generate AI title |
| `/api/user/drive-config` | GET | Fetch Drive OAuth tokens |
| `/api/auth/google/disconnect` | POST | Disconnect Google Drive |

## 6. Usage Example

```typescript
import { syncManager } from '@/lib/storage/sync-manager';

// Save a conversation
await syncManager.saveConversation(
    conversationId,
    userId,
    title,
    messages
);

// Load a conversation
const conversation = await syncManager.loadConversation(conversationId);

// Initialize Drive (required before sync)
await syncManager.initializeGoogleDrive(userId);
```

## 7. Message Schema Validation

The `MessagePartSchema` (`src/features/john-gpt/schema.ts`) validates AI SDK message parts before storage.

### Supported Part Types

| Type | Fields |
|------|--------|
| `text` | `text: string` |
| `image` | `image: string`, `mimeType?: string` |
| `file` | `data: string`, `mimeType: string` |
| `tool-call` | `toolCallId`, `toolName`, `args` |
| `tool-result` | `toolCallId`, `toolName`, `result`, `isError?` |
| `reasoning` | `reasoning: string` |
| `source` | `source: { sourceType, id, url?, title? }` |
| `step-start/finish` | *(no additional fields)* |

> **Note:** If new AI SDK part types are added, update the discriminated union in `schema.ts`.

---

## 8. Future Improvements

*   **Conflict Resolution UI:** Allow users to choose versions if a conflict occurs.
*   **Storage Quota:** Display Drive usage.
*   **Export:** Download conversation as Markdown/PDF.

---

## 9. Change Log

| Date | Change |
|------|--------|
| 2025-12-15 | **FIX:** Sidebar now correctly displays all conversations by adding `userId` mismatch check in `refreshConversationList` |
| 2025-12-15 | **FIX:** Sync 400 Bad Request error resolved - Zod `.optional()` accepts `undefined` but not `null` |
| 2025-12-15 | **FIX:** Infinite refresh loop prevented with `isRefreshingList` flag |
| 2025-12-15 | **FIX:** Individual conversation loading now fetches from API if cache has 0 messages (metadata-only) |
| 2025-12-15 | Disabled Google Drive sync UI from sidebar (backend still available, UI hidden) |
| 2025-12-15 | **KNOWN ISSUE:** Viewing old conversations updates their `updatedAt` timestamp - see `docs/escalation_report_timestamp_issue.md` |
| 2024-12-14 | Hardened `MessagePartSchema` with explicit discriminated union (was `.passthrough()`) |
| 2024-12-14 | Added ownership checks (403 responses) to `/api/conversations/[id]` |

