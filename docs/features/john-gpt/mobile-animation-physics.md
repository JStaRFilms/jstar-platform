# JohnGPT Mobile Animation Physics ("Solomon Style")

This document details the implementation of the high-fidelity "Solomon-style" 3D extraction animation used for the JohnGPT mobile chat widget.

## Overview

The animation is designed to simulate a physical object (a folder or file) sliding out of a slot (the navbar) with weight, momentum, and 3D depth. It avoids standard 2D slides in favor of a "tactile" feel using 3D transforms and precise layering.

## Core Physics Concepts

### 1. The "3D Sandwich" & Z-Index Swapping
To create the illusion of the chat sliding *out* of the navbar but tucking *behind* it when minimized, we use a dynamic z-index strategy:

*   **Expanded State (`z-60`)**: The chat sits in front of everything, including the top header.
*   **Minimized State (`z-49`)**: The chat sits behind the bottom navbar (`z-50`), creating a "slot" effect.

**The Magic Switch:**
To prevent visual clipping during the transition, we switch the `z-index` **while the element is off-screen or moving fast**.
*   **Opening:** `z-index` is raised to `60` *immediately* so it pops out in front.
*   **Closing:** `z-index` is held at `60` for **150ms** (while it dives down), then switched to `49` invisibly before it bounces back up behind the navbar.

### 2. "Bounce Off-Screen" Logic
Instead of animating directly to its resting position, the minimization animation **overshoots** completely off-screen before settling.

1.  **Start:** Open position.
2.  **Overshoot (50%):** The element translates to `120%` (completely invisible/off-screen).
3.  **Switch:** The `z-index` swaps to `49` at `150ms` (approx. 15-20% into the animation, catching the down-stroke).
4.  **Settle (100%):** The element bounces *back up* to `calc(100% - 48px)` (the peek position), now safely behind the navbar.

### 3. Asymmetric Timing
The animation uses different speeds for opening and closing to enhance the "heavy" feel:
*   **Opening (`solomon-out`)**: **0.6s** – Fast, energetic extraction.
*   **Closing (`solomon-in`)**: **1.0s** – Slow, heavy insertion with a significant bounce.

## Implementation Details

### CSS Keyframes (`globals.css`)

We use `perspective(1000px)` to enable 3D rotation.

```css
/* Opening: Tilted back -> Straight */
@keyframes solomon-out {
  0% { transform: perspective(1000px) translateY(var(--solomon-offset, 100%)) rotateX(15deg) scale(0.95); }
  100% { transform: perspective(1000px) translateY(0) rotateX(0deg) scale(1); }
}

/* Closing: Straight -> Overshoot (Off-screen) -> Tilted back (Peek) */
@keyframes solomon-in {
  0% { transform: perspective(1000px) translateY(0) rotateX(0deg) scale(1); }
  50% { transform: perspective(1000px) translateY(120%) rotateX(20deg) scale(0.9); } /* Overshoot */
  100% { transform: perspective(1000px) translateY(var(--solomon-offset, 100%)) rotateX(15deg) scale(0.95); }
}
```

**Bezier Curve:** `cubic-bezier(0.34, 1.56, 0.64, 1)`
This custom curve provides the "snap" and "bounce" effect. The value `1.56` creates the elastic overshoot.

### Component Logic (`JohnGPTDialog.tsx`)

The component manages the state and the crucial timing for the z-index switch.

```tsx
// Z-index logic
const [activeZIndex, setActiveZIndex] = useState(state.isChatMinimized ? 49 : 60);

React.useEffect(() => {
  if (state.isChatMinimized) {
    // Minimizing: Wait 150ms (catch the down-stroke) before dropping behind navbar
    const timer = setTimeout(() => setActiveZIndex(49), 150);
    return () => clearTimeout(timer);
  } else {
    // Expanding: Raise in front immediately
    setActiveZIndex(60);
  }
}, [state.isChatMinimized]);
```

### CSS Variables
*   `--solomon-offset`: Defines the resting "peek" height for the minimized chat.
    *   Value: `calc(100% - 48px)` (Leaves 48px visible).

## Tuning Guide

To adjust the "feel" of the animation:

| Parameter | Location | Effect | Current Value |
| :--- | :--- | :--- | :--- |
| **Close Speed** | `globals.css` (`.animate-solomon-in`) | How heavy/slow the close feels. | `1.0s` |
| **Open Speed** | `globals.css` (`.animate-solomon-out`) | How snappy the open feels. | `0.6s` |
| **Z-Index Delay** | `JohnGPTDialog.tsx` | When the layer swap happens. Must be fast enough to beat the bounce-back. | `150ms` |
| **Overshoot** | `globals.css` (`@keyframes solomon-in`) | How far it dives before coming back. | `120%` |
| **Peek Height** | `JohnGPTDialog.tsx` | How much of the handle is visible. | `calc(100% - 48px)` |
