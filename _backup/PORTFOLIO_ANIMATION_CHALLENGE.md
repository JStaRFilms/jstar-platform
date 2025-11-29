# Portfolio Card Scroll Animation Challenge

## Status: ✅ SOLVED

## Solution Overview
We successfully implemented scroll-triggered animations for portfolio cards on mobile devices. The solution involves:

1.  **Mobile Detection**: Using `isMobileDevice()` to detect if the user is on a mobile device.
2.  **Scroll Tracking**: Using `useScrollAnimationMulti` hook to track when portfolio cards enter the viewport.
3.  **Dynamic Hover State**: Added a `forceHover` prop to `PortfolioCard` that programmatically triggers the hover styles when the card is visible on mobile.
4.  **Re-triggering**: Configured the animation hook with `triggerOnce: false` so that animations reset when cards scroll out of view, providing a continuous interactive experience.
5.  **Bug Fix**: Fixed an issue in `useScrollAnimationMulti` where it wasn't handling dynamic item counts correctly, which was necessary for the asynchronously loaded portfolio items.

## Key Files Modified
- `src/features/HomePage/components/PortfolioSection.tsx`: Main logic integration.
- `src/features/HomePage/components/PortfolioCard.tsx`: Added `forceHover` prop.
- `src/hooks/useScrollAnimationMulti.ts`: Fixed dynamic count handling.

## Original Challenge Description
Below is the original challenge description for reference.

---

## Project Context
- **Tech Stack**: Next.js 14, React, TypeScript, Tailwind CSS v4
- **Working Directory**: `jstar-platform`
- **Dev Server**: Running on `localhost:3000`

## Objective
Implement scroll-triggered animations for portfolio cards that automatically reveal card details (overlay with tags, title, description) when scrolled into view on mobile devices, similar to how the service cards animation works.

## What Works ✅

### Service Cards Animation (SUCCESSFUL)
Location: `src/features/HomePage/components/ServicesSection.tsx`

```tsx
import { useScrollAnimationMulti } from '@/hooks/useScrollAnimationMulti';

const { refs: cardRefs, visibilityStates } = useScrollAnimationMulti<HTMLDivElement>({
  count: serviceTiers.length,
  staggerDelay: 150,
});

// In render:
{serviceTiers.map((tier, index) => (
  <div
    key={tier.id}
    ref={cardRefs[index]}
    className={`scroll-animate-hidden ${
      visibilityStates[index] ? 'scroll-animate-fade-in-up' : ''
    }`}
  >
    <ServiceTierCard tier={tier} />
  </div>
))}
```

**CSS** (`src/app/globals.css`):
```css
.scroll-animate-hidden {
  opacity: 0;
  transform: translateY(20px);
}

.scroll-animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Result**: Cards fade in and slide up perfectly on scroll, works on both mobile and desktop!

## What Doesn't Work ❌

### Portfolio Cards Animation (FAILING)
Location: `src/features/HomePage/components/PortfolioSection.tsx`

**Goal**: On mobile devices, when portfolio cards scroll into view, automatically show the hover overlay (dark gradient with project details).

**Portfolio Card Structure** (`src/features/HomePage/components/PortfolioCard.tsx`):
```tsx
<div className="portfolio-item group ...">
  <div className="aspect-video ...">
    <Image ... className="... group-hover:scale-110" />
    
    {/* This overlay should auto-show on mobile when in viewport */}
    <div className="absolute inset-0 ... opacity-0 group-hover:opacity-100 ...">
      <div className="translate-y-4 group-hover:translate-y-0 ...">
        {/* Tags, title, description */}
      </div>
    </div>
  </div>
</div>
```

### Attempts Made

#### Attempt 1: JavaScript + Class Toggle (FAILED)
```tsx
// Added to PortfolioSection.tsx
const { refs: row1Refs, visibilityStates: row1Visible } = useScrollAnimationMulti<HTMLDivElement>({
  count: 2,
  staggerDelay: 0,
});

// Wrapper with conditional class
<div className={row1Visible[index] ? 'portfolio-card-highlight' : ''}>
  <PortfolioCard ... />
</div>
```

**CSS Attempted**:
```css
.portfolio-card-highlight .portfolio-item > div:first-of-type > div:nth-child(2) {
  opacity: 1 !important;
}
```

**Result**: Class `portfolio-card-highlight` was **NOT being added** (inspected DOM showed `class=""`). IntersectionObserver not firing.

#### Attempt 2: CSS-Only Mobile Detection (INCONSISTENT)
```css
@media (max-width: 768px) and (hover: none) {
  .portfolio-item > div:first-of-type > div:nth-child(2) {
    opacity: 1 !important;
  }
}
```

**Result**: 
- Laptop dev tools (mobile emulation): All cards always highlighted ✅
- Actual mobile device: No cards highlighted ❌
- `hover: none` media query behaves differently across devices

#### Attempt 3: Simpler Mobile-Only CSS (INCONSISTENT)
```css
@media (max-width: 768px) {
  .portfolio-item > div:first-of-type > div:nth-child(2) {
    opacity: 0.95 !important;
  }
}
```

**Result**: Same inconsistency as Attempt 2

## Technical Details

### IntersectionObserver Hook
`src/hooks/useScrollAnimationMulti.ts` uses:
```typescript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Update visibility state
      }
    });
  },
  {
    threshold: threshold ?? getOptimalThreshold(),
    rootMargin: rootMargin ?? getRootMargin(),
  }
);
```

- Works perfectly for ServiceSection cards
- Returns empty `visibilityStates` for PortfolioSection cards

### Current File State
- `PortfolioSection.tsx`: No scroll animation code (reverted to original)
- `globals.css`: No portfolio mobile CSS (reverted to original)
- `ServicesSection.tsx`: Working scroll animations intact

## What We Need

**A solution that:**
1. Auto-reveals portfolio card overlays when scrolled into view on mobile
2. Works consistently on both browser dev tools AND real mobile devices
3. Preserves normal hover behavior on desktop
4. Doesn't interfere with the existing portfolio card click handler for the modal

**Ideally:**
- Similar to how ServiceSection animations work
- Uses the existing `useScrollAnimationMulti` hook if possible
- Or a completely different approach that actually works

## Questions to Solve

1. Why does `useScrollAnimationMulti` work for ServiceSection but not for PortfolioSection?
2. Why does the `portfolio-card-highlight` class not get applied?
3. Is there a better way to detect mobile devices for CSS targeting?
4. Should we use a different approach entirely (like adding a prop to PortfolioCard)?

## Files to Reference

- `src/hooks/useScrollAnimationMulti.ts` - The hook that works for services
- `src/features/HomePage/components/PortfolioSection.tsx` - Where we need the fix
- `src/features/HomePage/components/PortfolioCard.tsx` - The card component
- `src/features/HomePage/components/ServicesSection.tsx` - Working example
- `src/app/globals.css` - Global styles

## Desired User Experience

**Desktop**: Hover over card → overlay appears (current behavior, working fine)
**Mobile**: Scroll card into view → overlay automatically appears (NOT working)

---

**Please help us implement a working solution for mobile portfolio card animations!**
