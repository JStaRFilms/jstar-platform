# Feature: Animated Icons

## 1. Purpose

The `AnimatedIcons` feature provides a system-wide implementation of custom animated SVG icons using the AnimateIcons library. This enhances user experience by adding purposeful, smooth animations to static elements across the J StaR Films platform, while maintaining performance and accessibility standards.

## 2. High-Level Goal

Transform static icons into engaging, animated elements that:
- Provide visual feedback for user interactions
- Enhance brand personality with smooth animations
- Maintain mobile-first responsive design
- Ensure accessibility and performance optimization

## 3. Main Component (`AnimatedIcon.tsx`)

This is the primary wrapper component for all animated icons in the system.

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `iconName` | `string` | Yes | Name of the icon from AnimateIcons gallery (e.g., "bell", "atom") |
| `size` | `number` | No | Icon size in pixels (default: 24) |
| `color` | `string` | No | Tailwind color class (default: "currentColor") |
| `isAnimated` | `boolean` | No | Enable/disable animations (default: true) |
| `ariaLabel` | `string` | No | Accessibility label for screen readers |
| `className` | `string` | No | Additional Tailwind classes |

### State

- Manages animation state via ref for programmatic control
- Handles responsive sizing based on screen size

## 4. Custom Hooks (`useAnimatedIcon.ts`)

- **Purpose:** Encapsulates animation logic and responsive behavior
- **Returns:** `{ iconRef, startAnimation, stopAnimation, isAnimating }`

## 5. Usage Example

```tsx
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';

// Basic usage with hover animation
<AnimatedIcon iconName="bell" size={32} />

// Programmatic control
const bellRef = useRef();
<AnimatedIcon
  ref={bellRef}
  iconName="bell"
  size={32}
  color="text-jstar-blue"
  ariaLabel="Notifications"
/>

// Responsive sizing
<AnimatedIcon
  iconName="atom"
  size={24}
  className="md:w-8 md:h-8"
/>
```

## 6. Implementation Plan

1. **Create Core Wrapper:** `src/components/ui/AnimatedIcon.tsx`
2. **Install Library:** Add AnimateIcons via shadcn CLI
3. **Feature Integration:** Add to HomePage and SystemDiagnostic
4. **Styling Updates:** Ensure Tailwind v4 compatibility
5. **Accessibility:** Add ARIA labels and keyboard support
6. **Performance Testing:** Monitor Core Web Vitals
7. **Documentation:** Update with usage examples

## 7. Dependencies

- AnimateIcons library (installed via shadcn)
- motion/react (included with AnimateIcons)
- Tailwind CSS v4 for styling
- React refs for programmatic control

## 8. Browser Compatibility

- Modern browsers with CSS animation support
- Fallback to static icons for older browsers
- Reduced motion support for accessibility

## 9. Performance Considerations

- Lazy loading of icon components
- Animation throttling on low-performance devices
- Bundle size monitoring for multiple icons