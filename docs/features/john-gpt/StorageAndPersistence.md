# Feature: JohnGPT Storage & Persistence

## 1. Purpose

The Storage & Persistence system ensures that user conversations are saved reliably, accessible across devices (via Google Drive), and available offline (via IndexedDB). It implements a **hybrid storage architecture** that balances performance, reliability, and data ownership.

## 2. Architecture Overview

The system uses a three-tier storage strategy:

1.  **IndexedDB (Local Cache):**
    *   **Role:** Primary read/write layer for the UI.
    *   **Benefit:** Instant load times, offline support, zero latency.
    *   **Library:** `idb` (via `IndexedDBClient`).

2.  **Google Drive (Cloud Backup):**
    *   **Role:** Long-term storage and cross-device sync.
    *   **Benefit:** User owns their data, accessible outside the app.
    *   **Format:** JSON files named `[AI Title] - [8-char ID].json`.
    *   **Library:** Custom `GoogleDriveClient` using Google Drive API v3.

3.  **Neon DB (Metadata):**
    *   **Role:** Lightweight index for the conversation sidebar.
    *   **Benefit:** Fast listing of conversations without scanning Drive files.
    *   **Data:** `id`, `title`, `createdAt`, `updatedAt`, `driveFileId`.

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
| 2024-12-14 | Hardened `MessagePartSchema` with explicit discriminated union (was `.passthrough()`) |
| 2024-12-14 | Added ownership checks (403 responses) to `/api/conversations/[id]` |
