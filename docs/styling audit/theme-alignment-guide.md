# Theme Alignment Guide for J StaR Films Website

## Overview
This guide provides a reference for ensuring theme consistency across all pages of the J StaR Films website. It uses the golden pages (`/about`, `/services`, `/blog`) as the authoritative reference for correct theming patterns. Any page can be aligned by comparing against these patterns and applying semantic corrections while preserving design intent.

## Golden Pages Reference
**Location:** `src/features/AboutPage/`, `src/features/ServicesPage/`, `src/features/BlogPage/`

**Key Components to Study:**
- `AboutHero.tsx` - Hero sections with dark backgrounds and white text
- `ServicesHero.tsx` - Statistics cards and service descriptions
- `ServicesOverview.tsx` - Feature/service listing patterns
- `BlogSection.tsx` - Content cards and text patterns

## Core Theming Patterns

### 1. Brand Colors (PRESERVE AS-IS)
```typescript
// Custom Tailwind tokens from globals.css @theme
--color-jstar-blue: #007bff;
--color-faith-purple: #6f42c1;
--color-growth-green: #28a745;
--color-admin-red: #DC2626;
--color-sacred-gold: #D97706;
--color-primary: #1e40af;
--color-secondary: #4f46e5;
--color-accent: #8b5cf6;
--color-highlight: #ec4899;
```

**Usage Examples:**
```tsx
// CORRECT - Use for accents, buttons, highlights
bg-jstar-blue/20 text-jstar-blue
bg-gradient-to-r from-jstar-blue to-faith-purple
text-growth-green
```

### 2. Semantic Color Tokens
```typescript
// Core semantic tokens
--color-background: #F9FAFB;     // gray-50 (light) / #0B1221 (dark)
--color-foreground: #0B1221;     // near slate-950 (light) / #E5E7EB (dark)
--color-border: #E5E7EB;          // gray-200 (light) / #374151 (dark)
--color-ring: #3B82F6;           // blue-500
--color-card: #FFFFFF;           // white (light) / #0B1221 (dark)
--color-muted: #374151;          // gray-700 (light) / #94A3B8 (dark)
--color-muted-foreground: #6B7280; // gray-500 (light) / #94A3B8 (dark)

// Status semantic tokens
--color-error: #DC2626;           // red-600 (light) / #EF4444 (dark)
--color-success: #10B981;         // green-500 (light) / #34D399 (dark)
--color-warning: #F59E0B;         // yellow-400 (light) / #FCD34D (dark)
```

**Tailwind Classes:**
```tsx
bg-background          // Page backgrounds
text-foreground        // Primary text
border-border          // All borders
bg-card                // Card/component backgrounds
text-muted             // Secondary/muted text
text-muted-foreground  // Subtle secondary text (lighter than text-muted)
bg-error text-error    // Error states
bg-success text-success  // Success states
bg-warning text-warning  // Warning states
```

### 3. Design Intent Patterns (PRESERVE)

#### Hero Sections
```tsx
<section className="hero-bg min-h-[60vh] flex items-center relative">
  // Dark gradient background with white text
  <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
  <p className="text-xl text-gray-300 mb-8"> // Muted white on dark
```

**Pattern:** Dark backgrounds with `text-white` and `text-gray-300` for hierarchy.

#### Cards & Components
```tsx
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
  <h3 className="text-gray-900 dark:text-white">
  <p className="text-gray-700 dark:text-gray-300">
```

**Pattern:** Light/dark toggles with matching semantic equivalents.

#### Status Indicators
```tsx
bg-error      // For critical/error
bg-warning    // For warnings
bg-success    // For success
bg-primary    // For active/running
```

## What to FIX vs IGNORE

### ❌ FIX: Hardcoded Colors Not Aligning
- `text-gray-900` → `text-foreground` (primary text)
- `text-gray-300` → `text-muted` (secondary text)
- `bg-gray-50/70` → `bg-card` (component backgrounds)
- `border-gray-200` → `border-border` (all borders)
- `text-red-500` → `text-error` (error states)
- `text-green-500` → `text-success` (success states)

### ✅ IGNORE: Intentional Design Choices
- `text-white` on dark backgrounds (design hierarchy in heroes/sections)
- Brand colors (`text-jstar-blue`, `bg-faith-purple`) - correct usage
- `bg-gray-900/800` for dark sections (structural, not color-system dependent)
- Dark mode overrides that follow pattern: `dark:bg-gray-700 dark:text-gray-300`

### ⚠️ BE CAUTIOUS: Borderline Cases
- `text-gray-400/500/600` - check if it's truly muted text or needs foreground/card
- `bg-black/transparent` - often design-dependent, not theme-related
- Hero background gradients - preserve unless semantically mapping

## Step-by-Step Page Alignment Process

### 1. Analyze Golden Page References
```bash
# Read key components from golden pages
read_file src/features/AboutPage/components/AboutHero.tsx
read_file src/features/ServicesPage/components/ServicesHero.tsx
read_file src/features/ServicesPage/components/ServicesOverview.tsx
```

### 2. Examine Target Page Components
```bash
# Read the page you want to fix
read_file src/features/[PageName]/components/[ComponentName].tsx
```

### 3. Compare Against Patterns
- Does it use brand colors correctly? ✅
- Are text colors using foreground/muted appropriate? ❌ → Fix
- Are backgrounds using card/background semantic? ❌ → Fix
- Are status colors using error/success/warning? ❌ → Fix
- Is text-white preserved on dark backgrounds? ✅

### 4. Apply Targeted Fixes
```tsx
// BEFORE (non-compliant)
<h3 className="text-gray-900 dark:text-white mb-3">
<p className="text-gray-400 mb-2">
<div className="bg-gray-50 dark:bg-gray-800 p-4">

// AFTER (aligned)
<h3 className="text-foreground mb-3">
<p className="text-muted mb-2">
<div className="bg-card p-4">
```

### 5. Verify Against Golden Pages
- Does the component now visually match golden page equivalents?
- Are all hardcoded grays replaced with semantic tokens?
- Is dark mode behavior preserved/improved?

## Common Issues & Solutions

### Issue: "Component doesn't switch properly in dark mode"
**Solution:** Replace hardcoded colors with semantic tokens that have dark variants.

### Issue: "Colors don't match the rest of the site"
**Solution:** Check that brand colors are used for accents, semantic tokens for basics.

### Issue: "Hero section looks inconsistent"
**Solution:** Ensure dark hero sections maintain `text-white` and `text-gray-300` patterns.

### Issue: "Status indicators don't match golden pages"
**Solution:** Use `bg-error`, `bg-success`, `bg-warning` for status states.

## Build Verification
After making changes, always run:
```bash
npm run build
```
This ensures no invalid classes were introduced and dark mode works properly.

## Reference Examples

### ✅ Good - Aligned Component
```tsx
<div className="bg-card border border-border rounded-lg p-6">
  <h3 className="text-foreground font-semibold mb-2">Title</h3>
  <p className="text-muted mb-4">Description</p>
  <span className="px-2 py-1 bg-success text-success-foreground rounded">
    Active
  </span>
</div>
```

### ❌ Bad - Needs Fixing
```tsx
<div className="bg-white dark:bg-gray-800 border border-gray-200 rounded-lg p-6">
  <h3 className="text-gray-900 dark:text-white font-semibold mb-2">Title</h3>
  <p className="text-gray-400 mb-4">Description</p>
  <span className="px-2 py-1 bg-green-500 text-white rounded">
    Active
  </span>
</div>
```

## Real-World Fix Examples

### ✅ Table Cell Visibility Fix + Semantic Token Implementation (PricingSection.tsx)
**Problem**: Table data cells missing explicit text colors, inheriting barely-readable `text-foreground`. Site uses custom dark variant that doesn't work with `@theme .dark` selectors.

**Solution**: Implement semantic tokens using direct CSS custom properties with `.dark` overrides - works with `&:is(.dark *)` custom variant.

```css
/* Step 1: Define default semantic values */
--color-muted: #374151;  /* gray-700 light */
--color-muted-dark: #94A3B8; /* slate-400 dark */

.dark {
  --color-muted: var(--color-muted-dark); /* Override for dark mode */
}

text-muted           /* gray-700 → slate-400 */
text-foreground      /* very dark → very light */
text-card           /* white → near-black */
```

```tsx
// Step 2: Convert hardcoded classes to semantic tokens
<td className="text-center text-gray-700 dark:text-gray-300">3-5</td>
// ↓
<td className="text-center text-muted">3-5</td>

// Result: Semantic, theme-compatible, automatically switches colors
```

**Applied to**: All table data cells converted to `text-muted`, maintaining visual consistency while enabling proper semantic theming.

**Why this approach?**: Custom dark variants (`&:is(.dark *)`) require direct CSS overrides instead of `@theme .dark` selectors. This ensures semantic tokens work correctly across your custom implementation.

## Resources
- **Globals.css**: Contains all theme token definitions and custom variants
- **Theme Audit Report**: `docs/styling audit/theme-audit-report.json` for systematic issues
- **Golden Pages**: Always reference for design intent and color usage patterns

This guide ensures any AI agent or developer can systematically align any page's theming with the established golden page patterns while preserving design integrity.
