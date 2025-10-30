# Theme Alignment Guide

This document outlines the process of aligning the application's styling with the theme, ensuring that all components adapt correctly to both light and dark modes.

## Hero Section Button Styling Fix

### Problem

The "View Our Work" button in the hero section was not visible in light mode due to a styling issue. The button's text was hardcoded to `text-white`, which made it unreadable against the light background. This was happening because the slide data fetched from the API had hardcoded styles.

### Solution

The fix involved modifying the `useHeroSlides` hook to process the slide data and replace the hardcoded styles with theme-aware utility classes. This ensures that the button is always visible in both light and dark modes, while still allowing the other styles to be customized from the admin panel.

The `tailwind.config.ts` file was also updated to extend the theme with the custom color variables from `src/app/globals.css`. This ensures that Tailwind's utility classes can correctly resolve the brand colors.

### 1. Configuring `tailwind.config.ts`

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'jstar-blue': 'var(--color-jstar-blue)',
        'faith-purple': 'var(--color-faith-purple)',
        'growth-green': 'var(--color-growth-green)',
        'admin-red': 'var(--color-admin-red)',
        'sacred-gold': 'var(--color-sacred-gold)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        highlight: 'var(--color-highlight)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        border: 'var(--color-border)',
        ring: 'var(--color-ring)',
        error: 'var(--color-error)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        card: 'var(--color-card)',
        muted: 'var(--color-muted)',
        'muted-foreground': 'var(--color-muted-foreground)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Clash Display', 'sans-serif'],
      },
      animation: {
        'bounce': 'bounce 1s infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin': 'spin 1s linear infinite',
      }
    },
  },
  plugins: [],
}

export default config
```

### 2. Modifying `useHeroSlides.ts`

```typescript
// src/features/HomePage/hooks/useHeroSlides.ts
if (result.status === 'success' && result.data && result.data.length > 0) {
    const themedSlides = result.data.map(slide => ({
    ...slide,
    buttonBorder: 'border-primary dark:border-accent',
    buttonText: 'text-primary dark:text-accent',
    buttonHover: 'hover:bg-primary/10 dark:hover:bg-accent/10',
    }));
    setSlides(themedSlides);
} else {
// ...
```

### Verification

The fix was verified by running the application and confirming that the "View Our Work" button is now visible in both light and dark modes. The button's transparent, bordered style has also been preserved.
