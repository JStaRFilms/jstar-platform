# Animation Guidelines for J StaR Platform

## Overview

This document provides guidelines for using animations across the J StaR platform to ensure consistent, accessible, and performant user experiences.

## Core Principles

### 1. Purpose-Driven Animations
- **Enhance, Don't Distract**: Animations should provide meaningful feedback or guide attention
- **Performance First**: All animations must maintain 60fps and not impact Core Web Vitals
- **Accessibility Priority**: Respect user's motion preferences and provide alternatives

### 2. Animation Hierarchy
- **Micro-interactions**: Subtle hover/focus states (100-300ms)
- **Page Transitions**: Smooth section changes (300-500ms)
- **Loading States**: Clear feedback during async operations (500-1000ms)
- **Celebrations**: Success states and achievements (600-800ms)

## Component Usage

### AnimatedIcon Component

The universal `AnimatedIcon` wrapper provides consistent animation behavior:

```tsx
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { PlayCircleIcon } from '@/components/icons/static-icons';

// Basic hover animation
<AnimatedIcon animation="scale" trigger="hover">
  <PlayCircleIcon className="w-6 h-6" />
</AnimatedIcon>

// Click-triggered animation
<AnimatedIcon
  animation="bounce"
  trigger="click"
  onClick={handleAction}
  aria-label="Save changes"
>
  <SaveIcon className="w-5 h-5" />
</AnimatedIcon>

// Programmatic control
const iconRef = useRef<AnimatedIconRef>(null);
<AnimatedIcon
  ref={iconRef}
  animation="pulse"
  trigger="programmatic"
  onClick={() => iconRef.current?.startAnimation()}
/>
```

### Animation Types

| Type | Use Case | Duration | Notes |
|------|----------|----------|-------|
| `bounce` | Attention-grabbing, playful | 500-800ms | Use sparingly |
| `pulse` | Loading states, breathing effects | 1000-2000ms | Continuous OK |
| `spin` | Loading spinners, progress | 1000ms | Linear rotation |
| `scale` | Hover states, buttons | 200-400ms | Subtle scaling |
| `fade` | Content transitions | 300ms | Smooth opacity |
| `slide` | Directional movement | 400ms | Left/right/up/down |
| `rotate` | Interactive feedback | 300ms | Partial rotation |
| `wobble` | Error states | 600ms | Attention-grabbing |
| `heartbeat` | Urgent notifications | 1500ms | Pulsing effect |
| `shake` | Validation errors | 500ms | Horizontal shake |

### Animation Triggers

| Trigger | Use Case | Accessibility |
|---------|----------|---------------|
| `hover` | Desktop interactions | Respects motion preferences |
| `click` | Button actions | Provides feedback |
| `load` | Page/component entry | Can be disabled |
| `programmatic` | State changes | Full control |

## Animation Presets

Use predefined animation presets for consistency:

```tsx
import { animationPresets, animationVariants } from '@/components/ui/animation-presets';

// Using presets
<motion.div
  initial={animationPresets.fadeIn.initial}
  animate={animationPresets.fadeIn.animate}
  transition={animationPresets.fadeIn.transition}
>
  Content
</motion.div>

// Using variants
<motion.div
  variants={animationVariants.cardHover}
  whileHover="whileHover"
  transition={animationTransitions.cardHover}
>
  Card content
</motion.div>
```

## Accessibility Guidelines

### Reduced Motion Support

Always respect user's motion preferences:

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// In components
<AnimatedIcon
  animation={prefersReducedMotion ? undefined : 'bounce'}
  respectReducedMotion={true}
/>
```

### Screen Reader Compatibility

- Provide meaningful `aria-label` attributes
- Use semantic HTML elements
- Don't rely solely on animation for conveying information

### Keyboard Navigation

- Ensure animated elements are keyboard accessible
- Provide focus indicators
- Support keyboard-triggered animations

## Performance Optimization

### Bundle Size
- AnimateIcons library adds ~50KB (monitor with `npm run build`)
- Use tree-shaking to include only needed icons
- Lazy load animated components when possible

### Runtime Performance
- Limit concurrent animations to 10-15 elements
- Use `transform` and `opacity` for GPU acceleration
- Avoid animating layout properties (width, height, top, left)

### Monitoring
```bash
# Check bundle size impact
npm run build
npx webpack-bundle-analyzer dist/static/js/*.js
```

## Implementation Patterns

### Loading States
```tsx
const [isLoading, setIsLoading] = useState(true);

// Animated loading spinner
{isLoading && (
  <AnimatedIcon animation="spin" trigger="load">
    <LoaderIcon className="w-6 h-6" />
  </AnimatedIcon>
)}
```

### Success Feedback
```tsx
const [showSuccess, setShowSuccess] = useState(false);

const handleSave = async () => {
  await saveData();
  setShowSuccess(true);
  setTimeout(() => setShowSuccess(false), 2000);
};

// Animated success checkmark
{showSuccess && (
  <AnimatedIcon animation="bounce" trigger="load" delay={100}>
    <CheckIcon className="w-6 h-6 text-green-500" />
  </AnimatedIcon>
)}
```

### Hover Interactions
```tsx
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
  Interactive element
</motion.div>
```

## Component-Specific Guidelines

### Buttons
- Use `scale` or `bounce` for primary actions
- Keep animations subtle (scale: 1.05 max)
- Duration: 200-300ms

### Cards
- Use `hoverLift` preset for elevation
- Combine with subtle glow effects
- Duration: 300ms

### Forms
- Animate validation errors with `shake`
- Success states with `bounce` checkmarks
- Loading states with `pulse` or `spin`

### Navigation
- Page transitions with `slideInFromRight`
- Active states with subtle `scale`
- Duration: 400ms

## Testing Checklist

### Functionality
- [ ] Animations trigger on correct events
- [ ] Programmatic control works
- [ ] Cleanup prevents memory leaks

### Accessibility
- [ ] Respects `prefers-reduced-motion`
- [ ] Screen reader compatible
- [ ] Keyboard accessible

### Performance
- [ ] 60fps animation smoothness
- [ ] No layout thrashing
- [ ] Reasonable bundle size increase

### Cross-browser
- [ ] Works in target browsers
- [ ] Graceful degradation
- [ ] Fallback for unsupported features

## Common Pitfalls

1. **Over-animation**: Too many animations compete for attention
2. **Performance**: Heavy animations on low-end devices
3. **Accessibility**: Ignoring motion preferences
4. **Consistency**: Using different animation patterns for similar interactions
5. **Bundle Size**: Including unused animation libraries

## Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [AnimateIcons Gallery](https://animateicons.vercel.app)
- [WCAG Motion Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
- [CSS Triggers](https://csstriggers.com/)
