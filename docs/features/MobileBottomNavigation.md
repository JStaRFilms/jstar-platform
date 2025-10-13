# Feature: Mobile Bottom Navigation

## 1. Purpose

The `MobileBottomNavigation` feature provides a responsive, mobile-only, app-style navigation bar fixed to the bottom of the viewport. It enhances the user experience on small screens by offering intuitive, thumb-friendly access to the site's main sections. It integrates the "smart navigation" system, allowing users to either scroll to sections on the homepage or navigate directly to pages.

## 2. Technology Stack

- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS (with responsive `md:hidden` utility)
- **State Management:** React `useState`
- **Interaction Logic:** `useSmartNavigation` custom hook
- **Icons:** AnimateIcons library (via `shadcn/ui`)
- **Feedback:** `Tooltip` UI component

## 3. Component Architecture

### File Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── MobileBottomNav.tsx   # Main container, state management
│   │   └── MobileNavItem.tsx     # Individual icon/button, logic
│   └── ui/
│       ├── Tooltip.tsx           # Reused for visual feedback
│       └── [IconName]Icon.tsx    # Animated icons (e.g., HouseIcon.tsx)
└── hooks/
    └── useSmartNavigation.ts     # Reused for interaction logic
```

### Main Components

#### `MobileBottomNav.tsx`

The primary container component responsible for the overall layout and state management.

-   **Responsibility:**
    -   Renders only on mobile viewports (`md:hidden`).
    -   Manages the state for the `Tooltip` component, ensuring only one tooltip is visible at a time.
    -   Maps over a `navigationConfig` array to render `MobileNavItem` components.
    -   Styled with a fixed position, backdrop blur ("glassmorphism"), and top border.

#### `MobileNavItem.tsx`

A child component representing a single interactive item in the navigation bar.

-   **Responsibility:**
    -   Integrates and displays an animated icon from the AnimateIcons library.
    -   Uses the `useSmartNavigation` hook to get event handlers for smart interaction.
    -   Lifts tooltip state changes up to the `MobileBottomNav` parent.
    -   **Conditionally renders** a semantic `<button>` on the homepage (for scrolling) or a Next.js `<Link>` on all other pages (for direct navigation).
    -   Displays an "active" visual state based on the current URL path.

## 4. Smart Interaction Logic

This component reuses the `useSmartNavigation` hook to provide a dual-function user experience **on the homepage**:

-   **Short Tap (< 1000ms):** Smoothly scrolls the user to the corresponding section ID on the current page (e.g., tapping "About" scrolls to `#about`).
-   **Long Press (> 1000ms):** Navigates the user to the dedicated page for that section (e.g., holding "About" navigates to the `/about` page).
-   **On all other pages**, a standard tap immediately navigates to the link's `href`.

## 5. Critical Implementation Details

### Preventing Content Obscuring

To prevent the fixed navigation bar from covering the last few lines of page content, a padding utility class was added to the `<main>` element in the root layout (`src/app/layout.tsx`).

```tsx
<main className="pb-16 md:pb-0">{children}</main>
```

-   `pb-16`: Adds 4rem (64px) of padding to the bottom, matching the `h-16` height of the navigation bar.
-   `md:pb-0`: Removes this padding on medium screens and larger, where the bottom navigation bar is hidden.

### Tooltip Positioning

The `Tooltip` component is rendered within `MobileBottomNav.tsx` but is positioned `fixed` relative to the viewport. It is placed within a container that is anchored just above the navigation bar (`bottom-16`) to ensure it appears in the correct context for the user.

## 6. Usage Example

The component is integrated directly into the root layout to ensure its presence across the application on mobile devices.

**File: `src/app/layout.tsx`**

```tsx
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Header />
        <main className="pb-16 md:pb-0">{children}</main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
```

## Change Log

### [Date: 2025-10-12] - Mobile Bottom Navigation Implementation

-   **Purpose:** Created a new, mobile-only bottom navigation system to improve user experience on small viewports.
-   **Key Changes:**
    -   Developed `MobileBottomNav.tsx` and `MobileNavItem.tsx` components.
    -   Installed and integrated five animated icons (`house`, `user-round`, `blocks`, `sparkles`, `mail`).
    -   Reused the `useSmartNavigation` hook to provide tap-to-scroll and hold-to-navigate functionality.
    -   Added responsive padding to the main layout to prevent content from being obscured.
    -   Enhanced UI/UX with smooth scrolling to top when home button is pressed on home page.
    -   Improved focus states for better accessibility.
    -   Fixed horizontal overflow issues across mobile viewports.
    -   Optimized layout to prevent content cutoff on various screen sizes.

### [Date: 2025-10-13] - Advanced Navigation Features Implementation

-   **Purpose:** Enhanced the mobile navigation with scroll spy, motion blur, and improved animations for a premium user experience.
-   **Key Changes:**
    -   **Scroll Spy Integration:** Added `useScrollSpy` hook to dynamically highlight navigation items based on current scroll position on homepage.
    -   **Motion Blur Effect:** Implemented `useScrollBlur` hook that applies a subtle blur effect to page content during navigation-triggered scrolling, creating a cinematic transition.
    -   **Navigation Order Update:** Reordered navigation items from Home/About/Work/Services/Contact to Home/About/Services/Work/Contact.
    -   **Animation Triggers:** Enhanced icon animations to trigger both on user interaction (press/touch) and when items become active via scroll spy.
    -   **Tooltip Centering:** Fixed tooltip text centering by adding flexbox utilities for proper alignment.
    -   **Smart Home Button:** Home button now scrolls smoothly to top on homepage instead of navigation.
    -   **Performance Optimizations:** Motion blur only activates during programmatic scrolling, not manual user scroll.
    -   **Enhanced UX:** Navigation now provides real-time visual feedback as users scroll through different sections.

## 7. Recent UI/UX Improvements

### Home Button Behavior
- The home button now provides visual feedback and smoothly scrolls to the top when pressed on the home page.
- On other pages, it navigates back to the home page as expected.

### Accessibility Improvements
- Enhanced focus states for better keyboard navigation.
- Added proper ARIA labels and roles for screen readers.
- Improved touch targets for better mobile interaction.

### Layout Fixes
- Fixed horizontal overflow issues that caused unwanted scrolling.
- Optimized padding and margins for a consistent experience across devices.
- Ensured content remains fully visible and properly aligned on all screen sizes.
    -   Ensured the component is hidden on desktop screens using Tailwind's `md:hidden` utility.
-   **Benefits:**
    -   Provides a modern, app-like navigation experience on mobile.
    -   Enhances UI with smooth, purposeful animated icons.
    -   Maintains a consistent smart interaction pattern between desktop and mobile navigation.
