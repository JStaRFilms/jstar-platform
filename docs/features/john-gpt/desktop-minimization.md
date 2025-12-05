# Desktop Minimization: 3-State Morph & Glass Pill

## Overview
The desktop minimization experience for JohnGPT has been redesigned to be "sleek and modern," moving away from the standard "disappear off-screen" behavior. It now features a **3-State Morphing System** that transitions smoothly between different shapes based on user interaction and inactivity.

## The 3 States

### 1. Expanded (Active)
*   **Dimensions:** `450px` x `600px` (or custom based on content).
*   **Shape:** Large rounded rectangle (`rounded-3xl`).
*   **Content:** Full chat interface (Header, Messages, Input).
*   **Behavior:** Fully interactive.

### 2. Minimized "Glass Pill" (Standby)
*   **Dimensions:** `200px` x `60px`.
*   **Shape:** Pill shape (`rounded-full`).
*   **Content:**
    *   **Icon:** Sparkles gradient icon.
    *   **Text:** "JohnGPT" label + "Click to expand" hint.
*   **Trigger:** User clicks the "Minimize" button.
*   **Behavior:**
    *   Morphs from the expanded state.
    *   Remains visible at the bottom right.
    *   **Hover:** Scales up slightly (`scale-105`).
    *   **Click:** Expands back to the full chat window.

### 3. Idle "Icon" (Dormant)
*   **Dimensions:** `60px` x `60px`.
*   **Shape:** Rounded square (`rounded-2xl`).
*   **Content:** Only the Sparkles gradient icon (centered).
*   **Trigger:** **8 seconds** of inactivity (no mouse hover) while in the "Pill" state.
*   **Behavior:**
    *   The "Pill" shrinks horizontally.
    *   Text fades out and collapses.
    *   **Hover:** Immediately expands back to the **Pill** state.
    *   **Click:** Expands back to the full chat window.

## Technical Implementation

### State Management
The logic is handled within `JohnGPTDialog.tsx` using React state and refs.

*   **`state.isChatMinimized`**: Controls whether the chat is Expanded or Minimized.
*   **`isIdle`**: A local boolean state that tracks if the 8-second inactivity timer has fired.
*   **`idleTimerRef`**: A `useRef` to manage the `setTimeout` for the 8-second delay.

### Logic Flow
1.  **Minimize:** User clicks minimize -> `isChatMinimized = true`. The UI morphs to the **Pill** state. The idle timer starts.
2.  **Inactivity:** If the user doesn't hover over the pill for 8 seconds, `isIdle` becomes `true`. The UI morphs to the **Icon** state.
3.  **Wake Up:** User hovers over the Icon -> `handleMouseEnter` clears the timer and sets `isIdle = false`. The UI morphs back to the **Pill**.
4.  **Restore:** User clicks the Pill/Icon -> `expandChat()` is called. `isChatMinimized = false`, and the UI morphs back to **Expanded**.

### CSS Transitions
We use Tailwind CSS classes with `transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]` to ensure all shape changes (width, height, border-radius) are fluid and organic.

```tsx
// Example conditional class logic
state.isChatMinimized
  ? (isIdle
      ? 'w-[60px] h-[60px] rounded-2xl ...' // Icon
      : 'w-[200px] h-[60px] rounded-full ...' // Pill
    )
  : 'w-[450px] h-[600px] rounded-3xl ...' // Expanded
```

## Mobile Behavior
This feature is **Desktop Only**. On mobile devices (`max-width: 768px`), the chat continues to use the "Solomon-style" physics animation (sliding down to a peek bar) to preserve screen real estate and touch ergonomics.
