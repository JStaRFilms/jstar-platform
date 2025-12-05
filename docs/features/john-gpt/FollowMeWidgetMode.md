# Follow-Me Widget Mode

## Overview

The Follow-Me Widget Mode allows users to continue a conversation from the full JohnGPT page (`/john-gpt`) as a floating widget while navigating to other pages. This provides a seamless chat experience that "follows" the user across the application.

## How It Works

### Triggering Follow-Me Mode

1. **Manual Trigger**: Click the **minimize button** (⊟) in the JohnGPT page header
2. User is redirected to the homepage with the widget showing a **green "Active Chat"** indicator

### Visual States

| Mode | Button Color | Icon | Label |
|------|-------------|------|-------|
| Normal Widget | Blue/Purple | ✨ Sparkles | - |
| Follow-Me Active | Green/Teal | 💬 Message | "Active Chat" |

### Expanding Back

- Click the **green widget** to open the follow-me conversation
- Click the **expand button** (↗️) to return to the full `/john-gpt/[conversationId]` page
- Follow-me mode automatically deactivates when returning to the full page

## State Management

Follow-me state is managed via `ActiveChatContext` and persisted in **sessionStorage** (not localStorage), meaning:

- State persists across page navigations within the same browser session
- State clears when the browser tab/window is closed
- Opening a new tab starts fresh with normal widget behavior

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ActiveChatProvider                        │
│  (Global context in providers.tsx)                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐    ┌─────────────────────────────────┐│
│  │  ChatHeader     │    │  JohnGPTFeature (Widget)        ││
│  │  (Full Page)    │    │                                  ││
│  │                 │    │  - Detects follow-me mode       ││
│  │  Minimize btn → │────│  - Shows green indicator        ││
│  │  activates      │    │  - Passes conversationId        ││
│  │  follow-me      │    │    to JohnGPTDialog             ││
│  └─────────────────┘    └─────────────────────────────────┘│
│                                                              │
│  ┌─────────────────┐    ┌─────────────────────────────────┐│
│  │  ChatView       │    │  JohnGPTDialog                  ││
│  │  (Full Page)    │    │                                  ││
│  │                 │    │  - Loads follow-me conversation ││
│  │  Clears state   │    │  - Uses full API (not widget)  ││
│  │  on arrival     │    │  - Expand → full page          ││
│  └─────────────────┘    └─────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Key Files

| File | Purpose |
|------|---------|
| `src/features/john-gpt/context/ActiveChatContext.tsx` | Global state with sessionStorage |
| `src/features/john-gpt/index.tsx` | Widget trigger with follow-me indicator |
| `src/features/john-gpt/components/ChatHeader.tsx` | Minimize button |
| `src/features/john-gpt/components/JohnGPTDialog.tsx` | Load/expand follow-me conversation |
| `src/features/john-gpt/components/ChatView.tsx` | Clear follow-me on arrival |

## API Behavior

- **Normal widget**: Uses `/api/chat?context=widget` (limited capabilities)
- **Follow-me mode**: Uses `/api/chat` (full capabilities, same as full page)

## Known Behaviors

1. Follow-me state clears when closing the browser (by design via sessionStorage)
2. The widget shows the normal widget session if no follow-me is active
3. Arriving at the full `/john-gpt` page clears follow-me state after a small delay to prevent race conditions
