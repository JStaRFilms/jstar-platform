# Feature: Widget Session Persistence & Promotion

## 1. Purpose

This feature enables JohnGPT widget chat sessions to persist across page reloads and allows users to promote widget conversations into their permanent main conversation history. Widget sessions sync to Google Drive in a separate `widget-sessions/` folder to avoid polluting the main conversation list.

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA FLOW                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  WIDGET CHAT                                                        │
│  ────────────                                                       │
│  1. User sends message in widget                                    │
│  2. useBranchingChat saves to IndexedDB (instant)                   │
│  3. SyncManager queues debounced Drive sync (5s delay)              │
│  4. Drive sync → widget-sessions/ folder                            │
│                                                                     │
│  PROMOTION (Open in JohnGPT → Save to History)                      │
│  ─────────────────────────────────────────────────                  │
│  1. User clicks "Open in JohnGPT" → /john-gpt?import=[sessionId]    │
│  2. ChatView loads session from IndexedDB/Drive via SyncManager     │
│  3. User clicks "Save to History"                                   │
│  4. handlePromoteSession():                                         │
│     a. Creates new conversation ID                                  │
│     b. Saves to Neon DB (POST /api/conversations)                   │
│     c. Saves to IndexedDB (syncManager.saveConversation)            │
│     d. Navigates to /john-gpt/[newId]                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Folder Structure in Google Drive

```
J StaR Platform/
├── conversations/       ← Full JohnGPT conversations
└── widget-sessions/     ← Widget temporary chats
```

---

## 3. Files Modified/Created

### Storage Layer

| File | Change Type | Description |
|------|-------------|-------------|
| `src/lib/storage/google-drive-client.ts` | Modified | Added `saveWidgetSession`, `loadWidgetSession`, `deleteWidgetSession` methods. Uses `widget-sessions/` subfolder. |
| `src/lib/storage/sync-manager.ts` | Modified | Added `isWidget` flag support to routing saves/loads. Added `deleteWidgetSession` and `forceSyncConversation` methods. |
| `src/lib/google-drive.ts` | Modified | Updated folder name from `"JohnGPT Data"` to `"J StaR Platform"`. Added `ensureWidgetSessionsFolder`, `saveWidgetSession`, `listWidgetSessions` methods. |

### UI Components

| File | Change Type | Description |
|------|-------------|-------------|
| `src/features/john-gpt/components/JohnGPTPage.tsx` | Modified | Added `import` query parameter extraction. Passes `importSessionId` to `ChatView`. |
| `src/features/john-gpt/components/ChatView.tsx` | Modified | Added `importSessionId` prop handling. Implemented promotion banner UI and `handlePromoteSession` function. |
| `src/features/john-gpt/components/JohnGPTDialog.tsx` | Modified | Passes `isWidget: true` to `useBranchingChat` options. |

### Hooks

| File | Change Type | Description |
|------|-------------|-------------|
| `src/features/john-gpt/hooks/useBranchingChat.ts` | Modified | Added `isWidget` option. Routes saves to correct Drive folder. Suppresses Neon DB sync for widgets. |
| `src/features/john-gpt/hooks/useWidgetPersistence.ts` | Modified | Added `openInJohnGPT` function that generates import URL. |

---

## 4. Key Components

### ChatView - Import Banner

```tsx
// Promotion banner shown when ?import=[sessionId] is present
{isImportBannerVisible && (
    <div className="bg-blue-600/10 border-b border-blue-600/20 p-4">
        <h3>Widget Session Detected</h3>
        <p>Save this chat to your history to keep it forever.</p>
        <button onClick={() => router.push('/john-gpt')}>Discard</button>
        <button onClick={handlePromoteSession}>Save to History</button>
    </div>
)}
```

### handlePromoteSession Function

```typescript
const handlePromoteSession = async () => {
    const newId = crypto.randomUUID();
    const title = "Imported Widget Chat";

    // 1. Save to Neon DB (enables sidebar visibility)
    await fetch('/api/conversations', {
        method: 'POST',
        body: JSON.stringify({ conversationId: newId, title }),
    });

    // 2. Save to IndexedDB (offline access)
    await syncManager.saveConversation(newId, user.id, title, messages);

    // 3. Navigate to new conversation
    router.replace(`/john-gpt/${newId}`);
};
```

---

## 5. API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/conversations` | POST | Save conversation metadata to Neon DB |
| `/api/conversations` | GET | List conversations for sidebar |
| `/api/user/drive-config` | GET | Get Google Drive OAuth token |

---

## 6. Usage Flow

1. **User chats in widget** → Messages auto-save to IndexedDB + Drive (widget-sessions/)
2. **User clicks "Open in JohnGPT"** → Redirects to `/john-gpt?import=widget-session-xxx`
3. **"Widget Session Detected" banner appears** → Shows Save/Discard options
4. **User clicks "Save to History"** → Saves to Neon DB + IndexedDB, navigates to new URL
5. **Conversation appears in sidebar** ✅

---

## 7. Testing Checklist

- [x] Widget messages persist on page reload (IndexedDB)
- [x] Widget sessions sync to Drive `widget-sessions/` folder
- [x] "Open in JohnGPT" button navigates with `?import=` param
- [x] Import banner displays correctly
- [x] "Save to History" creates new conversation
- [x] New conversation appears in sidebar immediately
- [x] Navigation to new conversation URL works
