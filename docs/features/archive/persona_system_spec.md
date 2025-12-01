# Persona System Architecture & Implementation Spec

## 1. Executive Summary
The goal of the Persona System is to transform JohnGPT from a generic chatbot into a versatile platform with distinct, specialized AI personalities. Each persona (e.g., "Creative Partner", "Coding Assistant") must have a unique voice, expertise, and behavior pattern enforced by strict system prompts.

**Current Status:**
- ✅ **Frontend:** UI for selecting personas exists (`PersonaSelector`).
- ✅ **Database:** Schema exists and seeding script is ready.
- ❌ **Backend:** The chat API (`/api/chat/route.ts`) currently **IGNORES** the selected persona. It uses a generic default behavior.
- ❌ **Intelligence:** No context awareness or auto-switching.

## 2. Core Architecture (The "Fix")

### Data Flow
1.  **User Selects Persona:** Frontend (`ChatView`) tracks `activePersona`.
2.  **Message Sent:** `useChat` sends `{ text: "...", body: { personaId: "..." } }`.
3.  **API Receives Request:**
    - Extract `personaId` from request body.
    - Fetch `Persona` data from Database (or cache).
    - **CRITICAL STEP:** Prepend the Persona's `systemPrompt` to the messages array sent to the AI model.

### Required Changes

#### A. Backend Logic (`src/app/api/chat/route.ts`)
The API route must be updated to:
1.  Read `personaId` from the request body.
2.  Fetch the persona details (optimize with caching if possible, but DB fetch is fine for now).
3.  Construct the `system` message.

**Pseudocode Logic:**
```typescript
const { messages, personaId } = await req.json();

// 1. Fetch Persona
const persona = await prisma.persona.findUnique({ where: { id: personaId } });

// 2. Define System Prompt
const systemPrompt = persona 
  ? persona.systemPrompt 
  : "You are JohnGPT, a helpful assistant.";

// 3. Prepend to Messages
const coreMessages = [
  { role: 'system', content: systemPrompt },
  ...convertToCoreMessages(messages)
];

// 4. Stream Response
const result = await streamText({
  model: getAIModel(),
  messages: coreMessages, // Use the new array with system prompt
});
```

## 3. Advanced "Intelligent" Features (The "Upgrade")

To make the system truly "smart" and not just a dropdown menu, implement the following:

### A. Intent-Based Auto-Switching (Agent Slot Machine Lite)
**Concept:** If a user starts a chat with "Write a React component...", the system should automatically suggest or switch to the **Coding Assistant** persona.

**Implementation:**
- Create a lightweight classifier (using a small model or regex) on the *first message*.
- If confidence is high, return a `suggestedPersonaId` in the response headers or metadata.
- Frontend shows a toast: "Switching to Coding Assistant for better results?"

### B. Dynamic Context Injection
**Concept:** Personas should be aware of the user's environment.
- **Mobile Mode:** If `req.headers['user-agent']` indicates mobile, append "Keep responses concise and readable on small screens" to the system prompt.
- **Time Awareness:** Inject "Current time is [Date]" into the system prompt.

### C. Persona Memory (Long-term Goal)
**Concept:** Each persona remembers specific preferences.
- *Coding Assistant* remembers you prefer TypeScript.
- *Biblical Counselor* remembers your preferred Bible translation (ESV/NIV).
- **Implementation:** Add a `PersonaPreferences` table linked to `User` and `Persona`.

## 4. Implementation Checklist for AI Agent

Please execute the following steps in order:

### Step 1: Fix the Backend (Priority High)
- [ ] Modify `src/app/api/chat/route.ts` to accept `personaId`.
- [ ] Implement DB fetch for the persona.
- [ ] Inject the `system` message into the `streamText` call.
- [ ] Verify that changing the persona actually changes the AI's behavior (e.g., ask "Who are you?").

### Step 2: Enhance the Frontend
- [ ] Ensure `ChatView.tsx` passes the correct `personaId` in the `body` of `useChat`.
- [ ] Add a visual indicator in the chat header showing the active persona's icon and role.

### Step 3: Add "Mobile Awareness"
- [ ] In `route.ts`, detect mobile user agent.
- [ ] Append "Format for mobile readability" to the system prompt if detected.

### Step 4: Verify & Test
- [ ] Run the seed script (`npx tsx prisma/seed.ts`) if not done.
- [ ] Test all 4 default personas to ensure distinct personalities.
