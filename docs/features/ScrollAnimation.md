# Feature: Scroll-Triggered Animations

## 1. Purpose

The Scroll-Triggered Animation system provides a performance-optimized, accessible way to add scroll animations across the jstar-platform. It uses IntersectionObserver API for optimal performance, automatically respects user accessibility preferences, and provides device-specific optimizations for both mobile and desktop experiences.

## 2. Architecture

### Core Components

1. **Utility Functions** (`scrollAnimationUtils.ts`)
   - Device detection and optimization
   - Accessibility checks  
   - Threshold and timing calculations

2. **Hooks** (`useScrollAnimation.ts`, `useScrollAnimationMulti.ts`)
   - Single-element animation management
   - Multi-element stagger animations
   - IntersectionObserver lifecycle management

3. **CSS Animations** (`globals.css`)
   - 7 pre-defined animation keyframes
   - Utility classes for easy application
   - Accessibility media queries

### How It Works

1. Hook attaches IntersectionObserver to element(s)
2. Observer triggers when element enters viewport
3. Hook updates visibility state
4. CSS animation class is applied
5. GPU-accelerated animation plays
6. Observer auto-cleans up on unmount

## 3. API Reference

### `useScrollAnimation(options?)`

**Options:**
- `threshold?`: number - Visibility percentage to trigger (default: device-optimized)
- `rootMargin?`: string - Margin around viewport (default: device-optimized)
- `triggerOnce?`: boolean - Animate only once (default: true)
- `delay?`: number - Delay before animation starts in ms (default: 0)

**Returns:**
- `ref`: MutableRefObject - Attach to element
- `isVisible`: boolean - Current visibility state
- `hasAnimated`: boolean - Has animated at least once

### `useScrollAnimationMulti(options)` **Options:**
- `count`: number - Number of elements (required)
- `staggerDelay?`: number - Delay between elements in ms (default: 100)
- Plus all options from `useScrollAnimation`

**Returns:**
- `refs`: Array<MutableRefObject> - Array of refs for each element
- `visibilityStates`: boolean[] - Visibility state for each element
- `allAnimated`: boolean - All elements have animated

### CSS Animation Classes

| Class                          | Description                    |
|--------------------------------|--------------------------------|
| `.scroll-animate-hidden`       | Initial hidden state (required) |
| `.scroll-animate-fade-in`      | Simple fade in                 |
| `.scroll-animate-fade-in-up`   | Fade + slide up (default)      |
| `.scroll-animate-fade-in-down` | Fade + slide down              |
| `.scroll-animate-fade-in-left` | Fade + slide from left         |
| `.scroll-animate-fade-in-right`| Fade + slide from right        |
| `.scroll-animate-scale-in`     | Scale 95%→100% + fade          |
| `.scroll-animate-rotate-in`    | Rotate + scale + fade          |

## 4. Usage Examples

### Single Element - Basic

```tsx
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function MyComponent() {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <div 
      ref={ref}
      className={`scroll-animate-hidden ${isVisible ? 'scroll-animate-fade-in-up' : ''}`}
    >
      This content animates on scroll
    </div>
  );
}
```

### Single Element - With Options

```tsx
const { ref, isVisible } = useScrollAnimation({
  threshold: 0.5,  // Trigger when 50% visible
  triggerOnce: false,  // Re-animate when scrolling back
  delay: 200  // Wait 200ms before animating
});
```

### Staggered Grid

```tsx
import { useScrollAnimationMulti } from '@/hooks/useScrollAnimationMulti';

export function ProductGrid({ products }: { products: Product[] }) {
  const { refs, visibilityStates } = useScrollAnimationMulti({
    count: products.length,
    staggerDelay: 100
  });
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product, i) => (
        <div
          key={product.id}
          ref={refs[i]}
          className={`scroll-animate-hidden ${
            visibilityStates[i] ? 'scroll-animate-fade-in-up' : ''
          }`}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
```

### Different Animation Types

```tsx
// Slide from left
<div 
  ref={ref1}
  className={`scroll-animate-hidden ${isVisible1 ? 'scroll-animate-fade-in-left' : ''}`}
>
  Content
</div>

// Scale in
<div 
  ref={ref2}
  className={`scroll-animate-hidden ${isVisible2 ? 'scroll-animate-scale-in' : ''}`}
>
  Content
</div>
```

## 5. Accessibility

### Automatic Reduced Motion Support

The system automatically respects `prefers-reduced-motion: reduce`:

**JavaScript Level:**
- `shouldEnableAnimations()` checks user preference
- If reduced motion is enabled, hooks immediately set `isVisible: true`
- Elements appear without animation

**CSS Level:**
- Media query disables all animations
- Elements set to `opacity: 1` and `transform: none` 

This is handled automatically - **no developer action required**.

### Testing Accessibility

**macOS:**
- System Settings → Accessibility → Display → Reduce motion

**Windows:**
- Settings → Ease of Access → Display → Show animations

**Browser DevTools:**
- Chrome/Edge: DevTools → Rendering → Emulate CSS media prefers-reduced-motion

## 6. Performance

### Optimizations

1. **IntersectionObserver** - More efficient than scroll event listeners
2. **GPU Acceleration** - Animations use `transform` and `opacity`
3. **will-change** - Hints browser for optimization
4. **Single Observer** - One observer per hook invocation
5. **Auto Cleanup** - Observers disconnect on unmount
6. **Device Optimization** - Different thresholds for mobile/desktop

### Performance Monitoring

Check animation performance in Chrome DevTools:
1. Performance tab → Record while scrolling
2. Look for "Composite Layers" (GPU acceleration)
3. Verify no layout thrashing (should be green)
4. FPS should stay at 60fps

### Best Practices

✅ **Do:**
- Use `triggerOnce: true` (default) to prevent re-animations
- Apply animations to container divs, not individual text nodes
- Limit animations to elements entering viewport (not the entire page)

❌ **Don't:**
- Animate layout properties (width, height, top, left)
- Stack too many animations on a single page
- Use extremely long animation durations (keep under 1s)

## 7. Mobile vs Desktop

### Automatic Optimization

| Setting      | Desktop | Mobile |
|--------------|---------|--------|
| Threshold    | 0.2 (20%) | 0.1 (10%) |
| Root Margin  | -100px | -50px |

**Why?**
- Mobile screens are smaller, so 20% visibility might not show enough content
- Lower threshold on mobile triggers animations earlier for better UX
- Optimizations are automatic based on viewport width (< 768px = mobile)

## 8. Example Component

See `src/components/examples/ScrollAnimationExamples.tsx` for:
- All 7 animation types demonstrated
- Staggered multi-element examples
- Grid and list patterns
- Accessibility notes

## 9. Troubleshooting

**Animations not triggering:**
- Ensure element has `.scroll-animate-hidden` initially
- Check that ref is properly attached
- Verify element is within viewport but not fully visible yet

**Animations laggy:**
- Check GPU acceleration in DevTools (should see composite layers)
- Reduce number of simultaneous animations
- Consider increasing stagger delay for multi-element animations

**TypeScript errors:**
- Ensure refs are typed correctly: `MutableRefObject<HTMLElement | null>`
- For specific elements use: `as HTMLDivElement` if needed

### Dynamic Content Support

The `useScrollAnimationMulti` hook automatically handles dynamic content updates. If the `count` changes (e.g., due to filtering or async data loading), the hook will:
1. Re-initialize refs
2. Reset visibility states
3. Re-observe elements

This makes it perfect for filtered lists or asynchronously loaded grids.

### Re-triggering Animations

By default, animations only play once (`triggerOnce: true`). To have elements animate every time they enter the viewport:

```tsx
const { ref, isVisible } = useScrollAnimation({
  triggerOnce: false
});
```

This is useful for:
- Long landing pages where users might scroll back up
- Interactive elements that should reset their state when out of view

### Mobile-Specific Interactions

You can use the scroll animation system to trigger mobile-specific interactions, such as auto-revealing hover states when elements enter the viewport.

**Pattern:**
1. Detect mobile device
2. Use `useScrollAnimationMulti` to track visibility
3. Pass visibility state to component to force "hover" styles

```tsx
// Component
const { refs, visibilityStates } = useScrollAnimationMulti({
  count: items.length,
  triggerOnce: false // Reset when out of view
});

// Render
<Card 
  forceHover={isMobile && visibilityStates[index]} 
  ref={refs[index]} 
/>
```

This ensures mobile users get a rich experience without needing touch interactions.

---

## 10. Integration

### Adding to Existing Components

1. Import the hook
2. Add `ref` to element
3. Add conditional CSS classes
4. Test with "Reduce Motion" enabled

### Global Adoption

The system is designed to be **additive** - existing code continues to work. Gradually adopt scroll animations for:
- Hero sections
- Feature cards
- Testimonials
- Product grids
- Blog post lists
- Any content that benefits from progressive disclosure

---

**Summary:** A production-ready, accessible, performant scroll animation system that works across devices and respects user preferences. Easy to use, hard to misuse.
